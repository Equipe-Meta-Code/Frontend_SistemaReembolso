import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { themas } from "../../global/themes";
import { createStyles } from "./styles";
import { useTheme } from '../../context/ThemeContext';
import {
  FontAwesome5,
  MaterialCommunityIcons,
  Octicons,
  SimpleLineIcons,
} from "@expo/vector-icons";

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const { theme } = useTheme();
  const style = createStyles (theme);

  const go = (screenName: string) => {
    navigation.navigate(screenName);
  };

  const isFocused = (screenName: string) => {
    return state.routes[state.index].name === screenName;
  };

  return (
    <View style={style.tabArea}>

      {/* botão home */}
      <TouchableOpacity
        style={style.tabItemHome}
        onPress={() => go("Home")}
      >
        <Octicons
          name="home"
          style={[style.iconHome, isFocused("Home") && { color: theme.colors.sempre_branco }]}
        />
        <Text style={[style.textHome, isFocused("Home") && { color: theme.colors.sempre_branco }]}>
          Home
        </Text>
      </TouchableOpacity>

      {/* botão registrar */}
      <TouchableOpacity
        style={style.tabItemCenter}
        onPress={() => go("Registrar")}
      >
        <SimpleLineIcons
          name="plus"
          style={[style.iconCenter, isFocused("Registrar") && { color: theme.colors.primary }]}
        />
      </TouchableOpacity>

      {/* botão histórico */}
      <View style={style.tabItemRight}>
        <TouchableOpacity style={style.tabItem} onPress={() => go("Historico")}>
          <MaterialCommunityIcons
            name="file-document-edit"
            style={[style.iconRight, isFocused("Historico") && { color: theme.colors.primary }]}
          />
          <Text style={[style.textRight, isFocused("Historico") && { color: theme.colors.primary }]}>
            Histórico
          </Text>
        </TouchableOpacity>

        {/* botão perfil */}
        <TouchableOpacity style={style.tabItem} onPress={() => go("Perfil")}>
          <FontAwesome5
            name="user"
            style={[style.iconRight, isFocused("Perfil") && { color: theme.colors.primary }]}
          />
          <Text style={[style.textRight, isFocused("Perfil") && { color: theme.colors.primary }]}>
            Perfil
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomTabBar;
