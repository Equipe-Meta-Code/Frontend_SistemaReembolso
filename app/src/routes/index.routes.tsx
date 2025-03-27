import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../pages/login/Login";
import BottomRoutes from "./bottom.routes";

export default function Routes(){
    const Stack = createStackNavigator()

    return (
        <Stack.Navigator initialRouteName="BottomRoutes" 
        screenOptions={{
            headerShown: false, 
            cardStyle: {
                backgroundColor: "#FFF",
            },
        }}>
            <Stack.Screen name="BottomRoutes" component={BottomRoutes} />
            <Stack.Screen name="Login" component={Login} />
        </Stack.Navigator>

    )
}