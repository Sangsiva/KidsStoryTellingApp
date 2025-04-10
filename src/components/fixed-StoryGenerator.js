import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { startStory, adaptStory } from '../services/mockApiService';

// Improved story generation service with better error handling
const StoryGenerationService = {
  // Generate a new story based on keywords
  generateStory: async (keywords) => {
    try {
      console.log("Generating story with keywords:", keywords);
      
      // Default to 'lion' if no keywords are provided
      const input = keywords?.primary_request || 
                   (keywords?.animals?.length > 0 ? keywords.animals[0] : 'lion');
      
      console.log("Using input for story generation:", input);
      
      const result = await startStory(input);
      
      if (result.success && result.story) {
        console.log("Story generated successfully:", result.story.title);
        return result.story;
      } else {
        console.error("API returned success but no story data");
        // Return a default story as fallback
        return {
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
        };
      }
    } catch (error) {
      console.error('Error generating story:', error);
      // Return a default story as fallback
      return {
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
      };
    }
  },
  
  // Adapt an existing story with new elements
  adaptStory: async (currentStory, keywords) => {
    try {
      console.log("Adapting story with keywords:", keywords);
      
      if (!currentStory) {
        console.error("No current story to adapt");
        return await StoryGenerationService.generateStory(keywords);
      }
      
      const input = keywords?.primary_request || 
                   (keywords?.animals?.length > 0 ? keywords.animals[0] : '');
      
      console.log("Using input for story adaptation:", input);
      
      const result = await adaptStory(currentStory, input);
      
      if (result.success && result.story) {
        console.log("Story adapted successfully");
        return result.story;
      } else {
        console.error("API returned success but no adapted story data");
        // Return the original story if adaptation fails
        return currentStory;
      }
    } catch (error) {
      console.error('Error adapting story:', error);
      // Return the original story if adaptation fails
      return currentStory;
    }
  }
};

// Styled components
const StoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const StoryTitle = styled.h2`
  font-size: 28px;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 20px;
  text-align: center;
`;

const StoryContent = styled.div`
  background-color: white;
  border-radius: 15px;
  padding: 20px;
  width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  font-size: 18px;
  line-height: 1.6;
`;

const StorySegment = styled.p`
  margin-bottom: 15px;
`;

const StoryControls = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const ControlButton = styled.button`
  background-color: ${props => props.theme.colors.secondary};
  color: white;
  border: none;
  border-radius: 25px;
  padding: 10px 20px;
  margin: 0 10px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
  
  .spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top: 4px solid ${props => props.theme.colors.secondary};
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin: 20px 0;
  padding: 10px;
  background-color: rgba(255, 0, 0, 0.1);
  border-radius: 5px;
  text-align: center;
`;

// Main component
const StoryGenerator = ({ 
  initialKeywords = null,
  onStoryGenerated,
  onStorySegmentChange,
  onError
}) => {
  const [story, setStory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [showFullStory, setShowFullStory] = useState(false);
  
  // Generate a story when initialKeywords are provided
  useEffect(() => {
    if (initialKeywords) {
      console.log("Initial keywords received:", initialKeywords);
      generateStory(initialKeywords);
    }
  }, [initialKeywords]);
  
  // Generate a new story
  const generateStory = async (keywords) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Generating story with keywords:", keywords);
      const newStory = await StoryGenerationService.generateStory(keywords);
      console.log("Story generated:", newStory);
      
      setStory(newStory);
      setCurrentSegmentIndex(0);
      setShowFullStory(false);
      
      if (onStoryGenerated) {
        onStoryGenerated(newStory);
      }
    } catch (error) {
      console.error("Error in generateStory:", error);
      setError('Failed to generate story. Please try again.');
      
      if (onError) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Adapt the current story
  const adaptCurrentStory = async (keywords) => {
    if (!story) {
      console.log("No story to adapt, generating new story instead");
      return generateStory(keywords);
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Adapting story with keywords:", keywords);
      const adaptedStory = await StoryGenerationService.adaptStory(story, keywords);
      console.log("Story adapted:", adaptedStory);
      
      setStory(adaptedStory);
      
      // Keep the current segment index if possible
      if (currentSegmentIndex >= adaptedStory.middle_segments.length) {
        setCurrentSegmentIndex(adaptedStory.middle_segments.length - 1);
      }
      
      if (onStoryGenerated) {
        onStoryGenerated(adaptedStory);
      }
    } catch (error) {
      console.error("Error in adaptCurrentStory:", error);
      setError('Failed to adapt story. Please try again.');
      
      if (onError) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Navigate to the next segment
  const nextSegment = () => {
    if (!story) return;
    
    if (currentSegmentIndex < story.middle_segments.length - 1) {
      setCurrentSegmentIndex(currentSegmentIndex + 1);
      
      if (onStorySegmentChange) {
        onStorySegmentChange(currentSegmentIndex + 1);
      }
    }
  };
  
  // Navigate to the previous segment
  const prevSegment = () => {
    if (!story) return;
    
    if (currentSegmentIndex > 0) {
      setCurrentSegmentIndex(currentSegmentIndex - 1);
      
      if (onStorySegmentChange) {
        onStorySegmentChange(currentSegmentIndex - 1);
      }
    }
  };
  
  // Toggle between showing current segment and full story
  const toggleFullStory = () => {
    setShowFullStory(!showFullStory);
  };
  
  // Get the current segment text
  const getCurrentSegmentText = () => {
    if (!story) return '';
    
    if (currentSegmentIndex === 0) {
      return story.intro;
    } else if (currentSegmentIndex <= story.middle_segments.length) {
      return story.middle_segments[currentSegmentIndex - 1];
    } else {
      const endingIndex = currentSegmentIndex - story.middle_segments.length - 1;
      return story.endings[endingIndex];
    }
  };
  
  // Get the full story text
  const getFullStoryText = () => {
    if (!story) return '';
    
    let fullText = story.intro;
    
    story.middle_segments.forEach(segment => {
      fullText += '\n\n' + segment;
    });
    
    story.endings.forEach(ending => {
      fullText += '\n\n' + ending;
    });
    
    return fullText;
  };
  
  // Render the story content
  const renderStoryContent = () => {
    if (!story) return null;
    
    if (showFullStory) {
      // Show the full story
      return (
        <StoryContent>
          <StorySegment>{story.intro}</StorySegment>
          
          {story.middle_segments.map((segment, index) => (
            <StorySegment key={`middle-${index}`}>{segment}</StorySegment>
          ))}
          
          {story.endings.map((ending, index) => (
            <StorySegment key={`ending-${index}`}>{ending}</StorySegment>
          ))}
        </StoryContent>
      );
    } else {
      // Show only the current segment
      return (
        <StoryContent>
          <StorySegment>
            {getCurrentSegmentText()}
          </StorySegment>
        </StoryContent>
      );
    }
  };
  
  return (
    <StoryContainer>
      {isLoading ? (
        <LoadingIndicator>
          <div className="spinner"></div>
        </LoadingIndicator>
      ) : (
        <>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          {story && (
            <>
              <StoryTitle>{story.title}</StoryTitle>
              
              {renderStoryContent()}
              
              <StoryControls>
                {!showFullStory && (
                  <>
                    <ControlButton 
                      onClick={prevSegment} 
                      disabled={currentSegmentIndex === 0}
                    >
                      Previous
                    </ControlButton>
                    
                    <ControlButton 
                      onClick={nextSegment} 
                      disabled={currentSegmentIndex >= story.middle_segments.length - 1}
                    >
                      Next
                    </ControlButton>
                  </>
                )}
                
                <ControlButton onClick={toggleFullStory}>
                  {showFullStory ? 'Show Current Segment' : 'Show Full Story'}
                </ControlButton>
              </StoryControls>
            </>
          )}
        </>
      )}
    </StoryContainer>
  );
};

export default StoryGenerator;
export { StoryGenerationService };
