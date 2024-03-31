import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import { Picker } from '@react-native-picker/picker';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type ClimateQuizProps = {
  navigation: NativeStackNavigationProp<any, any>;
};

const ClimateQuiz: React.FC<ClimateQuizProps> = ({ navigation }) => {
  const [climate, setClimate] = useState<string>('hot');

  const handleClimateChange = (itemValue: string) => {
    setClimate(itemValue);
  };

  const handleNextStep = async () => {
    try {
      if (!climate) {
        alert('Please select your climate before continuing.');
        return;
      }

      await AsyncStorage.setItem('climate', climate);
      ReactNativeHapticFeedback.trigger('impactHeavy');
      navigation.navigate('ActivityLevelQuiz', { climate });
    } catch (error) {
      console.log('Error storing climate:', error);
    }
  };

  const climateOptions = [
    <Picker.Item key="hot" label="Hot" value="hot" />,
    <Picker.Item key="mild" label="Mild" value="mild" />,
    <Picker.Item key="cold" label="Cold" value="cold" />,
  ];

  return (
    <View style={styles.container}>
      <LottieView
        source={require('./SUPER.json')}
        autoPlay
        loop
        style={styles.backgroundAnimation}
      />
      <View style={styles.content}>
        <Text style={styles.heading}>Select your climate.</Text>
        <Picker
          style={styles.picker}
          selectedValue={climate}
          onValueChange={handleClimateChange}
        >
          
          {climateOptions}
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

export default ClimateQuiz;