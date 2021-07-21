import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Auth from '../screens/Auth';
import MenuNavigator from './MenuNavigator';
import AuthOrApp from '../screens/AuthOrApp';

const MainNavigator = createStackNavigator();

const MainRoute = () => {
  return (
    <NavigationContainer>
      <MainNavigator.Navigator initialRouteName="AuthOrApp" headerMode='none'>
        <MainNavigator.Screen name="AuthOrApp" title="AuthOrApp" component={AuthOrApp} />
        <MainNavigator.Screen name="Auth" title="Auth" component={Auth} />
        <MainNavigator.Screen name="Home" title="Tasks" component={MenuNavigator} />
      </MainNavigator.Navigator>
    </NavigationContainer>
  )
};
export default MainRoute;