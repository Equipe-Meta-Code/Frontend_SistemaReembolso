import { StyleSheet, Dimensions } from "react-native";
import { themas } from "../../global/themes";

const { width, height } = Dimensions.get("window");

export const style = StyleSheet.create({
   tabArea: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      height: 60,
      backgroundColor: "#fff",
      paddingHorizontal: 20,
    },
    tabItemHome: {
      alignItems: "center",
    },
    tabItemCenter: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: "#007AFF",
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      bottom: 15,
      left: "50%",
      marginLeft: -25,
    },
    tabItemRight: {
      flexDirection: "row",
    },
    tabItem: {
      marginLeft: 20,
    },
    iconHome: {
      fontSize: 24,
      color: "gray",
    },
    iconCenter: {
      fontSize: 24,
      color: "white",
    },
    iconRight: {
      fontSize: 24,
      color: "gray",
    },
    textHome: {
      fontSize: 12,
      color: "gray",
    },

})