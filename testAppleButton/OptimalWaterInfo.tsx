import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Animated, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import LottieView from 'lottie-react-native';

const OptimalWaterInfo = () => {
  const [waterGoal, setWaterGoal] = useState('');
  const fadeAnimText = new Animated.Value(0);
  const fadeAnimButton = new Animated.Value(0);
  const navigation = useNavigation();

  useEffect(() => {
    fetchWaterGoal();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      console.log('Screen focused, resetting animations');
      fadeAnimText.setValue(0);
      fadeAnimButton.setValue(0);
      fadeIn(fadeAnimText, 3000);
      fadeIn(fadeAnimButton, 6000);

      return () => {
        // This is the cleanup function for useFocusEffect
        // You can reset any state or animations here if needed
      };
    }, [fadeAnimText, fadeAnimButton])
  );

  const fetchWaterGoal = async () => {
    try {
      const storedWaterGoal = await AsyncStorage.getItem('waterGoal');
      if (storedWaterGoal !== null) {
        setWaterGoal(storedWaterGoal);
      }
    } catch (error) {
      console.log('Error fetching water goal:', error);
    }
  };

  const fadeIn = (animValue, duration) => {
    Animated.timing(animValue, {
      toValue: 1,
      duration: duration,
      useNativeDriver: true,
    }).start();
  };

  const handleNextPress = () => {
    ReactNativeHapticFeedback.trigger('impactHeavy');
    navigation.navigate('Main');
  };

  return (
    <View style={styles.container}>
      <LottieView
        source={require('./small_bubbles.json')}
        autoPlay
        loop
        style={styles.backgroundAnimation}
      />
      <Animated.Text style={[styles.text, { opacity: fadeAnimText }]}>
        Daily hydration goal: {waterGoal}oz
      </Animated.Text>
      <Animated.View style={{ opacity: fadeAnimButton }}>
        <TouchableOpacity style={styles.button} onPress={handleNextPress}>
          <Text style={styles.buttonText}>Start Hydrating</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundAnimationContainer: {
    position: 'absolute',
    top: '0%',
    left: '0%',
    width: 200,
    height: 200,
    overflow: 'hidden',
    transform: [{ scale: 10 }],
  },
  backgroundAnimation: {
    position: 'absolute',
    top: -50,
    left: -30,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#009DFF',
  },
  text: {
    fontSize: 24,
    color: 'white',
    marginBottom: 20,
    fontFamily: 'Chalkboard SE',
  },
  button: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  buttonText: {
    color: '#009DFF',
    fontSize: 18,
    fontFamily: 'Chalkboard SE',
  },
});

export default OptimalWaterInfo;