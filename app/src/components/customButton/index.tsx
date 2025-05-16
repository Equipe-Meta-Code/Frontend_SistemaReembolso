import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { createStyles } from "./styles"; // Importa os estilos
import { StyleProp, TextStyle, ViewStyle } from "react-native";
import { useTheme } from '../../context/ThemeContext';

type Props = {
    title: string;
    onPress: () => void;
    buttonStyle?: StyleProp<ViewStyle>;
    loading?: boolean;
    textStyle?: StyleProp<TextStyle>;
}

export function ButtonCustom({ title, onPress, buttonStyle, textStyle }: Props) {
    const { theme } = useTheme();
    const styles = createStyles (theme);

    return (
        <TouchableOpacity 
            style={[styles.button, buttonStyle]} 
            onPress={onPress}
            activeOpacity={0.8}
        >
            <Text style={[styles.buttonText, textStyle]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
}
