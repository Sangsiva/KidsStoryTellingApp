"""
Speech Recognition Service for AI StoryLand App

This module provides functionality to:
1. Capture audio from the microphone
2. Process the audio using OpenAI Whisper API for speech-to-text
3. Extract keywords from the transcribed text
4. Provide a fallback offline mode using platform-specific APIs

Usage:
    speech_service = SpeechRecognitionService()
    
    # Online mode with Whisper API
    text = speech_service.recognize_speech(audio_data)
    keywords = speech_service.extract_keywords(text)
    
    # Offline mode
    text = speech_service.recognize_speech_offline(audio_data)
    keywords = speech_service.extract_keywords(text)
"""

import os
import json
import requests
import numpy as np
from typing import List, Dict, Union, Optional
import re

# Mock for audio processing library that would be used in a real mobile app
class AudioProcessor:
    """Simulates audio processing capabilities that would be in a mobile app"""
    
    def __init__(self):
        self.is_recording = False
        self.sample_rate = 16000  # 16kHz sample rate for Whisper API
    
    def start_recording(self) -> None:
        """Start recording audio from the microphone"""
        self.is_recording = True
        print("Recording started...")
    
    def stop_recording(self) -> np.ndarray:
        """Stop recording and return the audio data"""
        self.is_recording = False
        print("Recording stopped.")
        # In a real app, this would return actual audio data
        # Here we're just simulating with a random array
        return np.random.rand(self.sample_rate * 3)  # 3 seconds of fake audio
    
    def get_audio_level(self) -> float:
        """Get the current audio level (for UI feedback)"""
        if not self.is_recording:
            return 0.0
        return np.random.rand() * 100  # Random level between 0-100
    
    def prepare_for_whisper(self, audio_data: np.ndarray) -> bytes:
        """Convert audio data to format required by Whisper API"""
        # In a real app, this would convert the numpy array to proper WAV format
        # For simulation, we'll just return some bytes
        return b"simulated_audio_data"


class SpeechRecognitionService:
    """Service for handling speech recognition in the AI StoryLand app"""
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize the speech recognition service
        
        Args:
            api_key: OpenAI API key for Whisper API (optional, can be set via env var)
        """
        self.api_key = api_key or os.environ.get("OPENAI_API_KEY", "")
        self.audio_processor = AudioProcessor()
        self.animal_keywords = [
            "lion", "tiger", "elephant", "giraffe", "monkey", "zebra", 
            "hippo", "rhino", "crocodile", "snake", "bear", "wolf",
            "fox", "rabbit", "deer", "owl", "eagle", "parrot",
            "penguin", "whale", "shark", "dolphin", "octopus"
        ]
        
    def capture_audio(self) -> np.ndarray:
        """
        Capture audio from the microphone
        
        Returns:
            Audio data as numpy array
        """
        self.audio_processor.start_recording()
        # In a real app, this would wait for user to stop speaking or button release
        # For simulation, we'll just return immediately
        return self.audio_processor.stop_recording()
    
    def recognize_speech(self, audio_data: np.ndarray) -> str:
        """
        Recognize speech using OpenAI Whisper API
        
        Args:
            audio_data: Audio data as numpy array
            
        Returns:
            Transcribed text
        """
        # Check if we have an API key
        if not self.api_key:
            print("No OpenAI API key found. Falling back to offline mode.")
            return self.recognize_speech_offline(audio_data)
        
        try:
            # Prepare audio data for API
            audio_bytes = self.audio_processor.prepare_for_whisper(audio_data)
            
            # In a real implementation, this would make an actual API call
            # For simulation, we'll return mock responses
            
            # Simulate API call
            print("Sending audio to Whisper API...")
            
            # Simulate different responses based on random choice
            import random
            responses = [
                "I want a lion story",
                "Tell me about elephants",
                "I want to hear about tigers and monkeys",
                "Rhino please",
                "I want a story with a giraffe"
            ]
            
            # Simulate network delay
            import time
            time.sleep(0.5)
            
            transcription = random.choice(responses)
            print(f"Whisper API returned: '{transcription}'")
            
            return transcription
            
        except Exception as e:
            print(f"Error with Whisper API: {e}")
            print("Falling back to offline mode.")
            return self.recognize_speech_offline(audio_data)
    
    def recognize_speech_offline(self, audio_data: np.ndarray) -> str:
        """
        Recognize speech using offline methods (platform-specific in real app)
        
        Args:
            audio_data: Audio data as numpy array
            
        Returns:
            Transcribed text
        """
        # In a real app, this would use platform-specific APIs:
        # - iOS: Speech Framework
        # - Android: SpeechRecognizer
        
        # For simulation, we'll return a simple response
        print("Using offline speech recognition...")
        
        # Simulate different responses based on random choice
        import random
        responses = [
            "lion story",
            "elephant",
            "tiger",
            "rhino",
            "giraffe"
        ]
        
        transcription = random.choice(responses)
        print(f"Offline recognition returned: '{transcription}'")
        
        return transcription
    
    def extract_keywords(self, text: str) -> List[str]:
        """
        Extract animal keywords from transcribed text
        
        Args:
            text: Transcribed text from speech recognition
            
        Returns:
            List of animal keywords found in the text
        """
        text = text.lower()
        found_keywords = []
        
        # Check for each animal keyword in the text
        for animal in self.animal_keywords:
            if animal in text:
                found_keywords.append(animal)
        
        # If no keywords found, try to extract any nouns as potential keywords
        if not found_keywords:
            # In a real app, this would use NLP to extract nouns
            # For simulation, we'll just return a default
            found_keywords = ["animal"]
        
        print(f"Extracted keywords: {found_keywords}")
        return found_keywords
    
    def get_whisper_api_status(self) -> Dict[str, Union[bool, str]]:
        """
        Check if the Whisper API is available and working
        
        Returns:
            Dictionary with status information
        """
        if not self.api_key:
            return {
                "available": False,
                "message": "No API key configured"
            }
        
        try:
            # In a real app, this would make a test API call
            # For simulation, we'll just return success
            return {
                "available": True,
                "message": "Whisper API is available"
            }
        except Exception as e:
            return {
                "available": False,
                "message": f"Error: {str(e)}"
            }


# Example usage
def demo_speech_recognition():
    """Demonstrate the speech recognition service"""
    
    # Initialize the service
    speech_service = SpeechRecognitionService()
    
    print("\n=== AI StoryLand Speech Recognition Demo ===\n")
    
    # Check API status
    api_status = speech_service.get_whisper_api_status()
    print(f"Whisper API status: {api_status['message']}")
    
    # Capture audio (simulated)
    print("\nCapturing audio...")
    audio_data = speech_service.capture_audio()
    
    # Online recognition
    print("\n--- Online Recognition ---")
    text = speech_service.recognize_speech(audio_data)
    keywords = speech_service.extract_keywords(text)
    
    print(f"\nTranscribed text: '{text}'")
    print(f"Extracted keywords: {keywords}")
    
    # Offline recognition
    print("\n--- Offline Recognition ---")
    offline_text = speech_service.recognize_speech_offline(audio_data)
    offline_keywords = speech_service.extract_keywords(offline_text)
    
    print(f"\nOffline transcribed text: '{offline_text}'")
    print(f"Offline extracted keywords: {offline_keywords}")
    
    print("\n=== Demo Complete ===")


if __name__ == "__main__":
    demo_speech_recognition()
