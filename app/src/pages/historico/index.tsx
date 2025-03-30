import React, { useState, useEffect } from "react";
import { View, FlatList, TouchableOpacity, Text } from "react-native";
import { useRoute } from "@react-navigation/native";
import Header from "../../components/historico/Header";
import ExpenseSection from "../../components/historico/ExpenseSection";
import { styles } from "../../styles/historico.styles";

const despesas = [
  {
    categoria: "Transporte",
    icone: "🚖",
    itens: [
      { data: "27/05/2024", projeto: "Projeto Alpha", valor: "R$ 14,80" },
      { data: "28/05/2024", projeto: "Projeto Beta", valor: "R$ 22,30" },
      { data: "29/05/2024", projeto: "Projeto Gama", valor: "R$ 60,90" },
      { data: "30/05/2024", projeto: "Projeto Delta", valor: "R$ 25,40" },
      { data: "01/06/2024", projeto: "Projeto Epsilon", valor: "R$ 48,00" },
    ],
  },
  {
    categoria: "Hospedagem",
    icone: "🏨",
    itens: [
      { data: "27/05/2024", projeto: "Projeto Zeta", valor: "R$ 14,80" },
      { data: "28/05/2024", projeto: "Projeto Theta", valor: "R$ 22,30" },
      { data: "29/05/2024", projeto: "Projeto Iota", valor: "R$ 60,90"},
      { data: "30/05/2024", projeto: "Projeto Alpha", valor: "R$ 120,00"},
      { data: "30/05/2024", projeto: "Projeto Epsilon", valor: "R$ 7,48"},

    ],
  },
  {
    categoria: "Alimentação",
    icone: "🍔",
    itens: [
      { data: "12/06/2024", projeto: "Projeto Theta", valor: "R$ 856,13" },
      { data: "14/06/2024", projeto: "Projeto Alpha", valor: "R$ 45,90" },
      { data: "15/06/2024", projeto: "Projeto Beta", valor: "R$ 210,75" },
    ],
  },
  {
    categoria: "Entretenimento",
    icone: "🎬",
    itens: [
      { data: "05/06/2024", projeto: "Projeto Gama", valor: "R$ 50,00"},
      { data: "10/06/2024", projeto: "Projeto Alpha", valor: "R$ 120,00" },
    ],
  },
  {
    categoria: "Educação",
    icone: "📚",
    itens: [
      { data: "02/06/2024", projeto: "Projeto Zeta", valor: "R$ 299,99" },
      { data: "03/06/2024", projeto: "Projeto Beta", valor: "R$ 89,90" },
    ],
  },
  {
    categoria: "Saúde",
    icone: "⚕️",
    itens: [
      { data: "08/06/2024", projeto: "Projeto Delta", valor: "R$ 250,00"},
      { data: "09/06/2024", projeto: "Projeto Iota", valor: "R$ 80,45" },
    ],
  },
];


const Historico: React.FC = () => {
  interface RouteParams {
    projectId?: string;
  }
  
  const route = useRoute();
  const { projectId } = route.params as RouteParams || {};

  const despesasFiltradas = projectId
    ? despesas.map((categoria) => ({
        ...categoria,
        itens: categoria.itens.filter((item) => item.projeto === projectId),
      })).filter((categoria) => categoria.itens.length > 0)
    : despesas;

  const calcularTotal = () => {
    return despesasFiltradas
      .flatMap((categoria) => categoria.itens)
      .reduce((total, item) => total + parseFloat(item.valor.replace("R$ ", "").replace(",", ".")), 0)
      .toFixed(2)
      .replace(".", ",");
  };

  const totalDespesas = calcularTotal();
  const [dataAtual, setDataAtual] = useState("");

  useEffect(() => {
    const hoje = new Date();
    const dia = hoje.getDate().toString().padStart(2, "0");
    const mes = (hoje.getMonth() + 1).toString().padStart(2, "0");
    setDataAtual(`${dia}/${mes}`);
  }, []);

  return (
    <View style={styles.container}>
      <Header />
      <FlatList
        data={despesasFiltradas}
        keyExtractor={(item) => item.categoria}
        renderItem={({ item }) => <ExpenseSection {...item} />}
        contentContainerStyle={styles.listContainer}
      />
      
      <TouchableOpacity style={styles.fixedButton}>
        <View style={styles.circleButton}>
          <Text style={styles.circleText}>{dataAtual}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.buttonText}>Total de Despesas</Text>
          <Text style={styles.buttonValue}>R$ {totalDespesas}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Historico;