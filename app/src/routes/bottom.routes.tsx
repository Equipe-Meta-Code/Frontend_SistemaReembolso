import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import Home from '../pages/home/Home';
import Historico from "../pages/historico/Historico";
import Perfil from "../pages/perfil/Perfil";
import CustomTabBar from '../components/customTabBar';
import RegistroDespesa from '../pages/registroDespesa/RegistroDespesa';

const Tab = createBottomTabNavigator();

export default function BottomRoutes() {
  return (
    <Tab.Navigator
        screenOptions={{
        headerShown:false,
        }}
        tabBar={pros=><CustomTabBar {...pros} />}
    >
        
        <Tab.Screen 
            name="Home" 
            component={Home}
        />
        <Tab.Screen 
            name="Registrar" 
            component={RegistroDespesa}
        />
        <Tab.Screen 
            name="Historico" 
            component={Historico}
        />
        <Tab.Screen 
            name="Perfil" 
            component={Perfil}
        />

    </Tab.Navigator>
  )
};