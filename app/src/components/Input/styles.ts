import { StyleSheet, Dimensions } from "react-native";
import { themas } from "../../global/themes";


export const style = StyleSheet.create({
    inputTitle: {
        paddingTop: 5,
        fontSize: 16,
        color: themas.colors.black,
        marginTop: 20,
        alignSelf: 'flex-start',
        marginLeft: 10,
    },
    inputContainer: {
        width: '100%',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: themas.colors.gray,
        borderRadius: 5,
        paddingHorizontal: 10,
        height: 40,
        marginTop: 5,
    },
    input: {
        flex: 1,
        color: themas.colors.black,
    },
    iconRight: {
        marginLeft: 10,
    },
    erroInput: {
        borderColor: themas.colors.red,
    },
    erroTexto: {
        color: themas.colors.red,
        fontSize: 12,
        marginTop: 4,
        marginBottom: 8,
    },
});