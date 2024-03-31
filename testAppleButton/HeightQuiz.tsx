import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import { Picker } from '@react-native-picker/picker';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const HeightQuiz = ({ navigation }) => {
  const [feet, setFeet] = useState('5');
  const [inches, setInches] = useState('5');

  const handleFeetChange = (itemValue) => {
    setFeet(itemValue);
  };

  const handleInchesChange = (itemValue) => {
    setInches(itemValue);
  };

  const handleNextStep = async () => {
    try {
      if (!feet || !inches) {
        alert('Please select your height before continuing.');
        return;
      }

      const heightInCm = (parseInt(feet) * 30.48) + (parseInt(inches) * 2.54);
      await AsyncStorage.setItem('heightInCm', String(heightInCm));
      ReactNativeHapticFeedback.trigger('impactHeavy');
      navigation.navigate('WeightQuiz');
    } catch (error) {
      console.log('Error storing height:', error);
    }
  };

  const feetOptions = Array.from({ length: 6 }, (_, index) => (
    <Picker.Item key={index} label={`${index + 3} ft`} value={`${index + 3}`} />
  ));

  const inchesOptions = Array.from({ length: 12 }, (_, index) => (
    <Picker.Item key={index} label={`${index} in`} value={`${index}`} />
  ));

  return (
    <View style={styles.container}>
      <LottieView
        source={require('./SUPER.json')}
        autoPlay
        loop
        style={styles.backgroundAnimation}
      />
      <View style={styles.content}>
        <Text style={styles.heading}>Select your height.</Text>
        <View style={styles.pickerContainer}>
          <Picker
            style={styles.picker}
            selectedValue={feet}
            onValueChange={handleFeetChange}
          >
            {feetOptions}
          </Picker>
          <Picker
            style={styles.picker}
            selectedValue={inches}
            onValueChange={handleInchesChange}
          >
            {inchesOptions}
          </Picker>
        </View>
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
    textShadowColor: 'rgba(255, 255, 255, 0.75)',
    textShadowRadius: 1.5,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 16,
  },
  picker: {
    width: '48%',
  },
  button: {
    marginTop: 16,
  },
});

export default HeightQuiz;