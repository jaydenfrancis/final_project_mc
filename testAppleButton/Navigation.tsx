import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HeightQuiz from './HeightQuiz';
import WeightQuiz from './WeightQuiz';
import GenderQuiz from './GenderQuiz';
import ActivityLevelQuiz from './ActivityLevelQuiz';
import MainScreen from './WaterGoal';
import StreakScreen from './StreakScreen';
import LoadingPersonalGoal from './LoadingPersonalGoal';
import OptimalWaterInfo from './OptimalWaterInfo';
import WheelPicker from './climateQuiz';
import SignInScreen from './SignInScreen';
import UsernameScreen from './UsernameScreen';
import FriendsScreen from './FriendsScreen';
import SettingsPage from './SettingsPage';
import auth from '@react-native-firebase/auth';

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarShowLabel: false,
      tabBarActiveTintColor: '#000000',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: { backgroundColor: '#FFFFFF', height: 70 },
      headerShown: false,
      detachPreviousScreen: !__DEV__,
      swipeEnabled: true,
    }}
    tabBarPosition="bottom"
  >
    <Tab.Screen
      name="WaterGoal"
      component={MainScreen}
      options={{
        tabBarIcon: tabBarIcon('water', 'water-outline'),
      }}
    />
    <Tab.Screen
      name="Friends"
      component={FriendsScreen}
      options={{
        tabBarIcon: tabBarIcon('account-group', 'account-group-outline'),
      }}
    />
    <Tab.Screen
      name="Settings"
      component={SettingsPage}
      options={{
        tabBarIcon: tabBarIcon('cog', 'cog-outline'),
      }}
    />
  </Tab.Navigator>
);

const tabBarIcon = (activeIcon, inactiveIcon) => ({ focused, color, size }) => (
  <MaterialCommunityIcons name={focused ? activeIcon : inactiveIcon} size={25} color={color} />
);

const Navigation = () => {
  const [initialRoute, setInitialRoute] = useState('WeightQuiz');
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, navigate to the main content
        setInitialRoute('Main'); // Assuming 'Main' is the route name for your main content
      } else {
        // User is signed out, navigate to the sign-in screen
        setInitialRoute('WeightQuiz');
      }
    });

    return subscriber; // Unsubscribe on unmount
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="WeightQuiz" component={WeightQuiz} options={{ gestureEnabled: false }} />
        <Stack.Screen name="GenderQuiz" component={GenderQuiz} options={{ gestureEnabled: false }} />
        <Stack.Screen name="climateQuiz" component={WheelPicker} options={{ gestureEnabled: false }} />
        <Stack.Screen name="ActivityLevelQuiz" component={ActivityLevelQuiz} options={{ gestureEnabled: false }} />
        <Stack.Screen name="SignInScreen" component={SignInScreen} options={{ gestureEnabled: false }} />
        <Stack.Screen name="UsernameScreen" component={UsernameScreen} options={{ gestureEnabled: false }} />
        <Stack.Screen name="LoadingPersonalGoal" component={LoadingPersonalGoal} options={{ gestureEnabled: false }} />
        <Stack.Screen name="OptimalWaterInfo" component={OptimalWaterInfo} options={{ gestureEnabled: false }} />
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen
          name="StreakScreen"
          component={StreakScreen}
          options={{
            presentation: 'modal',
            animationTypeForReplace: 'push',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;