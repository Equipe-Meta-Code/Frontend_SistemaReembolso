import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createStyles } from "../../styles/historico.styles";
import { useTheme } from '../../context/ThemeContext';

const Header: React.FC = () => {
  const { theme } = useTheme();
  const styles = createStyles (theme);
  
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>
        Visualize seu <Text style={styles.highlight}>Histórico</Text> de Gastos!
      </Text>
    </View>
  );
};

export default Header;