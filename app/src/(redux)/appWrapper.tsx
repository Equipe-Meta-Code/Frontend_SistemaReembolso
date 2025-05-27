import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createStackNavigator } from "@react-navigation/stack";
import { loadUser, selectIsAuthenticated } from "./authSlice";
import { AppDispatch } from "./store";
import { View, ActivityIndicator } from "react-native";

// Telas
import Home from "../pages/home/Home";
import Profile from "../pages/perfil/Perfil";
import Login from "../pages/login/Login";
import BottomRoutes from "../routes/bottom.routes";
import Cadastro from "../pages/Cadastro/Cadastro";
import Intro from "../pages/Intro/Intro";
import PreRegistro from "../pages/PreRegistro/PreRegistro";
import guiaDoUsuario from "../pages/guiaDoUsuario/guiaDoUsuario";   
import RecuperacaoSenha from "../pages/RecuperacaoSenha/RecuperacaoSenha";   
import VerificarCodigo from "../pages/RecuperacaoSenha/VerificarCodigo";
import NovaSenha from "../pages/RecuperacaoSenha/NovaSenha";  
import Verificacao2FA from "../pages/login/Verificacao2FA";
import { themas } from "../global/themes";
import Notificacao from "../pages/notificacao/Notificacao";

// Define os params de cada screen do Stack
type RootStackParamList = {
  Login: undefined;
  Cadastro: undefined;
  Verificacao2FA: { email: string };
  BottomRoutes: undefined;
  Intro: undefined;
  PreRegistro: undefined;
  guiaDoUsuario: undefined;
  RecuperacaoSenha: undefined;
  VerificarCodigo: { email: string };
  NovaSenha: { email: string }; // Passa o email para verificar o código
  Notificacao: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function AppWrapper() {
    const dispatch = useDispatch<AppDispatch>();
    const [loading, setLoading] = useState(true);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    useEffect(() => {
        // dispatch retorna promise graças ao createAsyncThunk e AppDispatch tipado
        dispatch(loadUser()).finally(() => setLoading(false));
    }, [dispatch]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color={themas.colors.azul_escuro} />
            </View>
        );
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!isAuthenticated ? (
                <>  
                    <Stack.Screen name="Intro" component={Intro} />
                    <Stack.Screen name="PreRegistro" component={PreRegistro} />
                    <Stack.Screen name="Login" component={Login} />
                    <Stack.Screen name="Cadastro" component={Cadastro} />
                    <Stack.Screen name= "RecuperacaoSenha" component={RecuperacaoSenha} />
                    <Stack.Screen name="VerificarCodigo" component={VerificarCodigo} />
                    <Stack.Screen name="NovaSenha" component={NovaSenha} />


                    <Stack.Screen name="Verificacao2FA" component={Verificacao2FA} />
                </>
            ) : (
                <>
                    <Stack.Screen name="BottomRoutes" component={BottomRoutes} />
                    <Stack.Screen name="guiaDoUsuario" component={guiaDoUsuario} />
                    <Stack.Screen name="Notificacao" component={Notificacao} />
                </>
            )}
        </Stack.Navigator>
    );
}

export default AppWrapper;