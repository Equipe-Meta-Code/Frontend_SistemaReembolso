import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import api from '../../services/api';
import PacoteCard from '../../components/home/PacoteCard';
import { RootState } from "../../(redux)/store";
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import AntDesign from '@expo/vector-icons/AntDesign';

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
  status: string;
  despesas?: string[];
}

type RootStackParamList = {
  Home: undefined;
  RegistroDespesa: undefined;
  Historico: undefined;
  Perfil: undefined;
};

const PacotesScreen = ({ route }: any) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { projectId } = route.params;
  const [pacotes, setPacotes] = useState<Pacote[]>([]);
  const [despesasMap, setDespesasMap] = useState<Record<string, Despesa>>({});
  const [nomeProjeto, setNomeProjeto] = useState('');

  useEffect(() => {
    const fetchPacotesDespesas = async () => {
      try {
        const response = await api.get<Pacote[]>('/pacote');
        const pacotesDoProjeto = response.data.filter((p) => p.projetoId === projectId);

        setPacotes(pacotesDoProjeto);

        // Juntar todos os IDs de despesas
        const allDespesaIds = pacotesDoProjeto.flatMap(p => p.despesas || []);

        if (allDespesaIds.length > 0) {
          const despesasResponse = await api.post('/despesas/by-ids', { ids: allDespesaIds });
          const despesasDetalhadas = despesasResponse.data;

          const map: Record<string, Despesa> = {};
          despesasDetalhadas.forEach((d: Despesa) => {
            map[d.despesaId] = d;
          });

          setDespesasMap(map);

          const projetoResponse = await api.get(`/projeto/${Number(projectId)}`);
          setNomeProjeto(projetoResponse.data.nome);
        }
      } catch (err) {
        console.error('Erro ao buscar pacotes ou despesas:', err);
      }
    };

    fetchPacotesDespesas();
  }, [projectId]);

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
              <AntDesign name="arrowleft" style={styles.arrow} />
        </TouchableOpacity>
        <Text style={styles.title}>{nomeProjeto || 'Carregando...'}</Text>
      </View>

      <View style={styles.pacotesList}>
        <Text style={styles.pacotesTitle}>Meus pacotes</Text>
        <FlatList
          data={pacotes}
          keyExtractor={(item) => item.pacoteId}
          renderItem={({ item }) => {
            const despesasDetalhadas = item.despesas?.map(id => despesasMap[id])?.filter(Boolean);
            return <PacoteCard 
                nome={item.nome} 
                despesas={despesasDetalhadas} 
                pacoteId={item.pacoteId} 
                projetoId={item.projetoId} 
                userId={item.userId} 
                status={item.status} 
            />;
          }}
        />
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFBFB',
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#1F48AA',
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    paddingLeft: 15,
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
  arrow: {
    fontSize: 24,
    color: '#FFFFFF',
  },
});

export default PacotesScreen;