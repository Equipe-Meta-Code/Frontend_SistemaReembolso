import React, { useState, useEffect } from 'react';
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

  interface PacoteCardProps extends Pacote {
    fetchPacotesDespesas: () => void;
    resetarExpandido: boolean;
  }  

  const PacoteCard: React.FC<PacoteCardProps> = ({ nome, despesas, status, pacoteId, fetchPacotesDespesas, resetarExpandido }) => {
    
      const [isSolicitando, setIsSolicitando] = useState(false);
      const [expandido, setExpandido] = useState(false);  

      const handleSolicitarReembolso = async () => {
        Alert.alert(
          'Solicitar reembolso do pacote',
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
                  Alert.alert('Sucesso', 'Reembolso solicitado com sucesso!');
                  fetchPacotesDespesas();
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
      type GrupoDespesas = { categoria: string; itens: { descricao?: string; valor: string; data: string; }[] };
      const despesasAgrupadas = despesasOrdenadas?.reduce((acc: GrupoDespesas[], despesa) => {
      const categoriaExistente = acc.find((c) => c.categoria === despesa.categoria);
      const itemFormatado = {
        descricao: despesa.descricao,
        valor: `R$ ${despesa.valor_gasto.toFixed(2).replace('.', ',')}`,
        data: new Date(despesa.data).toLocaleDateString('pt-BR'),
        aprovacao: despesa.aprovacao,
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
      'Alimentação': 'rgba(234, 234, 255, 0.8)',
      'Hospedagem': 'rgba(3, 46, 31, 0.07)',
      'Transporte': 'rgba(52, 163, 238, 0.1)',
      'Serviços Terceirizados': 'rgba(90, 128, 19, 0.1)',
      'Materiais': 'rgba(255, 109, 211, 0.06)',
      'Outros': 'rgba(97, 97, 97, 0.1)',
    };    

    const tituloCategoriaCores: Record<string, string> = {
      'Alimentação': 'rgba(58, 8, 196, 0.63)',
      'Hospedagem': 'rgba(6, 58, 40, 0.65)',
      'Transporte': 'rgba(19, 75, 165, 0.67)',
      'Serviços Terceirizados': 'rgba(50, 70, 13, 0.5)',
      'Materiais': 'rgba(160, 3, 95, 0.69)',
      'Outros': 'rgba(54, 52, 52, 0.5)',
    };    

    const statusStyles: Record<string, { backgroundColor: string; color: string }> = {
      'Rascunho': { backgroundColor: '#E5E7EB', color: '#374151' },
      'Aguardando Aprovação': { backgroundColor: 'rgba(255, 188, 20, 0.21)', color: 'rgba(214, 154, 1, 0.96)' },
      'Recusado': { backgroundColor: 'rgba(209, 53, 53, 0.15)', color: 'rgba(185, 14, 14, 0.70)' },
      'Aprovado': { backgroundColor: 'rgba(27, 143, 37, 0.15)', color: 'rgba(4, 155, 12, 0.83)' },
      'Aprovado Parcialmente': { backgroundColor: 'rgba(255, 139, 62, 0.21)', color: 'rgba(248, 103, 7, 0.69)' },
    };    

    const aprovacaoDespesaCores: Record<string, string> = {
      'Aprovado': 'rgba(10, 138, 16, 0.87)',
      'Recusado': 'rgba(224, 7, 7, 0.8)',
    };    

    //mostra legenda apenas se o pacote for aprovado parcialmente
    const temAprovado = despesas?.some((d) => d.aprovacao === 'Aprovado');
    const temRejeitado = despesas?.some((d) => d.aprovacao === 'Recusado');
    const mistoAprovacao = temAprovado || temRejeitado;

    const totalGasto = despesas?.reduce((acc, curr) => acc + curr.valor_gasto, 0) || 0;
  
    useEffect(() => {
      if (resetarExpandido) {
        setExpandido(false);
      }
    }, [resetarExpandido]);
    
    return (
      <TouchableOpacity onPress={() => setExpandido(!expandido)} activeOpacity={1}>
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
                  <View key={grupo.categoria} style={[styles.categoriaCard, { backgroundColor: cardCategoriaCores[grupo.categoria] || cardCategoriaCores['Outros'] }]}>
                    <Text style={[styles.cardSubSubtitle, { color: tituloCategoriaCores[grupo.categoria] || tituloCategoriaCores['Outros'] }]}>{grupo.categoria}</Text>
                    
                    {grupo.itens.map((item: any, index: number) => (
                    <Text key={index} style={styles.despesaItem}>
                    {mistoAprovacao && (
                      <Text style={{ color: aprovacaoDespesaCores[item.aprovacao] || '#4B5563', fontWeight: 'bold' }}>
                        [{item.aprovacao}]
                      </Text>
                    )}
                    {' '}
                    {item.data} - {item.descricao} - {item.valor}
                  </Text>                                  
                    
                    ))}
                  </View>
                ))
              ) : (
                <Text style={styles.semDespesa}>Nenhuma despesa cadastrada.</Text>
              )}

              {/* Botão de solicitar reembolso */}
              {status === 'Rascunho' && (
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
    cardSubSubtitle: {
      marginTop: 12,
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
      backgroundColor: '#1F48AA',
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
