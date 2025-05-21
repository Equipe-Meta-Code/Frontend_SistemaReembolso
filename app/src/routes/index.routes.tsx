import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../pages/login/Login";
import BottomRoutes from "./bottom.routes";
import Home from "../pages/home/Home";
import RegistroDespesa from "../pages/registroDespesa/RegistroDespesa";
import { useTheme } from '../context/ThemeContext';


export default function Routes(){
    const Stack = createStackNavigator()
    const { theme } = useTheme();
    
    return (
        <Stack.Navigator
            initialRouteName="BottomRoutes"
            screenOptions={{
                headerShown:false,
                cardStyle:{
                    backgroundColor:theme.colors.secondary,
                }
            }}
        >

            <Stack.Screen
                name="Login"
                component={Login}
            />
            <Stack.Screen   
                name="Despesa"
                component={RegistroDespesa}
            />
            <Stack.Screen   
                name="Home"
                component={Home}
            />
            <Stack.Screen
                name="BottomRoutes"
                component={BottomRoutes}
            />

        </Stack.Navigator>

    )
}