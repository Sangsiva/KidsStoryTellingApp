import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import StoryScreen from './components/StoryScreen';
import ParentDashboard from './components/ParentDashboard';
import BedtimeMode from './components/BedtimeMode';

// Create stack navigator
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="StoryScreen"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#F8F4FF' }
        }}
      >
        <Stack.Screen name="StoryScreen" component={StoryScreen} />
        <Stack.Screen name="ParentDashboard" component={ParentDashboard} />
        <Stack.Screen name="BedtimeMode" component={BedtimeMode} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
