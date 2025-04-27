import React, { forwardRef, LegacyRef } from "react";
import { TextInput, View, TextInputProps, Text, TouchableOpacity,StyleProp,TextStyle} from 'react-native';
import { MaterialIcons, FontAwesome, Octicons } from '@expo/vector-icons';
import { themas } from "../../global/themes";
import { style } from "./styles";

type IconComponent = React.ComponentType<React.ComponentProps<typeof MaterialIcons>> | 
                     React.ComponentType<React.ComponentProps<typeof FontAwesome>> | 
                     React.ComponentType<React.ComponentProps<typeof Octicons>>;

type Props = TextInputProps & {
    IconLeft?: IconComponent,
    IconRigth?: IconComponent,
    iconLeftName?: string,  
    iconRightName?: string, 
    title?: string,
    onIconLeftPress?: () => void, 
    onIconRigthPress?: () => void ,
    height?:number,
    labelStyle?:StyleProp<TextStyle>
}

export const Input = forwardRef((props: Props, ref: LegacyRef<TextInput> | null) => {
    const { IconLeft, IconRigth, iconLeftName, iconRightName, title, onIconLeftPress, onIconRigthPress, height,labelStyle,...rest } = props;


    return (
        <>
            {title && <Text style={style.inputTitle}>{title}</Text>}
            <View style={style.inputContainer}>
                {IconLeft && iconLeftName && (
                    <TouchableOpacity onPress={onIconLeftPress}>
                        <IconLeft name={iconLeftName as any} size={20} color={'#888'} style={style.iconRight} />
                    </TouchableOpacity>
                )}

                <View style={style.inputWrapper}>
                    <TextInput 
                        style={style.input}
                        ref={ref}
                        multiline={rest.multiline ?? false}
                        {...rest}
                    />

                    {IconRigth && iconRightName && (
                        <TouchableOpacity onPress={onIconRigthPress}>
                            <IconRigth name={iconRightName as any} size={24} color={'#888'} style={style.iconRight} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

        </>
    );
});