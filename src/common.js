import { Alert, Platform } from 'react-native';

const server = Platform.OS === 'ios'
  ? 'http://localhost:3000' : 'http://192.168.3.10:3000';

const showError = (err) => {
  if (err.response && err.response.data) {
    Alert.alert('Bah, deu ruim!', `Mensagem: ${err.response.data}`);
  } else {
    Alert.alert('Bah, deu ruim!', `Mensagem: erro desconhecido`);
  }
}
const showSuccess = (msg) => {
  Alert.alert('Tudo certo!', msg);
}

export { server, showError, showSuccess }