import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';

const SettingsPage = ({ navigation }) => {
  const [settings, setSettings] = useState({
    weight: '',
    gender: 'male',
    climate: 'mild',
    dailyExercise: '30',
    waterGoal: '',
  });
  const [isWeightModalVisible, setWeightModalVisible] = useState(false);
  const [tempWeight, setTempWeight] = useState('');
  const [isGenderModalVisible, setGenderModalVisible] = useState(false);
  const [tempGender, setTempGender] = useState('');
  const [isExerciseModalVisible, setExerciseModalVisible] = useState(false);
  const [tempExercise, setTempExercise] = useState('');
  const [isClimateModalVisible, setClimateModalVisible] = useState(false);
  const [tempClimate, setTempClimate] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const weight = await AsyncStorage.getItem('weight') || '';
        const gender = await AsyncStorage.getItem('gender') || 'male';
        const climate = await AsyncStorage.getItem('climate') || 'mild';
        const dailyExercise = await AsyncStorage.getItem('dailyExercise') || '30';
        const waterGoal = await AsyncStorage.getItem('waterGoal') || '';

        setSettings({ weight, gender, climate, dailyExercise, waterGoal });
      } catch (error) {
        console.log('Error loading settings:', error);
      }
    };

    loadSettings();
  }, []);

  const openWeightModal = () => {
    setTempWeight(settings.weight);
    setWeightModalVisible(true);
  };

  const saveWeight = async () => {
    const newWaterGoal = calculateWaterGoal(tempWeight, settings.dailyExercise);
    setSettings({ ...settings, weight: tempWeight, waterGoal: newWaterGoal.toString() });
    setWeightModalVisible(false);
    try {
      await AsyncStorage.setItem('weight', tempWeight);
      await AsyncStorage.setItem('waterGoal', newWaterGoal.toString());
      console.log('Weight and water goal saved');
    } catch (error) {
      console.log('Error saving weight and water goal', error);
    }
  };

  const openGenderModal = () => {
    setTempGender(settings.gender);
    setGenderModalVisible(true);
  };

  const saveGender = async () => {
    setSettings({ ...settings, gender: tempGender });
    setGenderModalVisible(false);
    try {
      await AsyncStorage.setItem('gender', tempGender);
      console.log('Gender saved');
    } catch (error) {
      console.log('Error saving gender', error);
    }
  };

  const openExerciseModal = () => {
    setTempExercise(settings.dailyExercise);
    setExerciseModalVisible(true);
  };

  const saveExercise = async () => {
    const newWaterGoal = calculateWaterGoal(settings.weight, tempExercise);
    setSettings({ ...settings, dailyExercise: tempExercise, waterGoal: newWaterGoal.toString() });
    setExerciseModalVisible(false);
    try {
      await AsyncStorage.setItem('dailyExercise', tempExercise);
      await AsyncStorage.setItem('waterGoal', newWaterGoal.toString());
      console.log('Exercise and water goal saved');
    } catch (error) {
      console.log('Error saving exercise and water goal', error);
    }
  };

  const openClimateModal = () => {
    setTempClimate(settings.climate);
    setClimateModalVisible(true);
  };

  const saveClimate = async () => {
    setSettings({ ...settings, climate: tempClimate });
    setClimateModalVisible(false);
    try {
      await AsyncStorage.setItem('climate', tempClimate);
      console.log('Climate saved');
    } catch (error) {
      console.log('Error saving climate', error);
    }
  };

  const calculateWaterGoal = (weight, exercise) => {
    const waterGoal = Math.round(Number(weight) * 0.5 + ((Number(exercise) / 30) * 12));
    return waterGoal;
  };

  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigation.navigate('WeightQuiz'); // Replace 'WeightQuiz' with the actual screen name
    } catch (error) {
      console.log('Error signing out:', error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView style={styles.container}>
        {/* Water Goal Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hydration Goal</Text>
          <View style={styles.waterGoalContainer}>
          <Icon name="water-outline" size={24} color="#0072ff" style={styles.waterIcon} />
            <Text style={styles.waterGoalValue}>{settings.waterGoal}</Text>
            <Text style={styles.waterGoalUnit}>oz</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          {/* Weight Section */}
          <TouchableOpacity style={styles.row} onPress={openWeightModal}>
            <View style={[styles.rowIcon, { backgroundColor: '#A0B201' }]}>
              <FeatherIcon name="smile" size={20} color="#fff" />
            </View>
            <Text style={styles.rowLabel}>Weight</Text>
            <Text style={{ marginRight: 8 }}>{settings.weight || 'Set weight'}</Text>
            <Text style={styles.lbText}>lbs</Text>
            <FeatherIcon name="chevron-right" size={20} color="#C6C6C6" />
          </TouchableOpacity>

          {/* Weight Edit Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={isWeightModalVisible}
            onRequestClose={() => {
              setWeightModalVisible(!isWeightModalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Edit Weight</Text>
                <TextInput
                  style={styles.modalInput}
                  onChangeText={setTempWeight}
                  value={tempWeight}
                  keyboardType="numeric"
                />
                <Button title="Save" onPress={saveWeight} />
              </View>
            </View>
          </Modal>

          {/* Gender Section */}
          <TouchableOpacity style={styles.row} onPress={openGenderModal}>
            <View style={[styles.rowIcon, { backgroundColor: '#FF69B4' }]}>
              <Icon name="male-female-outline" size={20} color="#fff" />
            </View>
            <Text style={styles.rowLabel}>Gender</Text>
            <Text style={{ marginRight: 8 }}>{settings.gender}</Text>
            <FeatherIcon name="chevron-right" size={20} color="#C6C6C6" />
          </TouchableOpacity>

          {/* Gender Edit Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={isGenderModalVisible}
            onRequestClose={() => {
              setGenderModalVisible(!isGenderModalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Select Gender</Text>
                <TouchableOpacity onPress={() => setTempGender('male')}>
                  <Text style={[styles.modalButton, tempGender === 'male' && styles.selectedOption]}>Male</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setTempGender('female')}>
                  <Text style={[styles.modalButton, tempGender === 'female' && styles.selectedOption]}>Female</Text>
                </TouchableOpacity>
                <Button title="Save" onPress={saveGender} />
              </View>
            </View>
          </Modal>
        </View>

        <TouchableOpacity style={styles.row} onPress={openExerciseModal}>
          <View style={[styles.rowIcon, { backgroundColor: '#FF1111' }]}>
            <Icon name="bicycle-outline" size={20} color="#fff" />
          </View>
          <Text style={styles.rowLabel}>Activity Level</Text>
          <Text style={{ marginRight: 8 }}>{settings.dailyExercise}</Text>
          <Text style={{ marginRight: 8 }}>minutes</Text>
          <FeatherIcon name="chevron-right" size={20} color="#C6C6C6" />
        </TouchableOpacity>

        {/* Exercise Edit Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isExerciseModalVisible}
          onRequestClose={() => {
            setExerciseModalVisible(!isExerciseModalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Edit Daily Exercise</Text>
              <TextInput
                style={styles.modalInput}
                onChangeText={setTempExercise}
                value={tempExercise}
                keyboardType="numeric"
              />
              <Button title="Save" onPress={saveExercise} />
            </View>
          </View>
        </Modal>

        <TouchableOpacity style={styles.row} onPress={openClimateModal}>
          <View style={[styles.rowIcon, { backgroundColor: '#303030' }]}>
            <Icon name="thunderstorm-outline" size={20} color="#fff" />
          </View>
          <Text style={styles.rowLabel}>Weather</Text>
          <Text style={{ marginRight: 8 }}>{settings.climate}</Text>
          <FeatherIcon name="chevron-right" size={20} color="#C6C6C6" />
        </TouchableOpacity>

        {/* Climate Edit Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isClimateModalVisible}
          onRequestClose={() => {
            setClimateModalVisible(!isClimateModalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Select Climate</Text>
              <TouchableOpacity onPress={() => setTempClimate('mild')}>
                <Text style={[styles.modalButton, tempClimate === 'mild' && styles.selectedOption]}>Mild</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setTempClimate('hot')}>
                <Text style={[styles.modalButton, tempClimate === 'hot' && styles.selectedOption]}>Hot</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setTempClimate('cold')}>
                <Text style={[styles.modalButton, tempClimate === 'cold' && styles.selectedOption]}>Cold</Text>
              </TouchableOpacity>
              <Button title="Save" onPress={saveClimate} />
            </View>
          </View>
        </Modal>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  section: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#414d63',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 12,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowLabel: {
    flex: 1,
    fontSize: 16,
    color: '#0c0c0c',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalInput: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 5,
    marginBottom: 5,
    width: 100,
    textAlign: 'center',
  },
  selectedOption: {
    borderColor: '#007bff',
    backgroundColor: '#007bff',
    color: '#fff',
  },
  waterGoalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 12,
  },
  waterGoalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 8,
  },
  waterGoalUnit: {
    fontSize: 16,
    color: '#0c0c0c',
  },
  logoutButton: {
    backgroundColor: '#ff6347',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 32,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SettingsPage;