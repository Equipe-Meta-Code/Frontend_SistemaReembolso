import React, { useState, useEffect } from "react";
import { createStyles } from "./styles";
import { useTheme } from '../../context/ThemeContext';
import { Text, View, Image, Alert, ActivityIndicator, 
    TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard, Platform, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import { useDispatch, useSelector } from "react-redux";
import { loginUserAction } from "../../(redux)/authSlice";
import api from "../../services/api";
import { Input } from "../../components/Input/index"
import { ButtonCustom } from "../../components/customButton";
import { Divider } from "react-native-paper";

export default function Login() {
    const { theme } = useTheme();
    const style = createStyles (theme);
    const navigation = useNavigation<NavigationProp<any>>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [emailValido, setEmailValido] = useState(true);
    const [formInvalido, setFormInvalido] = useState(false);

    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.auth.user);

    useEffect(() => {
        if (user) {
            console.log("Usuário logado:", user.email);
        } else {
            console.log("Nenhum usuário logado.");
        }
    }, [user]);

    function validarEmail(texto: string) {
        setEmail(texto);
        const regex = /\S+@\S+\.\S+/;
        setEmailValido(regex.test(texto));
    }

    async function getLogin() {
        if (!email || !password || !emailValido) {
            setFormInvalido(true);
            return Alert.alert('Atenção', 'Preencha todos os campos corretamente!');
        }

        setFormInvalido(false);
        setLoading(true);

        try {
            const response = await api.post('/login', { email, password });
            const data = response.data;

            if (data.twoFactorEnabled) {
                navigation.navigate("Verificacao2FA", {
                    email: data.email,
                    userId: data.userId
            });
            } else {
                dispatch(loginUserAction(data));
            }


        } catch (error: any) {
            console.log('Erro ao logar o usuário.', error);
            const msg = error.response?.data?.mensagem || 'Não foi possível realizar o login. Tente novamente.';
            Alert.alert('Erro', msg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 0}
            >
                <View style={style.container}>
                    <View style={style.boxTop}>
                        <Text style={style.title}>Login</Text>
                        <Text style={style.description}>Faça login com seu e-mail e senha para acessar a sua conta</Text>
                    </View>

                    <View style={style.boxMid}>
                        <Text style={style.welcomeTitle}>Bem-vindo novamente 👋</Text>
                        
                        {/* Email */}
                        <Input
                            value={email}
                            onChangeText={text => {
                                if (formInvalido) setFormInvalido(false);
                                validarEmail(text);
                            }}
                            error={(formInvalido && !email) || (!emailValido && !!email)}
                            title="Email"
                            iconRightName="email"
                            IconRigth={MaterialIcons}
                            placeholder="Digite seu e-mail"
                            placeholderTextColor={theme.colors.cinza}

                        />
                        {/* Senha */}
                        <Input
                            value={password}
                            onChangeText={(text) => {
                                if (formInvalido) setFormInvalido(false);
                                setPassword(text);
                            }}
                            error={formInvalido && !password}
                            title="Senha"
                            secureTextEntry={!showPassword}
                            iconRightName={showPassword ? "visibility-off" : "visibility"}
                            IconRigth={MaterialIcons}
                            onIconRigthPress={() => setShowPassword(!showPassword)}
                            placeholder="Digite sua senha"
                            placeholderTextColor={theme.colors.cinza}
                        />

                        <TouchableOpacity onPress={() => navigation.navigate('RecuperacaoSenha')}>
                        <Text style={style.forgotPassword}>Esqueceu a senha?</Text>
                        </TouchableOpacity>

                        <ButtonCustom
                            title="Login"
                            onPress={() => getLogin()}
                            loading={loading}
                        />

                        {/* Texto "Ainda não possuo uma conta" no meio da linha */}
                        <View style={style.lineContainer}>
                            <Text style={style.noAccountText}>Ainda não possuo uma conta</Text>
                        </View>

                        {/* Botão "Cadastre-se" */}
                        <ButtonCustom
                            title="Cadastre-se"
                            onPress={() => navigation.navigate("Cadastro")}
                        />

                    </View>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}