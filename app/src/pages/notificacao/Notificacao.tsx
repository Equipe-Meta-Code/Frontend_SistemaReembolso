import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SectionList, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import type { StackNavigationProp } from '@react-navigation/stack';
import { format, isYesterday, isThisWeek, isThisMonth } from 'date-fns';
import { RootState } from '../../(redux)/store';
import { fetchNotifications, markNotificationAsRead } from '../../(redux)/notificationsSlice';
import { useTheme } from '../../context/ThemeContext';
import AntDesign from '@expo/vector-icons/AntDesign';
import type { AppDispatch } from '../../(redux)/store';

type RootStackParamList = {
  DetalheDespesa: { id: string };
};

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  date: number;
  read: boolean;
};

export default function Notificacao() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();
  const { items: allNotifications, loading } = useSelector((state: RootState) => state.notifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const filteredNotifications = allNotifications.filter(n => filter === 'all' ? true : !n.read);

  const sections = [
    { title: 'Hoje', data: filteredNotifications.filter(n => format(n.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')) },
    { title: 'Ontem', data: filteredNotifications.filter(n => isYesterday(n.date)) },
    { title: 'Esta Semana', data: filteredNotifications.filter(n => format(n.date, 'yyyy-MM-dd') !== format(new Date(), 'yyyy-MM-dd') && !isYesterday(n.date) && isThisWeek(n.date, { weekStartsOn: 1 })) },
    { title: 'Este Mês', data: filteredNotifications.filter(n => !isThisWeek(n.date, { weekStartsOn: 1 }) && isThisMonth(n.date)) },
    { title: 'Anterior', data: filteredNotifications.filter(n => !isThisMonth(n.date)) },
  ].filter(sec => sec.data.length > 0);

  function handlePress(item: NotificationItem) {
    if (!item.read) {
      dispatch(markNotificationAsRead(item.id));
    }
  }

  if (loading) {
    return <View style={styles.container}><Text style={styles.emptyText}>Carregando...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <AntDesign name="arrowleft" style={styles.arrow} />
          <Text style={styles.title_header}>Notificações</Text>
        </TouchableOpacity>
        <View style={styles.filters}>
          <TouchableOpacity onPress={() => setFilter('all')} style={[styles.filterBtn, filter === 'all' && styles.activeBtn]}>
            <Text style={filter === 'all' ? styles.activeBtnText : styles.filterBtnText}>Todas</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFilter('unread')} style={[styles.filterBtn, filter === 'unread' && styles.activeBtn]}>
            <Text style={filter === 'unread' ? styles.activeBtnText : styles.filterBtnText}>Não Lidas</Text>
          </TouchableOpacity>
        </View>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item.id + index}
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
        stickySectionHeadersEnabled={true}
      />
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 50,
    backgroundColor: theme.colors.primary
  },
  arrow: {
    fontSize: 24,
    color: theme.colors.sempre_branco
  },
  title_header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.sempre_branco,
    marginLeft: 16
  },
  filters: {
    flexDirection: 'row'
  },
  filterBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#FFF',
    borderRadius: 20
  },
  activeBtn: {
    backgroundColor: '#FFF'
  },
  filterBtnText: {
    color: '#FFF',
    fontWeight: '500'
  },
  activeBtnText: {
    color: '#2D61FF',
    fontWeight: 'bold'
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    backgroundColor: '#E9E9EF',
    paddingVertical: 8,
    paddingHorizontal: 20,
    color: '#333',
    marginTop: 10
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFF'
  },
  texts: {
    flex: 1,
    marginRight: 10
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111'
  },
  unreadTitle: {
    fontWeight: 'bold'
  },
  body: {
    fontSize: 14,
    color: '#555',
    marginTop: 2
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginTop: 6
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2D61FF',
    marginLeft: 8
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  empty: {
    alignItems: 'center',
    padding: 20
  },
  emptyText: {
    fontSize: 16,
    color: '#777'
  },
});