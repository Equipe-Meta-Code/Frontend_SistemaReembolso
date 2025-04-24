import React from 'react';
import { View, Text, Image, ScrollView, Button, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from "../../(redux)/store";
import { style } from "./styles";
import CustomButton from '../../components/perfil/Botao';
import BotaoInfoPessoal from '../../components/perfil/BotaoInfoPessoal';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

const InfosPessoais = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    type RootStackParamList = {
        Perfil: undefined; // Add other routes and their parameters here
    };
        
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const handleImagePress = () => {
        // Exibe um alerta com a opção de editar a imagem
        Alert.alert("Editar Imagem", "Escolha uma nova imagem de perfil.");
    };

    const handleEditName = () => {
        // Alerta para edição do nome
        Alert.alert("Editar Nome", `Você está prestes a editar o nome: ${user?.name}`);
    };

    const handleEditEmail = () => {
        // Alerta para edição do email
        Alert.alert("Editar Email", `Você está prestes a editar o email: ${user?.email}`);
    };

    return (
        <ScrollView contentContainerStyle={style.container}>
            <View style={style.containerBotoesTopo}>
                <BotaoInfoPessoal 
                    titulo="Cancelar"
                    onPress={() => {
                        Alert.alert('Atenção', 'As alterações não foram salvas!');
                        navigation.navigate('Perfil');
                    }}
                />
                <Text style={style.titulo}>Editar</Text>
                <BotaoInfoPessoal 
                    titulo="OK"
                    onPress={() => {
                        Alert.alert('Atenção', 'Alterações salvas com sucesso!');
                        navigation.navigate('Perfil');
                    }}
                />
            </View>

            <View style={style.containerBotoes}>
                <View style={style.imagemPerfil}>
                    <Image
                        source={require('../../assets/perfil.png')}
                        style={style.fotoPerfil}
                    />
                </View>

                <CustomButton
                    titulo={`Editar imagem de perfil`}
                    onPress={handleImagePress}
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
                    onPress={handleEditName}
                    iconName="chevron-forward"
                    iconColor="#000"
                />
                <CustomButton
                    titulo={`Email: ${user?.email}`}
                    onPress={handleEditEmail}
                    iconName="chevron-forward"
                    iconColor="#000"
                />
                
            </View>
        </ScrollView>
    );
};



export default InfosPessoais;