// Import necessary libraries
import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 
import { useFocusEffect } from '@react-navigation/native';


const FriendsScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [friends, setFriends] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const currentUser = auth().currentUser;

  const fetchAndUpdateLeaderboard = async () => {
    const today = new Date().toISOString().split('T')[0];
    const leaderboardList = [];

    // Attempt to fetch current user's intake for today
    const currentUserIntakeDoc = await firestore()
      .collection('users')
      .doc(currentUser.uid)
      .collection('dailyIntakes')
      .doc(today)
      .get();

    // Adding current user's data
    leaderboardList.push({
      id: currentUser.uid,
      username: 'You',
      todayWaterIntake: currentUserIntakeDoc.exists ? currentUserIntakeDoc.data().waterConsumed : 0,
    });

    // Fetching friends' data and ensuring they show up even if they haven't drunk water
    const friendsSnapshot = await firestore()
      .collection('users')
      .doc(currentUser.uid)
      .collection('friends')
      .get();

    await Promise.all(friendsSnapshot.docs.map(async (doc) => {
      const friendId = doc.id;
      const friendData = doc.data();
      const intakeDoc = await firestore()
        .collection('users')
        .doc(friendId)
        .collection('dailyIntakes')
        .doc(today)
        .get();

      leaderboardList.push({
        id: friendId,
        username: friendData.username || 'Friend', // Adjust based on where username is stored
        todayWaterIntake: intakeDoc.exists ? intakeDoc.data().waterConsumed : 0,
      });
    }));

    // Sorting by water intake
    leaderboardList.sort((a, b) => b.todayWaterIntake - a.todayWaterIntake);

    setLeaderboardData(leaderboardList);
  };

  // Refresh leaderboard when the screen gains focus
  useFocusEffect(
    React.useCallback(() => {
      fetchAndUpdateLeaderboard().catch(console.error);
    }, [])
  );

  const toggleSearch = () => setShowSearch(!showSearch);

  const handleSearch = async text => {
    setSearchText(text);
    if (text.trim() === '') {
      setSearchResults([]);
      return;
    }

    try {
      const usernameLowerCase = text.toLowerCase();
      const querySnapshot = await firestore().collection('users').get();
      const results = [];
      querySnapshot.forEach(doc => {
        const userData = doc.data();
        if (doc.id !== currentUser.uid) {
          results.push({ id: doc.id, ...userData });
        }
      });
      setSearchResults(results);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAddFriend = async user => {
    try {
      // Add user to current user's friends collection
      await firestore()
        .collection('users')
        .doc(currentUser.uid)
        .collection('friends')
        .doc(user.id)
        .set(user);
      // Add current user to the other user's friends collection
      await firestore()
        .collection('users')
        .doc(user.id)
        .collection('friends')
        .doc(currentUser.uid)
        .set({ id: currentUser.uid, username: currentUser.displayName });
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('./leaderboard.png')} style={styles.leaderboardImage} />
      <TouchableOpacity style={styles.plusIcon} onPress={toggleSearch}>
        <Icon name="plus" size={30} color="#007AFF" />
      </TouchableOpacity>
      {showSearch && (
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a user by username"
          value={searchText}
          onChangeText={setSearchText}
        />
      )}
      <FlatList
        data={leaderboardData}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.friendItem}>
            <Text style={styles.username}>{item.username}</Text>
            <Text style={styles.waterIntake}>{item.todayWaterIntake || 0} oz</Text>
          </View>
        )}
        ListHeaderComponent={() => <Text style={styles.sectionTitle}>Daily Leaderboard</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  leaderboardImage: {
    width: '100%',
    height: 125, // Adjust according to your image aspect ratio
    resizeMode: 'contain',
    marginTop: 50
  },
  plusIcon: {
    position: 'absolute',
    right: 20,
    top: 40,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    margin: 16,
    width: '90%',
  },
  friendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  waterIntake: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
    textAlign: 'center'
    
  },
});

export default FriendsScreen;