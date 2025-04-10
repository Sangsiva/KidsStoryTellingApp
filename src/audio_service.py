"""
Voice Modulation and Sound Effects Service for AI StoryLand App

This module provides functionality to:
1. Convert text to speech with voice modulation effects
2. Apply animal-specific voice filters
3. Add background sound effects
4. Control volume for bedtime mode
5. Support both online (API-based) and offline (local) audio processing

Usage:
    audio_service = AudioService()
    
    # Generate speech with animal voice effect
    audio_data = audio_service.generate_speech(text, animal_type="lion")
    
    # Play audio with background effects
    audio_service.play_audio(audio_data, background_effects=["jungle_ambience"])
    
    # Fade volume for bedtime mode
    audio_service.start_bedtime_fade(duration_seconds=300)
"""

import os
import time
import random
import numpy as np
from typing import List, Dict, Any, Optional, Tuple
import threading

class AudioService:
    """Handles voice modulation and sound effects for the AI StoryLand app"""
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize the audio service
        
        Args:
            api_key: ElevenLabs API key for TTS (optional, can be set via env var)
        """
        self.api_key = api_key or os.environ.get("ELEVENLABS_API_KEY", "")
        self.current_volume = 1.0  # Full volume
        self.is_bedtime_mode = False
        self.load_sound_effects()
        
    def load_sound_effects(self):
        """Load available sound effects"""
        # In a real app, these would be actual audio files
        # For this prototype, we'll just define the available effects
        
        self.animal_sounds = {
            "lion": ["roar", "growl", "purr"],
            "elephant": ["trumpet", "rumble"],
            "tiger": ["roar", "growl", "chuff"],
            "monkey": ["chatter", "screech", "howl"],
            "giraffe": ["bleat", "hum"],
            "zebra": ["bark", "snort"],
            "hippo": ["grunt", "bellow"],
            "rhino": ["grunt", "snort"],
            "crocodile": ["hiss", "growl"],
            "snake": ["hiss", "rattle"],
            "bear": ["growl", "roar", "grunt"],
            "wolf": ["howl", "growl", "bark"],
            "fox": ["bark", "scream"],
            "rabbit": ["squeak", "thump"],
            "deer": ["bleat", "snort"],
            "owl": ["hoot", "screech"],
            "eagle": ["screech", "call"],
            "parrot": ["squawk", "mimic"],
            "penguin": ["honk", "bray"],
            "whale": ["song", "blow"],
            "shark": ["splash", "bite"],
            "dolphin": ["click", "whistle"],
            "octopus": ["bubble", "squirt"]
        }
        
        self.ambient_sounds = {
            "jungle": ["birds", "insects", "leaves", "rain"],
            "savanna": ["wind", "grass", "distant animals"],
            "ocean": ["waves", "bubbles", "water"],
            "river": ["flowing water", "splashes"],
            "forest": ["birds", "wind", "leaves"],
            "mountain": ["wind", "eagles", "rocks"],
            "desert": ["wind", "sand", "heat waves"],
            "arctic": ["wind", "ice", "snow"],
            "farm": ["animals", "tractors", "chickens"],
            "zoo": ["people", "various animals"]
        }
        
        self.action_sounds = {
            "run": ["footsteps", "breathing"],
            "swim": ["splashes", "bubbles"],
            "fly": ["wing flaps", "wind"],
            "jump": ["bounce", "landing"],
            "sleep": ["snoring", "breathing"],
            "eat": ["munching", "chewing"],
            "play": ["laughter", "movement"],
            "hide": ["rustling", "quiet movement"]
        }
        
        self.bedtime_sounds = {
            "lullaby": ["soft music", "humming"],
            "white_noise": ["rain", "waves", "fan"],
            "nature_night": ["crickets", "owls", "gentle wind"]
        }
    
    def generate_speech(self, text: str, animal_type: Optional[str] = None, 
                        voice_intensity: float = 0.5) -> Dict[str, Any]:
        """
        Generate speech with optional animal voice modulation
        
        Args:
            text: Text to convert to speech
            animal_type: Type of animal voice effect to apply
            voice_intensity: Intensity of the animal voice effect (0.0 to 1.0)
            
        Returns:
            Dictionary containing audio data and metadata
        """
        # Check if we have an API key for online TTS
        if self.api_key:
            try:
                return self._generate_speech_online(text, animal_type, voice_intensity)
            except Exception as e:
                print(f"Error with online TTS: {e}")
                print("Falling back to offline TTS.")
        
        # Fallback to offline TTS
        return self._generate_speech_offline(text, animal_type, voice_intensity)
    
    def _generate_speech_online(self, text: str, animal_type: Optional[str], 
                               voice_intensity: float) -> Dict[str, Any]:
        """Generate speech using ElevenLabs API with animal voice effects"""
        # In a real implementation, this would make an actual API call
        # For simulation, we'll return mock data
        
        print(f"Generating online TTS for: '{text}'")
        if animal_type:
            print(f"Applying {animal_type} voice effect with intensity {voice_intensity}")
        
        # Simulate API call delay
        time.sleep(0.5)
        
        # Create mock audio data (would be actual audio bytes in real implementation)
        mock_audio_data = {
            "text": text,
            "audio_type": "online_tts",
            "duration_seconds": len(text) * 0.07,  # Rough estimate of speech duration
            "animal_effect": animal_type,
            "effect_intensity": voice_intensity,
            "timestamp": time.time()
        }
        
        return mock_audio_data
    
    def _generate_speech_offline(self, text: str, animal_type: Optional[str], 
                                voice_intensity: float) -> Dict[str, Any]:
        """Generate speech using offline TTS with animal voice effects"""
        print(f"Generating offline TTS for: '{text}'")
        if animal_type:
            print(f"Applying {animal_type} voice effect with intensity {voice_intensity}")
        
        # Create mock audio data (would be actual audio in real implementation)
        mock_audio_data = {
            "text": text,
            "audio_type": "offline_tts",
            "duration_seconds": len(text) * 0.08,  # Slightly slower than online
            "animal_effect": animal_type,
            "effect_intensity": voice_intensity,
            "timestamp": time.time()
        }
        
        return mock_audio_data
    
    def apply_animal_voice_effect(self, audio_data: Dict[str, Any], 
                                 animal_type: str, intensity: float) -> Dict[str, Any]:
        """
        Apply animal-specific voice effects to audio
        
        Args:
            audio_data: Audio data dictionary
            animal_type: Type of animal voice effect to apply
            intensity: Intensity of the effect (0.0 to 1.0)
            
        Returns:
            Updated audio data with effects applied
        """
        # In a real implementation, this would apply actual audio processing
        # For simulation, we'll just update the metadata
        
        print(f"Applying {animal_type} voice effect with intensity {intensity}")
        
        # Create a copy of the audio data
        processed_audio = audio_data.copy()
        
        # Update metadata
        processed_audio["animal_effect"] = animal_type
        processed_audio["effect_intensity"] = intensity
        processed_audio["processing"] = self._get_animal_voice_characteristics(animal_type)
        
        return processed_audio
    
    def _get_animal_voice_characteristics(self, animal_type: str) -> Dict[str, Any]:
        """Get voice modulation characteristics for a specific animal"""
        # These would be used for actual audio processing in a real implementation
        characteristics = {
            "lion": {
                "pitch_shift": -0.3,  # Lower pitch
                "growl_overlay": 0.4,  # Add growl effect
                "reverb": 0.2,  # Add slight reverb
                "description": "Deep, powerful voice with occasional growls"
            },
            "elephant": {
                "pitch_shift": -0.4,  # Very low pitch
                "trumpet_overlay": 0.3,  # Add trumpet effect
                "reverb": 0.3,  # Add reverb
                "description": "Deep, resonant voice with trumpet-like qualities"
            },
            "tiger": {
                "pitch_shift": -0.25,  # Lower pitch
                "growl_overlay": 0.35,  # Add growl effect
                "reverb": 0.15,  # Add slight reverb
                "description": "Strong, intimidating voice with growl undertones"
            },
            "monkey": {
                "pitch_shift": 0.3,  # Higher pitch
                "chatter_overlay": 0.4,  # Add chattering effect
                "speed": 1.2,  # Slightly faster
                "description": "High-pitched, energetic voice with chattering sounds"
            },
            "snake": {
                "pitch_shift": -0.1,  # Slightly lower pitch
                "hiss_overlay": 0.5,  # Add hissing effect
                "sustain": 1.3,  # Elongate certain sounds
                "description": "Smooth, elongated voice with subtle hissing"
            },
            "owl": {
                "pitch_shift": 0.1,  # Slightly higher pitch
                "hoot_overlay": 0.3,  # Add hooting effect
                "reverb": 0.4,  # Add reverb
                "description": "Wise, calm voice with occasional hoots"
            },
            # Default for animals without specific characteristics
            "default": {
                "pitch_shift": 0,  # No pitch shift
                "animal_overlay": 0.2,  # Slight animal sound overlay
                "reverb": 0.1,  # Slight reverb
                "description": "Gentle voice with subtle animal qualities"
            }
        }
        
        return characteristics.get(animal_type, characteristics["default"])
    
    def add_background_effects(self, audio_data: Dict[str, Any], 
                              effect_names: List[str], volume: float = 0.3) -> Dict[str, Any]:
        """
        Add background sound effects to audio
        
        Args:
            audio_data: Audio data dictionary
            effect_names: List of effect names to add
            volume: Volume of background effects (0.0 to 1.0)
            
        Returns:
            Updated audio data with background effects
        """
        # In a real implementation, this would mix actual audio files
        # For simulation, we'll just update the metadata
        
        print(f"Adding background effects: {effect_names} at volume {volume}")
        
        # Create a copy of the audio data
        processed_audio = audio_data.copy()
        
        # Update metadata
        processed_audio["background_effects"] = effect_names
        processed_audio["background_volume"] = volume
        
        return processed_audio
    
    def play_audio(self, audio_data: Dict[str, Any], 
                  background_effects: Optional[List[str]] = None) -> None:
        """
        Play audio with optional background effects
        
        Args:
            audio_data: Audio data to play
            background_effects: Optional list of background effect names
        """
        # In a real implementation, this would actually play audio
        # For simulation, we'll just print what would happen
        
        # Apply background effects if specified
        if background_effects:
            audio_data = self.add_background_effects(audio_data, background_effects)
        
        # Apply current volume setting
        volume_adjusted_audio = audio_data.copy()
        volume_adjusted_audio["playback_volume"] = self.current_volume
        
        # Simulate playback
        text = audio_data.get("text", "")
        duration = audio_data.get("duration_seconds", 1.0)
        animal_effect = audio_data.get("animal_effect", "none")
        
        print(f"\nPlaying audio: '{text}'")
        print(f"Duration: {duration:.1f} seconds")
        print(f"Voice effect: {animal_effect}")
        print(f"Volume: {self.current_volume * 100:.0f}%")
        
        if "background_effects" in audio_data:
            print(f"Background effects: {audio_data['background_effects']}")
        
        # Simulate the audio playing by waiting
        time.sleep(min(duration, 0.5))  # Cap at 0.5 seconds for demo purposes
        print("Audio playback completed")
    
    def start_bedtime_fade(self, duration_seconds: int = 300) -> None:
        """
        Start gradual volume fade for bedtime mode
        
        Args:
            duration_seconds: Duration of fade in seconds
        """
        if self.is_bedtime_mode:
            print("Bedtime mode already active")
            return
        
        self.is_bedtime_mode = True
        print(f"Starting bedtime fade over {duration_seconds} seconds")
        
        # In a real implementation, this would run in a background thread
        # For simulation, we'll just demonstrate the concept
        
        # Start a thread to simulate the fade
        fade_thread = threading.Thread(
            target=self._fade_volume_thread, 
            args=(duration_seconds,)
        )
        fade_thread.daemon = True
        fade_thread.start()
    
    def _fade_volume_thread(self, duration_seconds: int) -> None:
        """Background thread to handle volume fade"""
        start_volume = self.current_volume
        steps = min(duration_seconds, 10)  # Cap at 10 steps for demo
        
        for i in range(1, steps + 1):
            # Calculate new volume
            progress = i / steps
            self.current_volume = start_volume * (1 - progress)
            
            print(f"Fading volume: {self.current_volume * 100:.0f}%")
            
            # In a real implementation, this would be much slower
            time.sleep(duration_seconds / steps / 20)  # Accelerated for demo
        
        print("Bedtime fade complete")
        self.current_volume = 0.0
        
        # In a real app, this might transition to white noise or lullaby
        print("Transitioning to lullaby sounds...")
        
        # Reset after demo
        time.sleep(2)
        self.is_bedtime_mode = False
        self.current_volume = start_volume
    
    def stop_bedtime_fade(self) -> None:
        """Stop bedtime fade and restore volume"""
        if not self.is_bedtime_mode:
            return
        
        self.is_bedtime_mode = False
        self.current_volume = 1.0
        print("Bedtime fade stopped, volume restored")
    
    def get_animal_sounds(self, animal_type: str) -> List[str]:
        """Get available sound effects for a specific animal"""
        return self.animal_sounds.get(animal_type, [])
    
    def get_ambient_sounds(self, setting: str) -> List[str]:
        """Get available ambient sounds for a specific setting"""
        return self.ambient_sounds.get(setting, [])


# Example usage
def demo_audio_service():
    """Demonstrate the audio service functionality"""
    
    # Initialize the service
    audio_service = AudioService()
    
    print("\n=== AI StoryLand Audio Service Demo ===\n")
    
    # Generate speech for different animals
    print("Generating speech with different animal effects...")
    
    lion_speech = audio_service.generate_speech(
        "I am a mighty lion, king of the jungle!",
        animal_type="lion",
        voice_intensity=0.7
    )
    
    elephant_speech = audio_service.generate_speech(
        "Hello! I'm a big elephant with a long trunk.",
        animal_type="elephant",
        voice_intensity=0.6
    )
    
    monkey_speech = audio_service.generate_speech(
        "Ooh ooh! I'm a playful monkey swinging in the trees!",
        animal_type="monkey",
        voice_intensity=0.8
    )
    
    # Play the generated speech
    print("\nPlaying lion speech:")
    audio_service.play_audio(lion_speech, background_effects=["jungle", "savanna"])
    
    print("\nPlaying elephant speech:")
    audio_service.play_audio(elephant_speech, background_effects=["savanna", "river"])
    
    print("\nPlaying monkey speech:")
    audio_service.play_audio(monkey_speech, background_effects=["jungle", "forest"])
    
    # Demonstrate bedtime mode
    print("\nDemonstrating bedtime mode:")
    audio_service.start_bedtime_fade(duration_seconds=5)  # Shortened for demo
    
    # Play speech during fade
    time.sleep(1)
    print("\nPlaying speech during volume fade:")
    audio_service.play_audio(lion_speech)
    
    # Wait for fade to complete
    time.sleep(5)
    
    print("\n=== Demo Complete ===")


if __name__ == "__main__":
    demo_audio_service()
