import React from 'react';
import { View, SafeAreaView } from 'react-native';
import TaskList from './screens/TaskList';

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TaskList />
    </SafeAreaView>
  );
}
export default App;