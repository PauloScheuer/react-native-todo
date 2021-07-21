import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import TaskList from '../screens/TaskList';
import { Text, StyleSheet } from 'react-native';
import DrawerContent from '../screens/DrawerContent';

const Drawer = createDrawerNavigator();

const MenuNavigator = ({ route }) => {
  return (
    <Drawer.Navigator
      drawerStyle={{
        backgroundColor: '#f3f3f3',
        paddingVertical: 20,
      }}
      drawerContent={(props) => <DrawerContent {...props} name={route.params['name']} email={route.params['email']} />}
      drawerContentOptions={{
        activeBackgroundColor: '#800',
        inactiveTintColor: '#800',
      }}>
      <Drawer.Screen
        name='Today'
        options={{
          drawerLabel: ({ focused }) => (
            <Text style={{ color: focused ? '#f3f3f3' : '#800' }}>
              Hoje
            </Text>
          ),
        }}
      >
        {(props) => <TaskList title='Hoje' daysAhead={0} {...props} />}
      </Drawer.Screen>
      <Drawer.Screen
        name='Tomorrow'
        options={{
          drawerLabel: ({ focused }) => (
            <Text style={{ color: focused ? '#f3f3f3' : '#800' }}>
              Amanhã
            </Text>
          ),
        }}
      >
        {(props) => <TaskList title='Amanhã' daysAhead={1} {...props} />}
      </Drawer.Screen>
      <Drawer.Screen
        name='Week'
        options={{
          drawerLabel: ({ focused }) => (
            <Text style={{ color: focused ? '#f3f3f3' : '#800' }}>
              Semana
            </Text>
          ),
        }}
      >
        {(props) => <TaskList title='Semana' daysAhead={7} {...props} />}
      </Drawer.Screen>
      <Drawer.Screen
        name='Month'
        options={{
          drawerLabel: ({ focused }) => (
            <Text style={{ color: focused ? '#f3f3f3' : '#800' }}>
              Mês
            </Text>
          ),
        }}
      >
        {(props) => <TaskList title='Mês' daysAhead={30} {...props} />}
      </Drawer.Screen>
    </Drawer.Navigator>
  )
}

export default MenuNavigator;

const styles = StyleSheet.create({

})