import { StyleSheet } from "react-native";
import { themas } from "../../global/themes";

export const createStyles = (theme: any) => StyleSheet.create({
    button: {
        backgroundColor: theme.colors.primary, 
        paddingVertical: 19,
        paddingHorizontal: 130,
        borderRadius: 25, 
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: theme.colors.secondary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    
});
