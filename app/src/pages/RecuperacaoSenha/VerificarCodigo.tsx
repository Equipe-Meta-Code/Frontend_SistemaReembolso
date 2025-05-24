import React, { useState } from "react";
import { createStyles } from "./styles";
import { useTheme } from "../../context/ThemeContext";
import {
  Text, View, Alert, TouchableWithoutFeedback,
  KeyboardAvoidingView, Keyboard, Platform
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute, NavigationProp } from "@react-navigation/native";

import { Input } from "../../components/Input";
import { ButtonCustom } from "../../components/customButton";
import api from "../../services/api";
import LottieView from 'lottie-react-native';

export default function VerificarCodigo() {
  const { theme } = useTheme();
  const style = createStyles(theme);
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute();
  const { email } = route.params as { email: string };

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleVerificarCodigo() {
    if (!code) {
      return Alert.alert("Atenção", "Digite o código recebido por e-mail.");
    }

    setLoading(true);
    try {
      const response = await api.post("/verificar-codigo", { email, code });

      if (response.data.alertType === "success") {
        navigation.navigate("NovaSenha", { email }); // passa o email pra próxima tela
      } else {
        Alert.alert("Erro", response.data.message || "Código inválido ou expirado.");
      }
    } catch (error) {
      console.error("Erro na verificação do código:", error);
      Alert.alert("Erro", "Houve um problema ao verificar o código.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={style.container}>
          <View style={style.boxTop}>
            <Text style={style.title}>Verificação</Text>
            <Text style={style.description}>Digite o código enviado para {email}</Text>
          </View>
          <View style={style.boxMid}>
            <LottieView
            source={require('../../assets/Animation - 1748105304258.json')}
            autoPlay
            loop={true}
            style={{ width: 150, height: 150, alignSelf: 'center', marginTop: 20 }}
            />
            <Input
              value={code}
              onChangeText={setCode}
              title="Código"
              placeholder="Digite o código"
              iconRightName="lock"
              IconRigth={MaterialIcons}
            />
            
            <ButtonCustom
              title="Verificar"
              onPress={handleVerificarCodigo}
              loading={loading}
              buttonStyle={{marginTop: 30, paddingVertical: 16, paddingHorizontal:15, alignItems: "center",   justifyContent: "center",}}
            />

            <View
            style={{
                marginTop: 40,
                marginVertical: 20,
                borderBottomColor: '#D3D3D3', // cinza claro
                borderBottomWidth: 1,
                width: '100%',
            }}
            />
            <View style={{ marginTop: 30 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: theme.colors.text }}>Não recebeu um e-mail?</Text>
            <Text style={{ marginTop: 8, color: theme.colors.text, fontSize: 14 }}>
                • Certifique-se de que o endereço de e-mail informado está correto.
            </Text>
            <Text style={{ marginTop: 4, color: theme.colors.text, fontSize: 14 }}>
                • Verifique a caixa de spam do seu e-mail.
            </Text>
            <Text style={{ marginTop: 4, color: theme.colors.text, fontSize: 14 }}>
                • O envio pode levar alguns segundos.
            </Text>
            <ButtonCustom
            title="Informar outro e-mail"
            onPress={() => navigation.navigate("RecuperacaoSenha")}
            buttonStyle={{marginTop: 30, paddingVertical: 18, paddingHorizontal:15, alignItems: "center",   justifyContent: "center", width: '100%'}}

            />
            </View>

          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
