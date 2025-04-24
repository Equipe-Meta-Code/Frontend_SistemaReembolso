import React, { useState, useEffect } from "react";
import { View, FlatList, TouchableOpacity, Text } from "react-native";
import { useRoute } from "@react-navigation/native";
import Header from "../../components/historico/Header";
import ExpenseSection from "../../components/historico/ExpenseSection";
import { styles } from "../../styles/historico.styles";
import { RootState } from "../../(redux)/store";
import { useSelector } from "react-redux";
import api from "../../api";
import api2 from "../../services/api";


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
  id: string;
  name: string;
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
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resDespesas, resProjetos] = await Promise.all([
          api2.get("/despesa"),
          api.get("/projetos"),
        ]);
    
        setDespesas(resDespesas.data);
        const userId = user?.userId?.toString();
    
        const todosProjetos = resProjetos.data.flatMap((entry: any) => entry.projects || []);
    
        const projetosFiltrados = todosProjetos.filter((projeto: any) =>
          projeto.funcionarios?.some((funcionario: any) => funcionario.id === userId)
        );
    
        setProjetos(projetosFiltrados);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };
    
  
    fetchData();
  
    const hoje = new Date();
    const dia = hoje.getDate().toString().padStart(2, "0");
    const mes = (hoje.getMonth() + 1).toString().padStart(2, "0");
    setDataAtual(`${dia}/${mes}`);
  }, [user]);
 
  const getNomeProjeto = (id: string) => {
    const projeto = projetos.find((p) => String(p.id) === String(id));
    return projeto ? projeto.name : `teste ${id}`;
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
  

  const despesasDoProjeto = projectId
  ? despesas.filter((d) =>  String(d.projetoId) === String(projectId))
  : despesas.filter((d) => projetos.some((p) => String(p.id) === String(d.projetoId)));

const despesasAgrupadas = despesasDoProjeto.reduce((acc: any[], despesa) => {
  const nomeProjeto = getNomeProjeto(String(despesa.projetoId));

  const itemFormatado = {
    data: new Date(despesa.data).toLocaleDateString("pt-BR"),
    projeto: nomeProjeto,
    projetoId: despesa.projetoId,
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
? despesasAgrupadas
    .map((categoria) => ({
      ...categoria,
      itens: categoria.itens.filter((item: any) => String(item.projetoId) === String(projectId)),
    }))
    .filter((categoria) => categoria.itens.length > 0)
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
      {despesasFiltradas.length === 0 && (
        <Text style={{ textAlign: 'center', marginTop: 20, color: 'gray' }}>
          Nenhuma despesa encontrada.
        </Text>
        )}
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
