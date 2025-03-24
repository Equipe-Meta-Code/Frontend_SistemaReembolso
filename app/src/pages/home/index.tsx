import React from "react";
import { View, FlatList, TouchableOpacity, Text } from "react-native";
import Header from "../../components/historico/Header";
import ExpenseSection from "../../components/historico/ExpenseSection";
import { styles } from "../../styles/historico.styles";

const despesas = [
  {
    categoria: "Transporte",
    icone: "🚖",
    itens: [
      { data: "27/05/2024", tipo: "Uber", valor: "R$ 14,80", status: "REPROVADO" },
      { data: "28/05/2024", tipo: "Ônibus", valor: "R$ 22,30", status: "APROVADO" },
      { data: "29/05/2024", tipo: "Ônibus", valor: "R$ 60,90", status: "APROVADO" },
      { data: "30/05/2024", tipo: "Uber", valor: "R$ 25,40", status: "APROVADO" },
    ],
  },
  {
    categoria: "Hospedagem",
    icone: "🏨",
    itens: [
      { data: "27/05/2024", tipo: "Hotel", valor: "R$ 14,80", status: "APROVADO" },
      { data: "28/05/2024", tipo: "Hotel", valor: "R$ 22,30", status: "REPROVADO" },
      { data: "29/05/2024", tipo: "Hotel", valor: "R$ 60,90", status: "APROVADO" },
    ],
  },
  {
    categoria: "Alimentação",
    icone: "🍔",
    itens: [{ data: "12/06/2024", tipo: "Restaurante", valor: "R$ 856,13", status: "APROVADO" }],
  },
];

const Historico: React.FC = () => {
  return (
    <View style={styles.container}>
      <Header />
      <FlatList
        data={despesas}
        keyExtractor={(item) => item.categoria}
        renderItem={({ item }) => <ExpenseSection {...item} />}
        contentContainerStyle={styles.listContainer}
      />

      <TouchableOpacity style={styles.fixedButton}>
        <Text style={styles.buttonText}>Projeto Makro</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Historico;