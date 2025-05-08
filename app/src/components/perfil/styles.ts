import { StyleSheet, Dimensions } from "react-native";
import { themas } from "../../global/themes";

export const style = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
    },
    titulo:{
        fontSize: 22,
        color: "#494949",
    },
    quantia: {
        fontSize: 28,
        fontWeight: "bold",
        color: themas.colors.black,
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
        borderBottomColor: "themas.colors.cinza_claro",
      },    
    textoBotao: {
        fontSize: 18,
        fontWeight: "400",
        color: themas.colors.black,
    },  
    botaoTopo: {
        width: "auto",
        height: 50,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    textoBotaoTopo: {
        fontSize: 18,
        fontWeight: "400",
        color: themas.colors.black,
    },
});