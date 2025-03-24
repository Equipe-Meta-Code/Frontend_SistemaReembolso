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
    }
});