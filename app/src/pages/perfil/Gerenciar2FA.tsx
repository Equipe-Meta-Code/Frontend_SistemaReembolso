import React from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { createStyles } from './styles';
import { toggle2FA, resend2FACode } from '../../services/2faServices';
import { RootStackParamList } from '../../routes/navigation';
import { updateTwoFactor } from '../../(redux)/authSlice';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; 

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "../../(redux)/store";

export interface User {
    userId: number;
    id: number;
    name: string;
    email: string;
    twoFactorEnabled?: boolean; 
    token: string,
}

export default function Gerenciar2FA() {
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();
    
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const route = useRoute<RouteProp<RootStackParamList, 'Gerenciar2FA'>>();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const email = user?.email;
    const isEnabled = user?.twoFactorEnabled;

    const ativar2FA = async () => {
        if (!user || !user.email) {
            Alert.alert("Erro", "Usuário ou e-mail não disponível.");
            return;
        }
        try {
            await resend2FACode(user.email); 
            navigation.navigate('Verificacao2FA', { email: user.email, ativar: true });
        } catch (err) {
            Alert.alert('Erro', 'Não foi possível enviar o código.');
        }
    };

    const desativar2FA = async () => {
        if (!user) {
            Alert.alert("Erro", "Usuário não encontrado.");
            return;
        }
        Alert.alert(
            "Desativar 2FA",
            "Tem certeza que deseja desativar a verificação em duas etapas?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Confirmar",
                    onPress: async () => {
                        await toggle2FA(false, user.token);
                        dispatch(updateTwoFactor(false));
                        Alert.alert('Desativado', '2FA foi desativado.');
                        navigation.goBack();
                    },
                },
            ]
        );
    };
    console.log("Usuário atual do Redux:", user);

    return (
        <View style={styles.container2FA}>
            
            <View style={styles.header2FA}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Verificação de dois fatores</Text>
            </View>

            <View style={styles.textContainer2FA}>
                <Text style={styles.descricaoCinza}>A verificação é feita por email.</Text>
                <Text style={styles.descricaoNormal}>Um código de 6 dígitos será enviado para o email: {email}</Text>
            </View>

            <TouchableOpacity onPress={isEnabled===true ? desativar2FA : ativar2FA}>
                
                <View style={styles.link}>
                    <MaterialCommunityIcons 
                        style={styles.iconFA}
                        name="security"
                        size={20} 
                        color={theme.colors.primary} 
                    />
                    <Text style={styles.textoLink2FA}>
                        {user?.twoFactorEnabled ? "Desativar verificação dois fatores" : "Ativar verificação dois fatores"}
                    </Text>
                </View>

            </TouchableOpacity>
        </View>
    );
}