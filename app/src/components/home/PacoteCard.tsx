import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import api from '../../services/api';
import { themas } from "../../global/themes";
import { useTheme } from '../../context/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { TextInput } from 'react-native';
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
      
      const [editandoNome, setEditandoNome] = useState(false);
      const [novoNome, setNovoNome] = useState(nome);

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

      const handleExcluirPacote = () => {
        Alert.alert(
          'Excluir pacote',
          'Tem certeza que deseja excluir este pacote? Esta ação não pode ser desfeita.',
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Excluir',
              style: 'destructive',
              onPress: async () => {
                try {
                  await api.delete(`/pacotes/${pacoteId}`);
                  Alert.alert('Sucesso', 'Pacote excluído com sucesso');
                  fetchPacotesDespesas();
                } catch (error: any) {
                  console.error(error?.response?.data || error);
                  Alert.alert('Erro', error?.response?.data?.erro || 'Erro ao excluir pacote');
                }
              },
            },
          ]
        );
      };

      const salvarNome = async () => {
        if (novoNome === nome) {
          setEditandoNome(false);
          return;
        }

        try {
          await api.put(`/pacotes/${pacoteId}`, { nome: novoNome });
          setEditandoNome(false);
          fetchPacotesDespesas();
          Alert.alert('Sucesso', 'Nome atualizado com sucesso');
        } catch (error: any) {
          console.error(error);
          Alert.alert('Erro', error?.response?.data?.erro || 'Erro ao atualizar nome do pacote');
        }
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

    const tituloCategoriaCores: Record<string, string> = {
      'Alimentação': themas.colors.roxo_opaco,
      'Hospedagem': themas.colors.verde_escuro_opaco,
      'Transporte': themas.colors.azul_escuro_opaco,
      'Serviços Terceirizados': themas.colors.verde2_escuro_opaco,
      'Materiais': themas.colors.vinho_escuro_opaco,
      'Outros': themas.colors.cinza, 
    };    

    const statusStyles: Record<string, { backgroundColor: string; color: string }> = {
      'Rascunho': { backgroundColor: themas.colors.cinza_claro, color: themas.colors.chumbo },
      'Aguardando Aprovação': { backgroundColor: themas.colors.mostarda_opaco, color: themas.colors.mostarda_escuro_opaco },
      'Recusado': { backgroundColor: themas.colors.vinho_claro_opaco, color: themas.colors.vinho_escuro_opaco },
      'Aprovado': { backgroundColor: themas.colors.verde_claro_opaco, color: themas.colors.verde_medio_opaco },
      'Aprovado Parcialmente': { backgroundColor: themas.colors.laranja_claro_opaco, color: themas.colors.laranja_escuro_opaco },
    };   

    const aprovacaoDespesaCores: Record<string, string> = {
      'Aprovado': themas.colors.verde_medio_opaco,
      'Recusado': themas.colors.vinho,
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
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {editandoNome ? (
                <TextInput
                  style={[styles.cardTitle, styles.inputEditarNome]}
                  value={novoNome}
                  onChangeText={setNovoNome}
                  onSubmitEditing={salvarNome}
                  onBlur={salvarNome}
                  autoFocus
                />
              ) : (
                <>
                  <Text style={styles.cardTitle}>{novoNome}</Text>
                  {status === 'Rascunho' && (
                    <TouchableOpacity onPress={() => setEditandoNome(true)} style={{ marginLeft: 8, marginBottom: 2 }}>
                      <Feather name="edit" size={18} color={theme.colors.cinza} />
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>

            <Text style={styles.totalGasto}>Total gasto: R$ {totalGasto.toFixed(2).replace('.', ',')}</Text>
          
            <Text style={{ color: theme.colors.chumbo_claro, marginTop: 8, marginLeft: 3, marginBottom: 3 }}>{expandido ? '▲  Recolher' : '▼ Ver despesas'}</Text>

            {/* Histórico de despesas só aparece se estiver expandido */}
            {expandido && (
            <>
              <Text style={styles.cardSubtitle}>Histórico de Despesas:</Text>
              {despesas && despesas.length > 0 ? (
                despesasAgrupadas?.map((grupo) => (
                  <View key={grupo.categoria} style={[styles.categoriaCard]}>
                    <Text style={[styles.cardSubSubtitle, { color: tituloCategoriaCores[grupo.categoria] || tituloCategoriaCores['Outros'] }]}>{grupo.categoria}</Text>
                    
                    {grupo.itens.map((item: any, index: number) => (
                    <Text key={index} style={styles.despesaItem} numberOfLines={1} ellipsizeMode='tail'>
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
                <>
                <TouchableOpacity
                  style={[styles.botaoReembolso, (despesas?.length === 0 || isSolicitando) && { backgroundColor: theme.colors.cinza_medio }]}
                  onPress={handleSolicitarReembolso}
                  disabled={isSolicitando || despesas?.length === 0}
                >
                  <Text style={styles.textoBotao}>
                    {isSolicitando ? 'Solicitando...' : 'Solicitar Reembolso'}
                  </Text>
                </TouchableOpacity>

                {/* Mostrar botão de excluir pacote somente se não tiver despesas */}
                {(!despesas || despesas.length === 0) && (
                  <TouchableOpacity
                    style={[styles.botaoExcluir, { backgroundColor: theme.colors.primary }]}
                    onPress={handleExcluirPacote}
                  >
                    <Text style={styles.textoBotao}>Excluir Pacote</Text>
                  </TouchableOpacity>
                )}
                </>
              )}
            </>
          )}

        </View>
      </TouchableOpacity>

    );
  };

  const createStyles = (theme: any) => StyleSheet.create({
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
       backgroundColor: 'white',
       marginVertical: 10,

        // Sombra no iOS
       shadowColor: '#000',
       shadowOffset: { width: 0, height: 2 },
       shadowOpacity: 0.25,
       shadowRadius: 3.84,

        // Sombra no Android
       elevation: 5,
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

    botaoExcluir: {
      marginTop: 10,
      backgroundColor: theme.colors.cinza,
      paddingVertical: 10,
      borderRadius: 10,
      alignItems: 'center',
    },
    inputEditarNome: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.black,
      borderBottomWidth: 1,
      borderColor: theme.colors.primary,
      paddingVertical: 2,
    },

  });
  

export default PacoteCard;
