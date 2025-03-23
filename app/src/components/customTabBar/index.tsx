import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { style } from "./styles";
import {FontAwesome5, MaterialCommunityIcons, Octicons, SimpleLineIcons } from '@expo/vector-icons'

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
  
  const go = (screenName:string) => {
    navigation.navigate(screenName)
  }

  return (
    <View style={style.tabArea}>

      <TouchableOpacity 
        style={style.tabItemHome}
        onPress={()=>go("Home")}
      >
              <Octicons
                name="home"
                style={style.iconHome}
              />
              <Text
                style={style.textHome}
              >
                Home</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={style.tabItemCenter}
        onPress={() => go("Registrar")}
      >
          <SimpleLineIcons
            name="plus"
            style={style.iconCenter}
          />
      </TouchableOpacity>

      <View 
        style={style.tabItemRight}>
        
        <TouchableOpacity 
          style={style.tabItem}
          onPress={() => go("Historico")}
        >
            <MaterialCommunityIcons
              name="file-document-edit"
              style={style.iconRight}
            />
        </TouchableOpacity>

        <TouchableOpacity 
          style={style.tabItem}
          onPress={() => go("Perfil")}
        >
            <FontAwesome5
              name="user"
              style={style.iconRight}
            />
        </TouchableOpacity>
      </View>

    </View>
  );
};

export default CustomTabBar;