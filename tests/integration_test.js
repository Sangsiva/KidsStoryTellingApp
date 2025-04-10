// Integration test script for AI StoryLand App
// This script tests the integration between all components

const { AIStoryLandApp } = require('../src/app_integration');
const { SpeechProcessor } = require('../src/speech_processor');
const { StoryGenerator } = require('../src/story_generator');
const { AudioService } = require('../src/audio_service');

// Mock API keys for testing
const mockApiKeys = {
  openai: "test_openai_key",
  elevenlabs: "test_elevenlabs_key"
};

// Test function
async function runIntegrationTests() {
  console.log("=== AI StoryLand Integration Tests ===\n");
  
  // Initialize the app with mock API keys
  console.log("Initializing app...");
  const app = new AIStoryLandApp(mockApiKeys);
  
  // Test 1: Start a new story
  console.log("\nTest 1: Starting a new story");
  const storyResult = await app.start_new_story("I want a lion story");
  
  if (storyResult.success) {
    console.log("✅ Successfully started a new story");
    console.log(`Title: ${storyResult.story.title}`);
  } else {
    console.log("❌ Failed to start a new story");
    console.log(`Error: ${storyResult.error}`);
  }
  
  // Test 2: Adapt the current story
  console.log("\nTest 2: Adapting the current story");
  const adaptResult = await app.adapt_current_story("Add a monkey");
  
  if (adaptResult.success) {
    console.log("✅ Successfully adapted the story");
    console.log(`New segments added: ${adaptResult.story.middle_segments.length - storyResult.story.middle_segments.length}`);
  } else {
    console.log("❌ Failed to adapt the story");
    console.log(`Error: ${adaptResult.error}`);
  }
  
  // Test 3: Enable bedtime mode
  console.log("\nTest 3: Enabling bedtime mode");
  const bedtimeResult = await app.enable_bedtime_mode(5); // 5 minutes for testing
  
  if (bedtimeResult.success) {
    console.log("✅ Successfully enabled bedtime mode");
    console.log(`Duration: ${bedtimeResult.duration_minutes} minutes`);
  } else {
    console.log("❌ Failed to enable bedtime mode");
    console.log(`Error: ${bedtimeResult.error}`);
  }
  
  // Test 4: Update settings
  console.log("\nTest 4: Updating settings");
  const newSettings = {
    voice_effect_intensity: 0.8,
    background_sound_volume: 0.2,
    content_filters: {
      no_scary_content: true
    }
  };
  
  app.update_settings(newSettings);
  const appStatus = app.get_app_status();
  
  if (appStatus.settings.voice_effect_intensity === 0.8) {
    console.log("✅ Successfully updated settings");
  } else {
    console.log("❌ Failed to update settings");
  }
  
  // Test 5: Pause and resume story
  console.log("\nTest 5: Pausing and resuming story");
  const pauseResult = app.pause_story();
  
  if (pauseResult.success) {
    console.log("✅ Successfully paused the story");
    
    // Resume the story
    const resumeResult = app.resume_story();
    
    if (resumeResult.success) {
      console.log("✅ Successfully resumed the story");
    } else {
      console.log("❌ Failed to resume the story");
      console.log(`Error: ${resumeResult.error}`);
    }
  } else {
    console.log("❌ Failed to pause the story");
    console.log(`Error: ${pauseResult.error}`);
  }
  
  // Test 6: Disable bedtime mode
  console.log("\nTest 6: Disabling bedtime mode");
  const disableBedtimeResult = app.disable_bedtime_mode();
  
  if (disableBedtimeResult.success) {
    console.log("✅ Successfully disabled bedtime mode");
  } else {
    console.log("❌ Failed to disable bedtime mode");
    console.log(`Error: ${disableBedtimeResult.error}`);
  }
  
  console.log("\n=== Integration Tests Complete ===");
}

// Run the tests
runIntegrationTests().catch(error => {
  console.error("Error during integration tests:", error);
});
