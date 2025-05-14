import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { style } from './styles';
import { useTheme } from '../../context/ThemeContext'; 

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
  trackColor,
  thumbColor,
  style: customStyle,
}) => {
  const { theme } = useTheme();

  const track = trackColor || {
    false: theme.colors.cinza_claro,
    true: theme.colors.primary,
  };

  const thumb = value
    ? thumbColor || theme.colors.secondary
    : theme.colors.cinza_muito_claro;

  return (
    <View style={[style.botao, customStyle]}>
      <Text style={style.textoBotao}>{titulo}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={track}
        thumbColor={thumb}
      />
    </View>
  );
};

export default BotaoOpcao;
