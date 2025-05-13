import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { style } from "./styles";
import { themas } from '../../global/themes';

interface BotaoOpcaoProps {
  titulo: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  trackColor?: { false: string; true: string };
  thumbColor?: string;
  style?: object;
}

const BotaoOpcao: React.FC<BotaoOpcaoProps> = ({
  titulo,
  value,
  onValueChange,
  trackColor = { false: themas.colors.cinza_claro, true: themas.colors.primary },
  thumbColor = themas.colors.secondary,
  style: customStyle,
}) => {
  return (
    <View style={[style.botao, customStyle]}>
      <Text style={style.textoBotao}>{titulo}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={trackColor}
        thumbColor={value ? thumbColor : themas.colors.cinza_muito_claro} 
      />
    </View>
  );
};

export default BotaoOpcao;1