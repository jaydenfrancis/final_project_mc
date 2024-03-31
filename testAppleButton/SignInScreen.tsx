// SignInScreen.js
import React, { useContext, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { appleAuth, AppleButton } from '@invertase/react-native-apple-authentication';
import { firebase } from '@react-native-firebase/auth';
import { UserContext } from './UserContext'; // Assume we'll create this for global user state management
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';


const SignInScreen = () => {
  const navigation = useNavigation();


  async function onAppleButtonPress() {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      const { identityToken, nonce, email, fullName } = appleAuthRequestResponse;

      if (identityToken) {
        const appleCredential = firebase.auth.AppleAuthProvider.credential(identityToken, nonce);
        const userCredential = await firebase.auth().signInWithCredential(appleCredential);

        // Use email and fullName here if available, otherwise handle as null
        console.warn(`Firebase authenticated via Apple, UID: ${userCredential.user.uid}`);

        // If email and fullName are provided, you might want to save them to Firestore here
        ReactNativeHapticFeedback.trigger('impactHeavy');
        navigation.navigate('UsernameScreen');
      } else {
        // No identityToken retrieved
        Alert.alert('Apple Sign-In', 'Failed to retrieve identity token.');
      }
    } catch (error) {
      if (error.code === appleAuth.Error.CANCELED) {
        console.log('User canceled Apple Sign-In');
      } else {
        Alert.alert('Apple Sign-In Error', error.message);
      }
    }
  }

  return (
    <View style={styles.container}>
        <LottieView
        source={require('./SUPER.json')}
        autoPlay
        loop
        style={styles.backgroundAnimation}
      />
      {appleAuth.isSupported && (
        <AppleButton
          cornerRadius={5}
          style={styles.appleButton}
          buttonStyle={AppleButton.Style.WHITE}
          buttonType={AppleButton.Type.SIGN_IN}
          onPress={onAppleButtonPress}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appleButton: {
    width: 200,
    height: 60,
    marginBottom: 200
  },
  backgroundAnimation: {
    position: 'absolute',
    width: '125%',
    height: '125%',
  },
  
});

export default SignInScreen;
