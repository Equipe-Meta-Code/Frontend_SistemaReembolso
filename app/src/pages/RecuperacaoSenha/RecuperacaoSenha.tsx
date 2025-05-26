import React, { useState } from "react";
import { createStyles } from "./styles";
import { useTheme } from '../../context/ThemeContext';
import {
  Text, View, Alert, TouchableWithoutFeedback,
  KeyboardAvoidingView, Keyboard, Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import { Input } from "../../components/Input";
import { ButtonCustom } from "../../components/customButton";
import api from "../../services/api";
import LottieView from 'lottie-react-native';

export default function RecuperacaoSenha() {
  const { theme } = useTheme();
  const style = createStyles(theme);
  const navigation = useNavigation<NavigationProp<any>>();

  const [email, setEmail] = useState('');
  const [emailValido, setEmailValido] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formInvalido, setFormInvalido] = useState(false);

  function validarEmail(texto: string) {
    setEmail(texto);
    const regex = /\S+@\S+\.\S+/;
    setEmailValido(regex.test(texto));
  }

  async function handleEnviarEmail() {
    if (!email || !emailValido) {
      setFormInvalido(true);
      return Alert.alert('Atenção', 'Insira um e-mail válido!');
    }

    setLoading(true);
    try {
      await api.post('/recuperar-senha', { email });
      Alert.alert('Sucesso', 'Um email foi enviado para recuperação de senha.');
      // navigation.goBack();
    } catch (error: any) {
      console.log('Erro ao enviar recuperação de senha', error);
      const msg = error.response?.data?.mensagem || 'Não foi possível enviar o email.';
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
            <Text style={style.title}>Recuperação de Senha</Text>
            <Text style={style.description}>Informe seu e-mail para receber o código de recuperação</Text>
          </View>

          <View style={style.boxMid}>
            <Text style={style.welcomeTitle}>Esqueceu sua senha? </Text>
            <Text style={style.instruction}>Digite seu e-mail abaixo e te ajudaremos a redefinir sua senha.</Text>
            <LottieView
            source={require('../../assets/Animation - 1748104831108.json')}
            autoPlay
            loop={true}
            style={{ width: 150, height: 150, alignSelf: 'center', marginTop: 20 }}
            />
            <Input
              value={email}
              onChangeText={(text) => {
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

            <ButtonCustom
              title="Enviar Email"
              onPress={handleEnviarEmail}
              loading={loading}
              buttonStyle={{marginTop: 30, paddingVertical: 18, paddingHorizontal:15, alignItems: "center",   justifyContent: "center", width: '100%'}}
            />
            <ButtonCustom
              title="Verificar Código"
              onPress={() => navigation.navigate("VerificarCodigo", { email })}
              buttonStyle={{marginTop: 15, paddingVertical: 18, paddingHorizontal:15, alignItems: "center",   justifyContent: "center", width: '100%'}}
            />
            <ButtonCustom
              title="Voltar ao Login"
              onPress={() => navigation.navigate("Login")}
              buttonStyle={{marginTop: 35, paddingVertical: 18, paddingHorizontal:15, alignItems: "center",   justifyContent: "center", width: '100%'}}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
