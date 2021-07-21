import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const AuthOrApp = ({ navigation }) => {
  useFocusEffect(
    React.useCallback(() => {
      const getUserDataJson = async () => {
        const userDataJson = await AsyncStorage.getItem('userData');
        const userData = JSON.parse(userDataJson);
        if (userData && userData.token) {
          axios.defaults.headers.common['Authorization'] = `bearer ${userData.token}`
          navigation.navigate('Home', userData);
        } else {
          navigation.navigate('Auth', userData);
        }
      }
      getUserDataJson();
    }, [])
  )
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#800" />
    </View>
  );
}
export default AuthOrApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000'
  }
});