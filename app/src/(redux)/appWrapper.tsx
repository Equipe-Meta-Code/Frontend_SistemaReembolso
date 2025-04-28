import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createStackNavigator } from "@react-navigation/stack";
import { loadUser } from "./authSlice"; // Ação para carregar o usuário
import { View, ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "./authSlice";

// Telas
import Home from "../pages/home/Home";
import Profile from "../pages/perfil/Perfil";
import Login from "../pages/login/Login";
import BottomRoutes from "../routes/bottom.routes"; // Importando o Bottom Tab Navigator

import { AppDispatch } from "./store";
import Cadastro from "../pages/Cadastro/Cadastro";

const Stack = createStackNavigator();

function AppWrapper() {
    const dispatch = useDispatch<AppDispatch>(); // Tipar o dispatch com AppDispatch
    const [loading, setLoading] = useState(true);
    const isAuthenticated = useSelector(selectIsAuthenticated);

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
        <Stack.Navigator
            initialRouteName={isAuthenticated ? "BottomRoutes" : "Login"}
            screenOptions={{ headerShown: false }}
        >
            {!isAuthenticated ? (
                <>
                    {/* Tela de Login */}
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
                </>
            ) : (
                <>
                    {/* Tela de Home (Possivelmente a tela inicial após login) */}
                    <Stack.Screen
                        name="Home"
                        component={Home}
                        options={{ title: "Home", headerShown: false }}
                    />
                    {/* Tela de Profile */}
                    <Stack.Screen
                        name="Profile"
                        component={Profile}
                        options={{ title: "Profile" }}
                    />
                    {/* Rota para o BottomRoutes, que é a navegação principal após login */}
                    <Stack.Screen
                        name="BottomRoutes"
                        component={BottomRoutes}
                        options={{ headerShown: false }} // Esconde o cabeçalho para as telas de Bottom Tab Navigator
                    />
                </>
            )}
        </Stack.Navigator>
    );
};

export default AppWrapper;