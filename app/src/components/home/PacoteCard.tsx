import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import api from '../../services/api';
import { themas } from "../../global/themes";
import { useTheme } from '../../context/ThemeContext';
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
    
      const { theme } = useTheme();
      const styles = createStyles (theme);    
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
      'Alimentação': theme.colors.cinza_claro,
      'Hospedagem': theme.colors.verde_escuro,
      'Transporte': theme.colors.azul_claro,
      'Serviços Terceirizados': theme.colors.verde_medio,
      'Materiais': theme.colors.rosa,
      'Outros': theme.colors.chumbo_claro,
    };    

    const tituloCategoriaCores: Record<string, string> = {
      'Alimentação': theme.colors.roxo,
      'Hospedagem': theme.colors.verde_escuro,
      'Transporte': theme.colors.azul_escuro,
      'Serviços Terceirizados': theme.colors.amarelo,
      'Materiais': theme.colors.vinho_claro,
      'Outros': theme.colors.chumbo, 
    };    

    const statusStyles: Record<string, { backgroundColor: string; color: string }> = {
      'Rascunho': { backgroundColor: theme.colors.cinza_claro, color: theme.colors.cinza },
      'Aguardando Aprovação': { backgroundColor: theme.colors.mostarda, color: theme.colors.amarelo },
      'Recusado': { backgroundColor: theme.colors.vinho_claro, color: theme.colors.vinho_claro }, 
      'Aprovado': { backgroundColor: theme.colors.verde_medio, color: theme.colors.verde_medio },
      'Aprovado Parcialmente': { backgroundColor: theme.colors.laranja, color: theme.colors.laranja_forte },
    };    

    const aprovacaoDespesaCores: Record<string, string> = {
      'Aprovado': theme.colors.verde_medio,
      'Recusado': theme.colors.vinho_claro,
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
          
            <Text style={{ color: theme.colors.chumbo_claro, marginTop: 8, marginLeft: 3, marginBottom: 3 }}>{expandido ? '▲  Recolher' : '▼ Ver despesas'}</Text>

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
                      <Text style={{ color: aprovacaoDespesaCores[item.aprovacao] || theme.colors.chumbo_claro, fontWeight: 'bold' }}>
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
                  style={[styles.botaoReembolso, (despesas?.length === 0 || isSolicitando) && { backgroundColor: theme.colors.cinza_medio }]}
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

  const createStyles = (theme: any) => StyleSheet.create({
    card: {
      backgroundColor: theme.colors.secondary,
      padding: 10,
      borderRadius: 14,
      marginVertical: 12,
      elevation: 3,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.black,
      marginBottom: 4,
    },
    cardSubtitle: {
      marginTop: 16,
      fontSize: 15,
      fontWeight: '600',
      color: theme.colors.chumbo, 
    },
    cardSubSubtitle: {
      marginTop: 12,
      fontSize: 15,
      fontWeight: '600',
      color: theme.colors.chumbo, 
    },
    despesaItem: {
      marginTop: 6,
      fontSize: 15,
      color: theme.colors.chumbo_claro,
      lineHeight: 22,
    },
    semDespesa: {
      marginTop: 15,
      marginBottom: 10,
      color: theme.colors.cinza_medio, 
      fontSize: 14,
      fontStyle: 'italic',
    },
    statusContainer: {
      flexDirection: 'row',
      marginBottom: 15,
    },
    statusText: {
      backgroundColor: theme.colors.cinza_claro, 
      color: theme.colors.chumbo,
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
      backgroundColor: theme.colors.primary,
      paddingVertical: 10,
      borderRadius: 10,
      alignItems: 'center',
    },
    textoBotao: {
      color: theme.colors.sempre_branco,
      fontSize: 16,
      fontWeight: '600',
    },
    totalGasto: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.chumbo_claro,
      marginBottom: 6,
      marginLeft: 2,
    },    
  });
  

export default PacoteCard;
