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
    status: string[];
    despesas?: Despesa[];
  }

  const PacoteCard: React.FC<Pacote> = ({ nome, despesas }) => {
    // Agrupando despesas por categoria
    const despesasAgrupadas = despesas?.reduce((acc: any[], despesa) => {
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
    backgroundColor: '#fdfdfd',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    marginTop: 8,
    fontWeight: '600',
    color: '#555',
  },
  despesaItem: {
    marginTop: 4,
    color: '#333',
  },
  semDespesa: {
    marginTop: 4,
    color: '#999',
    fontStyle: 'italic',
  },
});

export default PacoteCard;
