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
    corTopo:{
        width: "100%",
        height: 140,
        backgroundColor: "#1F48AA",
        position: "absolute",
        borderRadius: 20,
    },
    topoPerfil: {
        marginTop: 60,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
    },
    imagemPerfil: {
        display: "flex",
        flexDirection: "column",
    },
    fotoPerfil: {
        width: 150,
        height: 150
    },
    nomeFuncionario: {
        fontSize: 28,
        fontWeight: "bold",
    },
    departamentoFuncionario: {
        fontSize: 22,
        color: "#494949",
    },
    departamento: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#d2ebfc",
        paddingTop: 5,
        paddingRight: 20,
        paddingBottom: 5,
        paddingLeft: 20,
        borderRadius: 20,
        maxWidth: 300,
    },
    departamentoTexto: {
        fontSize: 22,
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
        width: 300,
        height: 50,
        borderRadius: 56,
    },
    textoBotao: {
        fontSize: 24, 
        color: "#FFFFFF",
        fontWeight: "bold",
    },
    containerMostradores: {
        marginTop: 30,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 60,
    },
});