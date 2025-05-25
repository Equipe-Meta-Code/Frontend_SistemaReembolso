import React, { useState } from "react";
import { createStyles } from "./styles";
import { useTheme } from '../../context/ThemeContext';
import {
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Input } from "../../components/Input";
import api from "../../services/api";
import { ButtonCustom } from "../../components/customButton";
import { Asset } from 'expo-asset';

export default function Cadastro() {
  const { theme } = useTheme();
  const style = createStyles(theme);
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

  // Field-specific errors
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordConfirmError, setPasswordConfirmError] = useState('');
  const [termsError, setTermsError] = useState('');

  // Save default profile image
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

  // Validation functions
  function validateName(text: string) {
    setName(text);
    setNameError(text ? '' : 'Informe seu nome completo!');
  }

  function validateEmailField(text: string) {
    setEmail(text);
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(regex.test(text) ? '' : 'Digite um e-mail válido!');
  }

  function validatePasswordField(text: string) {
    setPassword(text);
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]:;"'|\\,.<>\/?]).+$/;
    setPasswordError(
      regex.test(text)
        ? ''
        : 'A senha deve conter pelo menos uma letra maiúscula, um número e um caractere especial!'
    );
  }

  function validatePasswordConfirmField(text: string) {
    setPasswordConfirm(text);
    setPasswordConfirmError(text === password ? '' : 'As senhas não coincidem!');
  }

  function validateTerms(checked: boolean) {
    setAcceptTerms(checked);
    setTermsError(checked ? '' : 'Você precisa aceitar os termos!');
  }

  async function getCadastro() {
    setErrorMessages([]);
    try {
      setLoading(true);
      let errors: string[] = [];

      if (!name || !email || !password || !passwordConfirm) {
        errors.push('Informe todos os campos obrigatórios!');
      }
      if (!acceptTerms) {
        errors.push('Você precisa aceitar os termos e condições para se cadastrar!');
      }

      if (errors.length > 0) {
        setErrorMessages(errors);
        return;
      }

      if (nameError || emailError || passwordError || passwordConfirmError || termsError) {
        return;
      }

      const response = await api.post('/register', { name, email, password });
      const newUser = response.data as { id: number };

      await salvarImagemPadrao(newUser.id);
      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
      navigation.navigate('Login');
    } catch (error: any) {
      setErrorMessages([]);
      const mensagemErro = error.response?.data?.message;
      if (mensagemErro === 'Email já está em uso!') {
        setErrorMessages(['Email já está em uso!']);
      } else {
        Alert.alert(
          'Erro',
          'Ocorreu um erro ao tentar realizar o cadastro. Por favor, tente novamente.'
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={style.container}>
            <View style={style.boxTop}>
              <View style={style.titleContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <MaterialIcons
                    name="arrow-back"
                    size={24}
                    color="white"
                    style={style.arrowBackIcon}
                  />
                </TouchableOpacity>
                <Text style={style.title}>Cadastre-se</Text>
              </View>
              <Text style={style.description}>
                Faça o seu cadastro para poder criar uma conta e utilizar os nossos serviços.
              </Text>
            </View>

            <View style={style.boxMid}>
              <Text style={style.welcomeTitle}>Bem-Vindo 👋</Text>
              <Text style={style.instruction}>
                Preencha o formulário abaixo para criar sua conta.
              </Text>

              <Input
                title="Nome Completo"
                placeholder="Digite seu nome completo"
                value={name}
                onChangeText={validateName}
                iconRightName="person"
                IconRigth={MaterialIcons}
                placeholderTextColor={theme.colors.cinza}
              />
              {nameError ? <Text style={style.errorMessage}>{nameError}</Text> : null}

              <Input
                title="Email"
                placeholder="Digite seu e-mail"
                value={email}
                onChangeText={validateEmailField}
                iconRightName="email"
                IconRigth={MaterialIcons}
                placeholderTextColor={theme.colors.cinza}
              />
              {emailError ? <Text style={style.errorMessage}>{emailError}</Text> : null}

              <Input
                title="Senha"
                placeholder="Digite sua senha"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={validatePasswordField}
                iconRightName={showPassword ? 'visibility-off' : 'visibility'}
                IconRigth={MaterialIcons}
                onIconRigthPress={() => setShowPassword(!showPassword)}
                placeholderTextColor={theme.colors.cinza}
              />
              {passwordError ? <Text style={style.errorMessage}>{passwordError}</Text> : null}

              <Input
                title="Confirmação de Senha"
                placeholder="Digite sua senha novamente"
                secureTextEntry={!showPasswordConfirm}
                value={passwordConfirm}
                onChangeText={validatePasswordConfirmField}
                iconRightName={showPasswordConfirm ? 'visibility-off' : 'visibility'}
                IconRigth={MaterialIcons}
                onIconRigthPress={() => setShowPasswordConfirm(!showPasswordConfirm)}
                placeholderTextColor={theme.colors.cinza}
              />
              {passwordConfirmError ? <Text style={style.errorMessage}>{passwordConfirmError}</Text> : null}

              <View style={style.checkboxContainer}>
                <TouchableOpacity
                  style={style.checkbox}
                  onPress={() => validateTerms(!acceptTerms)}
                >
                  <MaterialIcons
                    name={acceptTerms ? 'check-box' : 'check-box-outline-blank'}
                    size={24}
                    color={acceptTerms ? 'green' : theme.colors.cinza}
                  />
                </TouchableOpacity>
                <Text style={style.checkboxText}>
                  Eu aceito todos os termos e condições
                </Text>
              </View>
              {termsError ? <Text style={style.errorMessage}>{termsError}</Text> : null}

              {errorMessages.length > 0 && (
                <View style={style.errorContainer}>
                  {errorMessages.map((msg, index) => (
                    <Text key={index} style={style.errorMessage}>
                      {msg}
                    </Text>
                  ))}
                </View>
              )}

              <ButtonCustom
                title="Cadastre-se"
                onPress={getCadastro}
                loading={loading}
              />

              <View style={style.lineContainer}>
                <Text style={style.noAccountText}>
                  Já possui uma conta?
                  <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={{ color: theme.colors.primary }}> Login</Text>
                  </TouchableOpacity>
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}