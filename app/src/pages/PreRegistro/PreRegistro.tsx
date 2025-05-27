import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Animated,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { createStyles } from './styles';
import { ButtonCustom } from '../../components/customButton';

const mottos = [
  {
    text: 'Registro de Gastos Fácil e Rápido',
    image: require('../../assets/img1.jpg'),
  },
  {
    text: 'Tenha controle financeiro no seu projeto',
    image: require('../../assets/img2.jpg'),
  },
  {
    text: 'Simples, Rápido e Eficiente',
    image: require('../../assets/img3.jpg'), 
  },
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
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={mottos[mottoIndex].image}
        style={style.backgroundImage}
        resizeMode="cover"
      >
        <View style={style.imageOverlay} />
        <View style={style.overlay}>
          <Text style={style.title}>Recibify</Text>
          <Text style={style.motto}>{mottos[mottoIndex].text}</Text>
          <View style={style.buttonWrapper}>
            <ButtonCustom
              title="Começar"
              onPress={() => navigation.navigate('Login')}
            />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}
