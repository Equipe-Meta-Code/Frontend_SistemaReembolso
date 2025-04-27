import React from "react";
import { View, Text } from "react-native";
import { styles } from "../../styles/historico.styles";

interface ExpenseItemProps {
  data: string;
  projeto: string;
  valor: string;
  index: number;
  descricao: string;
  status: string;
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({ data, projeto, descricao, valor, status, index  }) => {
  return (
    <View style={[styles.despesaItem, { backgroundColor: index % 2 === 0 ? "#F8F8F8" : "#FFFFFF" }]}>
      <Text style={styles.data}>{data}</Text>
      <Text style={styles.tipoDespesa}>{projeto}</Text>
      <Text style={styles.tipoDespesa}>{descricao}</Text>
      <Text style={styles.valor}>{valor}</Text>
      <Text
        style={[
          styles.status,
          {
            color:
              status === "Recusado"
                ? "rgba(224, 7, 7, 0.8)"
                : status === "Aprovado"
                ? "rgba(10, 138, 16, 0.87)"
                : status === "Pendente"
                ? "rgba(255, 188, 20, 0.87)"
                : "#000000"
          }
        ]}
      >
        {status}
      </Text>
    </View>

  );
};

export default ExpenseItem;