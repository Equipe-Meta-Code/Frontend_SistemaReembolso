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
      { data: "27/05/2024", projeto: "Uber", valor: "R$ 14,80", status: "REPROVADO" },
      { data: "28/05/2024", projeto: "Ônibus", valor: "R$ 22,30", status: "APROVADO" },
      { data: "29/05/2024", projeto: "Ônibus", valor: "R$ 60,90", status: "APROVADO" },
      { data: "30/05/2024", projeto: "Uber", valor: "R$ 25,40", status: "APROVADO" },
      { data: "01/06/2024", projeto: "Táxi", valor: "R$ 48,00", status: "APROVADO" },
    ],
  },
  {
    categoria: "Hospedagem",
    icone: "🏨",
    itens: [
      { data: "27/05/2024", projeto: "Hotel", valor: "R$ 14,80", status: "APROVADO" },
      { data: "28/05/2024", projeto: "Hotel", valor: "R$ 22,30", status: "REPROVADO" },
      { data: "29/05/2024", projeto: "Hotel", valor: "R$ 60,90", status: "APROVADO" },
      { data: "30/05/2024", projeto: "Airbnb", valor: "R$ 120,00", status: "APROVADO" },
    ],
  },
  {
    categoria: "Alimentação",
    icone: "🍔",
    itens: [
      { data: "12/06/2024", projeto: "Restaurante", valor: "R$ 856,13", status: "APROVADO" },
      { data: "14/06/2024", projeto: "Lanchonete", valor: "R$ 45,90", status: "APROVADO" },
      { data: "15/06/2024", projeto: "Mercado", valor: "R$ 210,75", status: "APROVADO" },
    ],
  },
  {
    categoria: "Entretenimento",
    icone: "🎬",
    itens: [
      { data: "05/06/2024", projeto: "Cinema", valor: "R$ 50,00", status: "APROVADO" },
      { data: "10/06/2024", projeto: "Teatro", valor: "R$ 120,00", status: "REPROVADO" },
    ],
  },
  {
    categoria: "Educação",
    icone: "📚",
    itens: [
      { data: "02/06/2024", projeto: "Curso Online", valor: "R$ 299,99", status: "APROVADO" },
      { data: "03/06/2024", projeto: "Livro", valor: "R$ 89,90", status: "APROVADO" },
    ],
  },
  {
    categoria: "Saúde",
    icone: "⚕️",
    itens: [
      { data: "08/06/2024", projeto: "Consulta Médica", valor: "R$ 250,00", status: "APROVADO" },
      { data: "09/06/2024", projeto: "Farmácia", valor: "R$ 80,45", status: "APROVADO" },
    ],
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