// src/pages/login/Verificacao2FA
import React, { useState } from "react";
import { View, Text, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from "react-native";
import { useNavigation, NavigationProp, RouteProp, useRoute } from "@react-navigation/native";
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { createStyles } from "./styles";
import { Input } from "../../components/Input/index";
import { ButtonCustom } from "../../components/customButton";
import api from "../../services/api";
import { verify2FACode, resend2FACode, toggle2FA } from '../../services/2faServices';

import { useDispatch } from "react-redux";
import { loginUserAction } from "../../(redux)/authSlice";
import { updateTwoFactor } from "../../(redux)/authSlice";

// espera receber um email
type Verificacao2FARouteProp = RouteProp<{ params: { email: string; ativar?: boolean } }, "params">;

export default function Verificacao2FA() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<Verificacao2FARouteProp>();
  const dispatch = useDispatch();

  const { email, ativar } = route.params || {};
  const [code, setCode] = useState(""); // codigo digitado pelo usuário
  const [loading, setLoading] = useState(false);
  const [formInvalido, setFormInvalido] = useState(false);

  async function handleVerifyCode() {

    // verifica se campo está vazio ou incompleto
    if (!code || code.length !== 6) {
      setFormInvalido(true);
      return Alert.alert("Atenção", "Digite o código de 6 dígitos enviado por e-mail.");
    }

    setFormInvalido(false);
    setLoading(true);

    try {
      const response = await verify2FACode(email, code);
      const data = response.data;

      if (ativar) {
        if (data.token) {
          await toggle2FA(true, data.token);
          dispatch(updateTwoFactor(true));
          
          Alert.alert("Sucesso", "2FA ativado com sucesso!");
          navigation.goBack(); // ou redirecione para onde quiser
        } else {
          Alert.alert("Erro", "Token não recebido.");
        }
      } else {
        if (data.token) {
          dispatch(loginUserAction(data));
          Alert.alert("Sucesso", "Autenticação concluída!");
          navigation.navigate("BottomRoutes");
        } else {
          Alert.alert("Erro", "Token não recebido.");
        }
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || "Código inválido ou expirado.";
      console.log("Erro na verificação 2FA", error.response?.data);

      Alert.alert("Erro", msg);
    } finally {
      setLoading(false);
    }
  }

  // reenviar código se o usuário pedir
  async function handleResendCode() {
    try {
      setLoading(true);
      await resend2FACode(email); 
      Alert.alert("Código reenviado", "Verifique sua caixa de entrada.");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Erro ao reenviar o código.";
      console.log("Erro ao reenviar código", error.response?.data);
      Alert.alert("Erro", msg);
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
      
      <View style={styles.container}>
        <View style={styles.boxTop}>
          <Text style={styles.title}>Verificação 2FA</Text>
          <Text style={styles.description}>
            Digite o código de 6 dígitos que enviamos para o seu e-mail: {email}
          </Text>
        </View>

        <View style={styles.boxMid}>
        <View style={styles.inputGroup}>
          <Input
            value={code}
            onChangeText={text => {
              if (formInvalido) setFormInvalido(false);
              setCode(text);
            }}
            title="Código"
            placeholder="Digite o código de verificação"
            keyboardType="numeric"
            maxLength={6}
            iconRightName="vpn-key"
            IconRigth={MaterialIcons}
            error={formInvalido && (!code || code.length !== 6)}
            placeholderTextColor={theme.colors.cinza}
          />

          <ButtonCustom
            title="Verificar"
            onPress={handleVerifyCode}
            loading={loading}
          />

          <TouchableOpacity onPress={handleResendCode}>
            <Text style={styles.resendText}>Reenviar código</Text>
          </TouchableOpacity>

          
        </View>
        </View>

      </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}