// src/screens/InfosPessoais.tsx
import React from 'react';
import { View, Text, Image, ScrollView, Button } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from "../../(redux)/store";
import { style } from "./styles";
import CustomButton from '../../components/perfil/Botao';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

const InfosPessoais = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    type RootStackParamList = {
        Perfil: undefined; // Add other routes and their parameters here
    };
        
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    return (
        <ScrollView contentContainerStyle={style.container}>
            <View style={style.containerBotoes}>
                <View style={style.imagemPerfil}>
                    <Image
                        source={require('../../assets/perfil.png')}
                        style={style.fotoPerfil}
                    />
                </View>

                <CustomButton
                        titulo={`Editar imagem de perfil`}
                        onPress={() => alert("Selecionar Imagem")}
                        iconName="chevron-forward"
                        iconColor="#000"
                />
            </View>

            <View style={style.subtituloContainer}>

                <Text style={style.subtitulo}>Sobre</Text>
            </View>
            <View style={style.containerBotoes}>
                
                <CustomButton
                        titulo={`Nome: ${user?.name}`}
                        onPress={() => alert(`Editar nome: ${user?.name}`)}
                        iconName="chevron-forward"
                        iconColor="#000"
                />
                <CustomButton
                        titulo={`Email: ${user?.email}`}
                        onPress={() => alert(`Editar email: ${user?.name}`)}
                        iconName="chevron-forward"
                        iconColor="#000"
                />
                
            </View>
        </ScrollView>
    );
};



export default InfosPessoais;