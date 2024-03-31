import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import streakFire from './streak_fire.json';

const StreakScreen = ({ route, navigation }) => {
    const { streak } = route.params;
  return (
    <View style={styles.container}>
      <LottieView
        source={streakFire}
        autoPlay
        loop
        style={styles.animation}
      />
      <Text style={styles.goalText}>You're on fire!</Text>
      <Text style={styles.goalTextSub}>{`Current Streak: ${streak + 1}`}</Text>
      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF2828',
  },
  animation: {
    width: 300,
    height: 300,
  },
  continueButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  continueButtonText: {
    color: '#0080FF',
    fontWeight: 'bold',
  },
  goalText: {
    color: '#FFFFFF', // White color for contrast
    fontSize: 28, // Adjust size as needed
    fontWeight: 'bold', // Makes the text bold
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // Shadow color
    
    textShadowRadius: 3, // Blur radius of the shadow
    fontFamily: 'Arial', // Choose a font family that fits your app's style
    textAlign: 'center',
  },
  goalTextSub: {
    color: '#FFFFFF', // White color for contrast
    fontSize: 16, // Adjust size as needed
    fontWeight: 'bold', // Makes the text bold
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // Shadow color
    
    textShadowRadius: 3, // Blur radius of the shadow
    fontFamily: 'Arial', // Choose a font family that fits your app's style
    textAlign: 'center',
  },
});

export default StreakScreen;