import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import api from '../../services/api';
import PacoteCard from '../../components/home/PacoteCard';


interface Despesa {
  despesaId: string;
  projetoId: string;
  userId: string;
  categoria: string;
  data: string;
  valor_gasto: number;
  descricao: string;
  aprovacao: string;
}

interface Pacote {
  pacoteId: string;
  nome: string;
  projetoId: string;
  userId: string;
  status: string[];
  despesas?: string[];
}

const PacotesScreen = ({ route }: any) => {
  const { projectId } = route.params;
  const [pacotes, setPacotes] = useState<Pacote[]>([]);
  const [despesasMap, setDespesasMap] = useState<Record<string, Despesa>>({});

  useEffect(() => {
    const fetchPacotesEComDespesas = async () => {
      try {
        const response = await api.get<Pacote[]>('/pacote');
        const pacotesDoProjeto = response.data.filter((p) => p.projetoId === projectId);

        setPacotes(pacotesDoProjeto);

        // Juntar todos os IDs de despesas
        const allDespesaIds = pacotesDoProjeto.flatMap(p => p.despesas || []);

        if (allDespesaIds.length > 0) {
          const despesasResponse = await api.post('/despesas/by-ids', { ids: allDespesaIds });
          const despesasDetalhadas = despesasResponse.data;

          // Criar um map: id -> despesa
          const map: Record<string, Despesa> = {};
          despesasDetalhadas.forEach((d: Despesa) => {
            map[d.despesaId] = d;
          });

          setDespesasMap(map);
        }
      } catch (err) {
        console.error('Erro ao buscar pacotes ou despesas:', err);
      }
    };

    fetchPacotesEComDespesas();
  }, [projectId]);

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.title}>Meus pacotes</Text>
      </View>

      <View style={styles.pacotesList}>
        <Text style={styles.pacotesTitle}>Pacotes</Text>
        <FlatList
          data={pacotes}
          keyExtractor={(item) => item.pacoteId}
          renderItem={({ item }) => {
            const despesasDetalhadas = item.despesas?.map(id => despesasMap[id])?.filter(Boolean);
            return <PacoteCard nome={item.nome} despesas={despesasDetalhadas} pacoteId={''} projetoId={''} userId={''} status={[]} />;
          }}
        />
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#1F48AA',
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  pacotesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  pacotesList: {
    flex: 1,
    padding: 30,
  },
});

export default PacotesScreen;