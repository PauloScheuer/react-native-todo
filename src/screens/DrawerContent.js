import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList, createDrawerNavigator, DrawerItem } from '@react-navigation/drawer';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import globalStyles from '../styles';
import { TouchableOpacity } from 'react-native-gesture-handler';

const DrawerContent = (props) => {

  const handleLogout = async () => {
    delete axios.defaults.headers.common['Authorization'];
    await AsyncStorage.removeItem('userData');
    props.navigation.navigate('AuthOrApp');
  }

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.content}>
          <Text style={styles.title}>To do</Text>
          <Text style={styles.name}>{props.name}</Text>
          <Text style={styles.email}>{props.email}</Text>
        </View>
        <DrawerItemList {...props} />
        <TouchableOpacity onPress={handleLogout}>
          <View style={styles.logout}>
            <Icon name="sign-out" size={30} color="#800" />
          </View>
        </TouchableOpacity>
      </DrawerContentScrollView>
    </View>
  );
}
export default DrawerContent;

const styles = StyleSheet.create({
  content: {
    marginLeft: 10,
    marginBottom: 10
  },
  title: {
    fontFamily: globalStyles.fontFamily,
    fontSize: 32,
    marginBottom: 4
  },
  name: {
    fontFamily: globalStyles.fontFamily,
    fontSize: 24,
    marginBottom: 4
  },
  email: {
    fontFamily: globalStyles.fontFamily,
    fontSize: 16,
    marginLeft: 4,
  },
  logout: {
    marginLeft: 10,
    marginBottom: 10
  }
});