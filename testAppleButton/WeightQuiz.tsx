import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const WeightQuiz = ({ navigation }) => {
  const [weight, setWeight] = useState('');

  const handleWeightChange = (text) => setWeight(text);

  const handleNextStep = async () => {
    try {
      if (!weight) {
        alert('Please enter your weight before continuing.');
        return;
      }
      await AsyncStorage.setItem('weight', weight);
      ReactNativeHapticFeedback.trigger('impactHeavy');
      navigation.navigate('GenderQuiz');
    } catch (error) {
      console.log('Error storing weight:', error);
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
      <Text style={styles.heading}>Select your weight.</Text>
      <TextInput
        label="Weight (lbs)"
        value={weight}
        onChangeText={handleWeightChange}
        keyboardType="numeric"
        style={styles.input}
        mode="outlined"
      />
      <Button mode="contained" style={styles.button} onPress={handleNextStep}>
        Next
      </Button>
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
    heading: {
      color: 'black', // White color for contrast
    fontSize: 28, // Adjust size as needed
    fontWeight: 'bold', // Makes the text bold
    marginTop: -250,
    textShadowColor: 'rgba(255, 255, 255, 0.75)',
    textShadowRadius: 1.5,
    fontFamily: 'Chalkboard SE', // Choose a font family that fits your app's style
    textAlign: 'center',
    marginBottom: 20
    },
    input: {
      width: 150,
      marginBottom: 16,
    },
    button: {
      marginTop: 16,
    },
  });

export default WeightQuiz;