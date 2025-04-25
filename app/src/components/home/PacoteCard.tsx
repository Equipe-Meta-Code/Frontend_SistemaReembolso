import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import api from '../../api';
export interface Despesa {
    categoria: string;
    valor_gasto: number;
    descricao?: string;
    aprovacao: string;
    data: string;
    projetoId: string;
    userId: string;
  }
  
  export interface Pacote {
    pacoteId: string;
    nome: string;
    projetoId: string;
    userId: string;
    status: string;
    despesas?: Despesa[];
  }

  const PacoteCard: React.FC<Pacote> = ({ nome, despesas, status: initialStatus, pacoteId }) => {
    
      const [status, setStatus] = useState(initialStatus);
      const [isSolicitando, setIsSolicitando] = useState(false);

      const handleSolicitarReembolso = async () => {
        try {
          setIsSolicitando(true);

          const response = await api.post(`/pacotes/${pacoteId}/enviar`);

          setStatus('aguardando_aprovacao');
          Alert.alert('Sucesso', 'Reembolso solicitado com sucesso!');
        } catch (error: any) {
          console.error(error?.response?.data || error);
          Alert.alert('Erro', error?.response?.data?.erro || 'Não foi possível solicitar o reembolso.');
        }        
      };

      const despesasOrdenadas = [...(despesas || [])].sort(
        (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
      );

      // Agrupando despesas por categoria
      const despesasAgrupadas = despesasOrdenadas?.reduce((acc: any[], despesa) => {
      const categoriaExistente = acc.find((c) => c.categoria === despesa.categoria);
      const itemFormatado = {
        descricao: despesa.descricao,
        valor: `R$ ${despesa.valor_gasto.toFixed(2).replace('.', ',')}`,
        data: new Date(despesa.data).toLocaleDateString('pt-BR'),
      };
  
      if (categoriaExistente) {
        categoriaExistente.itens.push(itemFormatado);
      } else {
        acc.push({
          categoria: despesa.categoria,
          itens: [itemFormatado],
        });
      }
  
      return acc;
    }, []);

    const cardCategoriaCores: Record<string, string> = {
      'Alimentação': 'rgba(16, 185, 129, 0.11)',
      'Hospedagem': 'rgba(255, 194, 38, 0.15)',
      'Transporte': 'rgba(52, 123, 238, 0.1)',
      'Serviços Terceirizados': 'rgba(90, 128, 19, 0.1)',
      'Materiais': 'rgba(245, 94, 132, 0.1)',
      'Outros': 'rgba(97, 97, 97, 0.1)',
    };    

    const tituloCategoriaCores: Record<string, string> = {
      'Alimentação': 'rgba(12, 78, 56, 0.5)',
      'Hospedagem': 'rgba(121, 97, 39, 0.5)',
      'Transporte': 'rgba(19, 54, 110, 0.5)',
      'Serviços Terceirizados': 'rgba(50, 70, 13, 0.5)',
      'Materiais': 'rgba(102, 22, 42, 0.5)',
      'Outros': 'rgba(54, 52, 52, 0.5)',
    };    
  
    return (
      <View style={styles.card}>
        <View style={styles.statusContainer}>
          <Text style={[styles.statusText, { backgroundColor: '#F2F3F4' }]}>{status}</Text>
        </View>
        <Text style={styles.cardTitle}>{nome}</Text>
        <Text style={styles.cardSubtitle}>Histórico de Despesas:</Text>
  
        {despesas && despesas.length > 0 ? (
          despesasAgrupadas?.map((grupo) => (
            <View 
              key={grupo.categoria} 
              style={[styles.categoriaCard, { backgroundColor: cardCategoriaCores[grupo.categoria] || '#F9FAFB' },]}>

              <Text style={[styles.cardSubtitle, { color: tituloCategoriaCores[grupo.categoria] || '#F9FAFB' },]}>{grupo.categoria}</Text>
              {grupo.itens.map((item: any, index: number) => (
                <Text 
                  key={index} 
                  style={styles.despesaItem}>
                  • {item.data} - {item.descricao} - {item.valor}
                </Text>
              ))}
            </View>
          ))
        ) : (
          <Text style={styles.semDespesa}>Nenhuma despesa cadastrada.</Text>
        )}

        {status === 'rascunho' && (
        <TouchableOpacity
          style={[styles.botaoReembolso, , (despesas?.length === 0 || isSolicitando) && { backgroundColor: '#9CA3AF' }]}
          onPress={handleSolicitarReembolso}
          disabled={isSolicitando || despesas?.length === 0}
        >
          <Text style={styles.textoBotao}>
            {isSolicitando ? 'Solicitando...' : 'Solicitar Reembolso'}
          </Text>
        </TouchableOpacity>
      )}

      </View>
    );
  };

  const styles = StyleSheet.create({
    card: {
      backgroundColor: '#FBFBFB',
      padding: 10,
      borderRadius: 14,
      marginVertical: 12,
      elevation: 3,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#1A1A1A',
      marginBottom: 4,
    },
    cardSubtitle: {
      marginTop: 16,
      fontSize: 15,
      fontWeight: '600',
      color: '#374151', 
    },
    despesaItem: {
      marginTop: 6,
      fontSize: 15,
      color: '#4B5563',
      lineHeight: 22,
    },
    semDespesa: {
      marginTop: 15,
      marginBottom: 10,
      color: '#9CA3AF', 
      fontSize: 14,
      fontStyle: 'italic',
    },
    statusContainer: {
      flexDirection: 'row',
      marginBottom: 10,
    },
    statusText: {
      backgroundColor: '#E5E7EB', 
      color: '#374151',
      fontSize: 12,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
      textTransform: 'uppercase',
      fontWeight: '600',
    },
    categoriaCard: {
      padding: 16,
      borderRadius: 12,
      marginTop: 12,
    },
    botaoReembolso: {
      marginTop: 16,
      backgroundColor: '#2563EB',
      paddingVertical: 10,
      borderRadius: 10,
      alignItems: 'center',
    },
    textoBotao: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
  });
  

export default PacoteCard;
