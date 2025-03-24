import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { style } from "./styles";

interface IndicadoresProps {
  titulo: string;
  quantia: string;
}

const Indicadores: React.FC<IndicadoresProps> = ({ titulo, quantia}) => {
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