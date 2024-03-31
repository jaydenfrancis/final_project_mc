import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import LottieView from 'lottie-react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const UsernameScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');

  const handleUsernameSubmit = async () => {
    const usernameLowerCase = username.toLowerCase();
    const user = auth().currentUser;

    // Check for username availability
    const querySnapshot = await firestore()
      .collection('users')
      .where('usernameLowerCase', '==', usernameLowerCase)
      .get();

    if (!querySnapshot.empty) {
      Alert.alert('Username is already taken. Please try a different one.');
      return;
    }

    // Save username in Firestore
    await firestore().collection('users').doc(user.uid).set({
      username,
      usernameLowerCase,
      email: user.email, // Assuming email is available
    });
    ReactNativeHapticFeedback.trigger('impactHeavy');

    navigation.navigate('LoadingPersonalGoal');
  };

  return (
    <View style={styles.container}>
      <LottieView
        source={require('./SUPER.json')}
        autoPlay
        loop
        style={styles.backgroundAnimation}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter a username"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor="black"
      />
      <TouchableOpacity style={styles.button} onPress={handleUsernameSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: 'black', // Button background color
    padding: 10, // Button padding for size
    borderRadius: 20, // Rounded button edges
    marginBottom: 200
  },
  buttonText: {
    color: 'white', // Text color
    textAlign: 'center', // Center the text
  },
  backgroundAnimation: {
    position: 'absolute',
    width: '125%',
    height: '125%',
  },
});

export default UsernameScreen;

