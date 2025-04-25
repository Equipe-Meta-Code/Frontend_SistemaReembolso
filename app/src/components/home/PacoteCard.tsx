import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import api from '../../services/api';
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
      const [expandido, setExpandido] = useState(false);

      const handleSolicitarReembolso = async () => {
        Alert.alert(
          'Solicitar Reembolso do Pacote',
          'Após essa ação, não será possível adicionar novas despesas ao pacote ou desfazer a solicitação. Deseja continuar?',
          [
            {
              text: 'Cancelar',
              style: 'cancel',
            },
            {
              text: 'Confirmar',
              onPress: async () => {
                try {
                  setIsSolicitando(true);
                  const response = await api.post(`/pacotes/${pacoteId}/enviar`);
                  setStatus('aguardando_aprovacao');
                  Alert.alert('Sucesso', 'Reembolso solicitado com sucesso!');
                } catch (error: any) {
                  console.error(error?.response?.data || error);
                  Alert.alert('Erro', error?.response?.data?.erro || 'Não foi possível solicitar o reembolso.');
                } finally {
                  setIsSolicitando(false);
                }
              },
            },
          ]
        );
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
      'Alimentação': 'rgba(250, 164, 107, 0.1)',
      'Hospedagem': 'rgba(3, 46, 31, 0.07)',
      'Transporte': 'rgba(52, 123, 238, 0.1)',
      'Serviços Terceirizados': 'rgba(90, 128, 19, 0.1)',
      'Materiais': 'rgba(245, 94, 132, 0.1)',
      'Outros': 'rgba(97, 97, 97, 0.1)',
    };    

    const tituloCategoriaCores: Record<string, string> = {
      'Alimentação': 'rgba(145, 58, 0, 0.5)',
      'Hospedagem': 'rgba(6, 58, 40, 0.5)',
      'Transporte': 'rgba(19, 54, 110, 0.5)',
      'Serviços Terceirizados': 'rgba(50, 70, 13, 0.5)',
      'Materiais': 'rgba(102, 22, 42, 0.5)',
      'Outros': 'rgba(54, 52, 52, 0.5)',
    };    

    const statusStyles: Record<string, { backgroundColor: string; color: string }> = {
      rascunho: { backgroundColor: '#E5E7EB', color: '#374151' },
      aguardando_aprovacao: { backgroundColor: 'rgba(255, 194, 38, 0.15)', color: '#92400E' },
      rejeitado: { backgroundColor: '#FECACA', color: '#991B1B' },
      aprovado: { backgroundColor: '#D1FAE5', color: '#065F46' },
    };    

    const totalGasto = despesas?.reduce((acc, curr) => acc + curr.valor_gasto, 0) || 0;
  
    return (
      <TouchableOpacity onPress={() => setExpandido(!expandido)}>
        <View style={styles.card}>
            <View style={styles.statusContainer}>
                <Text style={[styles.statusText, {backgroundColor: statusStyles[status]?.backgroundColor, color: statusStyles[status]?.color}]}>
                  {status}
                </Text>
            </View>
            <Text style={styles.cardTitle}>{nome}</Text>
            <Text style={styles.totalGasto}>Total gasto: R$ {totalGasto.toFixed(2).replace('.', ',')}</Text>
          
            <Text style={{ color: '#6B7280', marginTop: 8, marginLeft: 3, marginBottom: 3 }}>{expandido ? '▲  Recolher' : '▼ Ver despesas'}</Text>

            {/* Histórico de despesas só aparece se estiver expandido */}
            {expandido && (
            <>
              <Text style={styles.cardSubtitle}>Histórico de Despesas:</Text>
              {despesas && despesas.length > 0 ? (
                despesasAgrupadas?.map((grupo) => (
                  <View key={grupo.categoria} style={[styles.categoriaCard, { backgroundColor: cardCategoriaCores[grupo.categoria] || '#F9FAFB' }]}>
                    <Text style={[styles.cardSubtitle, { color: tituloCategoriaCores[grupo.categoria] || '#F9FAFB' }]}>{grupo.categoria}</Text>
                    {grupo.itens.map((item: any, index: number) => (
                      <Text key={index} style={styles.despesaItem}>
                        • {item.data} - {item.descricao} - {item.valor}
                      </Text>
                    ))}
                  </View>
                ))
              ) : (
                <Text style={styles.semDespesa}>Nenhuma despesa cadastrada.</Text>
              )}

              {/* Botão de solicitar reembolso */}
              {status === 'rascunho' && (
                <TouchableOpacity
                  style={[styles.botaoReembolso, (despesas?.length === 0 || isSolicitando) && { backgroundColor: '#9CA3AF' }]}
                  onPress={handleSolicitarReembolso}
                  disabled={isSolicitando || despesas?.length === 0}
                >
                  <Text style={styles.textoBotao}>
                    {isSolicitando ? 'Solicitando...' : 'Solicitar Reembolso'}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}

        </View>
      </TouchableOpacity>

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
      marginBottom: 15,
    },
    statusText: {
      backgroundColor: '#E5E7EB', 
      color: '#374151',
      fontSize: 12,
      paddingHorizontal: 16,
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
    totalGasto: {
      fontSize: 14,
      fontWeight: '600',
      color: '#4B5563',
      marginBottom: 6,
      marginLeft: 2,
    },    
  });
  

export default PacoteCard;
