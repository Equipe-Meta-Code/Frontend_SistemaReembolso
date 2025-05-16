import React from "react";
import { View, Text } from "react-native";
import { themas } from "../../global/themes";
import { createStyles } from "../../styles/historico.styles";
import { useTheme } from '../../context/ThemeContext';

interface ExpenseItemProps {
  data: string;
  projeto: string;
  valor: string;
  index: number;
  descricao: string;
  status: string;
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({ data, projeto, descricao, valor, status, index  }) => {
  const { theme } = useTheme();
  const styles = createStyles (theme);
  
  return (
    <View style={[styles.despesaItem, { backgroundColor: index % 2 === 0 ? theme.colors.cinza_muito_claro : themas.colors.secondary }]}>
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
                ? theme.colors.vinho
                : status === "Aprovado"
                ? theme.colors.verde_medio
                : status === "Pendente"
                ? theme.colors.mostarda
                : theme.colors.black
          }
        ]}
      >
        {status}
      </Text>
    </View>

  );
};

export default ExpenseItem;