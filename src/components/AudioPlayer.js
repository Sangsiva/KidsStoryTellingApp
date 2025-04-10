import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Howl, Howler } from 'howler';

// Audio processing service for web browsers
const AudioService = {
  // Initialize the audio context
  audioContext: null,
  
  // Initialize the service
  initialize: () => {
    try {
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      AudioService.audioContext = new AudioContext();
      return true;
    } catch (error) {
      console.error('Web Audio API is not supported in this browser', error);
      return false;
    }
  },
  
  // Check if audio is supported
  isSupported: () => {
    return window.AudioContext !== undefined || window.webkitAudioContext !== undefined;
  },
  
  // Text-to-speech function (using browser's built-in speech synthesis)
  speak: (text, options = {}) => {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        reject('Speech synthesis not supported');
        return;
      }
      
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Create a new utterance
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set options
      utterance.rate = options.rate || 1.0;
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 1.0;
      
      // Set voice if specified
      if (options.voice) {
        const voices = window.speechSynthesis.getVoices();
        const selectedVoice = voices.find(voice => voice.name === options.voice);
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      }
      
      // Event handlers
      utterance.onend = () => {
        resolve();
      };
      
      utterance.onerror = (event) => {
        reject(`Speech synthesis error: ${event.error}`);
      };
      
      // Start speaking
      window.speechSynthesis.speak(utterance);
    });
  },
  
  // Apply animal voice effect to speech
  applyAnimalVoiceEffect: (animalType, intensity = 0.6) => {
    // Return speech options based on animal type
    const options = {
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0
    };
    
    switch (animalType) {
      case 'lion':
        options.pitch = 0.8;
        options.rate = 0.9;
        break;
      case 'elephant':
        options.pitch = 0.6;
        options.rate = 0.8;
        break;
      case 'tiger':
        options.pitch = 0.85;
        options.rate = 1.0;
        break;
      case 'monkey':
        options.pitch = 1.3;
        options.rate = 1.1;
        break;
      case 'snake':
        options.pitch = 0.7;
        options.rate = 0.7;
        break;
      case 'bird':
      case 'parrot':
        options.pitch = 1.5;
        options.rate = 1.2;
        break;
      default:
        // No effect for unknown animals
        break;
    }
    
    // Apply intensity
    options.pitch = 1.0 + (options.pitch - 1.0) * intensity;
    options.rate = 1.0 + (options.rate - 1.0) * intensity;
    
    return options;
  },
  
  // Play a sound effect
  playSoundEffect: (soundUrl, options = {}) => {
    const sound = new Howl({
      src: [soundUrl],
      volume: options.volume || 0.5,
      loop: options.loop || false,
      autoplay: options.autoplay || true,
      onend: options.onEnd || (() => {}),
      onloaderror: options.onError || ((id, error) => {
        console.error('Error loading sound:', error);
      })
    });
    
    const soundId = sound.play();
    
    // Return controls for the sound
    return {
      stop: () => sound.stop(soundId),
      pause: () => sound.pause(soundId),
      resume: () => sound.play(soundId),
      setVolume: (vol) => sound.volume(vol, soundId),
      fade: (from, to, duration) => sound.fade(from, to, duration, soundId)
    };
  },
  
  // Start bedtime fade
  startBedtimeFade: (soundControls, durationSeconds) => {
    if (!soundControls) return;
    
    soundControls.fade(soundControls.volume || 1.0, 0, durationSeconds * 1000);
    
    // Return a function to stop the fade
    return () => {
      soundControls.setVolume(soundControls.volume || 1.0);
    };
  }
};

// Styled components
const AudioPlayerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
`;

const PlaybackControls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
`;

const ControlButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.secondary};
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
    background-color: ${props => props.theme.colors.primary};
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  svg {
    width: 24px;
    height: 24px;
    color: white;
  }
`;

const VolumeControl = styled.div`
  display: flex;
  align-items: center;
  margin-top: 15px;
  width: 100%;
  max-width: 300px;
`;

const VolumeSlider = styled.input`
  width: 100%;
  margin: 0 10px;
`;

const VolumeIcon = styled.div`
  svg {
    width: 20px;
    height: 20px;
    color: ${props => props.theme.colors.primary};
  }
`;

// Main component
const AudioPlayer = ({ 
  text, 
  animalType, 
  effectIntensity = 0.6, 
  backgroundSounds = [], 
  onPlaybackStart, 
  onPlaybackEnd 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const [currentSoundControls, setCurrentSoundControls] = useState(null);
  const [backgroundSoundControls, setBackgroundSoundControls] = useState([]);
  
  // Initialize audio service
  useEffect(() => {
    AudioService.initialize();
    
    // Clean up on unmount
    return () => {
      // Stop all sounds
      if (currentSoundControls) {
        currentSoundControls.stop();
      }
      
      backgroundSoundControls.forEach(control => {
        if (control) control.stop();
      });
      
      // Stop any ongoing speech
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);
  
  // Play the story text
  const playStory = async () => {
    if (!text) return;
    
    try {
      setIsPlaying(true);
      setIsPaused(false);
      
      if (onPlaybackStart) onPlaybackStart();
      
      // Apply animal voice effect
      const voiceOptions = AudioService.applyAnimalVoiceEffect(animalType, effectIntensity);
      voiceOptions.volume = volume;
      
      // Play background sounds if provided
      const bgControls = [];
      if (backgroundSounds && backgroundSounds.length > 0) {
        backgroundSounds.forEach(sound => {
          const control = AudioService.playSoundEffect(sound, {
            volume: volume * 0.3,
            loop: true
          });
          bgControls.push(control);
        });
        setBackgroundSoundControls(bgControls);
      }
      
      // Speak the text
      await AudioService.speak(text, voiceOptions);
      
      // Stop background sounds when speech ends
      bgControls.forEach(control => {
        if (control) control.stop();
      });
      
      setIsPlaying(false);
      
      if (onPlaybackEnd) onPlaybackEnd();
    } catch (error) {
      console.error('Error playing story:', error);
      setIsPlaying(false);
    }
  };
  
  // Pause or resume playback
  const togglePlayPause = () => {
    if (!isPlaying) {
      playStory();
      return;
    }
    
    if ('speechSynthesis' in window) {
      if (isPaused) {
        window.speechSynthesis.resume();
        
        // Resume background sounds
        backgroundSoundControls.forEach(control => {
          if (control) control.resume();
        });
        
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        
        // Pause background sounds
        backgroundSoundControls.forEach(control => {
          if (control) control.pause();
        });
        
        setIsPaused(true);
      }
    }
  };
  
  // Stop playback
  const stopPlayback = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    
    // Stop background sounds
    backgroundSoundControls.forEach(control => {
      if (control) control.stop();
    });
    
    setIsPlaying(false);
    setIsPaused(false);
    
    if (onPlaybackEnd) onPlaybackEnd();
  };
  
  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    // Update ongoing speech volume if possible
    // (Note: This may not work in all browsers as speech synthesis
    // doesn't always support changing volume during playback)
    
    // Update background sound volumes
    backgroundSoundControls.forEach(control => {
      if (control) control.setVolume(newVolume * 0.3);
    });
  };
  
  return (
    <AudioPlayerContainer>
      <PlaybackControls>
        <ControlButton onClick={togglePlayPause}>
          {isPlaying && !isPaused ? (
            // Pause icon
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
          ) : (
            // Play icon
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          )}
        </ControlButton>
        
        {isPlaying && (
          <ControlButton onClick={stopPlayback}>
            {/* Stop icon */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="4" width="16" height="16"></rect>
            </svg>
          </ControlButton>
        )}
      </PlaybackControls>
      
      <VolumeControl>
        <VolumeIcon>
          {/* Volume low icon */}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        </VolumeIcon>
        
        <VolumeSlider 
          type="range" 
          min="0" 
          max="1" 
          step="0.1" 
          value={volume} 
          onChange={handleVolumeChange} 
        />
        
        <VolumeIcon>
          {/* Volume high icon */}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
          </svg>
        </VolumeIcon>
      </VolumeControl>
    </AudioPlayerContainer>
  );
};

export default AudioPlayer;
export { AudioService };
