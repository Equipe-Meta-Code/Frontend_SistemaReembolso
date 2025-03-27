import { StyleSheet, Dimensions } from "react-native";

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
        color: "#000000",
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
});