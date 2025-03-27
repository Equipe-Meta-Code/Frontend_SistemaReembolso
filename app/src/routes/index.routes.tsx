import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../pages/login/Login";
import Cadastro from "../pages/Cadastro/Cadastro";
import BottomRoutes from "./bottom.routes";
import Home from "../pages/home/Home";

export default function Routes(){
    const Stack = createStackNavigator()

    return (
        <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
                headerShown:false,
                cardStyle:{
                    backgroundColor:"#FFF",
                }
            }}
        >

            <Stack.Screen
                name="Login"
                component={Login}
            />
            <Stack.Screen   
                name="Cadastro"
                component={Cadastro}
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