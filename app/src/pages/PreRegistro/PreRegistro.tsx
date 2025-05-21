import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Animated,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { createStyles } from './styles';
import { ButtonCustom } from '../../components/customButton';

const mottos = [
  'Registro de Gastos Fácil e Rápido',
  'Tenha controle financeiro no seu projeto',
  'Simples, Rápido e Eficiente',
];

export default function Intro() {
  const { theme } = useTheme();
  const style = createStyles(theme);
  const navigation = useNavigation<NavigationProp<any>>();

  const [mottoIndex, setMottoIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setMottoIndex((prev) => (prev + 1) % mottos.length);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <LinearGradient
      colors={[theme.colors.secondary, theme.colors.primary, theme.colors.sempre_branco]}
      style={style.container}
    >
      {/* Logo (opcional) */}
      {/* <Image
        source={require('../../assets/logo.png')}
        style={style.logo}
      /> */}

      <Text style={style.title}>Recibify</Text>

      <Animated.Text style={[style.motto, { opacity: fadeAnim }]}>
        {mottos[mottoIndex]}
      </Animated.Text>

      <View style={style.buttonWrapper}>
        <ButtonCustom
          title="Começar"
          onPress={() => navigation.navigate('Login')}
        />
      </View>
    </LinearGradient>
  );
}
