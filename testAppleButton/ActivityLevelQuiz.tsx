import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import { Picker } from '@react-native-picker/picker';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const ActivityLevelQuiz = ({ navigation }) => {
  const [dailyExercise, setDailyExercise] = useState('30');

  const handleExerciseChange = (itemValue) => {
    setDailyExercise(itemValue);
  };

  const handleNextStep = async () => {
    try {
      await AsyncStorage.setItem('dailyExercise', dailyExercise);
      ReactNativeHapticFeedback.trigger('impactHeavy');

      const height = await AsyncStorage.getItem('heightInCm');
      const weight = await AsyncStorage.getItem('weight');
      const gender = await AsyncStorage.getItem('gender');
      const climate = await AsyncStorage.getItem('climate');
      const exercise = dailyExercise;

      const waterGoal = Math.round(Number(weight) * 0.5 + ((Number(exercise) / 30) * 12));
      console.log('Calculated water goal:', waterGoal);
      await AsyncStorage.setItem('waterGoal', waterGoal.toString());

      console.log('Water goal for the day:', waterGoal);
      console.log('Water goal successfully stored:', waterGoal);
      navigation.navigate('SignInScreen');
    } catch (error) {
      console.log('Error storing activity level and daily exercise:', error);
    }
  };

  const exerciseOptions = Array.from({ length: 13 }, (_, index) => {
    const exercise = index * 15;
    return (
      <Picker.Item key={exercise} label={`${exercise} minutes`} value={`${exercise}`} />
    );
  });

  return (
    <View style={styles.container}>
      <LottieView
        source={require('./SUPER.json')}
        autoPlay
        loop
        style={styles.backgroundAnimation}
      />
      <View style={styles.content}>
        <Text style={styles.heading}>How much do you exercise daily?</Text>
        <Picker
          style={styles.picker}
          selectedValue={dailyExercise}
          onValueChange={handleExerciseChange}
        >
          {exerciseOptions}
        </Picker>
        <Button mode="contained" style={styles.button} onPress={handleNextStep}>
          Next
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundAnimation: {
    position: 'absolute',
    width: '125%',
    height: '125%',
  },
  content: {
    marginBottom: 200,
    width: '100%',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    color: 'black',
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'Chalkboard SE',
    textAlign: 'center',
  },
  picker: {
    width: '100%',
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
});

export default ActivityLevelQuiz;