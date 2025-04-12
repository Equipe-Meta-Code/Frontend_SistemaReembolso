import React, { useState, useEffect } from "react";
import { View, FlatList, TouchableOpacity, Text } from "react-native";
import { useRoute } from "@react-navigation/native";
import Header from "../../components/historico/Header";
import ExpenseSection from "../../components/historico/ExpenseSection";
import { styles } from "../../styles/historico.styles";
import api2 from "../../services/api2";
import api from "../../services/api";

interface Despesa {
  _id: string;
  projetoId: string;
  userId: string;
  categoria: string;
  data: string;
  valor_gasto: number;
  descricao: string;
  aprovacao: string;
}

interface Projeto {
  _id: string;
  nome: string;
}

const Historico: React.FC = () => {
  interface RouteParams {
    projectId?: string;
  }

  const route = useRoute();
  const { projectId } = (route.params as RouteParams) || {};

  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [dataAtual, setDataAtual] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resDespesas, resProjetos] = await Promise.all([
          api2.get("/despesa"),
          api.get("/projetos"),
        ]);
  
        setDespesas(resDespesas.data);
        setProjetos(resProjetos.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };
  
    fetchData();
  
    const hoje = new Date();
    const dia = hoje.getDate().toString().padStart(2, "0");
    const mes = (hoje.getMonth() + 1).toString().padStart(2, "0");
    setDataAtual(`${dia}/${mes}`);
  }, []);
  

  const getNomeProjeto = (id: string) => {
    const projeto = projetos.find((p) => p._id === id);
    return projeto ? projeto.nome : `Projeto ${id}`;
  };

  const getIconeCategoria = (categoria: string) => {
    const icones: Record<string, string> = {
      Transporte: "🚖",
      Hospedagem: "🏨",
      Alimentação: "🍔",
      Entretenimento: "🎬",
      Educação: "📚",
      Saúde: "⚕️",
      Outros: "💼",
    };
  
    return icones[categoria] || "💰";
  };  

  const despesasAgrupadas = despesas.reduce((acc: any[], despesa) => {
    const nomeProjeto = getNomeProjeto(despesa.projetoId);

    const itemFormatado = {
      data: new Date(despesa.data).toLocaleDateString("pt-BR"),
      projeto: nomeProjeto,
      valor: `R$ ${despesa.valor_gasto.toFixed(2).replace(".", ",")}`,
      descricao: despesa.descricao,
      status: despesa.aprovacao,
    };

    const categoriaExistente = acc.find((c) => c.categoria === despesa.categoria);

    if (categoriaExistente) {
      categoriaExistente.itens.push(itemFormatado);
    } else {
      acc.push({
        categoria: despesa.categoria,
        icone: getIconeCategoria(despesa.categoria),
        itens: [itemFormatado],
      });
    }

    return acc;
  }, []);

  const despesasFiltradas = projectId
    ? despesasAgrupadas.map((categoria) => ({
        ...categoria,
        itens: categoria.itens.filter((item: any) => item.projeto === getNomeProjeto(projectId)),
      })).filter((categoria) => categoria.itens.length > 0)
    : despesasAgrupadas;

  const calcularTotal = () => {
    return despesasFiltradas
      .flatMap((categoria) => categoria.itens)
      .reduce((total, item) => {
        const valorNumerico = parseFloat(item.valor.replace("R$ ", "").replace(",", "."));
        return total + (isNaN(valorNumerico) ? 0 : valorNumerico);
      }, 0)
      .toFixed(2)
      .replace(".", ",");
  };

  const totalDespesas = calcularTotal();

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
