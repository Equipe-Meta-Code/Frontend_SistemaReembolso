import React, { useState, useEffect } from "react";
import { View, FlatList, TouchableOpacity, Text } from "react-native";
import { useRoute } from "@react-navigation/native";
import Header from "../../components/historico/Header";
import ExpenseSection from "../../components/historico/ExpenseSection";
import { styles } from "../../styles/historico.styles";
import api from "../../services/api";
import { RootState } from "../../(redux)/store";
import { useSelector } from "react-redux";

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
  projetoId: string;
  nome: string;
  funcionarios: Array<Funcionario>;
}

interface Categoria {
  categoriaId: string;
  nome: string;
}

interface Funcionario {
  userId: string;
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
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [dataAtual, setDataAtual] = useState("");
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resDespesas, resProjetos, resCategorias] = await Promise.all([
          api.get("/despesa"),
          api.get("/projeto"),
          api.get("/categorias"),
        ]);

        setDespesas(resDespesas.data);
        const userId = user?.userId?.toString();

        const projetosFiltrados = resProjetos.data.filter((projeto: any) =>
          projeto.funcionarios?.some((funcionario: any) => String(funcionario.userId) === String(userId))
        );

        setProjetos(projetosFiltrados);
        setCategorias(resCategorias.data);
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
    const projeto = projetos.find((p) => String(p.projetoId) === String(id));
    return projeto ? projeto.nome : `Projeto ${id}`;
  };

  const iconesCategorias: Record<string, string> = {
    Transporte: "🚖",
    Hospedagem: "🏨",
    Alimentação: "🍔",
    Entretenimento: "🎬",
    Educação: "📚",
    Saúde: "⚕️",
    Outros: "💼",
  };

  const getIconeCategoria = (categoriaId: string) => {
    const categoria = categorias.find(c => String(c.categoriaId) === String(categoriaId));
    if (categoria) {
      return iconesCategorias[categoria.nome] || "💰";
    }
    return "💰";
  };

  const getNomeCategoria = (categoriaId: string) => {
    const categoria = categorias.find(c => String(c.categoriaId) === String(categoriaId));
    return categoria ? categoria.nome : `Categoria ${categoriaId}`;
  };  
  
  const userId = user?.userId?.toString();
  
  const despesasFiltradasUsuario = despesas.filter((d) => String(d.userId) === String(userId));
  
  const despesasDoProjeto = projectId
    ? despesasFiltradasUsuario.filter((d) => String(d.projetoId) === String(projectId))
    : despesasFiltradasUsuario

    const despesasAgrupadas = despesasDoProjeto.reduce((acc: any[], despesa) => {
      const nomeProjeto = getNomeProjeto(String(despesa.projetoId));
      const nomeCategoria = getNomeCategoria(despesa.categoria); // 👈 Pega o nome correto aqui
      
      const itemFormatado = {
        data: new Date(despesa.data).toLocaleDateString("pt-BR"),
        projeto: nomeProjeto,
        projetoId: despesa.projetoId,
        valor: `R$ ${despesa.valor_gasto.toFixed(2).replace(".", ",")}`,
        descricao: despesa.descricao,
        status: despesa.aprovacao,
      };
    
      const categoriaExistente = acc.find((c) => c.categoria === nomeCategoria);
    
      if (categoriaExistente) {
        categoriaExistente.itens.push(itemFormatado);
      } else {
        const novaCategoria = {
          categoria: nomeCategoria,
          icone: getIconeCategoria(despesa.categoria), 
          itens: [itemFormatado],
        };
        acc.push(novaCategoria);
      }
    
      return acc;
    }, []);
    
  const calcularTotal = () => {
    return despesasAgrupadas
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
        data={despesasAgrupadas}
        keyExtractor={(item) => `${item.categoria}`}
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
