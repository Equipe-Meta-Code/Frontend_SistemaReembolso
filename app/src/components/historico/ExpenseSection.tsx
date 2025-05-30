import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import ExpenseItem from "./ExpenseItem";
import { createStyles, COLUMN_WIDTHS } from "../../styles/historico.styles";
import { useTheme } from '../../context/ThemeContext';
import { ScrollView } from "react-native";


interface Expense {
  data: string;
  projeto: string;
  valor: string;
  descricao: string;
  status: string;
}

interface ExpenseSectionProps {
  categoria: string;

  itens: Expense[];
}

const ExpenseSection: React.FC<ExpenseSectionProps> = ({ categoria, itens }) => {
  const { theme } = useTheme();
  const styles = createStyles (theme);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{categoria}</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        <View>
          {/* Cabeçalho das colunas */}
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, { width: COLUMN_WIDTHS.data }]}>Data</Text>
            <Text style={[styles.headerText, { width: COLUMN_WIDTHS.projeto }]}>Projeto</Text>
            <Text style={[styles.headerText, { width: COLUMN_WIDTHS.descricao }]}>Descrição</Text>
            <Text style={[styles.headerText, { width: COLUMN_WIDTHS.valor }]}>Valor</Text>
            <Text style={[styles.headerText, { width: COLUMN_WIDTHS.status }]}>Status</Text>
          </View>

          {itens.map((despesa, index) => (
            <ExpenseItem key={index} {...despesa} index={index} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default ExpenseSection;