"""
App Integration Module for AI StoryLand App

This module integrates all components of the AI StoryLand app:
1. Speech Recognition
2. Story Generation
3. Voice Modulation and Sound Effects

It provides a unified API that would be used by the UI layer.

Usage:
    app = AIStoryLandApp()
    
    # Start a new story
    app.start_new_story("I want a lion story")
    
    # Adapt current story
    app.adapt_current_story("Add a monkey")
    
    # Enable bedtime mode
    app.enable_bedtime_mode(duration_minutes=15)
"""

import os
import time
import threading
from typing import Dict, List, Any, Optional

# Import our custom modules
from speech_processor import SpeechProcessor
from story_generator import StoryGenerator
from audio_service import AudioService

class AIStoryLandApp:
    """Main application class that integrates all components"""
    
    def __init__(self, api_keys: Optional[Dict[str, str]] = None):
        """
        Initialize the AI StoryLand app
        
        Args:
            api_keys: Dictionary of API keys for various services
        """
        # Set default API keys if not provided
        if api_keys is None:
            api_keys = {}
        
        # Initialize components
        self.speech_processor = SpeechProcessor(api_keys.get("openai"))
        self.story_generator = StoryGenerator(api_keys.get("openai"))
        self.audio_service = AudioService(api_keys.get("elevenlabs"))
        
        # App state
        self.current_story = None
        self.current_story_segment_index = 0
        self.is_story_in_progress = False
        self.is_listening = False
        self.is_speaking = False
        self.is_bedtime_mode = False
        self.settings = self._get_default_settings()
        
        # Story playback thread
        self.playback_thread = None
        self.stop_playback = False
    
    def _get_default_settings(self) -> Dict[str, Any]:
        """Get default app settings"""
        return {
            "voice_effect_intensity": 0.6,
            "background_sound_volume": 0.3,
            "playback_speed": 1.0,
            "bedtime_fade_duration_minutes": 15,
            "content_filters": {
                "no_scary_content": True,
                "educational_focus": False
            },
            "offline_mode": False,
            "save_favorites": True,
            "auto_adapt_story": True
        }
    
    def update_settings(self, new_settings: Dict[str, Any]) -> None:
        """
        Update app settings
        
        Args:
            new_settings: Dictionary of settings to update
        """
        # Update only the provided settings
        for key, value in new_settings.items():
            if key in self.settings:
                if isinstance(value, dict) and isinstance(self.settings[key], dict):
                    # For nested dictionaries, update individual keys
                    self.settings[key].update(value)
                else:
                    self.settings[key] = value
        
        print(f"Settings updated: {new_settings}")
    
    def process_voice_input(self) -> Dict[str, Any]:
        """
        Process voice input from the user
        
        Returns:
            Dictionary with processing results
        """
        self.is_listening = True
        print("Listening for voice input...")
        
        try:
            # Process speech input
            result = self.speech_processor.process_speech_input()
            
            # Extract key information
            transcription = result["transcription"]
            keywords = result["keywords"]
            primary_animal = result["primary_animal"]
            
            print(f"Heard: '{transcription}'")
            print(f"Keywords: {keywords}")
            
            return {
                "success": True,
                "transcription": transcription,
                "keywords": keywords,
                "primary_animal": primary_animal
            }
        except Exception as e:
            print(f"Error processing voice input: {e}")
            return {
                "success": False,
                "error": str(e)
            }
        finally:
            self.is_listening = False
    
    def start_new_story(self, voice_input: Optional[str] = None) -> Dict[str, Any]:
        """
        Start a new story based on voice input or direct text
        
        Args:
            voice_input: Optional text input (if None, will listen for voice)
            
        Returns:
            Dictionary with story information
        """
        try:
            # Get keywords from voice input or direct text
            if voice_input is None:
                # Process voice input
                result = self.process_voice_input()
                if not result["success"]:
                    return {
                        "success": False,
                        "error": "Failed to process voice input"
                    }
                
                keywords = result["keywords"]
            else:
                # Process text input
                keywords = self.speech_processor.keyword_extractor.extract_keywords(voice_input)
            
            # Generate story
            print(f"Generating story with keywords: {keywords}")
            self.current_story = self.story_generator.generate_story(keywords)
            self.current_story_segment_index = 0
            self.is_story_in_progress = True
            
            # Start story playback in a separate thread
            self.stop_playback = False
            self.playback_thread = threading.Thread(target=self._story_playback_thread)
            self.playback_thread.daemon = True
            self.playback_thread.start()
            
            return {
                "success": True,
                "story": self.current_story,
                "message": f"Started new story: {self.current_story['title']}"
            }
        except Exception as e:
            print(f"Error starting new story: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def adapt_current_story(self, voice_input: Optional[str] = None) -> Dict[str, Any]:
        """
        Adapt the current story based on new voice input
        
        Args:
            voice_input: Optional text input (if None, will listen for voice)
            
        Returns:
            Dictionary with adaptation results
        """
        if not self.is_story_in_progress or self.current_story is None:
            return {
                "success": False,
                "error": "No story in progress to adapt"
            }
        
        try:
            # Get keywords from voice input or direct text
            if voice_input is None:
                # Process voice input
                result = self.process_voice_input()
                if not result["success"]:
                    return {
                        "success": False,
                        "error": "Failed to process voice input"
                    }
                
                keywords = result["keywords"]
            else:
                # Process text input
                keywords = self.speech_processor.keyword_extractor.extract_keywords(voice_input)
            
            # Adapt story
            print(f"Adapting story with new keywords: {keywords}")
            adapted_story = self.story_generator.adapt_story(self.current_story, keywords)
            
            # Update current story
            self.current_story = adapted_story
            
            # If auto-adapt is enabled, continue playback from where we left off
            if self.settings["auto_adapt_story"]:
                # Find the index where new content was added
                old_segments_count = len(self.current_story["middle_segments"]) - len(adapted_story["middle_segments"])
                if old_segments_count < 0:
                    # New segments were added, start from the first new segment
                    self.current_story_segment_index = len(self.current_story["middle_segments"]) + old_segments_count
            
            return {
                "success": True,
                "story": self.current_story,
                "message": "Story adapted with new elements"
            }
        except Exception as e:
            print(f"Error adapting story: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def _story_playback_thread(self) -> None:
        """Background thread for story playback"""
        if self.current_story is None:
            return
        
        try:
            # Get story components
            title = self.current_story["title"]
            intro = self.current_story["intro"]
            middle_segments = self.current_story["middle_segments"]
            endings = self.current_story["endings"]
            sound_effects = self.current_story.get("sound_effects", [])
            primary_animal = self.current_story.get("primary_animal")
            
            # Play title
            print(f"\nPlaying story: {title}")
            title_audio = self.audio_service.generate_speech(
                f"The title of our story is: {title}",
                animal_type=None,  # No animal effect for title
                voice_intensity=0
            )
            self.audio_service.play_audio(title_audio)
            
            # Play intro with animal voice effect
            print(f"Playing intro: {intro}")
            self.is_speaking = True
            intro_audio = self.audio_service.generate_speech(
                intro,
                animal_type=primary_animal,
                voice_intensity=self.settings["voice_effect_intensity"]
            )
            self.audio_service.play_audio(intro_audio, background_effects=sound_effects)
            
            # Check if playback should stop
            if self.stop_playback:
                self.is_speaking = False
                return
            
            # Play middle segments
            for i, segment in enumerate(middle_segments):
                # Skip segments we've already played
                if i < self.current_story_segment_index:
                    continue
                
                self.current_story_segment_index = i
                
                print(f"Playing segment {i+1}/{len(middle_segments)}: {segment}")
                segment_audio = self.audio_service.generate_speech(
                    segment,
                    animal_type=primary_animal,
                    voice_intensity=self.settings["voice_effect_intensity"]
                )
                self.audio_service.play_audio(segment_audio, background_effects=sound_effects)
                
                # Check if playback should stop
                if self.stop_playback:
                    self.is_speaking = False
                    return
                
                # Pause between segments
                time.sleep(0.5)
            
            # Play endings
            for i, ending in enumerate(endings):
                print(f"Playing ending {i+1}/{len(endings)}: {ending}")
                ending_audio = self.audio_service.generate_speech(
                    ending,
                    animal_type=primary_animal,
                    voice_intensity=self.settings["voice_effect_intensity"] * 0.8  # Softer for ending
                )
                self.audio_service.play_audio(ending_audio, background_effects=sound_effects)
                
                # Check if playback should stop
                if self.stop_playback:
                    self.is_speaking = False
                    return
                
                # Pause between endings
                time.sleep(0.5)
            
            print("Story playback completed")
            self.is_story_in_progress = False
            
        except Exception as e:
            print(f"Error during story playback: {e}")
        finally:
            self.is_speaking = False
    
    def pause_story(self) -> Dict[str, Any]:
        """
        Pause the current story playback
        
        Returns:
            Dictionary with pause status
        """
        if not self.is_speaking:
            return {
                "success": False,
                "message": "No story is currently playing"
            }
        
        self.stop_playback = True
        
        return {
            "success": True,
            "message": "Story paused",
            "segment_index": self.current_story_segment_index
        }
    
    def resume_story(self) -> Dict[str, Any]:
        """
        Resume the current story playback
        
        Returns:
            Dictionary with resume status
        """
        if not self.is_story_in_progress or self.current_story is None:
            return {
                "success": False,
                "message": "No story in progress to resume"
            }
        
        if self.is_speaking:
            return {
                "success": False,
                "message": "Story is already playing"
            }
        
        # Start playback thread
        self.stop_playback = False
        self.playback_thread = threading.Thread(target=self._story_playback_thread)
        self.playback_thread.daemon = True
        self.playback_thread.start()
        
        return {
            "success": True,
            "message": "Story resumed",
            "segment_index": self.current_story_segment_index
        }
    
    def enable_bedtime_mode(self, duration_minutes: int = 15) -> Dict[str, Any]:
        """
        Enable bedtime mode with volume fade
        
        Args:
            duration_minutes: Duration of fade in minutes
            
        Returns:
            Dictionary with bedtime mode status
        """
        if self.is_bedtime_mode:
            return {
                "success": False,
                "message": "Bedtime mode is already active"
            }
        
        self.is_bedtime_mode = True
        
        # Convert minutes to seconds
        duration_seconds = duration_minutes * 60
        
        # Start bedtime fade
        self.audio_service.start_bedtime_fade(duration_seconds)
        
        return {
            "success": True,
            "message": f"Bedtime mode enabled with {duration_minutes} minute fade",
            "duration_minutes": duration_minutes
        }
    
    def disable_bedtime_mode(self) -> Dict[str, Any]:
        """
        Disable bedtime mode
        
        Returns:
            Dictionary with bedtime mode status
        """
        if not self.is_bedtime_mode:
            return {
                "success": False,
                "message": "Bedtime mode is not active"
            }
        
        self.is_bedtime_mode = False
        self.audio_service.stop_bedtime_fade()
        
        return {
            "success": True,
            "message": "Bedtime mode disabled"
        }
    
    def save_favorite_story(self) -> Dict[str, Any]:
        """
        Save the current story as a favorite
        
        Returns:
            Dictionary with save status
        """
        if not self.is_story_in_progress or self.current_story is None:
            return {
                "success": False,
                "message": "No story in progress to save"
            }
        
        # In a real app, this would save to a database or file
        # For this prototype, we'll just print a message
        
        print(f"Saving story as favorite: {self.current_story['title']}")
        
        return {
            "success": True,
            "message": f"Story '{self.current_story['title']}' saved as favorite",
            "story": self.current_story
        }
    
    def get_app_status(self) -> Dict[str, Any]:
        """
        Get the current 
(Content truncated due to size limit. Use line ranges to read in chunks)