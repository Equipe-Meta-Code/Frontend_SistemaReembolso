import './gesture-handler';
import React from 'react';
import { StyleSheet } from 'react-native';

/* import Routes from './src/routes/index.routes'; */
import { NavigationContainer } from '@react-navigation/native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { store } from './src/(redux)/store';
import { Provider } from 'react-redux';
import AppWrapper from './src/(redux)/appWrapper';

export default function App() {
  return (
    <Provider store={store}>
      <ActionSheetProvider>

        <NavigationContainer>
          <AppWrapper />
        </NavigationContainer>
      </ActionSheetProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({

});