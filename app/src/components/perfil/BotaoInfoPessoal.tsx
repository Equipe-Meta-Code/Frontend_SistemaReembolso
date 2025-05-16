import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { themas } from '../../global/themes';
import { createStyles } from "./styles";
import { useTheme } from '../../context/ThemeContext'; 

interface CustomButtonProps {
  titulo: string;
  onPress: () => void;
  iconName?: string;
  iconSize?: number;
  iconColor?: string;
  style?: object;
}
    

const BotaoInfoPessoal: React.FC<CustomButtonProps> = ({
  titulo,
  onPress,
  iconName,
  iconSize = 20,
  iconColor = themas.colors.black,
  style: customStyle,
  }) => {

  const { theme } = useTheme();
  const style = createStyles (theme);
    
  return (
    <TouchableOpacity style={style.botaoTopo} onPress={onPress}>
      <Text style={style.textoBotaoTopo}>{titulo}</Text>
    </TouchableOpacity>
  );
};

export default BotaoInfoPessoal;