import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
enableScreens(); // ✅ Chame isso logo no início!

import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { store } from './src/(redux)/store';
import { Provider } from 'react-redux';
import AppWrapper from './src/(redux)/appWrapper';
import { ThemeProvider } from './src/context/ThemeContext';

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <ActionSheetProvider>
          <NavigationContainer>
            <AppWrapper />
          </NavigationContainer>
        </ActionSheetProvider>
      </ThemeProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({});
