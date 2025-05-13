import React, { forwardRef, LegacyRef } from "react";
import { TextInput, View, TextInputProps, Text, TouchableOpacity, StyleProp, TextStyle } from 'react-native';
import { MaterialIcons, FontAwesome, Octicons } from '@expo/vector-icons';
import { style } from "./styles";
import { themas } from "../../global/themes";

type IconComponent = React.ComponentType<React.ComponentProps<typeof MaterialIcons>> | 
                     React.ComponentType<React.ComponentProps<typeof FontAwesome>> | 
                     React.ComponentType<React.ComponentProps<typeof Octicons>>;

type Props = TextInputProps & {
    IconLeft?: IconComponent;
    IconRigth?: IconComponent;
    iconLeftName?: string;  
    iconRightName?: string; 
    title?: string;
    onIconLeftPress?: () => void; 
    onIconRigthPress?: () => void;
    height?: number;
    labelStyle?: StyleProp<TextStyle>;
    /** sinaliza erro para borda e texto */
    error?: boolean;
};

export const Input = forwardRef((props: Props, ref: LegacyRef<TextInput> | null) => {
    const {IconLeft, IconRigth, iconLeftName, iconRightName, title, onIconLeftPress, onIconRigthPress, height, labelStyle, error = false, ...rest} = props;

    return (
        <>
            {title && <Text style={style.inputTitle}>{title}</Text>}
            <View style={style.inputContainer}>
                <View style={[
                    style.inputWrapper,
                    error && style.erroInput,
                    height ? { height } : undefined
                ]}>
                    {IconLeft && iconLeftName && (
                        <TouchableOpacity onPress={onIconLeftPress}>
                            <IconLeft name={iconLeftName as any} size={20} color={themas.colors.gray} style={style.iconRight} />
                        </TouchableOpacity>
                    )}

                    <TextInput
                        ref={ref}
                        style={style.input}
                        multiline={rest.multiline ?? false}
                        {...rest}
                    />

                    {IconRigth && iconRightName && (
                        <TouchableOpacity onPress={onIconRigthPress}>
                            <IconRigth name={iconRightName as any} size={24} color={themas.colors.gray} style={style.iconRight} />
                        </TouchableOpacity>
                    )}
                </View>
                {error && <Text style={style.erroTexto}>Campo inválido</Text>}
            </View>
        </>
    );
});