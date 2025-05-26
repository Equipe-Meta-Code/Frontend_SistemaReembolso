import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, Alert, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { setProfileImage } from '../../(redux)/authSlice';
import { RootState } from '../../(redux)/store';
import { createStyles } from './styles';
import { useTheme } from '../../context/ThemeContext';
import CustomButton from '../../components/perfil/Botao';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import api from '../../services/api';
import Foto from '../../com../../components/foto/Foto';
import { Asset } from 'expo-asset';
import { useActionSheet } from '@expo/react-native-action-sheet';

const InfosPessoais = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { theme } = useTheme();
  const style = createStyles(theme);
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<{ Perfil: undefined }>>();

  const [imageUri, setImageUri] = useState<string | null>(user?.profileImage ?? null);

  const { showActionSheetWithOptions } = useActionSheet();

  useEffect(() => {
    setImageUri(user?.profileImage ?? null);
  }, [user?.profileImage]);

  const uploadToServer = async (uri: string) => {
    const filename = uri.split('/').pop()!;
    const match = /\.(\w+)$/.exec(filename);
    const mimeType = match ? `image/${match[1]}` : 'image';

    const formData = new FormData();
    formData.append('profileImage', { uri, name: filename, type: mimeType } as any);
    formData.append('tipo', 'user');
    formData.append('tipoId', String(user!.id));

    try {
      const res = await api.post('/imagem', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (res.data.success) {
        const novaUrl = `${res.data.imagemUrl}?ts=${Date.now()}`;
        dispatch(setProfileImage(novaUrl));
        setImageUri(novaUrl);
        Alert.alert('Sucesso', 'Foto atualizada!');
      }
    } catch (err) {
      console.error('[FRONT] Erro ao enviar imagem:', err);
      Alert.alert('Erro', 'Falha ao enviar imagem.');
    }
  };

  const escolherGaleria = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return Alert.alert('Permissão negada', 'Você precisa permitir acesso à galeria.');
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 1 });
    if (result.canceled || !result.assets.length) return;
    const uri = result.assets[0].uri;
    uploadToServer(uri);
  };

  const tirarFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return Alert.alert('Permissão negada', 'Você precisa permitir acesso à câmera.');
    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 1 });
    if (result.canceled || !result.assets.length) return;
    const uri = result.assets[0].uri;
    uploadToServer(uri);
  };

  const handleImageOptions = () => {
    const options = ['Cancelar', 'Tirar Foto', 'Galeria'];
    const cancelButtonIndex = 0;
    showActionSheetWithOptions({ options, cancelButtonIndex }, (buttonIndex) => {
      switch (buttonIndex) {
        case 1:
          return tirarFoto();
        case 2:
          return escolherGaleria();
        default:
          return;
      }
    });
  };

  const handleImagemPadrao = async () => {
    if (!user) return;
    try {
      const asset = Asset.fromModule(require('../../assets/perfil.png'));
      await asset.downloadAsync();
      const uri = asset.localUri || asset.uri;
      uploadToServer(uri);
      Alert.alert('Sucesso', 'Imagem padrão restaurada!');
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
                      borderColor={theme.colors.secondary}
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
                iconColor={theme.colors.black}
              />

              <CustomButton
                titulo={`Voltar imagem padrão`}
                onPress={handleImagemPadrao}
                iconName="chevron-forward"
                iconColor={theme.colors.black}
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
                    iconColor={theme.colors.black}
                />
                <CustomButton
                    titulo={`Email: ${user?.email}`}
                    onPress={() => console.log("Email")}
                    iconName=""
                    iconColor={theme.colors.black}
                />
                
            </View>
        </ScrollView>
    );
};



export default InfosPessoais;