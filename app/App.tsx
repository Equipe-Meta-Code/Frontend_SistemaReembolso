import React from 'react';
import { StatusBar } from 'expo-status-bar';
import Home from './src/pages/home/Home';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Historico from './src/pages/historico/Historico';
import RegistroDespesa from './src/pages/registroDespesa/RegistroDespesa';
import Perfil from './src/pages/perfil/Perfil';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="RegistroDespesa" component={RegistroDespesa} />
        <Stack.Screen name="Historico" component={Historico} />
        <Stack.Screen name="Perfil" component={Perfil} />
        {/* Adicionar rota para página do projeto*/}
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
