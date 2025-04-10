"""
Speech Recognition Integration Module for AI StoryLand App

This module integrates the speech recognition service with the keyword extractor
to provide a complete speech processing pipeline for the app.

Usage:
    speech_processor = SpeechProcessor()
    result = speech_processor.process_speech_input()
    
    # Access results
    transcription = result['transcription']
    keywords = result['keywords']
    primary_animal = result['primary_animal']
"""

import os
import time
from typing import Dict, List, Any, Optional

# Import our custom modules
from speech_recognition_service import SpeechRecognitionService
from keyword_extractor import KeywordExtractor

class SpeechProcessor:
    """
    Integrates speech recognition and keyword extraction for the AI StoryLand app
    """
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize the speech processor
        
        Args:
            api_key: OpenAI API key for Whisper API (optional)
        """
        self.speech_service = SpeechRecognitionService(api_key)
        self.keyword_extractor = KeywordExtractor()
        self.last_processing_time = 0
        self.processing_history = []
        
    def process_speech_input(self) -> Dict[str, Any]:
        """
        Process speech input from capture to keyword extraction
        
        Returns:
            Dictionary containing transcription, keywords, and primary animal
        """
        # Record processing start time
        start_time = time.time()
        
        # Capture audio
        print("Capturing audio...")
        audio_data = self.speech_service.capture_audio()
        
        # Recognize speech
        print("Recognizing speech...")
        transcription = self.speech_service.recognize_speech(audio_data)
        
        # Extract keywords
        print("Extracting keywords...")
        keywords = self.keyword_extractor.extract_keywords(transcription)
        
        # Get primary animal
        primary_animal = self.keyword_extractor.get_primary_animal(keywords)
        
        # Calculate processing time
        processing_time = time.time() - start_time
        self.last_processing_time = processing_time
        
        # Create result
        result = {
            "transcription": transcription,
            "keywords": keywords,
            "primary_animal": primary_animal,
            "processing_time": processing_time
        }
        
        # Add to history (limited to last 10 entries)
        self.processing_history.append(result)
        if len(self.processing_history) > 10:
            self.processing_history.pop(0)
        
        return result
    
    def get_processing_stats(self) -> Dict[str, Any]:
        """
        Get statistics about speech processing performance
        
        Returns:
            Dictionary with processing statistics
        """
        if not self.processing_history:
            return {
                "average_time": 0,
                "min_time": 0,
                "max_time": 0,
                "total_processed": 0
            }
        
        times = [entry["processing_time"] for entry in self.processing_history]
        
        return {
            "average_time": sum(times) / len(times),
            "min_time": min(times),
            "max_time": max(times),
            "total_processed": len(self.processing_history)
        }
    
    def get_last_recognized_animals(self) -> List[str]:
        """
        Get a list of animals recognized in recent interactions
        
        Returns:
            List of animal keywords from recent processing
        """
        animals = []
        for entry in self.processing_history:
            animal = entry.get("primary_animal")
            if animal and animal not in animals:
                animals.append(animal)
        
        return animals


# Example usage
def demo_speech_processor():
    """Demonstrate the complete speech processing pipeline"""
    
    # Initialize the processor
    processor = SpeechProcessor()
    
    print("\n=== AI StoryLand Speech Processing Demo ===\n")
    
    # Process speech input
    print("Processing speech input...")
    result = processor.process_speech_input()
    
    # Display results
    print("\nResults:")
    print(f"Transcription: '{result['transcription']}'")
    print(f"Keywords: {result['keywords']}")
    print(f"Primary animal: {result['primary_animal']}")
    print(f"Processing time: {result['processing_time']:.2f} seconds")
    
    # Process another input
    print("\nProcessing another speech input...")
    result2 = processor.process_speech_input()
    
    # Display results
    print("\nResults:")
    print(f"Transcription: '{result2['transcription']}'")
    print(f"Keywords: {result2['keywords']}")
    print(f"Primary animal: {result2['primary_animal']}")
    print(f"Processing time: {result2['processing_time']:.2f} seconds")
    
    # Get processing stats
    stats = processor.get_processing_stats()
    print("\nProcessing Statistics:")
    print(f"Average processing time: {stats['average_time']:.2f} seconds")
    print(f"Min processing time: {stats['min_time']:.2f} seconds")
    print(f"Max processing time: {stats['max_time']:.2f} seconds")
    print(f"Total processed: {stats['total_processed']}")
    
    # Get recognized animals
    animals = processor.get_last_recognized_animals()
    print(f"\nRecently recognized animals: {animals}")
    
    print("\n=== Demo Complete ===")


if __name__ == "__main__":
    demo_speech_processor()
