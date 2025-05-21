import { StyleSheet, Dimensions } from "react-native";
import { themas } from "../../global/themes";

export const createStyles = (theme: any) => StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
    },
    titulo:{
        fontSize: 22,
        color: theme.colors.chumbo,
    },
    quantia: {
        fontSize: 28,
        fontWeight: "bold",
        color: theme.colors.black,
    },
    botao: {
        width: "100%",
        height: 50,
        borderRadius: 8,
        backgroundColor: theme.colors.secondary,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.cinza_claro,
      },    
    textoBotao: {
        fontSize: 18,
        fontWeight: "400",
        color: theme.colors.black,
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
        color: theme.colors.black,
    },
});