import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, Alert, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { setProfileImage } from '../../(redux)/authSlice';
import { RootState } from '../../(redux)/store';
import { style } from "./styles";
import CustomButton from '../../components/perfil/Botao';
import BotaoInfoPessoal from '../../components/perfil/BotaoInfoPessoal';
import { useNavigation, useFocusEffect  } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import api from "../../services/api"

const InfosPessoais = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const userProfileImage = useSelector((state: RootState) => state.auth.user?.profileImage);

    type RootStackParamList = {
        Perfil: undefined; // Add other routes and their parameters here
    };

    const dispatch = useDispatch();
    const navigation = useNavigation<StackNavigationProp<{ Perfil: undefined }>>();
    const [imageUri, setImageUri] = useState<string | null>(user?.profileImage ?? null);
    const [originalImage, setOriginalImage] = useState<string | null>(user?.profileImage ?? null);

    const handleImagePress = () => {
        // Exibe um alerta com a opção de editar a imagem
        Alert.alert("Editar Imagem", "Escolha uma nova imagem de perfil.");
    };
    
    useEffect(() => {
        setImageUri(user?.profileImage ?? null);
        setOriginalImage(user?.profileImage ?? null);
    }, [user]);
    
    const handleImageUpload = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permissão negada', 'Você precisa permitir o acesso à galeria.');
          return;
        }
    
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images, // ← Corrigido aqui
          quality: 1,
        });
        if (result.canceled || !result.assets.length) return;
    
        const uri = result.assets[0].uri;
        setImageUri(uri);
    
        const filename = uri.split('/').pop()!;
        const match = /\.(\w+)$/.exec(filename);
        const mimeType = match ? `image/${match[1]}` : 'image';
    
    
        try {
          const formData = new FormData();
          formData.append('profileImage', {
            uri: uri,
            name: filename,
            type: mimeType,
          } as any);
      
          formData.append('tipo', 'user');
          formData.append('tipoId', String(user!.id));
      
          const res = await api.post('/imagem', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
      
          if (res.data.success) {
            const newImageUrl = `${res.data.imagemUrl}?ts=${Date.now()}`;
            dispatch(setProfileImage(newImageUrl));        
            setImageUri(newImageUrl); // Força a atualização imediata
            Alert.alert('Sucesso', 'Foto atualizada!');
          }
        } catch (err) {
          console.error('[FRONT] Erro completo:', err);
          Alert.alert('Erro', 'Falha ao enviar imagem.');
        }
      };

      
  useEffect(() => {
    console.log('imageUri atualizado:', user?.profileImage);
    setImageUri(user?.profileImage ?? null);
    setOriginalImage(user?.profileImage ?? null);
  }, [user?.profileImage]); // ← Alterado para observar user.profileImage especificamente

  useEffect(() => {
    console.log('imageUri atualizado:', imageUri); // Deve mostrar a URL com timestamp
  }, [imageUri]);

  useEffect(() => {
    console.log('User profileImage atualizado:', user?.profileImage);
    if (user?.profileImage) {
      setImageUri(user.profileImage);
      setOriginalImage(user.profileImage);
    }
  }, [user?.profileImage]);

  useEffect(() => {
    console.log('Estado do user:', user);
  }, [user]);
    

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