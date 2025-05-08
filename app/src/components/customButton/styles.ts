import { StyleSheet } from "react-native";
import { themas } from "../../global/themes"; // Se você quiser usar seu themas lindão!

export const styles = StyleSheet.create({
    button: {
        backgroundColor: themas.colors.primary, 
        paddingVertical: 19,
        paddingHorizontal: 130,
        borderRadius: 25, 
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: themas.colors.secondary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    
});
