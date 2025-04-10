import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

// Speech recognition service for web browsers
const SpeechRecognitionService = {
  recognition: null,
  isSupported: () => {
    return 'webkitSpeechRecognition' in window || 
           'SpeechRecognition' in window;
  },
  
  initialize: () => {
    if (!SpeechRecognitionService.isSupported()) {
      console.error('Speech recognition is not supported in this browser');
      return false;
    }
    
    // Initialize the SpeechRecognition object
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    SpeechRecognitionService.recognition = new SpeechRecognition();
    
    // Configure the recognition
    SpeechRecognitionService.recognition.continuous = false;
    SpeechRecognitionService.recognition.interimResults = false;
    SpeechRecognitionService.recognition.lang = 'en-US';
    
    return true;
  },
  
  start: (onResult, onError, onEnd) => {
    if (!SpeechRecognitionService.recognition) {
      if (!SpeechRecognitionService.initialize()) {
        onError('Speech recognition not supported');
        return false;
      }
    }
    
    // Set up event handlers
    SpeechRecognitionService.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const confidence = event.results[0][0].confidence;
      onResult(transcript, confidence);
    };
    
    SpeechRecognitionService.recognition.onerror = (event) => {
      onError(event.error);
    };
    
    SpeechRecognitionService.recognition.onend = () => {
      if (onEnd) onEnd();
    };
    
    // Start listening
    try {
      SpeechRecognitionService.recognition.start();
      return true;
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      onError(error.message);
      return false;
    }
  },
  
  stop: () => {
    if (SpeechRecognitionService.recognition) {
      try {
        SpeechRecognitionService.recognition.stop();
        return true;
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
        return false;
      }
    }
    return false;
  }
};

// Keyword extraction from transcribed text
const KeywordExtractor = {
  // List of animal keywords to detect
  animals: [
    'lion', 'tiger', 'elephant', 'giraffe', 'monkey', 'zebra', 
    'hippo', 'rhino', 'crocodile', 'snake', 'bear', 'wolf',
    'fox', 'rabbit', 'deer', 'owl', 'eagle', 'parrot'
  ],
  
  // List of setting keywords
  settings: [
    'jungle', 'forest', 'savanna', 'river', 'mountain', 'ocean',
    'beach', 'desert', 'cave', 'farm', 'zoo', 'park'
  ],
  
  // List of action keywords
  actions: [
    'run', 'jump', 'swim', 'fly', 'climb', 'hide', 'sleep',
    'eat', 'drink', 'play', 'sing', 'dance', 'laugh'
  ],
  
  // Extract keywords from text
  extract: (text) => {
    if (!text) return { animals: [], settings: [], actions: [], primary_request: null };
    
    const lowerText = text.toLowerCase();
    
    // Extract animals
    const foundAnimals = KeywordExtractor.animals.filter(animal => 
      lowerText.includes(animal)
    );
    
    // Extract settings
    const foundSettings = KeywordExtractor.settings.filter(setting => 
      lowerText.includes(setting)
    );
    
    // Extract actions
    const foundActions = KeywordExtractor.actions.filter(action => 
      lowerText.includes(action)
    );
    
    // Determine primary request (usually the first animal mentioned)
    let primaryRequest = foundAnimals.length > 0 ? foundAnimals[0] : null;
    
    // Check for specific story request patterns
    if (lowerText.includes('story about') || lowerText.includes('tell me about')) {
      const parts = lowerText.split(/story about|tell me about/i);
      if (parts.length > 1) {
        const requestPart = parts[1].trim();
        const words = requestPart.split(/\s+/);
        if (words.length > 0) {
          // Use the first word after "story about" or "tell me about"
          const potentialRequest = words[0].replace(/[^a-z]/gi, '');
          if (potentialRequest) {
            primaryRequest = potentialRequest;
          }
        }
      }
    }
    
    return {
      animals: foundAnimals,
      settings: foundSettings,
      actions: foundActions,
      primary_request: primaryRequest
    };
  }
};

// Styled components
const SpeechRecognizerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const MicButton = styled.button`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: ${props => props.isListening ? props.theme.colors.accent : props.theme.colors.secondary};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  svg {
    width: 40px;
    height: 40px;
    color: white;
  }
`;

const ListeningIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  
  .dot {
    width: 10px;
    height: 10px;
    margin: 0 5px;
    background-color: ${props => props.theme.colors.accent};
    border-radius: 50%;
    animation: pulse 1.5s infinite ease-in-out;
  }
  
  .dot:nth-child(2) {
    animation-delay: 0.2s;
  }
  
  .dot:nth-child(3) {
    animation-delay: 0.4s;
  }
  
  @keyframes pulse {
    0% { transform: scale(0.8); opacity: 0.5; }
    50% { transform: scale(1.2); opacity: 1; }
    100% { transform: scale(0.8); opacity: 0.5; }
  }
`;

const TranscriptBox = styled.div`
  background-color: white;
  border-radius: 15px;
  padding: 15px;
  width: 100%;
  min-height: 60px;
  margin-top: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-size: 18px;
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 10px;
  font-size: 14px;
`;

// Main component
const SpeechRecognizer = ({ onSpeechResult, initialPrompt = "Tap the microphone and say what story you want" }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState(initialPrompt);
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(true);
  
  // Check if speech recognition is supported
  useEffect(() => {
    const supported = SpeechRecognitionService.isSupported();
    setIsSupported(supported);
    
    if (supported) {
      SpeechRecognitionService.initialize();
    }
    
    return () => {
      SpeechRecognitionService.stop();
    };
  }, []);
  
  // Handle microphone button click
  const handleMicClick = () => {
    if (!isSupported) {
      setError("Speech recognition is not supported in your browser");
      return;
    }
    
    if (isListening) {
      // Stop listening
      SpeechRecognitionService.stop();
      setIsListening(false);
    } else {
      // Start listening
      setError(null);
      setTranscript("Listening...");
      setIsListening(true);
      
      const success = SpeechRecognitionService.start(
        // onResult callback
        (text, confidence) => {
          setTranscript(text);
          
          // Extract keywords
          const keywords = KeywordExtractor.extract(text);
          
          // Pass the result to parent component
          if (onSpeechResult) {
            onSpeechResult({
              text,
              confidence,
              keywords
            });
          }
        },
        // onError callback
        (errorMessage) => {
          setError(`Error: ${errorMessage}`);
          setIsListening(false);
        },
        // onEnd callback
        () => {
          setIsListening(false);
        }
      );
      
      if (!success) {
        setIsListening(false);
        setTranscript(initialPrompt);
        setError("Failed to start speech recognition");
      }
    }
  };
  
  return (
    <SpeechRecognizerContainer>
      <MicButton 
        isListening={isListening}
        onClick={handleMicClick}
        disabled={!isSupported}
      >
        {/* Microphone icon */}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
          <line x1="12" y1="19" x2="12" y2="23"></line>
          <line x1="8" y1="23" x2="16" y2="23"></line>
        </svg>
      </MicButton>
      
      {isListening && (
        <ListeningIndicator>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </ListeningIndicator>
      )}
      
      <TranscriptBox>
        {transcript}
      </TranscriptBox>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {!isSupported && (
        <ErrorMessage>
          Speech recognition is not supported in your browser. 
          Please try Chrome, Edge, or Safari.
        </ErrorMessage>
      )}
    </SpeechRecognizerContainer>
  );
};

export default SpeechRecognizer;
export { SpeechRecognitionService, KeywordExtractor };
