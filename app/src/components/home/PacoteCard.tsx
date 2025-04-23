import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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

  const PacoteCard: React.FC<Pacote> = ({ nome, despesas, status }) => {
    
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
  
    return (
      <View style={styles.card}>
        <View style={styles.statusContainer}>
          <Text style={[styles.statusText, { backgroundColor: '#F2F3F4' }]}>{status}</Text>
        </View>
        <Text style={styles.cardTitle}>{nome}</Text>
        <Text style={styles.cardSubtitle}>Histórico de Despesas:</Text>
  
        {despesas && despesas.length > 0 ? (
          despesasAgrupadas?.map((grupo) => (
            <View key={grupo.categoria} style={styles.card}>
              <Text style={styles.cardSubtitle}>{grupo.categoria}</Text>
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
      </View>
    );
  };

  const styles = StyleSheet.create({
    card: {
      backgroundColor: '#FBFBFB',
      padding: 10,
      borderRadius: 16,
      marginVertical: 12,
      elevation: 2,
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: '#1A1A1A',
      marginBottom: 4,
    },
    cardSubtitle: {
      marginTop: 16,
      fontSize: 16,
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
      marginBottom: 8,
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
  });
  

export default PacoteCard;
