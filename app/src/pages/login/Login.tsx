import React, { useState } from "react";
import { style } from "./styles";
import { Text, View, Image, Alert, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';

export default function Login() {
    const navigation = useNavigation<NavigationProp<any>>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); 

    async function getLogin() {
        try {
            setLoading(true);
            if (!email || !password) {
                return Alert.alert('Atenção', 'Informe os campos obrigatórios!');
            }

            setTimeout(() => {
                if (email == 'admin@gmail' && password == '123456') {
                    Alert.alert('Logado com sucesso');
                    navigation.navigate('Home');
                } else {
                    Alert.alert('Usuário não foi encontrado');
                }

                setLoading(false);
            }, 3000);

        } catch (error) {
            console.log(error);
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
                    <Text style={style.inputTitle}>Email</Text>
                    <TextInput
                        style={style.input}
                        placeholder="Digite seu e-mail"
                        placeholderTextColor="gray"
                        value={email}
                        onChangeText={setEmail}
                    />

                    {/* Senha */}
                    <Text style={style.inputTitle}>Senha</Text>
                    <View style={style.passwordContainer}>
                        <TextInput
                            style={style.input}
                            placeholder="Digite sua senha"
                            placeholderTextColor="gray"
                            secureTextEntry={!showPassword} 
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)} 
                        >
                            <MaterialIcons
                                name={showPassword ? "visibility-off" : "visibility"} 
                                size={24}
                                color="#888" 
                                style={style.eyeIcon}
                            />
                        </TouchableOpacity>
                    </View>

                    <Text style={style.forgotPassword}>Esqueceu a senha?</Text>

                    <TouchableOpacity style={style.loginButton} onPress={() => getLogin()}>
                        {
                            loading ? 
                                <ActivityIndicator color={'white'} size={"small"} /> : <Text style={style.loginButtonText}>Login</Text>
                        }
                    </TouchableOpacity>
                                        {/* Texto "Ainda não possuo uma conta" no meio da linha */}
                                        <View style={style.lineContainer}>
                        <Text style={style.noAccountText}>Ainda não possuo uma conta</Text>
                    </View>

                    {/* Botão "Cadastre-se" */}
                    <TouchableOpacity style={style.signupButton} onPress={() => navigation.navigate("Cadastro")}>
                        <Text style={style.signupButtonText}>Cadastre-se</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}
