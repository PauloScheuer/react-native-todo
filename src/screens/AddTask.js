import React, { useState } from 'react';
import { View, Modal, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, TextInput, Text, Platform } from 'react-native';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';

import globalStyles from '../styles';

const AddTask = ({ isVisible = false, onCancel, onSave }) => {
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const getDatePicker = () => {
    let datePicker = <DateTimePicker
      value={date}
      mode="date"
      on
      onChange={(event, d) => {
        if (event.type === 'set') {
          setDate(d)
        }
        setShowDatePicker(false);
      }}
    />

    const dateString = moment(date).format('ddd, D [de] MMMM [de] YYYY');

    if (Platform.OS === 'android') {
      datePicker = (
        <View>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Text style={styles.date}>
              {dateString}
            </Text>
          </TouchableOpacity>
          {showDatePicker && datePicker}
        </View>
      )
    }
    return datePicker;
  }

  const handleSave = () => {
    const newTask = {
      desc,
      date
    }

    onSave && onSave(newTask);
    setDesc('');
    setDate(new Date());
    setShowDatePicker(false);
  }

  return (
    <Modal transparent={true} visible={isVisible} onRequestClose={onCancel} animationType='slide'>
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.background}>
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.container}>
        <Text style={styles.header}>Nova tarefa</Text>
        <TextInput
          style={styles.input}
          placeholder="Informe a descrição"
          value={desc}
          onChangeText={(text) => setDesc(text)}
        />
        {getDatePicker()}
        <View style={styles.buttons}>
          <TouchableOpacity onPress={onCancel}>
            <Text style={styles.button}>
              Cancelar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.button}>
              Salvar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.background}>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
export default AddTask;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  container: {
    flex: 2,
    backgroundColor: '#fff'
  },
  header: {
    fontFamily: globalStyles.fontFamily,
    backgroundColor: globalStyles.colors.today,
    color: globalStyles.colors.secondary,
    textAlign: 'center',
    padding: 15,
    fontSize: 16
  },
  input: {
    fontFamily: globalStyles.fontFamily,
    width: '90%',
    height: 40,
    marginTop: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 6,
    alignSelf: 'center'
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  button: {
    margin: 20,
    marginRight: 30,
    color: globalStyles.colors.today
  },
  date: {
    fontFamily: globalStyles.fontFamily,
    fontSize: 20,
    marginLeft: 15
  }
})