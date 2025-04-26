import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import api from '../../services/api';
import PacoteCard from '../../components/home/PacoteCard';
import { RootState } from "../../(redux)/store";
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useSelector } from 'react-redux';
import { Picker } from '@react-native-picker/picker';
import Ionicons from '@expo/vector-icons/Ionicons';

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
  const userId = useSelector((state: RootState) => state.auth.user?.userId);
  const [statusFiltro, setStatusFiltro] = useState('');

  const fetchPacotesDespesas = async () => {
    try {
      const response = await api.get<Pacote[]>('/pacote');
      const pacotesDoProjeto = response.data.filter((p) => p.projetoId === projectId && String(p.userId) === String(userId));
  
      const statusOrder = {
        'Rascunho': 1,
        'Aguardando Aprovação': 2,
        'Aprovado Parcialmente': 3,
        'Recusado': 4,
        'Aprovado': 5
      };
      const pacotesOrdenados = pacotesDoProjeto.sort((a, b) => {
        return statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder];
      });        
  
      setPacotes(pacotesOrdenados);
  
      const projetoResponse = await api.get(`/projeto/${Number(projectId)}`);
      setNomeProjeto(projetoResponse.data.nome);
  
      const allDespesaIds = pacotesDoProjeto.flatMap(p => p.despesas || []);
      if (allDespesaIds.length > 0) {
        const despesasResponse = await api.post('/despesas/by-ids', { ids: allDespesaIds });
        const despesasDetalhadas = despesasResponse.data;
  
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
  
  useEffect(() => {
    fetchPacotesDespesas();
    const interval = setInterval(fetchPacotesDespesas, 3000);
    return () => clearInterval(interval);
  }, [projectId, userId]);  

  const pacotesFiltrados = statusFiltro
  ? pacotes.filter(p => p.status === statusFiltro)
  : pacotes;

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
              <AntDesign name="arrowleft" style={styles.arrow} />
        </TouchableOpacity>
        <Text style={styles.title}>{nomeProjeto || 'Carregando...'}</Text>
      </View>

      {/*<View style={styles.filtroContainer}>
        <View style={styles.filtroRow}>
        <Ionicons name="filter" size={20} color="#374151" style={styles.filtroIcon} />
          <Picker
            selectedValue={statusFiltro}
            onValueChange={(itemValue) => setStatusFiltro(itemValue)}
            style={styles.picker}>
              
            <Picker.Item label="Todos" value="" />
            <Picker.Item label="Rascunho" value="rascunho" />
            <Picker.Item label="Aguardando Aprovação" value="aguardando_aprovacao" />
            <Picker.Item label="Aprovado" value="aprovado" />
            <Picker.Item label="Rejeitado" value="rejeitado" />
          </Picker>
        </View>
      </View>*/}


      <View style={styles.pacotesList}>
        <Text style={styles.pacotesTitle}>Meus pacotes</Text>
        <FlatList
          data={pacotesFiltrados}
          keyExtractor={(item) => item.pacoteId}
          renderItem={({ item, index }) => {
            const despesasDetalhadas = item.despesas?.map(id => despesasMap[id])?.filter(Boolean);
            const pacoteAtualStatus = item.status;
            const pacoteAnteriorStatus = index > 0 ? pacotesFiltrados[index - 1].status : null;
          
            return (
              <View>
                {index > 0 && pacoteAtualStatus !== pacoteAnteriorStatus && (
                  <View style={styles.divisor} />
                )}
                <PacoteCard 
                  nome={item.nome} 
                  despesas={despesasDetalhadas} 
                  pacoteId={item.pacoteId} 
                  projetoId={item.projetoId} 
                  userId={item.userId} 
                  status={item.status} 
                  fetchPacotesDespesas={fetchPacotesDespesas}
                />
              </View>
            );
          }}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Nenhum pacote encontrado.
              </Text>
            </View>
          )}
          
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
    padding: 25,
  },
  arrow: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  filtroContainer: {
    paddingHorizontal: 50,
    marginTop: 10,
  },
  picker: {
    flex: 1,
    color: '#111827',
  },  
  filtroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  filtroIcon: {
    marginRight: 5,
    marginLeft: 15,
  },
  divisor: {
    height: 2,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  emptyContainer: {
    marginTop: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#9CA3AF',
    textAlign: 'center',
  },  
  
});

export default PacotesScreen;