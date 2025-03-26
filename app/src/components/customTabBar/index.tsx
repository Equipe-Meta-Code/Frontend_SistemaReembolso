import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { style } from "./styles";
import {
  FontAwesome5,
  MaterialCommunityIcons,
  Octicons,
  SimpleLineIcons,
} from "@expo/vector-icons";

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const go = (screenName: string) => {
    navigation.navigate(screenName);
  };

  const isFocused = (screenName: string) => {
    return state.routes[state.index].name === screenName;
  };

  return (
    <View style={style.tabArea}>
      <TouchableOpacity
        style={style.tabItemHome}
        onPress={() => go("Home")}
      >
        <Octicons
          name="home"
          style={[style.iconHome, isFocused("Home") && { color: "blue" }]}
        />
        <Text style={[style.textHome, isFocused("Home") && { color: "blue" }]}>
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={style.tabItemCenter}
        onPress={() => go("Registrar")}
      >
        <SimpleLineIcons
          name="plus"
          style={[style.iconCenter, isFocused("Registrar") && { color: "blue" }]}
        />
      </TouchableOpacity>

      <View style={style.tabItemRight}>
        <TouchableOpacity style={style.tabItem} onPress={() => go("Historico")}>
          <MaterialCommunityIcons
            name="file-document-edit"
            style={[style.iconRight, isFocused("Historico") && { color: "blue" }]}
          />
        </TouchableOpacity>

        <TouchableOpacity style={style.tabItem} onPress={() => go("Perfil")}>
          <FontAwesome5
            name="user"
            style={[style.iconRight, isFocused("Perfil") && { color: "blue" }]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomTabBar;
