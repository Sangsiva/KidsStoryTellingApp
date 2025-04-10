import React from 'react';
import styled from 'styled-components';

const LanguageSelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
`;

const LanguageTitle = styled.h3`
  margin-bottom: 15px;
  color: ${props => props.theme.colors.primary};
`;

const LanguageOptions = styled.div`
  display: flex;
  gap: 10px;
`;

const LanguageButton = styled.button`
  padding: 10px 20px;
  border-radius: 20px;
  border: 2px solid ${props => props.theme.colors.secondary};
  background-color: ${props => props.isActive ? props.theme.colors.secondary : 'transparent'};
  color: ${props => props.isActive ? 'white' : props.theme.colors.secondary};
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.isActive ? props.theme.colors.secondary : props.theme.colors.secondary + '20'};
  }
`;

const LanguageSelector = ({ currentLanguage, onLanguageChange }) => {
  return (
    <LanguageSelectorContainer>
      <LanguageTitle>Story Language</LanguageTitle>
      <LanguageOptions>
        <LanguageButton 
          isActive={currentLanguage === 'english'} 
          onClick={() => onLanguageChange('english')}
        >
          English
        </LanguageButton>
        <LanguageButton 
          isActive={currentLanguage === 'tamil'} 
          onClick={() => onLanguageChange('tamil')}
        >
          Tamil
        </LanguageButton>
      </LanguageOptions>
    </LanguageSelectorContainer>
  );
};

export default LanguageSelector;
