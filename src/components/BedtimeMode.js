import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated, Switch } from 'react-native';
import Slider from '@react-native-community/slider';
import LottieView from 'lottie-react-native';

// Mock API for demonstration purposes
import { mockEnableBedtimeMode, mockDisableBedtimeMode } from '../services/mockApiService';

const BedtimeMode = ({ navigation }) => {
  // State variables
  const [isBedtimeEnabled, setIsBedtimeEnabled] = useState(false);
  const [fadeDuration, setFadeDuration] = useState(15);
  const [remainingTime, setRemainingTime] = useState(0);
  const [animation] = useState(new Animated.Value(1));
  const [backgroundOpacity] = useState(new Animated.Value(0.3));
  
  // Start animation when bedtime mode is enabled
  useEffect(() => {
    if (isBedtimeEnabled) {
      // Start volume fade animation
      Animated.timing(animation, {
        toValue: 0,
        duration: fadeDuration * 60000, // Convert minutes to milliseconds
        useNativeDriver: true,
      }).start();
      
      // Start background fade animation
      Animated.timing(backgroundOpacity, {
        toValue: 0.8,
        duration: fadeDuration * 60000, // Convert minutes to milliseconds
        useNativeDriver: true,
      }).start();
      
      // Start countdown timer
      const totalSeconds = fadeDuration * 60;
      setRemainingTime(totalSeconds);
      
      const timer = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    } else {
      // Reset animations
      animation.setValue(1);
      backgroundOpacity.setValue(0.3);
    }
  }, [isBedtimeEnabled, fadeDuration]);
  
  // Format remaining time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Toggle bedtime mode
  const toggleBedtimeMode = async () => {
    try {
      if (!isBedtimeEnabled) {
        const result = await mockEnableBedtimeMode(fadeDuration);
        if (result.success) {
          setIsBedtimeEnabled(true);
        }
      } else {
        const result = await mockDisableBedtimeMode();
        if (result.success) {
          setIsBedtimeEnabled(false);
        }
      }
    } catch (error) {
      console.error('Error toggling bedtime mode:', error);
    }
  };
  
  // Function to navigate back to story screen
  const goToStoryScreen = () => {
    navigation.navigate('StoryScreen');
  };

  return (
    <View style={styles.container}>
      {/* Night sky background */}
      <Animated.View 
        style={[
          styles.backgroundOverlay,
          { opacity: backgroundOpacity }
        ]}
      >
        <Image 
          source={require('../assets/night_sky.png')} 
          style={styles.backgroundImage}
          resizeMode="cover"
        />
      </Animated.View>
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={goToStoryScreen}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Bedtime Mode</Text>
      </View>
      
      <View style={styles.content}>
        {/* Moon icon */}
        <View style={styles.moonContainer}>
          <Image 
            source={require('../assets/moon.png')} 
            style={styles.moonImage}
            resizeMode="contain"
          />
          {isBedtimeEnabled && (
            <LottieView
              source={require('../assets/stars_twinkling.json')}
              style={styles.starsAnimation}
              autoPlay
              loop
            />
          )}
        </View>
        
        {/* Bedtime mode toggle */}
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>Bedtime Mode</Text>
          <Switch
            trackColor={{ false: "#D0D0D0", true: "#5E72EB" }}
            thumbColor={isBedtimeEnabled ? "#FFFFFF" : "#F4F3F4"}
            onValueChange={toggleBedtimeMode}
            value={isBedtimeEnabled}
          />
        </View>
        
        {/* Fade duration slider */}
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>Fade Duration</Text>
          <View style={styles.sliderRow}>
            <Slider
              style={styles.slider}
              minimumValue={5}
              maximumValue={30}
              step={5}
              value={fadeDuration}
              onValueChange={setFadeDuration}
              minimumTrackTintColor="#5E72EB"
              maximumTrackTintColor="#D0D0D0"
              thumbTintColor="#7B68EE"
              disabled={isBedtimeEnabled}
            />
            <Text style={styles.sliderValue}>{fadeDuration} min</Text>
          </View>
        </View>
        
        {/* Remaining time display */}
        {isBedtimeEnabled && (
          <View style={styles.timerContainer}>
            <Text style={styles.timerLabel}>Time Remaining</Text>
            <Text style={styles.timerValue}>{formatTime(remainingTime)}</Text>
            <Animated.View 
              style={[
                styles.volumeIndicator,
                { opacity: animation }
              ]}
            >
              <Text style={styles.volumeText}>
                Volume: {Math.round(animation._value * 100)}%
              </Text>
            </Animated.View>
          </View>
        )}
        
        {/* Lullaby options */}
        <View style={styles.lullabyContainer}>
          <Text style={styles.lullabyTitle}>After Story Ends</Text>
          
          <TouchableOpacity 
            style={[styles.lullabyOption, styles.selectedOption]}
          >
            <Image 
              source={require('../assets/lullaby_icon.png')} 
              style={styles.lullabyIcon}
            />
            <Text style={styles.lullabyText}>Lullaby</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.lullabyOption}>
            <Image 
              source={require('../assets/white_noise_icon.png')} 
              style={styles.lullabyIcon}
            />
            <Text style={styles.lullabyText}>White Noise</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.lullabyOption}>
            <Image 
              source={require('../assets/silence_icon.png')} 
              style={styles.lullabyIcon}
            />
            <Text style={styles.lullabyText}>Silence</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C3E50',
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 28,
    color: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  moonContainer: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  moonImage: {
    width: '100%',
    height: '100%',
  },
  starsAnimation: {
    position: 'absolute',
    width: 200,
    height: 200,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  toggleLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  sliderContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  sliderLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderValue: {
    width: 60,
    textAlign: 'right',
    color: '#FFFFFF',
    fontSize: 16,
  },
  timerContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  timerLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  timerValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  volumeIndicator: {
    backgroundColor: 'rgba(94, 114, 235, 0.3)',
    borderRadius: 10,
    padding: 8,
  },
  volumeText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  lullabyContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 15,
  },
  lullabyTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 15,
  },
  lullabyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: 'rgba(94, 114, 235, 0.3)',
    borderWidth: 1,
    borderColor: '#5E72EB',
  },
  lullabyIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  lullabyText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default BedtimeMode;
