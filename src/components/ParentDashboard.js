import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Slider } from 'react-native';

// Mock API for demonstration purposes
import { mockUpdateSettings, mockGetSettings } from '../services/mockApiService';

const ParentDashboard = ({ navigation }) => {
  // State variables for settings
  const [settings, setSettings] = useState({
    voiceEffectIntensity: 0.6,
    backgroundSoundVolume: 0.3,
    playbackSpeed: 1.0,
    bedtimeFadeDuration: 15,
    noScaryContent: true,
    educationalFocus: false,
    offlineMode: false,
    saveFavorites: true,
    autoAdaptStory: true
  });
  
  const [favoriteStories, setFavoriteStories] = useState([
    { id: 1, title: "Leo the Brave Lion", animal: "lion", date: "2025-04-08" },
    { id: 2, title: "Ellie the Elephant's Big Day", animal: "elephant", date: "2025-04-09" }
  ]);
  
  const [usageStats, setUsageStats] = useState({
    totalStories: 12,
    favoriteAnimal: "lion",
    averageDuration: "8 minutes",
    mostActiveTime: "7:30 PM"
  });

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  // Function to load settings
  const loadSettings = async () => {
    try {
      const result = await mockGetSettings();
      if (result.success) {
        setSettings(result.settings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  // Function to save settings
  const saveSettings = async () => {
    try {
      const result = await mockUpdateSettings(settings);
      if (result.success) {
        alert('Settings saved successfully!');
      } else {
        alert('Failed to save settings. Please try again.');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('An error occurred while saving settings.');
    }
  };

  // Function to handle setting changes
  const handleSettingChange = (setting, value) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [setting]: value
    }));
  };

  // Function to navigate back to story screen
  const goToStoryScreen = () => {
    navigation.navigate('StoryScreen');
  };

  // Function to delete a favorite story
  const deleteFavoriteStory = (id) => {
    setFavoriteStories(prevStories => 
      prevStories.filter(story => story.id !== id)
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={goToStoryScreen}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Parent Dashboard</Text>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={saveSettings}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {/* Voice and Sound Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Voice & Sound Settings</Text>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Animal Voice Effect</Text>
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderValue}>
                {Math.round(settings.voiceEffectIntensity * 100)}%
              </Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1}
                step={0.1}
                value={settings.voiceEffectIntensity}
                onValueChange={(value) => handleSettingChange('voiceEffectIntensity', value)}
                minimumTrackTintColor="#5B3E90"
                maximumTrackTintColor="#D0D0D0"
                thumbTintColor="#7B68EE"
              />
            </View>
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Background Sound Volume</Text>
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderValue}>
                {Math.round(settings.backgroundSoundVolume * 100)}%
              </Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1}
                step={0.1}
                value={settings.backgroundSoundVolume}
                onValueChange={(value) => handleSettingChange('backgroundSoundVolume', value)}
                minimumTrackTintColor="#5B3E90"
                maximumTrackTintColor="#D0D0D0"
                thumbTintColor="#7B68EE"
              />
            </View>
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Playback Speed</Text>
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderValue}>
                {settings.playbackSpeed.toFixed(1)}x
              </Text>
              <Slider
                style={styles.slider}
                minimumValue={0.5}
                maximumValue={1.5}
                step={0.1}
                value={settings.playbackSpeed}
                onValueChange={(value) => handleSettingChange('playbackSpeed', value)}
                minimumTrackTintColor="#5B3E90"
                maximumTrackTintColor="#D0D0D0"
                thumbTintColor="#7B68EE"
              />
            </View>
          </View>
        </View>
        
        {/* Bedtime Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bedtime Settings</Text>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Fade Duration (minutes)</Text>
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderValue}>
                {settings.bedtimeFadeDuration} min
              </Text>
              <Slider
                style={styles.slider}
                minimumValue={5}
                maximumValue={30}
                step={5}
                value={settings.bedtimeFadeDuration}
                onValueChange={(value) => handleSettingChange('bedtimeFadeDuration', value)}
                minimumTrackTintColor="#5B3E90"
                maximumTrackTintColor="#D0D0D0"
                thumbTintColor="#7B68EE"
              />
            </View>
          </View>
        </View>
        
        {/* Content Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Content Settings</Text>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>No Scary Content</Text>
            <Switch
              trackColor={{ false: "#D0D0D0", true: "#7B68EE" }}
              thumbColor={settings.noScaryContent ? "#FFFFFF" : "#F4F3F4"}
              onValueChange={(value) => handleSettingChange('noScaryContent', value)}
              value={settings.noScaryContent}
            />
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Educational Focus</Text>
            <Switch
              trackColor={{ false: "#D0D0D0", true: "#7B68EE" }}
              thumbColor={settings.educationalFocus ? "#FFFFFF" : "#F4F3F4"}
              onValueChange={(value) => handleSettingChange('educationalFocus', value)}
              value={settings.educationalFocus}
            />
          </View>
        </View>
        
        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Offline Mode</Text>
            <Switch
              trackColor={{ false: "#D0D0D0", true: "#7B68EE" }}
              thumbColor={settings.offlineMode ? "#FFFFFF" : "#F4F3F4"}
              onValueChange={(value) => handleSettingChange('offlineMode', value)}
              value={settings.offlineMode}
            />
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Save Favorites</Text>
            <Switch
              trackColor={{ false: "#D0D0D0", true: "#7B68EE" }}
              thumbColor={settings.saveFavorites ? "#FFFFFF" : "#F4F3F4"}
              onValueChange={(value) => handleSettingChange('saveFavorites', value)}
              value={settings.saveFavorites}
            />
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Auto-Adapt Story</Text>
            <Switch
              trackColor={{ false: "#D0D0D0", true: "#7B68EE" }}
              thumbColor={settings.autoAdaptStory ? "#FFFFFF" : "#F4F3F4"}
              onValueChange={(value) => handleSettingChange('autoAdaptStory', value)}
              value={settings.autoAdaptStory}
            />
          </View>
        </View>
        
        {/* Favorite Stories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Favorite Stories</Text>
          
          {favoriteStories.length > 0 ? (
            favoriteStories.map(story => (
              <View key={story.id} style={styles.favoriteStory}>
                <View style={styles.favoriteStoryInfo}>
                  <Text style={styles.favoriteStoryTitle}>{story.title}</Text>
                  <Text style={styles.favoriteStoryDetails}>
                    {story.animal} • {story.date}
                  </Text>
                </View>
                <View style={styles.favoriteStoryActions}>
                  <TouchableOpacity 
                    style={styles.favoriteStoryButton}
                    onPress={() => navigation.navigate('StoryScreen', { storyId: story.id })}
                  >
                    <Text style={styles.favoriteStoryButtonText}>Play</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.favoriteStoryButton, styles.deleteButton]}
                    onPress={() => deleteFavoriteStory(story.id)}
                  >
                    <Text style={styles.favoriteStoryButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyMessage}>No favorite stories yet.</Text>
          )}
        </View>
        
        {/* Usage Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Usage Statistics</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{usageStats.totalStories}</Text>
              <Text style={styles.statLabel}>Stories</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{usageStats.favoriteAnimal}</Text>
              <Text style={styles.statLabel}>Favorite Animal</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{usageStats.averageDuration}</Text>
              <Text style={styles.statLabel}>Avg. Duration</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{usageStats.mostActiveTime}</Text>
              <Text style={styles.statLabel}>Most Active</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F4FF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 28,
    color: '#5B3E90',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5B3E90',
  },
  saveButton: {
    backgroundColor: '#7B68EE',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5B3E90',
    marginBottom: 15,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  sliderContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderValue: {
    width: 50,
    textAlign: 'right',
    marginRight: 10,
    color: '#666',
  },
  favoriteStory: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  favoriteStoryInfo: {
    flex: 1,
  },
  favoriteStoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  favoriteStoryDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
  },
  favoriteStoryActions: {
    flexDirection: 'row',
  },
  favoriteStoryButton: {
    backgroundColor: '#7B68EE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginLeft: 10,
  },
  deleteButton: {
    backgroundColor: '#FF6B6B',
  },
  favoriteStoryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: '#F8F4FF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5B3E90',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});

export default ParentDashboard;
