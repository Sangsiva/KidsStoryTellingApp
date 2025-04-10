import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Howl, Howler } from 'howler';

// Enhanced Audio processing service for web browsers with improved error handling
const AudioService = {
  // Initialize the audio context
  audioContext: null,
  
  // Initialize the service
  initialize: () => {
    try {
      console.log("Initializing AudioService");
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
    const supported = window.AudioContext !== undefined || window.webkitAudioContext !== undefined;
    console.log("AudioService.isSupported:", supported);
    return supported;
  },
  
  // Check if speech synthesis is supported
  isSpeechSynthesisSupported: () => {
    const supported = 'speechSynthesis' in window;
    console.log("Speech synthesis supported:", supported);
    return supported;
  },
  
  // Get available voices
  getVoices: () => {
    if (!AudioService.isSpeechSynthesisSupported()) {
      console.error("Speech synthesis not supported");
      return [];
    }
    
    return window.speechSynthesis.getVoices();
  },
  
  // Text-to-speech function (using browser's built-in speech synthesis)
  speak: (text, options = {}) => {
    return new Promise((resolve, reject) => {
      if (!AudioService.isSpeechSynthesisSupported()) {
        console.error("Speech synthesis not supported");
        reject('Speech synthesis not supported');
        return;
      }
      
      console.log("Speaking text:", text);
      console.log("With options:", options);
      
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
        console.log("Speech synthesis completed");
        resolve();
      };
      
      utterance.onerror = (event) => {
        console.error(`Speech synthesis error: ${event.error}`);
        reject(`Speech synthesis error: ${event.error}`);
      };
      
      // Start speaking
      try {
        window.speechSynthesis.speak(utterance);
        
        // Workaround for Chrome bug where onend doesn't fire
        // https://bugs.chromium.org/p/chromium/issues/detail?id=509488
        const maxSpeechTime = Math.max(5000, text.length * 50); // Estimate based on text length
        setTimeout(() => {
          if (window.speechSynthesis.speaking) {
            console.log("Speech synthesis timeout - forcing completion");
            window.speechSynthesis.cancel();
            resolve();
          }
        }, maxSpeechTime);
      } catch (error) {
        console.error("Error starting speech synthesis:", error);
        reject(error);
      }
    });
  },
  
  // Apply animal voice effect to speech
  applyAnimalVoiceEffect: (animalType, intensity = 0.6) => {
    console.log("Applying voice effect for animal:", animalType, "with intensity:", intensity);
    
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
        console.log("Using default voice settings for unknown animal type");
        break;
    }
    
    // Apply intensity
    options.pitch = 1.0 + (options.pitch - 1.0) * intensity;
    options.rate = 1.0 + (options.rate - 1.0) * intensity;
    
    console.log("Final voice options:", options);
    return options;
  },
  
  // Play a sound effect
  playSoundEffect: (soundUrl, options = {}) => {
    try {
      console.log("Playing sound effect:", soundUrl);
      console.log("With options:", options);
      
      // Create a dummy sound object if the URL is invalid or missing
      if (!soundUrl) {
        console.warn("No sound URL provided, creating dummy sound object");
        return {
          stop: () => console.log("Dummy sound: stop"),
          pause: () => console.log("Dummy sound: pause"),
          resume: () => console.log("Dummy sound: resume"),
          setVolume: (vol) => console.log("Dummy sound: setVolume", vol),
          fade: (from, to, duration) => console.log("Dummy sound: fade", from, to, duration),
          volume: options.volume || 0.5
        };
      }
      
      const sound = new Howl({
        src: [soundUrl],
        volume: options.volume || 0.5,
        loop: options.loop || false,
        autoplay: options.autoplay || true,
        onend: options.onEnd || (() => {
          console.log("Sound ended:", soundUrl);
        }),
        onloaderror: options.onError || ((id, error) => {
          console.error('Error loading sound:', soundUrl, error);
        }),
        onplayerror: (id, error) => {
          console.error('Error playing sound:', soundUrl, error);
          // Try to recover by unlocking audio
          if (Howler.ctx && Howler.ctx.state !== 'running') {
            Howler.ctx.resume();
          }
        }
      });
      
      const soundId = sound.play();
      
      // Return controls for the sound
      return {
        stop: () => {
          console.log("Stopping sound:", soundUrl);
          sound.stop(soundId);
        },
        pause: () => {
          console.log("Pausing sound:", soundUrl);
          sound.pause(soundId);
        },
        resume: () => {
          console.log("Resuming sound:", soundUrl);
          sound.play(soundId);
        },
        setVolume: (vol) => {
          console.log("Setting volume for sound:", soundUrl, vol);
          sound.volume(vol, soundId);
        },
        fade: (from, to, duration) => {
          console.log("Fading sound:", soundUrl, from, to, duration);
          sound.fade(from, to, duration, soundId);
        },
        volume: options.volume || 0.5
      };
    } catch (error) {
      console.error("Error in playSoundEffect:", error);
      // Return dummy sound controls
      return {
        stop: () => console.log("Dummy sound: stop"),
        pause: () => console.log("Dummy sound: pause"),
        resume: () => console.log("Dummy sound: resume"),
        setVolume: (vol) => console.log("Dummy sound: setVolume", vol),
        fade: (from, to, duration) => console.log("Dummy sound: fade", from, to, duration),
        volume: options.volume || 0.5
      };
    }
  },
  
  // Start bedtime fade
  startBedtimeFade: (soundControls, durationSeconds) => {
    if (!soundControls) {
      console.warn("No sound controls provided for bedtime fade");
      return () => {};
    }
    
    console.log("Starting bedtime fade for", durationSeconds, "seconds");
    soundControls.fade(soundControls.volume || 1.0, 0, durationSeconds * 1000);
    
    // Return a function to stop the fade
    return () => {
      console.log("Stopping bedtime fade");
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

const StatusMessage = styled.div`
  margin-top: 10px;
  font-size: 14px;
  color: ${props => props.error ? 'red' : props.theme.colors.lightText};
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
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  
  // Initialize audio service
  useEffect(() => {
    console.log("AudioPlayer component mounted");
    const audioSupported = AudioService.initialize();
    const speechSupported = AudioService.isSpeechSynthesisSupported();
    
    setIsSpeechSupported(speechSupported);
    
    if (!audioSupported) {
      setError("Web Audio API is not supported in this browser");
    }
    
    if (!speechSupported) {
      setError("Speech synthesis is not supported in this browser");
    }
    
    // Clean up on unmount
    return () => {
      console.log("AudioPlayer component unmounting");
      // Stop all sounds
      if (currentSoundControls) {
        currentSoundControls.stop();
      }
      
      backgroundSoundControls.forEach(control => {
        if (control) control.stop();
      });
      
      // Stop any ongoing speech
      if (AudioService.isSpeechSynthesisSupported()) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);
  
  // Play the story text
  const playStory = async () => {
    if (!text) {
      setError("No text to play");
      return;
    }
    
    try {
      setIsPlaying(true);
      setIsPaused(false);
      setError("");
      setStatus("Playing story...");
      
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
      if (AudioService.isSpeechSynthesisSupported()) {
        await AudioService.speak(text, voiceOptions);
      } else {
        // If speech synthesis is not supported, wait a few seconds to simulate speech
        setStatus("Speech synthesis not supported. Simulating playback...");
        await new Promise(resolve => setTimeout(resolve, text.length * 50));
      }
      
      // Stop background sounds when speech ends
      bgControls.forEach(control => {
        if (control) control.stop();
      });
      
      setIsPlaying(false);
      setStatus("Playback completed");
      
      if (onPlaybackEnd) onPlaybackEnd();
    } catch (error) {
      console.error('Error playing story:', error);
      setIsPlaying(false);
      setError(`Error playing story: ${error.message || error}`);
      
      // Stop background sounds on error
      backgroundSoundControls.forEach(control => {
        if (control) control.stop();
      });
      
      if (onPlaybackEnd) onPlaybackEnd();
    }
  };
  
  // Pause or resume playback
  const togglePlayPause = () => {
    if (!isPlaying) {
      playStory();
      return;
    }
    
    if (AudioService.isSpeechSynthesisSupported()) {
      if (isPaused) {
        setStatus("Resuming playback...");
        window.speechSynthesis.resume();
        
        // Resume background sounds
        backgroundSoundControls.forEach(control => {
          if (control) control.resume();
        });
        
        setIsPaused(false);
      } else {
        setStatus("Playback paused");
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
    setStatus("Playback stopped");
    
    if (AudioService.isSpeechSynthesisSupported()) {
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
      
      {!isSpeechSupported && (
        <StatusMessage error={true}>
          Speech synthesis is not supported in this browser. Please try Chrome, Edge, or Safari.
        </StatusMessage>
      )}
      
      {error && (
        <StatusMessage error={true}>
          {error}
        </StatusMessage>
      )}
      
      {status && !error && (
        <StatusMessage>
          {status}
        </StatusMessage>
      )}
    </AudioPlayerContainer>
  );
};

export default AudioPlayer;
export { AudioService };
