import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import api from '../../services/api';
import PacoteCard from '../../components/home/PacoteCard';
import { RootState } from "../../(redux)/store";
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { themas } from "../../global/themes";
import { useTheme } from '../../context/ThemeContext';

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

const statusStyles: Record<string, { backgroundColor: string; color: string }> = {
  'Rascunho': { backgroundColor: themas.colors.cinza_claro, color: themas.colors.chumbo },
  'Aguardando Aprovação': { backgroundColor: themas.colors.mostarda_opaco, color: themas.colors.mostarda_escuro_opaco },
  'Recusado': { backgroundColor: themas.colors.vinho_claro_opaco, color: themas.colors.vinho_escuro_opaco },
  'Aprovado': { backgroundColor: themas.colors.verde_claro_opaco, color: themas.colors.verde_medio_opaco },
  'Aprovado Parcialmente': { backgroundColor: themas.colors.laranja_claro_opaco, color: themas.colors.laranja_escuro_opaco },
};

const PacotesScreen = ({ route }: any) => {
  const { theme } = useTheme();  
  const styles = createStyles (theme); 
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { projectId } = route.params;
  const [pacotes, setPacotes] = useState<Pacote[]>([]);
  const [despesasMap, setDespesasMap] = useState<Record<string, Despesa>>({});
  const [nomeProjeto, setNomeProjeto] = useState('');
  const userId = useSelector((state: RootState) => state.auth.user?.userId);
  const [statusSelecionado, setStatusSelecionado] = useState<string | null>(null);
  const [resetarExpandido, setResetarExpandido] = useState(false);
  const [statusProjeto, setStatusProjeto] = useState<string | null>(null);

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
      setStatusProjeto(projetoResponse.data.status);

      console.log("Status do projeto:", projetoResponse.data.status);
  
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

  // filtro no topo da tela
  const pacotesFiltrados = statusSelecionado
  ? pacotes.filter(p => p.status === statusSelecionado)
  : pacotes;

  useFocusEffect(
    React.useCallback(() => {
      // quando entra na tela, zera o filtro
      setStatusSelecionado(null);
  
      return () => {
        // quando sai da tela, também zera 
        setStatusSelecionado(null);
      };
    }, [])
  );  

  useFocusEffect(
    React.useCallback(() => {
      // quando entra na tela, os cards estão fechados
      setResetarExpandido(true);
      setTimeout(() => setResetarExpandido(false), 0);
  
      return () => {
        // quando sai da tela, os cards fecham
        setResetarExpandido(true);
      };
    }, [])
  );

  return (
    <View style={[styles.container, statusProjeto === 'encerrado' && styles.containerDesativado]}>
      <View style={statusProjeto === 'encerrado' ? styles.topEncerrado : styles.top}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
              <AntDesign name="arrowleft" style={styles.arrow} />
        </TouchableOpacity>
        <Text style={styles.title}>
          {nomeProjeto || 'Carregando...'}{statusProjeto === 'encerrado' ? ' - Encerrado' : ''}
        </Text>

      </View>

      {/* o filtro no topo da tela */}
      {!statusSelecionado && (
        <View style={styles.filtrosRow}>
          {Object.keys(statusStyles).map(status => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filtroChip,
                { backgroundColor: statusStyles[status].backgroundColor }
              ]}
              onPress={() => setStatusSelecionado(status)}
            >
              <Text
                style={[
                  styles.filtroChipText,
                  { color: statusStyles[status].color }
                ]}
              >
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {statusSelecionado && (
        <View style={styles.filtrosRow}>
          <TouchableOpacity
            style={[
              styles.filtroChip,
              { backgroundColor: statusStyles[statusSelecionado].backgroundColor }
            ]}
          >
            <Text
              style={[
                styles.filtroChipText,
                { color: statusStyles[statusSelecionado].color }
              ]}
            >
              {statusSelecionado}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filtroChipLimpar} onPress={() => setStatusSelecionado(null)}>
            <Ionicons name="close" size={20} color={theme.colors.chumbo} />
          </TouchableOpacity>

        </View>
      )}

      <View style={styles.pacotesList}>
        <Text style={[styles.pacotesTitle, statusProjeto === 'encerrado' && styles.containerDesativado]}>Meus pacotes</Text>

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
                  resetarExpandido={resetarExpandido}
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

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: theme.colors.primary,
    width: '100%',
  },
  topEncerrado: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: theme.colors.cinza,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.sempre_branco,
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
    color: theme.colors.text,
  },
  pacotesList: {
    flex: 1,
    padding: 25,
  },
  arrow: {
    fontSize: 24,
    color: theme.colors.sempre_branco,
  },
  filtroContainer: {
    paddingHorizontal: 50,
    marginTop: 10,
  },
  picker: {
    flex: 1,
    color: theme.colors.azul_escuro,
  },  
  filtroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cinza_muito_claro,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  filtroIcon: {
    marginRight: 5,
    marginLeft: 15,
  },
  divisor: {
    height: 2,
    backgroundColor: theme.colors.cinza_claro,
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
    color: theme.colors.cinza_medio,
    textAlign: 'center',
  },  
  filtrosRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginTop: 10,
    gap: 8,
  },
  filtroChip: {
    backgroundColor: theme.colors.cinza_claro,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  filtroChipText: {
    color: theme.colors.chumbo,
    fontSize: 14,
    fontWeight: '500',
  },
  filtroChipSelecionado: {
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
  }, 
  filtroChipSelecionadoText: {
    color: theme.colors.secondary,
    fontSize: 14,
    fontWeight: '500',
  },
  filtroChipLimpar: {
    backgroundColor: theme.colors.cinza_muito_claro,
    borderRadius: 20,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },  
  containerDesativado: {
    opacity: 1,
  },

});

export default PacotesScreen;