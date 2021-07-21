import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import 'moment/locale/pt-br';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { server, showError } from '../common';

import todayImage from '../../assets/imgs/today.jpg';
import tomorrowImage from '../../assets/imgs/tomorrow.jpg';
import weekImage from '../../assets/imgs/week.jpg';
import monthImage from '../../assets/imgs/month.jpg';
import globalStyles from '../styles';
import Task from '../components/Task';
import AddTask from './AddTask';

const TaskList = ({ title, daysAhead, navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [showDone, setShowDone] = useState(true);
  const [visibleTasks, setVisibletasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDone = async (id) => {
    try {
      await axios.put(`${server}/tasks/${id}/toggle`);
      handleRequestFromServer();
    } catch (error) {
      showError(error);
    }
  }
  const handleShowDone = () => {
    setShowDone(!showDone);
  }

  const filterTasks = () => {
    let visibleTasks = null;
    if (showDone) {
      visibleTasks = [...tasks];
    } else {
      const isPending = task => task.doneAt == null;
      visibleTasks = tasks.filter(isPending);
    }
    setVisibletasks(visibleTasks);
    handleSaveToStorage();
  }

  const handleSaveToStorage = async () => {
    await AsyncStorage.getItem('showDone');
    try {
      await AsyncStorage.setItem('showDone', JSON.stringify(showDone));
    } catch (error) {
      console.warn(error);
    }
  }
  const handleLoadFromStorage = async () => {
    try {
      const newShowDone = JSON.parse(await AsyncStorage.getItem('showDone'));
      setShowDone(newShowDone);
    } catch (error) {
    }
  }

  const handleAdd = async ({ desc, date }) => {
    if (!desc || !desc.trim()) {
      Alert.alert('Dados Inválidos', 'Descrição não informada');
      return;
    }

    try {
      await axios.post(`${server}/tasks`, {
        desc,
        estimateAt: date,
      });

      setIsModalOpen(false);
      handleRequestFromServer();
    } catch (error) {
      showError(error);
    }

  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${server}/tasks/${id}`)
      handleRequestFromServer();
    } catch (error) {
      showError(error);
    }
  }

  const handleRequestFromServer = async () => {
    try {
      const maxDate = moment().add({ days: daysAhead }).format('YYYY-MM-DD 23:59:59');
      const res = await axios.get(`${server}/tasks?date=${maxDate}`);
      setTasks(res.data);
    } catch (error) {
      showError(error);
    }
  }

  const getImage = () => {
    switch (daysAhead) {
      case 0: return todayImage
      case 1: return tomorrowImage
      case 7: return weekImage
      default: return monthImage
    }
  }
  const getColor = () => {
    switch (daysAhead) {
      case 0: return globalStyles.colors.today
      case 1: return globalStyles.colors.tomorrow
      case 7: return globalStyles.colors.week
      default: return globalStyles.colors.month
    }
  }

  useEffect(() => {
    filterTasks();
  }, [showDone, tasks]);

  useEffect(() => {
    handleLoadFromStorage();
    handleRequestFromServer();
    return () => {
      handleSaveToStorage();
    }
  }, []);

  const today = moment().locale('pt-br').format('ddd, D [de] MMMM');
  return (
    <View style={styles.container}>
      <AddTask
        isVisible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSave={handleAdd}
      />
      <ImageBackground source={getImage()} style={styles.background}>
        <View style={styles.iconBar}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Icon name='bars' color={globalStyles.colors.secondary} size={20} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShowDone}>
            <Icon name={showDone ? 'eye' : 'eye-slash'} color={globalStyles.colors.secondary} size={20} />
          </TouchableOpacity>
        </View>
        <View style={styles.titleBar}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{today}</Text>
        </View>
      </ImageBackground>
      <View style={styles.taskContainer}>
        <FlatList
          data={visibleTasks}
          keyExtractor={item => `${item.id}`}
          renderItem={({ item }) => {
            return <Task {...item} onToggle={handleDone} onDelete={handleDelete} />
          }} />
      </View>
      <TouchableOpacity activeOpacity={0.7} style={[styles.addButton, { backgroundColor: getColor() }]} onPress={() => setIsModalOpen(true)}>
        <Icon name="plus" size={20} color={globalStyles.colors.secondary} />
      </TouchableOpacity>
    </View >
  );
}
export default TaskList;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  background: {
    flex: 4
  },
  taskContainer: {
    flex: 6
  },
  titleBar: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  title: {
    fontFamily: globalStyles.fontFamily,
    color: globalStyles.colors.secondary,
    fontSize: 50,
    marginLeft: 20,
    marginBottom: 20
  },
  subtitle: {
    fontFamily: globalStyles.fontFamily,
    color: globalStyles.colors.secondary,
    fontSize: 20,
    marginLeft: 20,
    marginBottom: 30
  },
  iconBar: {
    flexDirection: 'row',
    marginHorizontal: 20,
    justifyContent: 'space-between',
    marginTop: 20
  },
  addButton: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center'
  }

})