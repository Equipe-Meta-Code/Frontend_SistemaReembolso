import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createStyles } from "./styles";
import { useTheme } from '../../context/ThemeContext';


interface IndicadoresProps {
  titulo: string;
  quantia: string;
}

const Indicadores: React.FC<IndicadoresProps> = ({ titulo, quantia}) => {
    const { theme } = useTheme();
    const style = createStyles (theme);
  
  return (
      <View style={style.container}>
        <Text style={style.titulo}>
          {titulo}
        </Text>
        <Text style={style.quantia}>
          {quantia}
        </Text>
      </View>
  );
};


export default Indicadores;