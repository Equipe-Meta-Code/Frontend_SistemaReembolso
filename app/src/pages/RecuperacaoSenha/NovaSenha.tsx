import React, { useState } from "react";
import { createStyles } from "./styles";
import { useTheme } from "../../context/ThemeContext";
import {
  Text, View, Alert, TouchableWithoutFeedback,
  KeyboardAvoidingView, Keyboard, Platform, LayoutAnimation, UIManager
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute, NavigationProp } from "@react-navigation/native";

import { Input } from "../../components/Input";
import { ButtonCustom } from "../../components/customButton";
import api from "../../services/api";
import LottieView from 'lottie-react-native';


if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function NovaSenha() {
  const { theme } = useTheme();
  const style = createStyles(theme);
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute();
  const { email, code } = route.params as { email: string; code: string };

  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [senhaFraca, setSenhaFraca] = useState(false);
  const [forcaSenha, setForcaSenha] = useState<'fraca' | 'media' | 'forte' | null>(null);

  function validarSenha(senha: string): boolean {
    const regexForte = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&^_-])[A-Za-z\d@$!%*#?&^_-]{6,}$/;
    return regexForte.test(senha);
  }

  function analisarForcaSenha(senha: string) {
    let pontos = 0;
    if (senha.length >= 6) pontos++;
    if (/[A-Z]/.test(senha)) pontos++;
    if (/\d/.test(senha)) pontos++;
    if (/[@$!%*#?&^_-]/.test(senha)) pontos++;

    if (pontos <= 1) setForcaSenha("fraca");
    else if (pontos === 2 || pontos === 3) setForcaSenha("media");
    else if (pontos >= 4) setForcaSenha("forte");
    else setForcaSenha(null);
  }

  async function handleAtualizarSenha() {
    LayoutAnimation.easeInEaseOut();

    if (!novaSenha || !confirmarSenha) {
      return Alert.alert("Atenção", "Preencha todos os campos.");
    }

    if (!validarSenha(novaSenha)) {
      setSenhaFraca(true);
      return;
    }

    if (novaSenha !== confirmarSenha) {
      return Alert.alert("Erro", "As senhas não coincidem.");
    }

    setSenhaFraca(false);
    setLoading(true);
    try {
      await api.put("/atualizar-senha", { email, code, novaSenha });


      Alert.alert("Sucesso", "Senha atualizada com sucesso!");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Erro ao atualizar senha:", error);
      Alert.alert("Erro", "Não foi possível atualizar a senha.");
    } finally {
      setLoading(false);
    }
  }

  const corForca = {
    fraca: "red",
    media: "#f2c037",
    forte: "#2ecc71"
  };

  const textoForca = {
    fraca: "Senha fraca",
    media: "Senha média",
    forte: "Senha forte"
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={style.container}>
          <View style={style.boxTop}>
            <Text style={style.title}>Nova Senha</Text>
            <Text style={style.description}>Crie uma nova senha para o seu perfil</Text>
          </View>
            <LottieView
            source={require('../../assets/Animation - 1748104045158.json')}
            autoPlay
            loop={true}
            style={{ width: 150, height: 150, alignSelf: 'center', marginTop: 20 }}
            />
          <View style={style.boxMid}>
            <Input
              value={novaSenha}
              onChangeText={(text) => {
                setNovaSenha(text);
                analisarForcaSenha(text);
                if (senhaFraca) setSenhaFraca(false);
              }}
              title="Nova Senha"
              placeholder="Digite sua nova senha"
              iconRightName={showNovaSenha ? "visibility-off" : "visibility"}
              IconRigth={MaterialIcons}
              secureTextEntry={!showNovaSenha}
              onIconRigthPress={() => setShowNovaSenha(!showNovaSenha)}
            />

            {/* Indicador de força */}
            {forcaSenha && (
              <Text style={{ color: corForca[forcaSenha], marginBottom: 10 }}>
                {textoForca[forcaSenha]}
              </Text>
            )}

            <Input
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              title="Confirmar Senha"
              placeholder="Confirme sua nova senha"
              iconRightName={showConfirmarSenha ? "visibility-off" : "visibility"}
              IconRigth={MaterialIcons}
              secureTextEntry={!showConfirmarSenha}
              onIconRigthPress={() => setShowConfirmarSenha(!showConfirmarSenha)}
            />

            {senhaFraca && (
              <View style={{ marginTop: 10 }}>
                <Text style={{ color: "red", fontSize: 14 }}>
                  A senha deve ter no mínimo 6 caracteres, incluindo uma letra, um número e um símbolo.
                </Text>
              </View>
            )}

            <ButtonCustom
              title="Atualizar Senha"
              onPress={handleAtualizarSenha}
              loading={loading}
              buttonStyle={{
                marginTop: 30,
                paddingVertical: 18,
                paddingHorizontal: 15,
                alignItems: "center",
                justifyContent: "center",
                width: '100%'
              }}
            />

            <ButtonCustom
              title="Voltar ao Login"
              onPress={() => navigation.navigate("Login")}
              buttonStyle={{
                marginTop: 100,
                paddingVertical: 18,
                paddingHorizontal: 15,
                alignItems: "center",
                justifyContent: "center",
                width: '100%'
              }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
