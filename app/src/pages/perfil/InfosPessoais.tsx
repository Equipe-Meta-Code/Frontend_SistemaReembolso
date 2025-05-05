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
import Foto from '../../com../../components/foto/Foto';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system'; 

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
            const novaImagemUrl = `${res.data.imagemUrl}?ts=${Date.now()}`;
            dispatch(setProfileImage(novaImagemUrl));        
            setImageUri(novaImagemUrl); // Força a atualização imediata
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

  const handleImagemPadrao = async () => {
    if (!user) return;
  
    try {
      const imagemPadrao = Asset.fromModule(require('../../assets/perfil.png'));
      await imagemPadrao.downloadAsync();
  
      const uri = imagemPadrao.localUri || imagemPadrao.uri;
      if (!uri) throw new Error('Não conseguiu obter URI do asset.');
  
      const nomeArquivo = uri.split('/').pop()!;
      const match = /\.(\w+)$/.exec(nomeArquivo);
      const mimeType = match ? `image/${match[1]}` : 'image/png';
  
      const formData = new FormData();
      formData.append('profileImage', {
        uri,
        name: nomeArquivo,
        type: mimeType,
      } as any);
      formData.append('tipo', 'user');
      formData.append('tipoId', String(user.id));
  
      const res = await api.post('/imagem', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        const novaUrlImagem = `${res.data.imagemUrl}?ts=${Date.now()}`;
        dispatch(setProfileImage(novaUrlImagem));
        setImageUri(novaUrlImagem);
        Alert.alert('Sucesso', 'Imagem padrão restaurada!');
      } else {
        throw new Error('Resposta do servidor sem sucesso.');
      }
    } catch (err) {
      console.error('[PADRÃO] Erro:', err);
      Alert.alert('Erro', 'Não foi possível restaurar a imagem padrão.');
    }
  };

    return (
        <ScrollView contentContainerStyle={style.container}>
            <View style={style.containerBotoesTopo}>
{/*                 <BotaoInfoPessoal 
                    titulo="Cancelar"
                    onPress={() => {
                        Alert.alert('Atenção', 'As alterações não foram salvas!');
                        navigation.navigate('Perfil');
                    }}
                /> */}
                <Text style={style.titulo}>Informações Pessoais</Text>
{/*                 <BotaoInfoPessoal 
                    titulo="OK"
                    onPress={() => {
                        Alert.alert('Atenção', 'Alterações salvas com sucesso!');
                        navigation.navigate('Perfil');
                    }}
                /> */}
            </View>

            <View style={style.containerBotoes}>
              <TouchableOpacity onPress={handleImageUpload} style={style.imagemPerfil}>
                  <View style={style.imagemPerfil}>
                  {user ? (
                    <Foto
                      tipo="user"
                      tipoId={+user.userId}
                      width={150}
                      height={150}
                      borderRadius={100}
                      borderWidth={3}
                      borderColor="#fff"
                      refreshKey={user.profileImage}
                      fallbackSource={require('../../assets/perfil.png')}
                    />
                  ) : (
                    <Image
                      source={userProfileImage ? { uri: userProfileImage } : require('../../assets/perfil.png')}
                      style={style.fotoPerfil}
                    />
                  )}
                  </View>

              </TouchableOpacity>

              <CustomButton
                titulo={`Alterar imagem do perfil`}
                onPress={handleImageUpload}
                iconName="chevron-forward"
                iconColor="#000"
              />

              <CustomButton
                titulo={`Voltar imagem padrão`}
                onPress={handleImagemPadrao}
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
                    onPress={() => console.log("Nome")}
                    iconName=""
                    iconColor="#000"
                />
                <CustomButton
                    titulo={`Email: ${user?.email}`}
                    onPress={() => console.log("Email")}
                    iconName=""
                    iconColor="#000"
                />
                
            </View>
        </ScrollView>
    );
};



export default InfosPessoais;