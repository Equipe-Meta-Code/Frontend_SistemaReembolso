import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../pages/login/Login";
import BottomRoutes from "./bottom.routes";
import Home from "../pages/home/Home";
import RegistroDespesa from "../pages/registroDespesa/RegistroDespesa";

export default function Routes(){
    const Stack = createStackNavigator()

    return (
        <Stack.Navigator
            initialRouteName="BottomRoutes"
            screenOptions={{
                headerShown:false,
                cardStyle:{
                    backgroundColor:themas.colors.secondary,
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