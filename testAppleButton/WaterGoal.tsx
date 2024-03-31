import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Alert, Image, TouchableOpacity, Modal} from 'react-native';
import { Text, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import confettiAnimation from './confetti_2.json';
import successGuyAnimation from './success_guy.json';
import { isToday, format, addDays, isYesterday} from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { StackActions } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import HapticFeedback from 'react-native-haptic-feedback';
import streakFireAnimation from './streak_fire.json';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import * as Progress from 'react-native-progress';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/Ionicons';

const MainScreen = () => {
  const [waterGoal, setWaterGoal] = useState(0);
  const [waterConsumed, setWaterConsumed] = useState(0);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [metGoal, setMetGoal] = useState(false);
  const [lastGoalMetDay, setLastGoalMetDay] = useState<Date | null>(null)
  const [showCongrats, setShowCongrats] = useState(false);
  const waterAnimation = useRef(null);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [waterAmount, setWaterAmount] = useState(0);
  const navigation = useNavigation();
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);
  const [points, setPoints] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedWaterGoal = await AsyncStorage.getItem('waterGoal');
        const storedWaterConsumed = await AsyncStorage.getItem('waterConsumed');
        const storedLastResetDay = await AsyncStorage.getItem('lastResetDay');
  
        const today = new Date();
        const lastResetDay = storedLastResetDay ? new Date(parseInt(storedLastResetDay, 10)) : null;
  
        if (storedWaterGoal !== null) {
          setWaterGoal(parseInt(storedWaterGoal, 10));
        }
        if (storedWaterConsumed !== null) {
          setWaterConsumed(parseInt(storedWaterConsumed, 10));
        }
  
        // Reset daily consumption and metGoal if it's a new day
        if (lastResetDay === null || !isToday(lastResetDay)) {
          await AsyncStorage.setItem('waterConsumed', '0');
          await AsyncStorage.setItem('lastResetDay', today.getTime().toString());
          setWaterConsumed(0);
          setMetGoal(false); // Reset metGoal for the new day
          // Optionally reset any other daily tracking states here
        } else {
          // Check if the goal was met on the last reset day
          const goalMet = await AsyncStorage.getItem('goalMet');
          setMetGoal(goalMet === 'true');
        }
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);  
    
    

  useEffect(() => {
    // Your existing useEffect code for fetching data...
    const fetchStreakAndLevel = async () => {
      const currentUser = auth().currentUser;
      try {
        const doc = await firestore().collection('users').doc(currentUser.uid).get();
        if (doc.exists) {
          const data = doc.data();
          setStreak(data.streak || 0);
          setLevel(data.level || 1);
          setPoints(data.points || 0);
        }
      } catch (error) {
        console.log('Error fetching streak and level:', error);
      }
    };

    fetchStreakAndLevel();
  }, []);

  const calculatePointsAndLevel = (newWaterConsumed) => {
    // Calculate the percentage of the goal achieved
    let percentageOfGoal = Math.floor((newWaterConsumed / waterGoal) * 100);
    percentageOfGoal = Math.min(percentageOfGoal, 100); // Cap the percentage at 100%
  
    // Calculate the points earned based on the percentage of the goal achieved
    let earnedPoints = percentageOfGoal;
  
    // If the goal has been reached or exceeded for the first time
    if (newWaterConsumed >= waterGoal && !metGoal) {
      setShowCongrats(true);
      setMetGoal(true); // Mark goal as met
    }
  
    // Update points based on the earned points
    setPoints((currentPoints) => Math.min(currentPoints + earnedPoints, 100));
  
    // Recalculate the level based on the new points value
    // Note: Since setState is asynchronous, calculate newLevel based on expected new points value
    let expectedNewPoints = Math.min(points + earnedPoints, 100);
    let newLevel = Math.floor(expectedNewPoints / 100) + 1;
  
    setLevel(newLevel); // Update the level
  
    return { newPoints: expectedNewPoints, newLevel }; // Return the expected new values
  };
  
  

  const updateStreakAndLevelInFirestore = async (newStreak, newPoints, newLevel) => {
    const currentUser = auth().currentUser;
    try {
      await firestore().collection('users').doc(currentUser.uid).set({
        streak: newStreak,
        points: newPoints,
        level: newLevel,
      }, { merge: true });
    } catch (error) {
      console.error('Error updating streak and level:', error);
    }
  };

  useEffect(() => {
    const updateStreak = async () => {
      const today = new Date();
      let newStreak = streak;
      const yesterday = addDays(today, -1);
  
      // Retrieve the date when the goal was last met
      const storedLastGoalMetDay = await AsyncStorage.getItem('lastGoalMetDay');
      const lastGoalMetDay = storedLastGoalMetDay ? new Date(parseInt(storedLastGoalMetDay, 10)) : null;
  
      if (metGoal && isToday(new Date())) {
        if (lastGoalMetDay && isYesterday(lastGoalMetDay)) {
          newStreak += 1; // Increment the streak if the goal was met yesterday
        } else if (!lastGoalMetDay || (!isToday(lastGoalMetDay) && !isYesterday(lastGoalMetDay))) {
          newStreak = 1; // Start a new streak or keep it at 1 if met today for the first time
        }
        // Update the streak in the state and Firestore
        setStreak(newStreak);
        await AsyncStorage.setItem('lastGoalMetDay', today.getTime().toString());
        await updateStreakAndLevelInFirestore(newStreak, points, level);
      } else if (lastGoalMetDay && !isToday(lastGoalMetDay) && !isYesterday(lastGoalMetDay)) {
        // Reset streak if no goal was met yesterday and it's a new day
        setStreak(0);
        await AsyncStorage.removeItem('lastGoalMetDay'); // Consider removing or updating this as appropriate
        await updateStreakAndLevelInFirestore(0, points, level);
      }
    };
  
    updateStreak();
  }, [waterConsumed, metGoal]); // Dependencies might need adjustment
  

  

  useFocusEffect(
    React.useCallback(() => {
      const fetchWaterGoal = async () => {
        try {
          const storedWaterGoal = await AsyncStorage.getItem('waterGoal');
          if (storedWaterGoal !== null) {
            setWaterGoal(parseInt(storedWaterGoal, 10));
          }
        } catch (error) {
          console.log('Error fetching water goal:', error);
        }
      };
  
      fetchWaterGoal();
    }, [])
  );
  
  


    
    

    useEffect(() => {
      const updateAnimationProgress = () => {
        const newProgress = waterGoal > 0 ? waterConsumed / waterGoal : 0;
        setAnimationProgress(newProgress);
        const goalJustMet = waterConsumed >= waterGoal && !metGoal;
        setMetGoal(waterConsumed >= waterGoal);
  
      };
  
      updateAnimationProgress();
    }, [waterConsumed, waterGoal]);

  


  useEffect(() => {
    if (metGoal) {
      const timer = setTimeout(() => {
        setShowSuccessAnimation(true);
      }, 1700); // Delay of 500ms for smoother transition
  
      return () => clearTimeout(timer);
    } else {
      setShowSuccessAnimation(false);
    }
  }, [metGoal]);

  const handleHapticFeedback = () => {
    const options = {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    };
    HapticFeedback.trigger('impactHeavy', options);
  };

  const handleOpenModal = () => {
    setModalVisible(true);
    };
    
    const handleCloseModal = () => {
    setModalVisible(false);
    setSliderValue(0);
  };

  const getWaterLabel = (value) => {
    if (value <= 4) {
    return 'sip';
    } else if (value <= 12) {
    return 'cup';
    } else {
    return 'bottle';
    }
  };
  
  
    
    

  const today = format(new Date(), 'eeee');

  const handleWaterAmountSubmit = async (amount) => {

    if (metGoal && isToday(lastGoalMetDay)) {
      return;
    }

    const consumedWater = amount;
    const newWaterConsumed = waterConsumed + consumedWater;
    const newProgress = newWaterConsumed / waterGoal;
    const currentUser = auth().currentUser;

    const totalFrames = 598;
    const startFrame = Math.floor(animationProgress * totalFrames);
    const endFrame = Math.floor(newProgress * totalFrames);
    let { newPoints, newLevel } = { newPoints: points, newLevel: level };
    if (!metGoal || !isToday(lastGoalMetDay)) {
      ({ newPoints, newLevel } = calculatePointsAndLevel(newWaterConsumed));
    }

    setWaterConsumed(newWaterConsumed);
    setAnimationProgress(newProgress);
    setWaterAmount(0);
    setPoints(newPoints);
    setLevel(newLevel);
    if (newWaterConsumed >= waterGoal && !metGoal) {
      setMetGoal(true);
      setLastGoalMetDay(new Date());
      
  }

    await AsyncStorage.setItem('waterConsumed', newWaterConsumed.toString());
    try {
      const today = new Date().toISOString().split('T')[0]; // Format today's date as YYYY-MM-DD
      await firestore().collection('users').doc(currentUser.uid)
        .collection('dailyIntakes').doc(today) // Using a separate document for each day
        .set({
          waterConsumed: newWaterConsumed,
          date: today
        }, { merge: true });
  
      console.log('Firestore updated successfully');
    } catch (error) {
      console.error('Error updating Firestore:', error);
    }

    if (waterAnimation.current) {
      waterAnimation.current.play(startFrame, endFrame);
    }
  };

  const handleAddSip = async () => {
    await handleWaterAmountSubmit(1);
  };

  const handleAddBottle = async () => {
    await handleWaterAmountSubmit(16);
  };

  const resetWaterConsumed = async () => {
    console.log('Resetting water consumed...');
    const currentUser = auth().currentUser;
    try {
      // Reset AsyncStorage values for daily consumption and goal tracking
      await AsyncStorage.setItem('waterConsumed', '0');
      await AsyncStorage.removeItem('lastGoalMetDay'); // Remove the lastGoalMetDay item
      console.log('AsyncStorage reset complete');
  
      // Reset local state
      setWaterConsumed(0);
      setAnimationProgress(0);
      setShowCongrats(false);
      setShowSuccessAnimation(false);
      setMetGoal(false);
      setStreak(0); // Reset streak
      setLevel(1); // Reset level back to initial value
      setPoints(0); // Reset points
  
      // Reset animation to initial state
      if (waterAnimation.current) {
        waterAnimation.current.play(0, 0);
      }
  
      // Increment resetKey to trigger re-render where needed
      setResetKey((prevKey) => prevKey + 1);
      console.log('State after reset:', {
        waterConsumed: 0,
        animationProgress: 0,
        showCongrats: false,
        showSuccessAnimation: false,
        metGoal: false,
        resetKey: resetKey + 1,
        streak: 0,
        level: 1,
        points: 0,
      });
  
      // Reset Firestore data for streak, level, and points along with daily intake
      const today = new Date().toISOString().split('T')[0]; // Format today's date as YYYY-MM-DD
      await firestore().collection('users').doc(currentUser.uid)
        .set({
          streak: 0,
          level: 1,
          points: 0,
        }, { merge: true });
  
      await firestore().collection('users').doc(currentUser.uid)
        .collection('dailyIntakes').doc(today)
        .set({
          waterConsumed: 0,
          date: today
        }, { merge: true });
  
      console.log('Firestore reset complete');
    } catch (error) {
      console.log('Error resetting water consumed:', error);
    }
  };
  

  const handleDrinkWater = async () => {
    await handleWaterAmountSubmit(8);
  };



  return (
    <View style={styles.container}>
      <View style={styles.streakContainer}>
    <LottieView
         source={streakFireAnimation}
         autoPlay
         loop
         style={styles.streakAnimation}
       />
    <Text style={styles.streakText}>{streak}</Text>
    </View>
    <Text style={styles.dayText}>Happy {today}!</Text>
    <View style={styles.backgroundAnimationContainer}>
    <LottieView
    source={require('./small_bubbles.json')}
    autoPlay
    loop
    style={styles.backgroundAnimation}
    />
    </View>
    {showSuccessAnimation && (
  <View style={styles.confettiContainer}>
    <LottieView
      key={`successAnimation-${resetKey}`}
      source={confettiAnimation}
      autoPlay
      loop
      style={styles.confettiAnimation}
    />
  </View>
)}
    <Text style={styles.goalText}>{waterConsumed}oz.</Text>
<Text style={styles.subtitleText}>
  {waterGoal > 0 ? `${((waterConsumed / waterGoal) * 100).toFixed(2)}% of daily goal` : 'Set a goal'}
</Text>
    <View style={styles.waterGlassContainer}>
    {showSuccessAnimation ? (
    <LottieView
    key={'successAnimation-${resetKey}'}
    source={successGuyAnimation}
    autoPlay
    loop
    style={styles.waterAnimation}
    />
    ) : (
    <LottieView
    key={'waterAnimation-${resetKey}'}
    ref={waterAnimation}
    source={require('./cup_with_percent.json')}
    loop={false}
    speed={2}
    style={styles.waterAnimation}
    />
    )}
    </View>
    <Text style={styles.waterConsumedText}>{metGoal ? 'Well done!' : 'Time to hydrate!'}</Text>
    <TouchableOpacity onPress={handleOpenModal} style={styles.addWaterButton}>
    <Icon name="water" size={60} color="#FFFFFF" />
    </TouchableOpacity>
    <Text style={styles.waterDropText}>I Drank Water!</Text>
    <Modal visible={modalVisible} animationType="slide" transparent>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalText}>I drank a {getWaterLabel(sliderValue)}</Text>
      <View style={styles.sliderContainer}>
        <LottieView
          source={require('./water_drop.json')}
          style={styles.waterDropAnimation}
          autoPlay
          loop
        />
        <Slider
          value={sliderValue}
          onValueChange={(value) => {
            setSliderValue(value);
            handleHapticFeedback();
          }}
          minimumValue={0}
          maximumValue={20}
          step={1}
          style={styles.slider}
          minimumTrackTintColor="#4CAF50"
          maximumTrackTintColor="#BDBDBD"
          thumbTintColor="#4CAF50"
        />
      </View>
      <Text style={styles.ouncesText}>{sliderValue} oz.</Text>
      <View style={styles.modalButtonContainer}>
        <TouchableOpacity
          style={[styles.modalButton, styles.submitButton]}
          onPress={() => {
            handleWaterAmountSubmit(sliderValue);
            handleCloseModal();
          }}
        >
          <Text style={styles.modalButtonText}>Submit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modalButton, styles.cancelButton]}
          onPress={handleCloseModal}
        >
          <Text style={styles.modalButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>
<View style={styles.progressBarContainer}>
    <Progress.Bar
    progress={points / 100}
    width={300}
    height={10}
    color="#4CAF50"
    borderColor="#FFFFFF"
    borderWidth={1}
    animated
    />
    <Text style={styles.levelText}>Level: {level}</Text>
    </View>
    <Button mode="contained" style={styles.resetButton} onPress={resetWaterConsumed}>
    Reset Daily Intake
    </Button>

    </View>
    );
}
    
    const styles = StyleSheet.create({
    container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#009DFF',
    },
    dayText: {
    marginTop: 100,
    color: '#BFEDFF',
    fontSize: 28,
    fontWeight: 'bold',
    textShadowColor: 'rgba(100, 0, 200, 0.5)',
    textShadowRadius: 2,
    fontFamily: 'Futura',
    textAlign: 'center',
    },
    goalText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowRadius: 3,
    fontFamily: 'Futura',
    textAlign: 'center',
    },
    subtitleText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
    textShadowRadius: 2,
    fontFamily: 'Futura',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    },
    waterGlassContainer: {
    width: 200,
    height: 400,
    overflow: 'hidden',
    },
    waterAnimation: {
    width: '100%',
    height: '100%',
    },
    waterConsumedText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowRadius: 2,
    fontFamily: 'Futura',
    textAlign: 'center',
    },
    resetButton: {
    marginTop: 20,
    },
    confettiContainer: {
    position: 'absolute',
    top: '25%',
    left: '25%',
    width: 200,
    height: 200,
    overflow: 'hidden',
    transform: [{ scale: 3 }],
    },
    backgroundAnimationContainer: {
    position: 'absolute',
    top: '10%',
    left: '10%',
    width: 200,
    height: 200,
    overflow: 'hidden',
    transform: [{ scale: 4.5 }],
    },
    confettiAnimation: {
    width: '100%',
    height: '100%',
    },
    backgroundAnimation: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    },
    progressBarContainer: {
    alignItems: 'center',
    marginTop: 20,
    },
    levelText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 5,
    },
    addWaterButton: {
    marginTop: 20,
    },
    waterDropText: {
    textAlign: 'center',
    color: '#FFFFFF'

    },
    streakContainer: {
      position: 'absolute',
      top: '5%',
      left: '2%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: 55,
      height: 55,
      backgroundColor: '#5A0CBF',
      borderRadius: 50,
  borderWidth: 2,
    },
    streakAnimation: {
    width: 40,
    height: 40,
    marginLeft: -10,
    marginTop: -3
    },
    streakText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: -8
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: '#FFFFFF',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
      width: '80%',
    },
    modalText: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    sliderContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 10,
    },
    waterDropAnimation: {
      width: 50,
      height: 50,
    },
    slider: {
      flex: 1,
      height: 40,
      marginLeft: 10,
      color: 'blue'
    },
    ouncesText: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    modalButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
    },
    modalButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
    },
    submitButton: {
      backgroundColor: '#4CAF50',
    },
    cancelButton: {
      backgroundColor: '#BDBDBD',
    },
    modalButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    });
    
    export default MainScreen;