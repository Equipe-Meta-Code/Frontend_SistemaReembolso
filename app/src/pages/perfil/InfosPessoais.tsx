// src/pages/InfosPessoais.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, Alert, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { setProfileImage } from '../../(redux)/authSlice';
import { RootState } from '../../(redux)/store';
import { style } from "./styles";
import CustomButton from '../../components/perfil/Botao';
import BotaoInfoPessoal from '../../components/perfil/BotaoInfoPessoal';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

const InfosPessoais = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const [imageUri, setImageUri] = useState<string | null>(user?.profileImage ?? null);
  const [originalImage, setOriginalImage] = useState<string | null>(user?.profileImage ?? null);

  type RootStackParamList = {
    Perfil: undefined;
  };

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    setImageUri(user?.profileImage ?? null);
    setOriginalImage(user?.profileImage ?? null);
  }, [user]);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permissão necessária", "Você precisa permitir o acesso à galeria.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const saveProfileChanges = async () => {
    if (user && imageUri) {
      const formData = new FormData();

      formData.append('name', user.name);
      formData.append('email', user.email);

      if (imageUri !== originalImage) {
        const filename = imageUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename ?? '');
        const type = match ? `image/${match[1]}` : `image`;

        formData.append('profileImage', {
          uri: imageUri,
          name: filename,
          type,
        } as any);
      }

      try {
        const response = await fetch('api2', {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const data = await response.json();

        if (data.success) {
          dispatch(setProfileImage(data.user.profileImage));
          Alert.alert("Sucesso!", "Imagem de perfil atualizada.");
          navigation.navigate('Perfil');
        } else {
          Alert.alert("Erro", "Não foi possível salvar a imagem.");
        }
      } catch (error) {
        console.error("Erro ao atualizar perfil:", error);
        Alert.alert("Erro", "Houve um problema ao salvar.");
      }
    }
  };

  const cancelChanges = () => {
    setImageUri(originalImage);
    Alert.alert("Alterações canceladas");
    navigation.navigate('Perfil');
  };

  useFocusEffect(
    React.useCallback(() => {
      setImageUri(originalImage);
    }, [originalImage])
  );

  return (
    <ScrollView contentContainerStyle={style.container}>
      <View style={style.containerBotoesTopo}>
        <BotaoInfoPessoal titulo="Cancelar" onPress={cancelChanges} />
        <Text style={style.titulo}>Editar</Text>
        <BotaoInfoPessoal titulo="OK" onPress={saveProfileChanges} />
      </View>

      <View style={style.containerBotoes}>
        <TouchableOpacity onPress={pickImage} style={style.imagemPerfil}>
          <Image
            source={imageUri ? { uri: imageUri } : require('../../assets/perfil.png')}
            style={style.fotoPerfil}
          />
        </TouchableOpacity>

        <CustomButton
          titulo="Editar imagem de perfil"
          onPress={pickImage}
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
