"""
Story Generation Service for AI StoryLand App

This module provides functionality to:
1. Generate stories based on keywords extracted from speech
2. Adapt ongoing stories with new elements
3. Create age-appropriate content for young children
4. Support both online (LLM-based) and offline (template-based) story generation

Usage:
    story_generator = StoryGenerator()
    
    # Generate a new story
    story = story_generator.generate_story(keywords)
    
    # Adapt an ongoing story
    updated_story = story_generator.adapt_story(current_story, new_keywords)
"""

import os
import json
import random
import time
from typing import Dict, List, Any, Optional, Tuple

class StoryGenerator:
    """Generates and adapts stories for the AI StoryLand app"""
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize the story generator
        
        Args:
            api_key: OpenAI API key for GPT API (optional, can be set via env var)
        """
        self.api_key = api_key or os.environ.get("OPENAI_API_KEY", "")
        self.load_story_templates()
        self.current_story_context = {}
        
    def load_story_templates(self):
        """Load story templates from file or create default templates"""
        # In a real app, these would be loaded from a database or file
        # For this prototype, we'll define them inline
        
        self.story_templates = {
            # Templates for different animals
            "lion": [
                {
                    "title": "Leo the Brave Lion",
                    "intro": "Once upon a time, there was a brave lion named Leo. Leo had a beautiful golden mane and a mighty roar.",
                    "middle_segments": [
                        "Leo lived in the savanna with all his animal friends.",
                        "One day, Leo heard a cry for help. It was coming from the river!",
                        "Leo ran as fast as he could to see what was happening.",
                        "At the river, Leo saw a little rabbit who couldn't swim and was scared of the water.",
                        "Leo was very brave. He carefully helped the rabbit cross the river."
                    ],
                    "endings": [
                        "The rabbit thanked Leo for being so brave and helpful.",
                        "Leo and the rabbit became good friends and played together every day.",
                        "And Leo learned that being brave means helping others when they're scared."
                    ],
                    "sound_effects": ["lion_roar", "savanna_ambience", "river_flowing"]
                },
                {
                    "title": "The Lion's Nap",
                    "intro": "In the warm savanna, there lived a sleepy lion named Sammy. Sammy loved to take long naps under the shade of a big tree.",
                    "middle_segments": [
                        "One sunny afternoon, Sammy was looking for the perfect spot for his nap.",
                        "He found a nice shady tree and curled up underneath it.",
                        "As Sammy was falling asleep, he heard some giggling nearby.",
                        "He opened one eye and saw some playful monkeys in the tree above him.",
                        "The monkeys were having so much fun swinging from branch to branch."
                    ],
                    "endings": [
                        "Sammy smiled and decided to watch the monkeys play instead of taking his nap.",
                        "Sometimes, watching friends have fun is better than sleeping.",
                        "The monkeys and Sammy became friends, and they played together every afternoon."
                    ],
                    "sound_effects": ["lion_yawn", "monkey_sounds", "savanna_ambience"]
                }
            ],
            "elephant": [
                {
                    "title": "Ellie the Elephant's Big Day",
                    "intro": "Ellie was a young elephant with big floppy ears and a very long trunk. She lived with her family in the jungle.",
                    "middle_segments": [
                        "Ellie loved using her trunk to spray water and pick up things.",
                        "One day, Ellie and her family went for a walk to the watering hole.",
                        "At the watering hole, Ellie saw her reflection in the water for the first time.",
                        "She was surprised by how big her ears were!",
                        "Ellie felt a little sad because her ears were bigger than her friends' ears."
                    ],
                    "endings": [
                        "Ellie's mother told her that her big ears were special and helped her stay cool in the hot sun.",
                        "Ellie realized that everyone is different, and that's what makes each animal special.",
                        "From that day on, Ellie loved her big ears and was proud to be herself."
                    ],
                    "sound_effects": ["elephant_trumpet", "jungle_ambience", "water_splash"]
                }
            ],
            "tiger": [
                {
                    "title": "Tyler the Stripy Tiger",
                    "intro": "Tyler was a young tiger with beautiful orange fur and black stripes. He lived in a dense jungle with tall trees and colorful flowers.",
                    "middle_segments": [
                        "Tyler loved to run and play hide and seek among the trees.",
                        "His stripes made him very good at hiding in the tall grass and between the trees.",
                        "One rainy day, Tyler couldn't go outside to play.",
                        "He was feeling bored and a little sad.",
                        "Then he had an idea! He could play indoor games with his tiger family."
                    ],
                    "endings": [
                        "Tyler and his family played fun games all day long.",
                        "They told stories, made up dances, and even built a cozy den with leaves.",
                        "Tyler learned that you can have fun anywhere, even on rainy days at home."
                    ],
                    "sound_effects": ["tiger_growl", "rain_sounds", "jungle_ambience"]
                }
            ],
            # Default template for animals without specific templates
            "default": [
                {
                    "title": "The Animal Adventure",
                    "intro": "Once upon a time, there was a wonderful animal who lived in a beautiful place.",
                    "middle_segments": [
                        "This animal had many friends who all lived nearby.",
                        "One sunny morning, the animal decided to go on an adventure.",
                        "Along the way, the animal met new friends and saw amazing things.",
                        "There were tall trees, flowing rivers, and colorful flowers everywhere.",
                        "The animal and friends played games and had a wonderful time."
                    ],
                    "endings": [
                        "As the sun began to set, the animal headed back home.",
                        "It had been a perfect day full of fun and adventure.",
                        "The animal fell asleep that night dreaming of the next adventure."
                    ],
                    "sound_effects": ["nature_sounds", "happy_music"]
                }
            ]
        }
        
        # Story adaptations for introducing new elements
        self.adaptation_templates = {
            "new_animal": [
                "Suddenly, a friendly {animal} appeared on the path!",
                "In the distance, they could see a {animal} watching them curiously.",
                "A gentle {animal} came over to say hello.",
                "They heard a sound and turned to see a {animal} nearby."
            ],
            "new_setting": [
                "They continued their journey and found themselves in a {setting}.",
                "The path led them to a beautiful {setting}.",
                "After walking for a while, they arrived at a {setting}.",
                "The friends decided to visit the nearby {setting}."
            ],
            "new_action": [
                "The animals decided to {action} together.",
                "Everyone thought it would be fun to {action}.",
                "They all began to {action} and had a wonderful time.",
                "The {animal} showed everyone how to {action}."
            ]
        }
    
    def generate_story(self, keywords: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate a new story based on extracted keywords
        
        Args:
            keywords: Dictionary with categorized keywords from speech recognition
            
        Returns:
            Dictionary containing the generated story
        """
        # Extract primary animal
        animals = keywords.get("animals", [])
        primary_animal = animals[0] if animals else "animal"
        
        # Try to use online generation if API key is available
        if self.api_key:
            try:
                return self._generate_story_online(keywords)
            except Exception as e:
                print(f"Error with online story generation: {e}")
                print("Falling back to offline generation.")
        
        # Fallback to offline generation
        return self._generate_story_offline(keywords)
    
    def _generate_story_online(self, keywords: Dict[str, Any]) -> Dict[str, Any]:
        """Generate story using OpenAI GPT API"""
        # In a real implementation, this would make an actual API call
        # For simulation, we'll return a mock response
        
        # Extract keywords
        animals = keywords.get("animals", [])
        settings = keywords.get("settings", [])
        actions = keywords.get("actions", [])
        story_types = keywords.get("story_types", [])
        
        primary_animal = animals[0] if animals else "animal"
        
        print(f"Generating online story about: {primary_animal}")
        
        # Simulate API call delay
        time.sleep(1)
        
        # Create a more dynamic story based on all keywords
        title = f"The {primary_animal.title()}'s Adventure"
        
        # Create story intro
        animal_name = self._get_animal_name(primary_animal)
        setting = settings[0] if settings else random.choice(["forest", "jungle", "meadow", "savanna"])
        intro = f"Once upon a time, there was a {primary_animal} named {animal_name}. {animal_name} lived in a beautiful {setting}."
        
        # Create middle segments
        middle_segments = []
        
        # Add segment about the animal
        if primary_animal == "lion":
            middle_segments.append(f"{animal_name} had a magnificent mane and a powerful roar that could be heard throughout the {setting}.")
        elif primary_animal == "elephant":
            middle_segments.append(f"{animal_name} had big floppy ears and a long trunk that could pick up things and spray water.")
        elif primary_animal == "tiger":
            middle_segments.append(f"{animal_name} had beautiful orange fur with black stripes that helped {animal_name} hide among the trees.")
        else:
            middle_segments.append(f"{animal_name} was a wonderful {primary_animal} who was loved by all the other animals.")
        
        # Add segment about the day
        middle_segments.append(f"One sunny morning, {animal_name} woke up feeling excited for a new day of adventures.")
        
        # Add segment about action if specified
        if actions:
            action = actions[0]
            middle_segments.append(f"{animal_name} loved to {action} more than anything else.")
            middle_segments.append(f"Today was the perfect day to {action} in the {setting}.")
        else:
            middle_segments.append(f"{animal_name} decided to explore the {setting} and see what adventures awaited.")
        
        # Add segment about friends
        other_animals = [a for a in animals if a != primary_animal]
        if other_animals:
            friend_animal = other_animals[0]
            friend_name = self._get_animal_name(friend_animal)
            middle_segments.append(f"As {animal_name} was exploring, {animal_name} met a friendly {friend_animal} named {friend_name}.")
            middle_segments.append(f"{animal_name} and {friend_name} decided to spend the day together.")
        else:
            middle_segments.append(f"During {animal_name}'s adventure, {animal_name} met many friendly animals who lived in the {setting}.")
        
        # Add segment about story type if specified
        if story_types:
            story_type = story_types[0]
            if story_type == "adventure":
                middle_segments.append(f"They discovered a hidden path that led to a mysterious part of the {setting} they had never seen before.")
            elif story_type == "funny":
                middle_segments.append(f"They played silly games and told funny jokes that made them laugh and laugh.")
            elif story_type == "happy":
                middle_segments.append(f"They had the most wonderful day filled with joy and happiness.")
        
        # Create endings
        endings = []
        endings.append(f"As the sun began to set, {animal_name} felt happy about the wonderful day.")
        
        if other_animals:
            endings.append(f"{animal_name} and {friend_name} promised to meet again for another adventure soon.")
        else:
            endings.append(f"{animal_name} couldn't wait to tell everyone about the amazing adventure.")
        
        endings.append(f"And as the stars came out, {animal_name} fell asleep dreaming of tomorrow's adventures.")
        
        # Determine appropriate sound effects
        sound_effects = [f"{primary_animal}_sounds", f"{setting}_ambience"]
        if actions:
            sound_effects.append(f"{actions[0]}_sounds")
        
        # Create story object
        story = {
            "title": title,
            "intro": intro,
            "middle_segments": middle_segments,
            "endings": endings,
            "sound_effects": sound_effects,
            "primary_animal": primary_animal,
            "animal_name": animal_name,
            "generation_method": "online"
        }
        
        # Save current story context for potential adaptation
        self.current_story_context = {
            "primary_animal": primary_animal,
            "animal_name": animal_name,
            "setting": setting,
            "characters": [animal_name],
            "mentioned_animals": animals
        }
        
        if other_animals:
            self.current_story_context["characters"].append(friend_name)
        
        return story
    
    def _generate_story_offline(self, keywords: Dict[str, Any]) -> Dict[str, Any]:
        """Generate story using pre-defined templates"""
        # Extract primary animal
        animals = keywords.get("animals", [])
        primary_animal = animals[0] if animals else "animal"
        
        print(f"Generating offline story about: {primary_animal}")
        
        # Get templates for the animal
        if primary_animal in self.story_templates:
            templates = self.story_templates[primary_animal]
        else:
            templates = self.story_templates["default"]
        
        # Select a random template
        template = random.choice(templates)
        
        # Create a copy to modify
        story = template.copy()
        
        # Add metadata
        story["primary_animal"] = primary_animal
        story["animal_name"] = self._get_animal_name(primary_animal)
        story["generation_method"] = "offline"
        
        # Save current story context for potential adaptation
        self.current_story_context = {
            "primary_animal": primary_animal,
            "animal_name": story["animal_name"],
            "setting": self._extract_setting_from_story(story),
            "characters": [story["animal_name"]],
            "mentioned_animals": [primary_animal]
        }
        
        return story
    
    def adapt_story(self, current_story: Dict[str, Any], new_keywords: Dict[str, Any]) -> Dict[str, Any]:
        """
        Adapt an ongoing story with new elements
        
        Args:
            current_story: The current story being told
            new_keywords: New keywords extracted from speech
            
        Returns:
            Updated story with new elements incorporated
        """
        # Extract new elements
        new_animals = new_keywords.get("animals", [])
        new_settings = new_keywords.get("settings", [])
        new_actions = new_keywords.get("actions", [])
        
        # Create a copy of the current story to modify
        adapted_story = current_story.copy()
        
        # Get the current middle segments
        middle_segments = adapted_story.get("middle_segments", []).copy()
        
        # Add new segments based on new keywords
        new_segments = []
        
        # Add new animal if specified
        if new_animals and not any(animal in self.current_story_context.get("mentioned_animals", []) for animal in new_animals):
            new_animal = new_animals[0]
            new_animal_name = self._get_animal_name(new_animal)
            
            # Add to context
            self.current_story_context["mentioned_animals"] = self.current_story_context.get("mentioned_animals", []) + [new_animal]
            self.current_story_context["characters"] = self.current_story_context.get("characters", []) + [new_animal_name]
            
            # Add new segment
            template = random.choice(self.adaptation_templates["new_animal"])
            new_segment = template.format(animal=new_animal)
            new_segments.append(new_segment)
            
            # Add interaction with primary character
            primary_name = self.current_story_context.get("animal_name", "the animal")
            new_segments.append(f"{primary_name} was excited to meet {new_animal_name} the {new_animal}.")
            
            # Add sound effect
            if "sound_effects" in adapted_story:
                adapted_story["sound_effects"].append(f"{new_animal}_sounds")
        
        # Add new setting if specified
        if new_settings and not any(setting in self.current_story_context.get("setting", "") for setting in new_settings):
            new_setting = new_settings[0]
            
            # Update context
            self.current_story_context["setting"] = new_setting
            
            # Add new segment
            template = random.choice(self.adaptation_templates["new_setting"])
            new_segment = template.format(setting=new_setting)
            new_segments.append(new_segment)
            
            # Add sound effect
            if "sound_effects" in adapted_story:
                adapted_story["sound_effects"].append(f"{new_setting}_ambience")
        
        # Add new action if specified
        if new_actions:
            new_action = new_actions[0]
            
            # Add new segment
            template = random.choice(self.adaptation_templates["new_action"])
            characters = self.current_story_context.get("characters", [])
            animal = self.current_story_context.get("primary_animal", "animal")
            new_segment = template.format(action=new_action, animal=animal)
            new_segments.append(new_segment)
            
            # Add sound effect
            if "sound_effects" in adapted_story:
                adapted_story["sound_effects"].append(f"{new_action}_sounds")
        
        # Add new segments to the story
        if new_segments:
            # Insert new segments before the endings
            middle_segments.extend(new_segments)
            adapted_story["middle_segments"] = middle_segments
        
        return adapted_story
    
    def _get_animal_name(self, animal_type: str) -> str:
        """Generate a name for an animal based on its type"""
        # Dictionary of potential names for each animal type
        animal_names = {
            "lion": ["Leo", "Simba", "Mufasa", "Nala", "Kion"],
            "elephant": ["Ellie", "Dumbo", "Horton", "Ella", "Trunk"],
            "tiger": ["Tony", "Rajah", "Stripes", "Tigger", "Shere"],
            "monkey": ["Curious", "George", "Boots", "Bananas", "Swing"],
            "giraffe": ["Spots", "Stretch", "Tall", "Necky", "Geoffrey"],
            "zebra": ["Stripes", "Ziggy", "Zara", "Zippy", "Zeke"],
            "hippo": ["Happy", "Moto", "Bubbles", "Splash", "Waddles"],
            "rhino": ["Rocky", "Horn", "Stomper", "Crash", "Rhonda"],
            "crocodile": ["Snappy", "Chomp", "Scales", "Crocky", "Ally"],
            "snake": ["Slither", "Hiss", "Scales", "Squeeze", "Fang"],
            "bear": ["Teddy", "Honey", "Fuzzy", "Grizzly", "Cubby"],
            "wolf": ["Howler", "Luna", "Shadow", "Fang", "Timber"],
            "fox": ["Sly", "Redd", "Swift", "Foxy", "Rusty"],
            "rabbit": ["Hoppy", "Bunny", "Thumper", "Cotton", "Fluffy"],
            "deer": ["Bambi", "Prancer", "Dash", "Spot", "Forest"],
            "owl": ["Hoot", "Wise", "Feathers", "Night", "Blink"],
            "eagle": ["Soar", "Freedom", "Wings", "Sky", "Talon"],
            "parrot": ["Polly", "Rainbow", "Squawk", "Feathers", "Mimic"],
            "penguin": ["Waddle", "Chilly", "Tux", "Flipper", "Ice"],
            "whale": ["Splash", "Blue", "Spout", "Dive", "Ocean"],
            "shark": ["Fin", "Jaws", "Chomp", "Sharky", "Bite"],
            "dolphin": ["Flipper", "Echo", "Splash", "Wave", "Click"],
            "octopus": ["Inky", "Tentacles", "Squish", "Octo", "Suction"]
        }
        
        # Default names for animals not in the dictionary
        default_names = ["Fuzzy", "Fluffy", "Happy", "Friendly", "Cuddly"]
        
        # Get names for the animal type or use default
        names = animal_names.get(animal_type, default_names)
        
        # Return a random name
        return random.choice(names)
    
    def _extract_setting_from_story(self, story: Dict[str, Any]) -> str:
        """Extract the setting from a story based on its content"""
        # Common settings to look for
        settings = ["jungle", "forest", "savanna", "ocean", "river", "mountain", "desert", "zoo"]
        
        # Check intro and middle segments for settings
        text = story.get("intro", "") + " " + " ".join(story.get("middle_segments", []))
        text = text.lower()
        
        for setting in settings:
            if setting in text:
                return setting
        
        # Default setting if none found
        return "wilderness"


# Example usage
def demo_story_generator():
    """Demonstrate the story generation functionality"""
    
    # Initialize the generator
    generator = StoryGenerator()
    
    print("\n=== AI StoryLand Story Generator Demo ===\n")
    
    # Test with different keywords
    test_keywords = [
        {
            "animals": ["lion"],
            "settings": ["jungle"],
            "actions": ["run"],
            "story_types": ["adventure"],
            "primary_request": "lion"
        },
        {
            "animals": ["elephant", "monkey"],
            "settings": ["river"],
            "actions": ["swim"],
            "story_types": ["funny"],
            "primary_request": "elephant"
        },
        {
            "animals": ["tiger"],
            "settings": [],
            "actions": [],
            "story_types": [],
            "primary_request": "tiger"
        }
    ]
    
    # Generate a story
    print("Generating a story about a lion...")
    lion_story = generator.generate_story(test_keywords[0])
    
    print(f"\nTitle: {lion_story['title']}")
    print(f"Intro: {lion_story['intro']}")
    print("\nMiddle segments:")
    for segment in lion_story['middle_segments']:
        print(f"- {segment}")
    print("\nEndings:")
    for ending in lion_story['endings']:
        print(f"- {ending}")
    print(f"\nSound effects: {lion_story['sound_effects']}")
    print(f"Primary animal: {lion_story['primary_animal']}")
    print(f"Animal name: {lion_story['animal_name']}")
    print(f"Generation method: {lion_story['generation_method']}")
    
    # Adapt the story with new keywords
    print("\nAdapting the story with a new animal (rhino)...")
    new_keywords = {
        "animals": ["rhino"],
        "settings": [],
        "actions": [],
        "story_types": [],
        "primary_request": "rhino"
    }
    
    adapted_story = generator.adapt_story(lion_story, new_keywords)
    
    print("\nUpdated middle segments:")
    for segment in adapted_story['middle_segments']:
        print(f"- {segment}")
    
    print("\n=== Demo Complete ===")


if __name__ == "__main__":
    demo_story_generator()
