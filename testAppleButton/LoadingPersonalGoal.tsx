import React from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';

const LoadingPersonalGoal = () => {
  const navigation = useNavigation(); // Use useNavigation hook if not using navigation prop

  const handleAnimationFinish = () => {
    // Navigate to the waterGoal page after the animation finishes
    navigation.navigate('OptimalWaterInfo');
  };

  return (
    <View style={styles.container}>
      <LottieView
        source={require('./new.json')} // Adjust the path to your Lottie file
        autoPlay
        loop={false} // Ensure the animation does not loop
        onAnimationFinish={handleAnimationFinish} // Handle the end of the animation
        style={styles.loadingAnimation}
      />
      <Text style={styles.actionText}>Calculating optimal</Text>
      <Text style={styles.actionText2}>hydration goal.</Text>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  loadingAnimation: {
    // Define the style for your animation if needed
    width: 180, // Example size, adjust as needed
    height: 180, // Example size, adjust as needed
  },
  actionText: {
    marginTop: 50,
    color: '#009DFF',
    fontSize: 24,
    fontFamily: 'Chalkboard SE',
    textAlign: 'center',
  },
  actionText2: {
    color: '#009DFF',
    fontSize: 24,
    fontFamily: 'Chalkboard SE',
    textAlign: 'center',
  },
});

export default LoadingPersonalGoal;
 