import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createStyles } from './styles';
import { useTheme } from '../../context/ThemeContext';

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
  iconColor,
  style: customStyle,
}) => {
  const { theme } = useTheme();
  const style = createStyles(theme);
  const finalIconColor = iconColor || theme.colors.black; 

  return (
    <TouchableOpacity style={[style.botao, customStyle]} onPress={onPress}>
      <Text style={style.textoBotao}>{titulo}</Text>
      {iconName && <Ionicons name={iconName} size={iconSize} color={finalIconColor} />}
    </TouchableOpacity>
  );
};

export default CustomButton;
