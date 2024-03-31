import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const GenderQuiz = ({ navigation }) => {
  const [gender, setGender] = useState(null);

  const handleGenderChange = async (value) => {
    const options = {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    };
    ReactNativeHapticFeedback.trigger('impactHeavy', options);
    setGender(value);
    try {
      await AsyncStorage.setItem('gender', value);
      navigation.navigate('climateQuiz');
    } catch (error) {
      console.log('Error storing gender:', error);
    }
  };

  return (
    <View style={styles.container}>
      <LottieView
        source={require('./SUPER.json')}
        autoPlay
        loop
        style={styles.backgroundAnimation}
      />
      <View style={styles.content}>
        <Text style={styles.heading}>Select your gender.</Text>
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            style={[styles.genderButton, gender === 'male' && styles.selectedButton]}
            onPress={() => handleGenderChange('male')}
          >
            Male
          </Button>
          <Button
            mode="contained"
            style={[styles.genderButton, gender === 'female' && styles.selectedButton]}
            onPress={() => handleGenderChange('female')}
          >
            Female
          </Button>
        </View>
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
    marginBottom: 400,
    width: '100%',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    marginTop: 200,
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 16,
    fontFamily: 'Chalkboard SE',
    color: 'black',
    

  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: 16,
  },
  genderButton: {
    marginTop: 20,
    width: 200
  },
  selectedButton: {
    backgroundColor: 'blue',
  },
});

export default GenderQuiz;