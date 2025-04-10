import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import LottieView from 'lottie-react-native';

// Mock API for demonstration purposes
// In a real app, this would connect to our backend services
import { mockStartStory, mockAdaptStory } from '../services/mockApiService';

const StoryScreen = ({ navigation }) => {
  // State variables
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStory, setCurrentStory] = useState(null);
  const [currentSegment, setCurrentSegment] = useState(0);
  const [transcription, setTranscription] = useState('');
  const [animation] = useState(new Animated.Value(0));
  const [soundEffect, setSoundEffect] = useState(null);

  // Animation for the animal character
  useEffect(() => {
    if (isPlaying) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(animation, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      animation.stopAnimation();
    }
  }, [isPlaying]);

  // Function to handle microphone press
  const handleMicPress = async () => {
    if (isListening) {
      // Stop listening
      setIsListening(false);
      console.log('handleMicPress: isListening set to false');
      
      // In a real app, this would stop the recording and process the audio
      // For demo, we'll simulate receiving a transcription
      setTimeout(() => {
        const mockTranscription = "I want a lion story";
        setTranscription(mockTranscription);
        console.log('handleMicPress: mockTranscription set to:', mockTranscription);
        
        // If no story is playing, start a new one
        if (!currentStory) {
          startNewStory(mockTranscription);
          console.log('handleMicPress: calling startNewStory with:', mockTranscription);
        } else {
          // Otherwise adapt the current story
          adaptCurrentStory(mockTranscription);
        }
      }, 1000);
    } else {
      // Start listening
      setIsListening(true);
      setTranscription('Listening...');
      
      // In a real app, this would start recording
      // For demo, we'll just update the UI
    }
  };

  // Function to start a new story
  const startNewStory = async (input) => {
    console.log('startNewStory: input received:', input);
    
    // Call the API to generate a story
    const result = await mockStartStory(input);
    
    if (result.success) {
      setCurrentStory(result.story);
      setCurrentSegment(0);
      playStory(result.story);
      console.log('startNewStory: story generated successfully:', result.story);
    } else {
      setTranscription('Sorry, I couldn\'t create a story. Please try again.');
    }
  };

  // Function to adapt the current story
  const adaptCurrentStory = async (input) => {
    if (!currentStory) return;
    
    // Call the API to adapt the story
    const result = await mockAdaptStory(currentStory, input);
    
    if (result.success) {
      setCurrentStory(result.story);
      // Continue from where we left off
      playStory(result.story, currentSegment);
    } else {
      setTranscription('Sorry, I couldn\'t adapt the story. Please try again.');
    }
  };

  // Function to play the story
  const playStory = async (story, startSegment = 0) => {
    setIsPlaying(true);
    
    // Play the title
    await speakText(`The title of our story is: ${story.title}`);
    
    // Play the intro
    await speakText(story.intro);
    
    // Play the middle segments
    for (let i = startSegment; i < story.middle_segments.length; i++) {
      setCurrentSegment(i);
      await speakText(story.middle_segments[i]);
      
      // Play a sound effect if available
      if (story.sound_effects && story.sound_effects.length > 0) {
        playRandomSoundEffect(story.sound_effects);
      }
    }
    
    // Play the endings
    for (let ending of story.endings) {
      await speakText(ending);
    }
    
    setIsPlaying(false);
  };

  // Function to speak text
  const speakText = (text) => {
    return new Promise((resolve) => {
      Speech.speak(text, {
        language: 'en',
        pitch: 1.0,
        rate: 0.9,
        onDone: resolve
      });
    });
  };

  // Function to play a random sound effect
  const playRandomSoundEffect = async (effects) => {
    // In a real app, this would play actual sound files
    // For demo, we'll just update the state
    const randomEffect = effects[Math.floor(Math.random() * effects.length)];
    setSoundEffect(randomEffect);
    
    // Reset after 2 seconds
    setTimeout(() => {
      setSoundEffect(null);
    }, 2000);
  };

  // Function to pause/resume the story
  const togglePlayback = () => {
    if (isPlaying) {
      Speech.stop();
      setIsPlaying(false);
    } else if (currentStory) {
      playStory(currentStory, currentSegment);
    }
  };

  // Function to navigate to parent dashboard
  const goToParentDashboard = () => {
    navigation.navigate('ParentDashboard');
  };

  // Get the appropriate animal image based on the current story
  const getAnimalImage = () => {
    if (!currentStory) return require('../assets/default_animal.png');
    
    const animalType = currentStory.primary_animal || 'default';
    
    // In a real app, this would use actual image assets
    switch (animalType) {
      case 'lion':
        return require('../assets/lion.png');
      case 'elephant':
        return require('../assets/elephant.png');
      case 'tiger':
        return require('../assets/tiger.png');
      default:
        return require('../assets/default_animal.png');
    }
  };

  return (
    <View style={styles.container}>
      {/* Parent dashboard button */}
      <TouchableOpacity 
        style={styles.parentButton}
        onPress={goToParentDashboard}
      >
        <Text style={styles.parentButtonText}>👤</Text>
      </TouchableOpacity>
      
      {/* Story title */}
      <Text style={styles.title}>
        {currentStory ? currentStory.title : 'AI StoryLand'}
      </Text>
      
      {/* Main content area */}
      <View style={styles.storyContainer}>
        {/* Animal character */}
        <Animated.View
          style={[
            styles.animalContainer,
            {
              transform: [
                {
                  translateY: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -10],
                  }),
                },
              ],
            },
          ]}
        >
          <Image
            source={getAnimalImage()}
            style={styles.animalImage}
            resizeMode="contain"
          />
        </Animated.View>
        
        {/* Sound effect indicator */}
        {soundEffect && (
          <View style={styles.soundEffectContainer}>
            <Text style={styles.soundEffectText}>🔊 {soundEffect}</Text>
          </View>
        )}
        
        {/* Transcription display */}
        <View style={styles.transcriptionContainer}>
          <Text style={styles.transcriptionText}>{transcription}</Text>
        </View>
      </View>
      
      {/* Control buttons */}
      <View style={styles.controlsContainer}>
        {/* Play/Pause button */}
        <TouchableOpacity 
          style={[styles.controlButton, styles.playButton]}
          onPress={togglePlayback}
        >
          <Text style={styles.buttonText}>
            {isPlaying ? '⏸️' : '▶️'}
          </Text>
        </TouchableOpacity>
        
        {/* Microphone button */}
        <TouchableOpacity 
          style={[styles.controlButton, styles.micButton, isListening && styles.listeningButton]}
          onPress={handleMicPress}
        >
          <Text style={styles.buttonText}>🎤</Text>
          {isListening && (
            <LottieView
              source={require('../assets/listening_animation.json')}
              style={styles.listeningAnimation}
              autoPlay
              loop
            />
          )}
        </TouchableOpacity>
        
        {/* Bedtime mode button */}
        <TouchableOpacity 
          style={[styles.controlButton, styles.bedtimeButton]}
          onPress={() => navigation.navigate('BedtimeMode')}
        >
          <Text style={styles.buttonText}>🌙</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F4FF',
    padding: 20,
  },
  parentButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  parentButtonText: {
    fontSize: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 20,
    color: '#5B3E90',
  },
  storyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animalContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animalImage: {
    width: '100%',
    height: '100%',
  },
  soundEffectContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,
    padding: 10,
  },
  soundEffectText: {
    fontSize: 16,
  },
  transcriptionContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginTop: 20,
    width: '90%',
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  transcriptionText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 30,
  },
  controlButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  playButton: {
    backgroundColor: '#7B68EE',
  },
  micButton: {
    backgroundColor: '#FF6B6B',
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  bedtimeButton: {
    backgroundColor: '#5E72EB',
  },
  listeningButton: {
    backgroundColor: '#FF8E8E',
  },
  buttonText: {
    fontSize: 30,
    color: 'white',
  },
  listeningAnimation: {
    position: 'absolute',
    width: 100,
    height: 100,
  },
});

export default StoryScreen;
