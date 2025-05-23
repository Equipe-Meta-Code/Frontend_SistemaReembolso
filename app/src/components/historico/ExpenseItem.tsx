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
    <View style={[styles.despesaItem, { backgroundColor: index % 2 === 0 ? theme.colors.cinza_tabela : theme.colors.preto_tabela }]}>
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
                ? themas.colors.verde_medio_opaco
                : status === "Pendente"
                ? themas.colors.mostarda_escuro_opaco
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