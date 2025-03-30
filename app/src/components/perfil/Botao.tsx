import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { style } from "./styles";

interface CustomButtonProps {
  titulo: string;
  onPress: () => void;
  iconName?: string;
  iconSize?: number;
  iconColor?: string;
  style?: object;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  titulo,
  onPress,
  iconName,
  iconSize = 20,
  iconColor = '#000',
  style: customStyle,
  }) => {
  return (
    <TouchableOpacity style={[style.botao, customStyle]} onPress={onPress}>
      <Text style={style.textoBotao}>{titulo}</Text>
      {iconName && <Ionicons name={iconName} size={iconSize} color={iconColor} />}
    </TouchableOpacity>
  );
};

export default CustomButton;