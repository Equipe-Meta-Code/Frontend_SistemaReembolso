import React, { useState, useEffect } from "react";
import { style } from "./styles";
import { Text, View, Image, Alert, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import { useDispatch, useSelector } from "react-redux";
import { loginUserAction } from "../../(redux)/authSlice";
import api from "../../services/api";
import{Input} from "../../components/Input/index"
import { ButtonCustom } from "../../components/customButton";

export default function Login() {
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
            const response = await api2.post('/login', { email, password });
            const user = response.data;

            dispatch(loginUserAction(user));

            setTimeout(() => {
                if (user.token) {
                    Alert.alert('Sucesso', 'Logado com sucesso!');
                    navigation.navigate('BottomRoutes');
                } else {
                    Alert.alert('Erro', 'Usuário não foi encontrado');
                }
                setLoading(false);
            }, 1500);

        } catch (error: any) {
            console.log('Erro ao logar o usuário.', error);
            const msg = error.response?.data?.mensagem || 'Não foi possível realizar o login. Tente novamente.';
            Alert.alert('Erro', msg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 0}
        >
            <View style={style.container}>
                <View style={style.boxTop}>
                    <Text style={style.title}>Login</Text>
                    <Text style={style.description}>Faça login com seu e-mail e senha para poder acessar a sua conta</Text>
                </View>

                <View style={style.boxMid}>
                    <Text style={style.welcomeTitle}>Bem-Vindo novamente👋</Text>
                    <Text style={style.instruction}>Para acessar sua conta você deve fazer o login primeiro.</Text>
                    {/* Email */}
                    <Input
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            console.log("Email digitado:", text);
                          }}
                          
                        title="Email"
                        iconRightName="email"
                        IconRigth={MaterialIcons}
                        placeholder="Digite seu e-mail"
                    />
                    {/* <Text style={style.inputTitle}>Email</Text>
                    <TextInput
                        style={[style.input, (!emailValido || (formInvalido && !email)) && style.erroInput]}
                        placeholder="Digite seu e-mail"
                        placeholderTextColor="gray"
                        value={email}
                        onChangeText={setEmail}
                    /> */}

                    {/* Senha */}
                    <Input
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            console.log("Senha digitada:", text);
                          }}
                          
                        title="Senha"
                        secureTextEntry={showPassword}
                        iconRightName={showPassword?"visibility-off":"visibility"}
                        IconRigth={MaterialIcons}
                        onIconRigthPress={() => setShowPassword(!showPassword)}
                        placeholder="Digite seu e-mail"
                    />
                    {/* <Text style={style.inputTitle}>Senha</Text>
                    <View style={style.passwordContainer}>
                        <TextInput
                            style={[style.input, (formInvalido && !password) && style.erroInput]}
                            placeholder="Digite sua senha"
                            placeholderTextColor="gray"
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <MaterialIcons
                                name={showPassword ? "visibility-off" : "visibility"}
                                size={24}
                                color="#888"
                                style={style.eyeIcon}
                            />
                        </TouchableOpacity>
                    </View> */}

                    <Text style={style.forgotPassword}>Esqueceu a senha?</Text>

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
    );
}
