import { StyleSheet, Dimensions } from "react-native";
import { themas } from "../../global/themes";

const { width, height } = Dimensions.get("window");

export const style = StyleSheet.create({
  tabArea:{
    flexDirection:'row',
    height: height * 0.09,
    alignItems:'center',
    paddingHorizontal: width * 0.05,
    backgroundColor: themas.colors.secondary,
    shadowColor: "#000",
    shadowOffset:{
        width:0,
        height:3,
    },
    elevation: 8,
 },

 tabItem:{
    justifyContent: 'center',
    alignItems: 'center',
 },

 tabItemHome:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent: 'center',
    position:'absolute',
    backgroundColor:themas.colors.primary,
    height: height * 0.065,
    width: width * 0.29,
    borderRadius: width * 0.175,
    left: width * 0.06,
    paddingHorizontal: width * 0.04,
    zIndex:9999,
 },

 iconHome: {
    fontSize: width * 0.05,
    color: "white",
    paddingRight: width * 0.02,
    paddingLeft: width * 0.02,
 },

 textHome: {
    fontSize: width * 0.039,
    color: "white",
 },

 tabItemCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 150,
    marginRight: 150,
 },

 iconCenter: {
    fontSize: width * 0.1,
    color: "black",
 },

 textCenter: {
   fontSize: width * 0.03,
   color: "black",
   marginTop: 4,
 },

 tabItemRight: {
    flexDirection: "row",
    position: "absolute",
    right: width * 0.10,
    gap: width * 0.06,
    width: 110,
    height: 80,
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex:9999,
 },

 iconRight: {
    fontSize: width * 0.055,
    color: "black",
 },

 textRight: {
   fontSize: width * 0.03,
   color: "black",
   marginTop: 4,
   textAlign: 'center',
 },

})