import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import Home from "../pages/home/Home";
import Historico from "../pages/historico";
import Perfil from "../pages/perfil/Perfil";
import RegistroDespesa from "../pages/registroDespesa/RegistroDespesa";
import CustomTabBar from "../components/customTabBar";

const Tab = createBottomTabNavigator();

export default function BottomRoutes() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { position: "absolute", bottom: 0, height: 60 },
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Registrar" component={RegistroDespesa} />
      <Tab.Screen name="Historico" component={Historico} />
      <Tab.Screen name="Perfil" component={Perfil} />
    </Tab.Navigator>
  );
}
