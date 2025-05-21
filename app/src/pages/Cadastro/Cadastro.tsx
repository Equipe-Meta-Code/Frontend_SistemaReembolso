import React, { useState } from "react";
import { createStyles } from "./styles";
import { useTheme } from '../../context/ThemeContext';
import { Text, View, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Input } from "../../components/Input";
import api from "../../services/api";
import { themas } from "../../global/themes";
import { ButtonCustom } from "../../components/customButton";
import { Asset } from 'expo-asset';

export default function Cadastro() {
    const { theme } = useTheme();
    const style = createStyles (theme);
    const navigation = useNavigation<NavigationProp<any>>();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState<string>('');
    const [passwordConfirm, setPasswordConfirm] = useState<string>('');
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [errorMessages, setErrorMessages] = useState<string[]>([]);

    // Função para validar a senha com expressões regulares
    const validatePassword = (password: string): boolean => {
        const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]:;"'|\\,.<>\/?]).+$/;
        return regex.test(password);
    };


    const salvarImagemPadrao = async (userId: number) => {
        try {
            const imagem = Asset.fromModule(require('../../assets/perfil.png'));
            await imagem.downloadAsync();
            const uri = imagem.localUri || imagem.uri;
            if (!uri) throw new Error('URI da imagem não disponível');

            const nomeArquivo = uri.split('/').pop()!;
            const match = /\.(\w+)$/.exec(nomeArquivo);
            const mimeType = match ? `image/${match[1]}` : 'image/png';

            const formData = new FormData();
            formData.append('profileImage', { uri, name: nomeArquivo, type: mimeType } as any);
            formData.append('tipo', 'user');
            formData.append('tipoId', String(userId));

            const res = await api.post('/imagem', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (!res.data.success) {
                console.warn('Upload da imagem padrão falhou:', res.data);
            }
        } catch (err) {
            console.error('Erro no upload da imagem padrão:', err);
        }
    };

    async function getCadastro() {
        setErrorMessages([]); // Limpar mensagens de erro anteriores
        try {
            setLoading(true);

            const validateEmail = (email: string): boolean => {
                const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return regex.test(email);
            };

            let errors: string[] = [];

            // Verificar se os campos obrigatórios estão preenchidos
            if (!name || !email || !password || !passwordConfirm) {
                errors.push('Informe todos os campos obrigatórios!');
            }

            // Verificar se o email é válido
            if (!validateEmail(email)) {
                errors.push('Digite um e-mail válido!');
            }

            // Validar a senha
            if (!validatePassword(password)) {
                errors.push('A senha deve conter pelo menos uma letra maiúscula, um número e um caractere especial!');
            }

            // Verificar se as senhas coincidem
            if (password !== passwordConfirm) {
                errors.push('As senhas não coincidem!');
            }

            // Verificar se os termos foram aceitos
            if (!acceptTerms) {
                errors.push('Você precisa aceitar os termos e condições para se cadastrar!');
            }

            if (errors.length > 0) {
                setErrorMessages(errors);
                setLoading(false); // Garantir que loading seja desativado após mostrar os erros
                return;
            }

            const response = await api.post('/register', {
                name,
                email,
                password
            });
            const newUser = response.data as { id: number };

            await salvarImagemPadrao(newUser.id);
            Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
            navigation.navigate("Login");

        } catch (error:any) {
            setErrorMessages([]);
            const mensagemErro = error.response.data.message;
            if (mensagemErro == "Email já está em uso!") {
                setErrorMessages(["Email já está em uso!"]);
            } else {
                Alert.alert(error, 'Ocorreu um erro ao tentar realizar o cadastro. Por favor, tente novamente.');
            }
        } finally {
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
                    <Input
                        title="Nome Completo"
                        placeholder="Digite seu nome completo"
                        value={name}
                        onChangeText={(text) => {
                            setName(text);
                        }}
                        iconRightName="person"
                        IconRigth={MaterialIcons}
                        placeholderTextColor={theme.colors.cinza}
                    />

                    {/* Email */}
                    <Input
                        title="Email"
                        placeholder="Digite seu e-mail"
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                        }}
                        iconRightName="email"
                        IconRigth={MaterialIcons}
                        placeholderTextColor={theme.colors.cinza}
                    />

                    {/* Senha */}
                    <Input
                        title="Senha"
                        placeholder="Digite sua senha"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                        }}
                        iconRightName={showPassword ? "visibility-off" : "visibility"}
                        IconRigth={MaterialIcons}
                        onIconRigthPress={() => setShowPassword(!showPassword)}
                        placeholderTextColor={theme.colors.cinza}
                    />

                    {/* Confirmação de Senha */}
                    <Input
                        title="Confirmação de Senha"
                        placeholder="Digite sua senha novamente"
                        secureTextEntry={!showPasswordConfirm}
                        value={passwordConfirm}
                        onChangeText={(text) => {
                            setPasswordConfirm(text);
                        }}
                        iconRightName={showPasswordConfirm ? "visibility-off" : "visibility"}
                        IconRigth={MaterialIcons}
                        onIconRigthPress={() => setShowPasswordConfirm(!showPasswordConfirm)}
                        placeholderTextColor={theme.colors.cinza}
                    />
                    {/* Aceitar Termos */}
                    <View style={style.checkboxContainer}>
                        <TouchableOpacity
                            style={style.checkbox}
                            onPress={() => setAcceptTerms(prev => !prev)}
                        >
                            <MaterialIcons
                                name={acceptTerms ? "check-box" : "check-box-outline-blank"}
                                size={24}
                                color={acceptTerms ? "green" : theme.colors.cinza}
                            />
                        </TouchableOpacity>
                        <Text style={style.checkboxText}>Eu aceito todos os termos e condições</Text>
                    </View>

                    {/* Exibição dos erros */}
                    {errorMessages.length > 0 && (
                        <View style={style.errorContainer}>
                            {errorMessages.map((msg, index) => (
                                <Text key={index} style={style.errorMessage}>
                                    {msg}
                                </Text>
                            ))}
                        </View>
                    )}

                    {/* Botão Cadastro */}
                    <ButtonCustom
                        title="Cadastre-se"
                        onPress={() => getCadastro()}
                        loading={loading}
                    />

                    {/* Texto "Já possui uma conta?" com "Login" em azul */}
                    <View style={style.lineContainer}>
                        <Text style={style.noAccountText}>Já possui uma conta?
                            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                                <Text style={{ color: theme.colors.primary }}> Login</Text>
                            </TouchableOpacity>
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}
