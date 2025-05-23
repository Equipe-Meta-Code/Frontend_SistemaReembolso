import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SectionList, TouchableOpacity, Platform } from 'react-native'; // Image foi removido se não estiver sendo usado
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import type { StackNavigationProp } from '@react-navigation/stack';
import { format, isYesterday, isThisWeek, isThisMonth } from 'date-fns';
import { RootState } from '../../(redux)/store'; // Confirme o caminho
import { markAsRead } from '../../(redux)/notificationsSlice'; // Confirme o caminho
import { useTheme } from '../../context/ThemeContext';
import AntDesign from '@expo/vector-icons/AntDesign';
import { themas } from "../../global/themes";

// Tipagem de rotas
type RootStackParamList = {
  DetalheDespesa: { id: string }; // O parâmetro da rota se chama 'id'
  Home: undefined;
};

// Tipo da notificação como armazenada no Redux
// Este ID é o ID único da notificação (ex: "algumDespesaId-1687780000000")
type NotificationItem = {
  id: string;
  title: string;
  body: string;
  date: number;
  read: boolean;
  // Se você decidir armazenar o payload 'data' da notificação no Redux, adicione-o aqui:
  // data?: { despesaId?: string; [key: string]: any };
};

export default function Notificacao() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();
  const allNotifications = useSelector((state: RootState) => state.notifications.items);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // Filtra notificações conforme estado
  const filteredNotifications = allNotifications.filter(n => filter === 'all' ? true : !n.read);

  // Agrupa em seções: Ontem / Esta Semana / Este Mês / Anterior
  const sections = [
    { title: 'Hoje', data: filteredNotifications.filter(n => format(n.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')) }, // Adicionada seção "Hoje" para melhor UX
    { title: 'Ontem', data: filteredNotifications.filter(n => isYesterday(n.date)) },
    { title: 'Esta Semana', data: filteredNotifications.filter(n => format(n.date, 'yyyy-MM-dd') !== format(new Date(), 'yyyy-MM-dd') && !isYesterday(n.date) && isThisWeek(n.date, { weekStartsOn: 1 /* Segunda-feira */ })) },
    { title: 'Este Mês', data: filteredNotifications.filter(n => !isThisWeek(n.date, { weekStartsOn: 1 }) && isThisMonth(n.date)) },
    { title: 'Anterior', data: filteredNotifications.filter(n => !isThisMonth(n.date)) },
  ].filter(sec => sec.data.length > 0);

  // Marcar como lida e navegar para o detalhe da despesa
  function handlePress(item: NotificationItem) {
    dispatch(markAsRead(item.id)); // item.id é o ID único da notificação

    // Extrai o ID da despesa do ID da notificação.
    // Isso assume que o ID da notificação (item.id) foi formatado como "despesaId-timestamp"
    // no NotificationsService.ts ao chamar addNotification.
    const extractedDespesaId = item.id.split('-')[0];

    // Navega para DetalheDespesa, passando o ID da despesa extraído.
    // O parâmetro da rota é chamado 'id', conforme definido em RootStackParamList.
    if (extractedDespesaId && extractedDespesaId !== 'undefined' && extractedDespesaId !== 'ID não disponível') {
      navigation.navigate('DetalheDespesa', { id: extractedDespesaId });
    } else {
      console.warn('Não foi possível extrair um ID de despesa válido para navegação:', item.id);
      // Opcional: Mostrar um alerta para o usuário
    }
  }

  return (
    <View style={styles.container}>
      {/* Header com filtros */}
        <View style={styles.top}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <AntDesign name="arrowleft" style={styles.arrow} />
            <Text style={styles.title_header}>Notificações</Text>
            <View style={styles.filters}>
            <TouchableOpacity onPress={() => setFilter('all')} style={[styles.filterBtn, filter === 'all' && styles.activeBtn]}>
              <Text style={filter === 'all' ? styles.activeBtnText : styles.filterBtnText}>Todas</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setFilter('unread')} style={[styles.filterBtn, filter === 'unread' && styles.activeBtn]}>
              <Text style={filter === 'unread' ? styles.activeBtnText : styles.filterBtnText}>Não Lidas</Text>
            </TouchableOpacity>
          </View>
          </TouchableOpacity>
        </View>

        <SectionList
          sections={sections}
          keyExtractor={(item, index) => item.id + index} // Garante chave única mesmo com IDs de notificação potencialmente problemáticos
          renderSectionHeader={({ section }) => (
            <Text style={styles.sectionHeader}>{section.title}</Text>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.itemContainer} onPress={() => handlePress(item)}>
              <View style={styles.texts}>
                <Text style={[styles.title, !item.read && styles.unreadTitle]}>{item.title}</Text>
                <Text style={styles.body}>{item.body}</Text>
                <Text style={styles.date}>{format(item.date, 'dd/MM/yyyy HH:mm')}</Text>
              </View>
              {!item.read && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <View style={styles.empty}><Text style={styles.emptyText}>Você não possui notificações.</Text></View>
          )}
          contentContainerStyle={sections.length === 0 && styles.emptyContainer}
        />
      </View>
  );
}

// Estilos (mantidos e adicionados alguns para os filtros e empty state)
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
  arrow: {
    fontSize: 24,
    color: theme.colors.sempre_branco,
  },
    title_header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.sempre_branco,
    paddingLeft: 15,
  },
  header: {
    backgroundColor: '#2D61FF',
    paddingHorizontal: 20, // Mais padding
    paddingTop: Platform.OS === 'android' ? 25 : 40, // Ajuste para status bar
    paddingBottom: 15,
    // Removido flexDirection e justifyContent para empilhar o título e os filtros
    // marginTop: 100, // Pode ser desnecessário ou ajustado conforme o layout geral do app
  },
  heading: {
    fontSize: 28, // Maior
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 15, // Espaço antes dos filtros
    textAlign: 'center', // Centralizado
  },
  filters: {
    flexDirection: 'row',
    justifyContent: 'center', // Centralizar os botões de filtro
  },
  filterBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 5, // Espaço entre os botões
    borderWidth: 1,
    borderColor: '#FFF', // Borda branca para contraste com header azul
    borderRadius: 20, // Mais arredondado
  },
  activeBtn: {
    backgroundColor: '#FFF', // Fundo branco quando ativo
  },
  filterBtnText: {
    color: '#FFF', // Texto branco para botões inativos
    fontWeight: '500',
  },
  activeBtnText: {
    color: '#2D61FF', // Texto azul para botão ativo
    fontWeight: 'bold',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    backgroundColor: '#E9E9EF', // Fundo para cabeçalho de seção
    paddingVertical: 8,
    paddingHorizontal: 20, // Padding igual ao header
    color: '#333', // Cor mais escura para o texto
    marginTop: 10, // Espaçamento
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20, // Padding igual ao header
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0', // Cor da borda mais suave
    backgroundColor: '#FFF', // Fundo branco para itens
  },
  texts: {
    flex: 1,
    marginRight: 10, // Espaço antes do "unreadDot"
  },
  title: {
    fontSize: 16,
    fontWeight: '500', // Um pouco menos bold que o não lido
    color: '#111',
  },
  unreadTitle: {
    fontWeight: 'bold', // Mantém bold para não lidas
  },
  body: {
    fontSize: 14,
    color: '#555',
    marginTop: 2, // Pequeno espaço
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginTop: 6, // Mais espaço
  },
  unreadDot: {
    width: 10, // Maior
    height: 10, // Maior
    borderRadius: 5, // Metade da largura/altura
    backgroundColor: '#2D61FF', // Cor azul do tema
    marginLeft: 8,
  },
  emptyContainer: { // Estilo para quando a lista está vazia
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: { // Conteúdo do empty state
    alignItems: 'center', // Centralizar o texto
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
  }
});