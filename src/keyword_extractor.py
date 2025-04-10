"""
Keyword Extraction Module for AI StoryLand App

This module provides functionality to:
1. Process transcribed text from speech recognition
2. Extract animal keywords and other relevant terms
3. Categorize keywords for story generation
4. Handle child-specific speech patterns and mispronunciations

Usage:
    extractor = KeywordExtractor()
    keywords = extractor.extract_keywords(text)
    animal_type = extractor.get_primary_animal(keywords)
"""

import re
from typing import List, Dict, Set, Optional, Tuple
import json

class KeywordExtractor:
    """Extracts and categorizes keywords from child speech input"""
    
    def __init__(self):
        """Initialize the keyword extractor with predefined keyword categories"""
        # Animal keywords with common mispronunciations
        self.animal_keywords = {
            # Primary keyword: [variations, mispronunciations, related terms]
            "lion": ["lions", "lyin", "loin", "roar", "simba"],
            "tiger": ["tigers", "tigger", "tiga", "stripe"],
            "elephant": ["elephants", "elphant", "dumbo", "trunk"],
            "giraffe": ["giraffes", "jiraf", "jiraffe", "long neck"],
            "monkey": ["monkeys", "munkey", "ape", "chimp", "banana"],
            "zebra": ["zebras", "zeebra", "stripey horse"],
            "hippo": ["hippos", "hippopotamus", "hipopatamus"],
            "rhino": ["rhinos", "rhinoceros", "ryno", "horn"],
            "crocodile": ["crocodiles", "croc", "crocadile", "alligator", "gator"],
            "snake": ["snakes", "snek", "slither", "hiss"],
            "bear": ["bears", "teddy", "grizzly", "panda", "polar bear"],
            "wolf": ["wolves", "woof", "howl"],
            "fox": ["foxes", "foxy", "firefox"],
            "rabbit": ["rabbits", "bunny", "bunnies", "hop"],
            "deer": ["deers", "bambi", "antlers", "reindeer"],
            "owl": ["owls", "hoot", "night bird"],
            "eagle": ["eagles", "bird", "fly"],
            "parrot": ["parrots", "bird", "talk", "pirate"],
            "penguin": ["penguins", "pingwin", "waddle"],
            "whale": ["whales", "big fish", "ocean"],
            "shark": ["sharks", "jaws", "fin", "teeth"],
            "dolphin": ["dolphins", "dolfin", "flipper"],
            "octopus": ["octopuses", "octopi", "tentacles"]
        }
        
        # Setting keywords
        self.setting_keywords = {
            "jungle": ["forest", "woods", "trees", "rainforest"],
            "ocean": ["sea", "water", "beach", "underwater"],
            "savanna": ["grassland", "africa", "plains"],
            "mountain": ["mountains", "hill", "climb"],
            "desert": ["sand", "hot", "cactus"],
            "arctic": ["snow", "ice", "cold", "north pole"],
            "farm": ["barn", "animals", "tractor", "cow"],
            "zoo": ["animals", "cages", "visit"]
        }
        
        # Action keywords
        self.action_keywords = {
            "run": ["running", "fast", "chase", "race"],
            "swim": ["swimming", "water", "splash"],
            "fly": ["flying", "sky", "wings"],
            "jump": ["jumping", "hop", "leap"],
            "sleep": ["sleeping", "nap", "dream", "bed"],
            "eat": ["eating", "food", "hungry", "snack"],
            "play": ["playing", "fun", "game", "toys"],
            "hide": ["hiding", "seek", "invisible"]
        }
        
        # Story type keywords
        self.story_type_keywords = {
            "adventure": ["journey", "quest", "explore", "discover"],
            "funny": ["silly", "laugh", "joke", "giggle"],
            "scary": ["spooky", "monster", "ghost", "dark"],
            "happy": ["joy", "smile", "fun", "good"],
            "sad": ["cry", "tears", "upset"],
            "friendship": ["friend", "together", "help", "share"]
        }
        
        # Common request patterns
        self.request_patterns = [
            r"(?:i want|tell me|can i have)(?:\sa)?\s(\w+)(?:\sstory)?",
            r"(?:story about|about a)(?:\s)(\w+)",
            r"^(\w+)(?:\splease|\snow|\sstory)?$"
        ]
    
    def extract_keywords(self, text: str) -> Dict[str, List[str]]:
        """
        Extract all types of keywords from the input text
        
        Args:
            text: Transcribed text from speech recognition
            
        Returns:
            Dictionary with categorized keywords
        """
        if not text:
            return {
                "animals": [],
                "settings": [],
                "actions": [],
                "story_types": [],
                "primary_request": None
            }
        
        # Normalize text
        normalized_text = self._normalize_text(text)
        
        # Extract primary request if present
        primary_request = self._extract_primary_request(normalized_text)
        
        # Extract keywords by category
        animals = self._extract_category_keywords(normalized_text, self.animal_keywords)
        settings = self._extract_category_keywords(normalized_text, self.setting_keywords)
        actions = self._extract_category_keywords(normalized_text, self.action_keywords)
        story_types = self._extract_category_keywords(normalized_text, self.story_type_keywords)
        
        # If no animals found but primary request looks like an animal, add it
        if not animals and primary_request:
            for animal, variations in self.animal_keywords.items():
                if primary_request == animal or primary_request in variations:
                    animals = [animal]
                    break
        
        return {
            "animals": animals,
            "settings": settings,
            "actions": actions,
            "story_types": story_types,
            "primary_request": primary_request
        }
    
    def get_primary_animal(self, keywords: Dict[str, List[str]]) -> Optional[str]:
        """
        Get the primary animal from extracted keywords
        
        Args:
            keywords: Dictionary with categorized keywords
            
        Returns:
            Primary animal keyword or None if no animals found
        """
        animals = keywords.get("animals", [])
        if not animals:
            return None
        return animals[0]
    
    def _normalize_text(self, text: str) -> str:
        """Normalize text for keyword extraction"""
        # Convert to lowercase
        text = text.lower()
        
        # Remove punctuation
        text = re.sub(r'[^\w\s]', ' ', text)
        
        # Replace multiple spaces with single space
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text
    
    def _extract_primary_request(self, text: str) -> Optional[str]:
        """Extract primary request using patterns"""
        for pattern in self.request_patterns:
            match = re.search(pattern, text)
            if match:
                return match.group(1).lower()
        return None
    
    def _extract_category_keywords(self, text: str, category_dict: Dict[str, List[str]]) -> List[str]:
        """Extract keywords for a specific category"""
        found_keywords = []
        
        # Split text into words
        words = text.split()
        
        # Check for each keyword and its variations
        for keyword, variations in category_dict.items():
            # Check for the main keyword
            if keyword in text:
                found_keywords.append(keyword)
                continue
                
            # Check for variations
            for variation in variations:
                if variation in text:
                    found_keywords.append(keyword)
                    break
                    
            # Check for partial matches (for child mispronunciations)
            if not any(kw == keyword for kw in found_keywords):
                for word in words:
                    # If word is at least 3 chars and 70% similar to keyword or variation
                    if len(word) >= 3 and self._is_similar(word, keyword):
                        found_keywords.append(keyword)
                        break
                    
                    for variation in variations:
                        if len(word) >= 3 and self._is_similar(word, variation):
                            found_keywords.append(keyword)
                            break
        
        return found_keywords
    
    def _is_similar(self, word1: str, word2: str) -> bool:
        """Check if two words are similar (for handling mispronunciations)"""
        # For very short words, require exact match
        if len(word1) <= 2 or len(word2) <= 2:
            return word1 == word2
            
        # For longer words, use a simple similarity metric
        # In a real app, this would use more sophisticated phonetic matching
        
        # If one is contained in the other, consider similar
        if word1 in word2 or word2 in word1:
            return True
            
        # Count matching characters
        matches = 0
        for char in word1:
            if char in word2:
                matches += 1
                
        # Calculate similarity ratio
        similarity = matches / max(len(word1), len(word2))
        
        # Consider similar if 70% or more characters match
        return similarity >= 0.7


# Example usage
def demo_keyword_extraction():
    """Demonstrate the keyword extraction functionality"""
    
    # Initialize the extractor
    extractor = KeywordExtractor()
    
    print("\n=== AI StoryLand Keyword Extraction Demo ===\n")
    
    # Test cases
    test_inputs = [
        "I want a lion story",
        "Tell me about elephants",
        "Tiger and monkey in the jungle",
        "Rhino please",
        "I want a story with a giraffe",
        "Lyin and tigger",  # Misspelled
        "Story about a big elphant",  # Misspelled
        "Happy bunny story",
        "Scary story with a shark",
        "I want funny monkeys playing"
    ]
    
    for input_text in test_inputs:
        print(f"\nInput: '{input_text}'")
        keywords = extractor.extract_keywords(input_text)
        
        print("Extracted keywords:")
        print(f"  Animals: {keywords['animals']}")
        print(f"  Settings: {keywords['settings']}")
        print(f"  Actions: {keywords['actions']}")
        print(f"  Story types: {keywords['story_types']}")
        print(f"  Primary request: {keywords['primary_request']}")
        
        primary_animal = extractor.get_primary_animal(keywords)
        print(f"Primary animal: {primary_animal}")
    
    print("\n=== Demo Complete ===")


if __name__ == "__main__":
    demo_keyword_extraction()
