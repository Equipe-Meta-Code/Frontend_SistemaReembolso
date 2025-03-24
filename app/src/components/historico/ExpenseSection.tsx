import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import ExpenseItem from "./ExpenseItem";
import { styles } from "../../styles/historico.styles";


interface Expense {
  data: string;
  tipo: string;
  valor: string;
  status: string;
}

interface ExpenseSectionProps {
  categoria: string;
  icone: string;
  itens: Expense[];
}

const ExpenseSection: React.FC<ExpenseSectionProps> = ({ categoria, icone, itens }) => {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.iconWrapper}>
          <Text style={styles.icon}>{icone}</Text>
        </View>
        <Text style={styles.sectionTitle}>{categoria}</Text>
      </View>

      {itens.map((despesa, index) => (
        <ExpenseItem key={index} {...despesa} />
      ))}
    </View>
  );
};

export default ExpenseSection;