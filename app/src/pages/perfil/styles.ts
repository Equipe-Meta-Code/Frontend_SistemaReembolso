import { StyleSheet, Dimensions } from "react-native";

export const style = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        backgroundColor: "#FFFFFF",
        padding: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    topoPerfil: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    imagemPerfil: {
        display: "flex",
        flexDirection: "column",
    },
    fotoPerfil: {
        width: 300,
        height: 300
    },
    nomeFuncionario: {
        fontSize: 30,
        fontWeight: "bold"
    },
    departamento: {
        marginTop: 10,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#c6e8ff",
        paddingTop: 5,
        paddingRight: 10,
        paddingBottom: 5,
        paddingLeft: 10,
        borderWidth: 1,
        borderColor: '#1F48AA',
        borderStyle: 'solid',
        borderRadius: 20,
        maxWidth: 300,
    },
    departamentoTexto: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#494949",
    },
    botoes: {
        marginTop: 20,
        gap: 20,
    },
    editContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1F48AA",
        width: 380,
        height: 50,
        borderRadius: 56,
    },
    textoBotao: {
        fontSize: 24, 
        color: "#FFFFFF",
        fontWeight: "bold",
    },
});