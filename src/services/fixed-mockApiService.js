// Mock API Service for AI StoryLand Web App
// This file provides mock implementations of the backend API calls with improved error handling

// Mock story data
const mockStories = {
  lion: {
    title: "Leo the Brave Lion",
    intro: "Once upon a time, there was a brave lion named Leo. Leo had a beautiful golden mane and a mighty roar.",
    middle_segments: [
      "Leo lived in the savanna with all his animal friends.",
      "One day, Leo heard a cry for help. It was coming from the river!",
      "Leo ran as fast as he could to see what was happening.",
      "At the river, Leo saw a little rabbit who couldn't swim and was scared of the water.",
      "Leo was very brave. He carefully helped the rabbit cross the river."
    ],
    endings: [
      "The rabbit thanked Leo for being so brave and helpful.",
      "Leo and the rabbit became good friends and played together every day.",
      "And Leo learned that being brave means helping others when they're scared."
    ],
    sound_effects: ["lion_roar", "savanna_ambience", "river_flowing"],
    primary_animal: "lion",
    animal_name: "Leo"
  },
  elephant: {
    title: "Ellie the Elephant's Big Day",
    intro: "Ellie was a young elephant with big floppy ears and a very long trunk. She lived with her family in the jungle.",
    middle_segments: [
      "Ellie loved using her trunk to spray water and pick up things.",
      "One day, Ellie and her family went for a walk to the watering hole.",
      "At the watering hole, Ellie saw her reflection in the water for the first time.",
      "She was surprised by how big her ears were!",
      "Ellie felt a little sad because her ears were bigger than her friends' ears."
    ],
    endings: [
      "Ellie's mother told her that her big ears were special and helped her stay cool in the hot sun.",
      "Ellie realized that everyone is different, and that's what makes each animal special.",
      "From that day on, Ellie loved her big ears and was proud to be herself."
    ],
    sound_effects: ["elephant_trumpet", "jungle_ambience", "water_splash"],
    primary_animal: "elephant",
    animal_name: "Ellie"
  },
  tiger: {
    title: "Tyler the Stripy Tiger",
    intro: "Tyler was a young tiger with beautiful orange fur and black stripes. He lived in a dense jungle with tall trees and colorful flowers.",
    middle_segments: [
      "Tyler loved to run and play hide and seek among the trees.",
      "His stripes made him very good at hiding in the tall grass and between the trees.",
      "One rainy day, Tyler couldn't go outside to play.",
      "He was feeling bored and a little sad.",
      "Then he had an idea! He could play indoor games with his tiger family."
    ],
    endings: [
      "Tyler and his family played fun games all day long.",
      "They told stories, made up dances, and even built a cozy den with leaves.",
      "Tyler learned that you can have fun anywhere, even on rainy days at home."
    ],
    sound_effects: ["tiger_growl", "rain_sounds", "jungle_ambience"],
    primary_animal: "tiger",
    animal_name: "Tyler"
  },
  default: {
    title: "The Animal Adventure",
    intro: "Once upon a time, there was a wonderful animal who lived in a beautiful place.",
    middle_segments: [
      "This animal had many friends who all lived nearby.",
      "One sunny morning, the animal decided to go on an adventure.",
      "Along the way, the animal met new friends and saw amazing things.",
      "There were tall trees, flowing rivers, and colorful flowers everywhere.",
      "The animal and friends played games and had a wonderful time."
    ],
    endings: [
      "As the sun began to set, the animal headed back home.",
      "It had been a perfect day full of fun and adventure.",
      "The animal fell asleep that night dreaming of the next adventure."
    ],
    sound_effects: ["nature_sounds", "happy_music"],
    primary_animal: "animal",
    animal_name: "Fuzzy"
  }
};

// Default settings
const defaultSettings = {
  voiceEffectIntensity: 0.6,
  backgroundSoundVolume: 0.3,
  playbackSpeed: 1.0,
  bedtimeFadeDuration: 15,
  noScaryContent: true,
  educationalFocus: false,
  offlineMode: false,
  saveFavorites: true,
  autoAdaptStory: true
};

// Mock API functions with improved error handling

// Start a new story based on input
export const startStory = async (input) => {
  try {
    console.log("startStory API called with input:", input);
    
    // Simulate API delay (shorter for better UX)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Extract animal type from input
    const inputLower = input ? input.toLowerCase() : '';
    let animalType = 'default';
    
    if (inputLower.includes('lion')) {
      animalType = 'lion';
    } else if (inputLower.includes('elephant')) {
      animalType = 'elephant';
    } else if (inputLower.includes('tiger')) {
      animalType = 'tiger';
    }
    
    console.log("Selected animal type:", animalType);
    
    // Return the story
    return {
      success: true,
      story: mockStories[animalType]
    };
  } catch (error) {
    console.error("Error in startStory API:", error);
    // Return default story on error
    return {
      success: true,
      story: mockStories.default
    };
  }
};

// Adapt an existing story with new elements
export const adaptStory = async (currentStory, input) => {
  try {
    console.log("adaptStory API called with input:", input);
    
    if (!currentStory) {
      console.error("No current story provided to adaptStory");
      return startStory(input);
    }
    
    // Simulate API delay (shorter for better UX)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Create a copy of the current story
    const adaptedStory = JSON.parse(JSON.stringify(currentStory));
    
    // Extract new elements from input
    const inputLower = input ? input.toLowerCase() : '';
    
    // Add new segments based on input
    if (inputLower.includes('monkey')) {
      adaptedStory.middle_segments.push(
        "Suddenly, a playful monkey appeared, swinging from tree to tree!",
        `"Hello!" said the monkey to ${adaptedStory.animal_name}. "Would you like to play with me?"`
      );
      adaptedStory.sound_effects.push("monkey_sounds");
    } else if (inputLower.includes('river') || inputLower.includes('water')) {
      adaptedStory.middle_segments.push(
        `${adaptedStory.animal_name} came to a beautiful flowing river.`,
        "The water was clear and cool, perfect for a drink on a hot day."
      );
      adaptedStory.sound_effects.push("river_flowing");
    } else if (inputLower.includes('run') || inputLower.includes('fast')) {
      adaptedStory.middle_segments.push(
        `${adaptedStory.animal_name} started to run as fast as possible!`,
        "It felt amazing to feel the wind rushing by."
      );
      adaptedStory.sound_effects.push("running_sounds");
    } else {
      // Generic adaptation
      adaptedStory.middle_segments.push(
        `${adaptedStory.animal_name} continued on the adventure with excitement.`,
        "There were so many wonderful things to discover!"
      );
    }
    
    console.log("Story adapted successfully");
    
    return {
      success: true,
      story: adaptedStory
    };
  } catch (error) {
    console.error("Error in adaptStory API:", error);
    // Return original story on error
    return {
      success: true,
      story: currentStory
    };
  }
};

// Get app settings
export const getSettings = async () => {
  try {
    console.log("getSettings API called");
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      success: true,
      settings: defaultSettings
    };
  } catch (error) {
    console.error("Error in getSettings API:", error);
    return {
      success: true,
      settings: defaultSettings
    };
  }
};

// Update app settings
export const updateSettings = async (newSettings) => {
  try {
    console.log("updateSettings API called with:", newSettings);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      success: true,
      settings: newSettings
    };
  } catch (error) {
    console.error("Error in updateSettings API:", error);
    return {
      success: false,
      error: "Failed to update settings"
    };
  }
};

// Enable bedtime mode
export const enableBedtimeMode = async (durationMinutes) => {
  try {
    console.log("enableBedtimeMode API called with duration:", durationMinutes);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      success: true,
      message: `Bedtime mode enabled with ${durationMinutes} minute fade`,
      duration_minutes: durationMinutes
    };
  } catch (error) {
    console.error("Error in enableBedtimeMode API:", error);
    return {
      success: false,
      error: "Failed to enable bedtime mode"
    };
  }
};

// Disable bedtime mode
export const disableBedtimeMode = async () => {
  try {
    console.log("disableBedtimeMode API called");
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      success: true,
      message: "Bedtime mode disabled"
    };
  } catch (error) {
    console.error("Error in disableBedtimeMode API:", error);
    return {
      success: false,
      error: "Failed to disable bedtime mode"
    };
  }
};

// Sound effect URLs
export const soundEffects = {
  lion_roar: '/sounds/lion_roar.mp3',
  elephant_trumpet: '/sounds/elephant_trumpet.mp3',
  tiger_growl: '/sounds/tiger_growl.mp3',
  monkey_sounds: '/sounds/monkey_sounds.mp3',
  savanna_ambience: '/sounds/savanna_ambience.mp3',
  jungle_ambience: '/sounds/jungle_ambience.mp3',
  river_flowing: '/sounds/river_flowing.mp3',
  water_splash: '/sounds/water_splash.mp3',
  rain_sounds: '/sounds/rain_sounds.mp3',
  running_sounds: '/sounds/running_sounds.mp3',
  nature_sounds: '/sounds/nature_sounds.mp3',
  happy_music: '/sounds/happy_music.mp3',
  lullaby: '/sounds/lullaby.mp3',
  white_noise: '/sounds/white_noise.mp3'
};
