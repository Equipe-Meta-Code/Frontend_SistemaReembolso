import { StyleSheet, Platform } from "react-native";
import { themas } from "../../global/themes";

export const style = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        backgroundColor: themas.colors.secondary,
        padding: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    corTopo:{
        width: "100%",
        height: 140,
        backgroundColor: themas.colors.primary,
        position: "absolute",
        borderRadius: 20,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
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
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center",
    },
    fotoPerfil: {
        width: 150,
        height: 150,
        borderRadius: 100,
        borderWidth: 3,
        borderColor: themas.colors.secondary,
    },
    nomeFuncionario: {
        fontSize: 28,
        fontWeight: "bold",
    },
    emailFuncionario: {
        fontSize: 22,
        fontWeight: "400",
        color: themas.colors.chumbo,
    },
    divisor: {
        marginTop: 20,
        width: "90%",  
        height: 1,  
        backgroundColor: themas.colors.cinza_claro,  
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
        backgroundColor: themas.colors.secondary,
        borderRadius: 12,
        padding: 5,
        shadowColor: themas.colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: themas.colors.cinza_claro,
    },
    botao: {
        width: "100%",
        height: 50,
        borderRadius: 8,
        backgroundColor: themas.colors.secondary,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: themas.colors.cinza_claro,
    },    
    textoBotao: {
        fontSize: 18,
        fontWeight: "400",
        color: themas.colors.black,
    },    
    containerMostradores: {
        marginTop: 10,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 60,
    },
    containerBotoesTopo: {

        marginBottom: 20,
        display: "flex",
        flexDirection: "row",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        position: "relative",
        ...Platform.select({
            ios:   { marginTop: 60 },  // iOS
            android: { marginTop: 40 }, // Android (ou outro valor que você queira)
            default: { marginTop: 40 }  // fallback
        }),
    },
    titulo: {
        fontSize: 22,
        fontWeight: "bold",
        color: themas.colors.black,
        position: "absolute",
        alignSelf: "center",
    },
});