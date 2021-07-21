import React, { useState } from 'react';
import { View, TouchableOpacity, ImageBackground, Text, StyleSheet, Alert } from 'react-native';

import backgroundImage from '../../assets/imgs/login.jpg'
import globalStyle from '../styles';
import AuthInput from '../components/AuthInput';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import { server, showError, showSuccess } from '../common';

const Auth = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [stageNew, setStageNew] = useState(false);

  const validations = [];
  validations.push(email && email.includes('@'));
  validations.push(password && password.length >= 6);

  if (stageNew) {
    validations.push(name && name.trim().length >= 3);
    validations.push(confirmPassword);
    validations.push(password === confirmPassword);
  }

  const isValidForm = validations.reduce((t, a) => t && a);

  const handleSign = () => {
    if (stageNew) {
      handleSignUp();
    } else {
      handleSignIn();
    }
  }

  const handleSignUp = async () => {
    try {
      await axios.post(`${server}/signup`, {
        name: name,
        email: email,
        password: password,
        confirmPassword: confirmPassword
      });

      showSuccess('Usuário cadastrado.');
      setStageNew(false);
      handleCleanState();
    } catch (err) {
      showError(err);
    }
  }
  const handleSignIn = async () => {
    try {
      const res = await axios.post(`${server}/signin`, {
        email: email,
        password: password,
      });

      axios.defaults.headers.common['Authorization'] = `bearer ${res.data.token}`
      AsyncStorage.setItem('userData', JSON.stringify(res.data));
      navigation.navigate('Home', JSON.stringify(res.data));
    } catch (error) {
      showError(error);
    }
  }

  const handleCleanState = () => {
    setEmail('');
    setName('');
    setPassword('');
    setConfirmPassword('');
    setStageNew(false);
  }

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <Text style={styles.title}>To do</Text>
      <Text style={styles.subTitle}>{stageNew ? 'Crie sua conta' : 'Informe seus dados'}</Text>
      <View style={styles.form}>
        {stageNew && (
          <AuthInput
            icon='user'
            placeholder="Nome"
            value={name}
            onChangeText={text => setName(text)}
            style={styles.input}
          />
        )}
        <AuthInput
          icon='at'
          placeholder="E-mail"
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.input}
        />
        <AuthInput
          icon='lock'
          placeholder="Senha"
          secureTextEntry={true}
          value={password}
          onChangeText={text => setPassword(text)}
          style={styles.input}
        />
        {stageNew && (
          <AuthInput
            icon='lock'
            placeholder="Confirme a senha"
            secureTextEntry={true}
            value={confirmPassword}
            onChangeText={text => setConfirmPassword(text)}
            style={styles.input}
          />
        )}
        <TouchableOpacity onPress={handleSign} disabled={!isValidForm}>
          <View style={[styles.button, !isValidForm && { backgroundColor: '#aaa' }]}>
            <Text style={styles.buttonText}>
              {stageNew ? 'Cadastrar' : 'Entrar'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={{ padding: 10 }} onPress={() => { setStageNew(!stageNew); }}>
        <Text style={styles.buttonText}>
          {stageNew ? 'Já possui conta?' : 'Ainda não possui conta?'}
        </Text>
      </TouchableOpacity>
    </ImageBackground >
  );
}
export default Auth;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontFamily: globalStyle.fontFamily,
    color: globalStyle.colors.secondary,
    fontSize: 70,
    marginBottom: 10
  },
  subTitle: {
    fontFamily: globalStyle.fontFamily,
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10
  },
  form: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 20,
    width: '90%'
  },
  input: {
    marginTop: 10,
    backgroundColor: '#fff'
  },
  button: {
    backgroundColor: '#080',
    marginTop: 10,
    padding: 10,
    alignItems: 'center',
    borderRadius: 7
  },
  buttonText: {
    fontFamily: globalStyle.fontFamily,
    color: '#fff',
    fontSize: 16
  },
})