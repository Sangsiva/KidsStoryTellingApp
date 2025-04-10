// Component tests for AI StoryLand App
// This script tests individual components

const { SpeechRecognitionService } = require('../src/speech_recognition_service');
const { KeywordExtractor } = require('../src/keyword_extractor');
const { StoryGenerator } = require('../src/story_generator');
const { AudioService } = require('../src/audio_service');

// Test function
async function runComponentTests() {
  console.log("=== AI StoryLand Component Tests ===\n");
  
  // Test 1: Speech Recognition Service
  console.log("Test 1: Speech Recognition Service");
  try {
    const speechService = new SpeechRecognitionService();
    
    // Test offline recognition (since we don't have real audio)
    const audio_data = new Float32Array(16000); // Mock audio data
    const text = speechService.recognize_speech_offline(audio_data);
    
    console.log(`✅ Speech recognition returned: "${text}"`);
    
    // Test keyword extraction
    const keywords = speechService.extract_keywords(text);
    console.log(`✅ Extracted keywords: ${keywords}`);
  } catch (error) {
    console.log(`❌ Speech Recognition Service test failed: ${error.message}`);
  }
  
  // Test 2: Keyword Extractor
  console.log("\nTest 2: Keyword Extractor");
  try {
    const extractor = new KeywordExtractor();
    
    const testInputs = [
      "I want a lion story",
      "Tell me about elephants",
      "Tiger and monkey in the jungle"
    ];
    
    for (const input of testInputs) {
      const keywords = extractor.extract_keywords(input);
      console.log(`Input: "${input}"`);
      console.log(`✅ Animals: ${keywords.animals}`);
      console.log(`✅ Settings: ${keywords.settings}`);
      console.log(`✅ Primary request: ${keywords.primary_request}`);
    }
  } catch (error) {
    console.log(`❌ Keyword Extractor test failed: ${error.message}`);
  }
  
  // Test 3: Story Generator
  console.log("\nTest 3: Story Generator");
  try {
    const generator = new StoryGenerator();
    
    // Test story generation
    const keywords = {
      animals: ["lion"],
      settings: ["jungle"],
      actions: ["run"],
      story_types: ["adventure"],
      primary_request: "lion"
    };
    
    const story = generator.generate_story(keywords);
    
    console.log(`✅ Generated story: "${story.title}"`);
    console.log(`✅ Intro: "${story.intro}"`);
    console.log(`✅ Number of segments: ${story.middle_segments.length}`);
    
    // Test story adaptation
    const newKeywords = {
      animals: ["monkey"],
      settings: [],
      actions: [],
      story_types: [],
      primary_request: "monkey"
    };
    
    const adaptedStory = generator.adapt_story(story, newKeywords);
    
    console.log(`✅ Adapted story with new segments: ${adaptedStory.middle_segments.length - story.middle_segments.length} new segments`);
  } catch (error) {
    console.log(`❌ Story Generator test failed: ${error.message}`);
  }
  
  // Test 4: Audio Service
  console.log("\nTest 4: Audio Service");
  try {
    const audioService = new AudioService();
    
    // Test speech generation
    const speech = audioService.generate_speech(
      "This is a test sentence for the lion.",
      "lion",
      0.7
    );
    
    console.log(`✅ Generated speech with duration: ${speech.duration_seconds} seconds`);
    
    // Test animal voice effect
    const effectSpeech = audioService.apply_animal_voice_effect(
      speech,
      "lion",
      0.8
    );
    
    console.log(`✅ Applied ${effectSpeech.animal_effect} voice effect with intensity ${effectSpeech.effect_intensity}`);
    
    // Test background effects
    const backgroundSpeech = audioService.add_background_effects(
      speech,
      ["jungle", "night"],
      0.3
    );
    
    console.log(`✅ Added background effects: ${backgroundSpeech.background_effects}`);
  } catch (error) {
    console.log(`❌ Audio Service test failed: ${error.message}`);
  }
  
  console.log("\n=== Component Tests Complete ===");
}

// Run the tests
runComponentTests().catch(error => {
  console.error("Error during component tests:", error);
});
