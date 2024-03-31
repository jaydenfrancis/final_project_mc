// LogoutComponent.js
import React, { useContext } from 'react';
import { Button } from 'react-native';
import { firebase } from '@react-native-firebase/auth';
import { UserContext } from './UserContext'; // Using the same UserContext

const LogoutComponent = () => {
  const {setUser} = useContext(UserContext);

  const handleLogout = async () => {
    try {
      await firebase.auth().signOut();
      setUser(null); // Clear user context
      console.log('User signed out!');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Button title="Logout" onPress={handleLogout} />
  );
};

export default LogoutComponent;
