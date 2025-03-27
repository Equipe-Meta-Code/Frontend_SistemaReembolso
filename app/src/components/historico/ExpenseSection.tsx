import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import ExpenseItem from "./ExpenseItem";
import { styles } from "../../styles/historico.styles";


interface Expense {
  data: string;
  projeto: string;
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

      {/* Cabeçalho das colunas */}
      <View style={styles.tableHeader}>
        <Text style={styles.headerText}>Data</Text>
        <Text style={styles.headerText}>Projeto</Text>
        <Text style={styles.headerText}>Valor</Text>
        <Text style={styles.headerText}>Status</Text>
      </View>
      
      {itens.map((despesa, index) => (
        <ExpenseItem key={index} {...despesa} index={index} />
      ))}

    </View>
  );
};

export default ExpenseSection;