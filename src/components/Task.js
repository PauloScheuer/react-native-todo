import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import moment from 'moment';
import 'moment/locale/pt-br';
import globalStyles from '../styles';

const getCheckView = (doneAt) => {
  if (doneAt != null) {
    return (
      <View style={styles.done}>
        <Icon name='check' size={20} color="#fff"></Icon>
      </View>
    )
  } else {
    return (
      <View style={styles.pending}>
      </View>
    )
  }
}
const Task = ({ id, desc, estimateAt, doneAt, onToggle, onDelete }) => {
  const doneOrNotStyle = doneAt != null ? { textDecorationLine: 'line-through' } : {}
  const date = doneAt || estimateAt;
  const formattedDate = moment(date).locale('pt-br').format('ddd, D [de] MMMM')

  const getRightContent = () => {
    return (
      <TouchableOpacity style={styles.right} onPress={() => onDelete(id)}>
        <Icon name="trash" size={20} color="#fff" />
      </TouchableOpacity>
    )
  }
  const getLeftContent = () => {
    return (
      <TouchableOpacity style={styles.left}>
        <Icon name="trash" size={20} color="#fff" style={{ marginLeft: 10 }} />
        <Text style={styles.delete}>Excluir</Text>
      </TouchableOpacity>
    )
  }

  return (
    <Swipeable
      renderRightActions={getRightContent}
      renderLeftActions={getLeftContent}
      onSwipeableLeftOpen={() => onDelete(id)}
    >
      <View style={styles.container}>
        <TouchableOpacity onPress={() => onToggle(id)} style={styles.checkContainer}>
          {getCheckView(doneAt)}
        </TouchableOpacity>
        <View>
          <Text style={[styles.desc, doneOrNotStyle]}>{desc}</Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
      </View>
    </Swipeable>
  );
}
export default Task;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderColor: '#aaa',
    borderBottomWidth: 1,
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  checkContainer: {
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  pending: {
    height: 25,
    width: 25,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#555'
  },
  done: {
    height: 25,
    width: 25,
    borderRadius: 13,
    backgroundColor: '#006400',
    alignItems: 'center',
    justifyContent: 'center'
  },
  desc: {
    fontFamily: globalStyles.fontFamily,
    color: globalStyles.colors.mainText,
    fontSize: 15
  },
  date: {
    fontFamily: globalStyles.fontFamily,
    color: globalStyles.colors.subText,
    fontSize: 12,
  },
  right: {
    backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 20
  },
  left: {
    flex: 1,
    backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
  },
  delete: {
    fontFamily: globalStyles.fontFamily,
    color: '#fff',
    fontSize: 20,
    margin: 10
  }
})