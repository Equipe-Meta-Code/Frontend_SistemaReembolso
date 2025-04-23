import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createStackNavigator } from "@react-navigation/stack";
import { View, ActivityIndicator } from "react-native";
import { loadUser } from "./authSlice";
import { AppDispatch } from "./store";
import Home from "../pages/home/Home";
import Profile from "../pages/perfil/Perfil";
import Login from "../pages/login/Login";
import Cadastro from "../pages/Cadastro/Cadastro";
import BottomRoutes from "../routes/bottom.routes";

const Stack = createStackNavigator();

function AppWrapper() {
    const dispatch = useDispatch<AppDispatch>();
    const [loading, setLoading] = useState(true); // Estado para controlar o loading

    useEffect(() => {
        const init = async () => {
            await dispatch(loadUser());
            setLoading(false);
        };

        init();
    }, [dispatch]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#2A2F4F" />
            </View>
        );
    }

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Login"
                component={Login}
                options={{ title: "Login", headerShown: false }}
            />
            <Stack.Screen
                name="Cadastro"
                component={Cadastro}
                options={{ title: "Cadastro", headerShown: false }}
            />
            <Stack.Screen
                name="Home"
                component={Home}
                options={{ title: "Home", headerShown: false }}
            />
            <Stack.Screen
                name="Profile"
                component={Profile}
                options={{ title: "Profile" }}
            />
            <Stack.Screen
                name="BottomRoutes"
                component={BottomRoutes}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

export default AppWrapper;