import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../styles/historico.styles";

const Header: React.FC = () => {

  return (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton} 
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>
        Visualize seu <Text style={styles.highlight}>Histórico</Text> de Gastos!
      </Text>
    </View>
  );
};

export default Header;