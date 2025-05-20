import React, { useState } from "react";
import { View, Text, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useNavigation, NavigationProp, RouteProp, useRoute } from "@react-navigation/native";
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { createStyles } from "./styles";
import { Input } from "../../components/Input/index";
import { ButtonCustom } from "../../components/customButton";
import api from "../../services/api";
import { useDispatch } from "react-redux";
import { loginUserAction } from "../../(redux)/authSlice";

type Verificacao2FARouteProp = RouteProp<{ params: { email: string } }, "params">;

export default function Verificacao2FA() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<Verificacao2FARouteProp>();
  const dispatch = useDispatch();

  const email = route.params?.email || "";

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [formInvalido, setFormInvalido] = useState(false);

  async function handleVerifyCode() {
    console.log("oiiiiiiiiiiii")
    if (!code || code.length !== 6) {
      setFormInvalido(true);
      return Alert.alert("Atenção", "Digite o código de 6 dígitos enviado por e-mail.");
    }

    setFormInvalido(false);
    setLoading(true);

    try {
      console.log("sei la", email, code)
      const response = await api.post("/verify-2fa", { email, code });
      const data = response.data;

      if (data.token) {
        dispatch(loginUserAction(data));
        Alert.alert("Sucesso", "Autenticação concluída!");
        
        navigation.reset({
          index: 0,
          routes: [{ name: "BottomRoutes" }],
        });

      } else {
        Alert.alert("Erro", "Token não recebido, tente novamente.");
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || "Código inválido ou expirado.";
      console.log("Erro na verificação 2FA", error.response?.data);

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
              title="Verificar Código"
              onPress={handleVerifyCode}
              loading={loading}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}