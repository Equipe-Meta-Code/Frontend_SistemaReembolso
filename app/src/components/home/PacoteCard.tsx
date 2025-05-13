import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import api from '../../services/api';
import { themas } from "../../global/themes";
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
      'Alimentação': themas.colors.cinza_claro,
      'Hospedagem': themas.colors.verde_escuro,
      'Transporte': themas.colors.azul_claro,
      'Serviços Terceirizados': themas.colors.verde_medio,
      'Materiais': themas.colors.rosa,
      'Outros': themas.colors.chumbo_claro,
    };    

    const tituloCategoriaCores: Record<string, string> = {
      'Alimentação': themas.colors.roxo,
      'Hospedagem': themas.colors.verde_escuro,
      'Transporte': themas.colors.azul_escuro,
      'Serviços Terceirizados': themas.colors.amarelo,
      'Materiais': themas.colors.vinho_claro,
      'Outros': themas.colors.chumbo, 
    };    

    const statusStyles: Record<string, { backgroundColor: string; color: string }> = {
      'Rascunho': { backgroundColor: themas.colors.cinza_claro, color: themas.colors.chumbo },
      'Aguardando Aprovação': { backgroundColor: themas.colors.mostarda, color: themas.colors.amarelo },
      'Recusado': { backgroundColor: themas.colors.vinho_claro, color: themas.colors.vinho_claro }, 
      'Aprovado': { backgroundColor: themas.colors.verde_medio, color: themas.colors.verde_medio },
      'Aprovado Parcialmente': { backgroundColor: themas.colors.laranja, color: themas.colors.laranja_forte },
    };    

    const aprovacaoDespesaCores: Record<string, string> = {
      'Aprovado': themas.colors.verde_medio,
      'Recusado': themas.colors.vinho_claro,
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
          
            <Text style={{ color: themas.colors.chumbo_claro, marginTop: 8, marginLeft: 3, marginBottom: 3 }}>{expandido ? '▲  Recolher' : '▼ Ver despesas'}</Text>

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
                      <Text style={{ color: aprovacaoDespesaCores[item.aprovacao] || themas.colors.chumbo_claro, fontWeight: 'bold' }}>
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
                  style={[styles.botaoReembolso, (despesas?.length === 0 || isSolicitando) && { backgroundColor: themas.colors.cinza_medio }]}
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
      backgroundColor: themas.colors.cinza_muito_claro,
      padding: 10,
      borderRadius: 14,
      marginVertical: 12,
      elevation: 3,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: themas.colors.black,
      marginBottom: 4,
    },
    cardSubtitle: {
      marginTop: 16,
      fontSize: 15,
      fontWeight: '600',
      color: themas.colors.chumbo, 
    },
    cardSubSubtitle: {
      marginTop: 12,
      fontSize: 15,
      fontWeight: '600',
      color: themas.colors.chumbo, 
    },
    despesaItem: {
      marginTop: 6,
      fontSize: 15,
      color: themas.colors.chumbo_claro,
      lineHeight: 22,
    },
    semDespesa: {
      marginTop: 15,
      marginBottom: 10,
      color: themas.colors.cinza_medio, 
      fontSize: 14,
      fontStyle: 'italic',
    },
    statusContainer: {
      flexDirection: 'row',
      marginBottom: 15,
    },
    statusText: {
      backgroundColor: themas.colors.cinza_claro, 
      color: themas.colors.chumbo,
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
      backgroundColor: themas.colors.primary,
      paddingVertical: 10,
      borderRadius: 10,
      alignItems: 'center',
    },
    textoBotao: {
      color: themas.colors.secondary,
      fontSize: 16,
      fontWeight: '600',
    },
    totalGasto: {
      fontSize: 14,
      fontWeight: '600',
      color: themas.colors.chumbo_claro,
      marginBottom: 6,
      marginLeft: 2,
    },    
  });
  

export default PacoteCard;
