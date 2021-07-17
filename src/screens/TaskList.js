import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import 'moment/locale/pt-br';
import Icon from 'react-native-vector-icons/FontAwesome';

import todayImage from '../../assets/imgs/today.jpg';
import globalStyles from '../styles';
import Task from '../components/Task';
import AddTask from './AddTask';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [showDone, setShowDone] = useState(true);
  const [visibleTasks, setVisibletasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDone = (id) => {
    const newTasks = [...tasks];
    newTasks.forEach(task => {
      if (task.id === id) {
        task.doneAt = task.doneAt ? null : new Date();
      }
    });
    setTasks(newTasks);
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
    await AsyncStorage.getItem('tasks');
    await AsyncStorage.getItem('visibleTasks');
    await AsyncStorage.getItem('showDone');
    await AsyncStorage.getItem('isModalOpen');
    console.warn('saving');
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
      await AsyncStorage.setItem('visibleTasks', JSON.stringify(visibleTasks));
      await AsyncStorage.setItem('showDone', JSON.stringify(showDone));
      await AsyncStorage.setItem('isModalOpen', JSON.stringify(isModalOpen));
    } catch (error) {
      console.warn('error');
    }
  }
  const handleLoadFromStorage = async () => {
    console.warn('loading')
    try {
      const newTasks = JSON.parse(await AsyncStorage.getItem('tasks'));
      const newVisibleTasks = JSON.parse(await AsyncStorage.getItem('visibleTasks'));
      const newShowDone = JSON.parse(await AsyncStorage.getItem('showDone'));
      const newIsModalOpen = JSON.parse(await AsyncStorage.getItem('isModalOpen'));
      setTasks(newTasks);
      setVisibletasks(newVisibleTasks);
      setShowDone(newShowDone);
      setIsModalOpen(newIsModalOpen);
    } catch (error) {
      console.warn('error');
    }
  }

  const handleAdd = (newTask) => {
    if (!newTask.desc || !newTask.desc.trim()) {
      Alert.alert('Dados Inválidos', 'Descrição não informada');
      return;
    }

    const newTasks = [...tasks];
    newTasks.push({
      id: Math.random(),
      desc: newTask.desc,
      estimateAt: newTask.date
    });

    setTasks(newTasks);
    setIsModalOpen(false);
  }

  const handleDelete = (id) => {
    const newTasks = tasks.filter(task => task.id !== id);
    setTasks(newTasks);
  }

  useEffect(() => {
    filterTasks();
  }, [showDone, tasks]);

  useEffect(() => {
    handleLoadFromStorage();
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
      <ImageBackground source={todayImage} style={styles.background}>
        <View style={styles.iconBar}>
          <TouchableOpacity onPress={handleShowDone}>
            <Icon name={showDone ? 'eye' : 'eye-slash'} color={globalStyles.colors.secondary} size={20} />
          </TouchableOpacity>
        </View>
        <View style={styles.titleBar}>
          <Text style={styles.title}>Hoje</Text>
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
      <TouchableOpacity activeOpacity={0.7} style={styles.addButton} onPress={() => setIsModalOpen(true)}>
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
    flex: 3
  },
  taskContainer: {
    flex: 7
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
    justifyContent: 'flex-end',
    marginTop: 10
  },
  addButton: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: globalStyles.colors.today,
    justifyContent: 'center',
    alignItems: 'center'
  }

})