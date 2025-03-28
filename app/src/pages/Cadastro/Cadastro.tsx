import React, { useState } from "react";
import { style } from "./styles";
import { Text, View, Image, Alert, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import axios from "axios";

export default function Cadastro() {
    const navigation = useNavigation<NavigationProp<any>>();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState<string>('');
    const [passwordConfirm, setPasswordConfirm] = useState<string>('');
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    // Função para validar a senha com expressões regulares
    const validatePassword = (password: string): boolean => {
        const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]:;"'|\\,.<>\/?]).+$/;
        return regex.test(password);
    };

    async function getCadastro() {
        try {
            setLoading(true);

            // Verificar se os campos obrigatórios estão preenchidos
            if (!name || !email || !password || !passwordConfirm) {
                return Alert.alert('Atenção', 'Informe todos os campos obrigatórios!');
            }

            // Verificar se as senhas coincidem
            if (password !== passwordConfirm) {
                return Alert.alert('Erro', 'As senhas não coincidem!');
            }

            // Validar a senha
            if (!validatePassword(password)) {
                return Alert.alert('Erro', 'A senha deve conter pelo menos uma letra maiúscula, um número e um caractere especial!');
            }

            // Verificar se os termos foram aceitos
            if (!acceptTerms) {
                return Alert.alert('Erro', 'Você precisa aceitar os termos e condições para se cadastrar!');
            }

            const response = await axios.post('http://192.168.1.106:3333/register', {
                name,
                email,
                password
            });
            const user = response.data;

            // Lógica para cadastro (exemplo simples)
            setTimeout(() => {
                Alert.alert('Cadastro realizado com sucesso!');
                navigation.navigate("Login"); // Redireciona para a tela de login após cadastro
                setLoading(false);
            }, 1500);

        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={style.container}>
                <View style={style.boxTop}>
                    <View style={style.titleContainer}>
                        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                            <MaterialIcons name="arrow-back" size={24} color="white" style={style.arrowBackIcon} />
                        </TouchableOpacity>
                        <Text style={style.title}>Cadastre-se</Text>
                    </View>
                    <Text style={style.description}>Faça o seu cadastro para poder criar uma conta e utilizar os nossos serviços.</Text>
                </View>
                <View style={style.boxMid}>
                    <Text style={style.welcomeTitle}>Bem-Vindo 👋</Text>
                    <Text style={style.instruction}>Preencha o formulário abaixo para criar sua conta.</Text>

                    {/* Nome Completo */}
                    <Text style={style.inputTitle}>Nome Completo</Text>
                    <TextInput style={style.input} placeholder="Digite seu nome completo" placeholderTextColor="gray" value={name} onChangeText={setName} />

                    {/* Email */}
                    <Text style={style.inputTitle}>Email</Text>
                    <TextInput style={style.input} placeholder="Digite seu e-mail" placeholderTextColor="gray" value={email} onChangeText={setEmail} />

                    {/* Senha */}
                    <Text style={style.inputTitle}>Senha</Text>
                    <View style={style.passwordContainer}>
                        <TextInput
                            style={style.input}
                            placeholder="Digite sua senha"
                            placeholderTextColor="gray"
                            secureTextEntry={!showPassword} // Se showPassword for true, a senha será visível
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
                    </View>

                    {/* Confirmação de Senha */}
                    <Text style={style.inputTitle}>Confirmação de senha</Text>
                    <View style={style.passwordContainer}>
                        <TextInput
                            style={style.input}
                            placeholder="Digite sua senha novamente"
                            placeholderTextColor="gray"
                            secureTextEntry={!showPasswordConfirm} // Se showPasswordConfirm for true, a senha será visível
                            value={passwordConfirm}
                            onChangeText={setPasswordConfirm}
                        />
                        <TouchableOpacity onPress={() => setShowPasswordConfirm(!showPasswordConfirm)}>
                            <MaterialIcons
                                name={showPasswordConfirm ? "visibility-off" : "visibility"}
                                size={24}
                                color="#888"
                                style={style.eyeIcon}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Aceitar Termos */}
                    <View style={style.checkboxContainer}>
                        <TouchableOpacity
                            style={style.checkbox}
                            onPress={() => setAcceptTerms(prev => !prev)}
                        >
                            <MaterialIcons
                                name={acceptTerms ? "check-box" : "check-box-outline-blank"}
                                size={24}
                                color={acceptTerms ? "green" : "gray"}
                            />
                        </TouchableOpacity>
                        <Text style={style.checkboxText}>Eu aceito todos os termos e condições</Text>
                    </View>

                    {/* Botão Cadastro */}
                    <TouchableOpacity style={style.signupButton} onPress={() => getCadastro()}>
                        {loading ? (
                            <ActivityIndicator color={"white"} size={"small"} />
                        ) : (
                            <Text style={style.signupButtonText}>Cadastre-se</Text>
                        )}
                    </TouchableOpacity>

                    {/* Texto "Já possui uma conta?" com "Login" em azul */}
                    <View style={style.lineContainer}>
                        <Text style={style.noAccountText}>Já possui uma conta?
                            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                                <Text style={{ color: '#1F48AA' }}> Login</Text>
                            </TouchableOpacity>
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}
