import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { createStyles } from './styles';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation, NavigationProp } from '@react-navigation/native';

export default function Intro() {
  const { theme } = useTheme();
  const style = createStyles(theme);
  const navigation = useNavigation<NavigationProp<any>>();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.navigate('PreRegistro');
    }, 6000); // 6 segundos

    return () => clearTimeout(timeout); // limpeza se desmontar antes
  }, [navigation]);

  return (
    <View style={style.container}>
      {/* <Image
        source={require('../../assets/teste.jpeg')} 
        style={style.logo}
        resizeMode="contain"
      /> */}
      <Text style={style.title}>Recibify</Text>
      <Text style={style.motto}>Registro de Gastos Fácil e Rápido</Text>
    </View>
  );
}
