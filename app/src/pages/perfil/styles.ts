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
        gap: 5,
    },
    imagemPerfil: {
        display: "flex",
        flexDirection: "column",
    },
    fotoPerfil: {
        width: 150,
        height: 150,
        borderRadius: 100,
        borderWidth: 3,
        borderColor: "#FFFFFF",
    },
    nomeFuncionario: {
        fontSize: 28,
        fontWeight: "bold",
    },
    emailFuncionario: {
        fontSize: 22,
        fontWeight: "400",
        color: "#494949",
    },
    divisor: {
        marginTop: 20,
        width: "90%",  
        height: 1,  
        backgroundColor: "#E0E0E0",  
        marginVertical: 15,  
        alignSelf: "center",  
    },    
    subtituloContainer: {
        marginTop: 30,
        width: "90%",
        alignSelf: "center",
        alignItems: "flex-start", // Alinha o conteúdo à esquerda
    },
       
    subtitulo: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "left", // Garante que o texto esteja alinhado à esquerda
    },    
    containerBotoes: {
        marginTop: 10,
        width: "90%",
        backgroundColor: "#ffffff",
        borderRadius: 12,
        padding: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: "#cecece",
    },
    botao: {
        width: "100%",
        height: 50,
        borderRadius: 8,
        backgroundColor: "#ffffff",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
    },    
    textoBotao: {
        fontSize: 18,
        fontWeight: "400",
        color: "#000000",
    },    
    containerMostradores: {
        marginTop: 10,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 60,
    },
});