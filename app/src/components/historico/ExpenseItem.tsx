import React from "react";
import { View, Text } from "react-native";
import { styles } from "../../styles/historico.styles";

interface ExpenseItemProps {
  data: string;
  tipo: string;
  valor: string;
  status: string;
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({ data, tipo, valor, status }) => {
  return (
    <View style={styles.despesaItem}>
      <Text style={styles.data}>{data}</Text>
      <Text style={styles.tipoDespesa}>{tipo}</Text>
      <Text style={styles.valor}>{valor}</Text>
      <Text
        style={[
          styles.status,
          { color: status === "REPROVADO" ? "red" : status === "APROVADO" ? "green" : "#000000" }
        ]}
      >
        {status}
      </Text>

    </View>
  );
};

export default ExpenseItem;