import React from "react";
import { View, Text } from "react-native";
import { styles } from "../../styles/historico.styles";
import { themas } from "../../global/themes";

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
    <View style={[styles.despesaItem, { backgroundColor: index % 2 === 0 ? themas.colors.cinza_muito_claro : themas.colors.secondary }]}>
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
                ? themas.colors.vinho
                : status === "Aprovado"
                ? themas.colors.verde_medio
                : status === "Pendente"
                ? themas.colors.mostarda
                : themas.colors.black
          }
        ]}
      >
        {status}
      </Text>
    </View>

  );
};

export default ExpenseItem;