import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from "../../(redux)/store";
import { FontAwesome5 } from '@expo/vector-icons';

import api from '../../services/api';
import Foto from '../../components/foto/Foto';
import ProjectCard from '../../components/home/ProjectCard';
import { useTheme } from '../../context/ThemeContext';
import { selectUnreadCount, fetchNotifications } from '../../(redux)/notificationsSlice';

interface Project {
  id: string;
  department: string;
  name: string;
  descricao: string;
  category: string[];
  total: number;
  spent: number;
  encerrado?: boolean;
  isEncerrado?: boolean;
}

type RootStackParamList = {
  Home: undefined;
  RegistroDespesa: undefined;
  Historico: undefined;
  Perfil: undefined;
  Notificacao: undefined;
};

const Home: React.FC = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const userProfileImage = useSelector((state: RootState) => state.auth.user?.profileImage);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const isScreenFocused = useIsFocused();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [ativos, setAtivos] = useState<Project[]>([]);
  const [encerrados, setEncerrados] = useState<Project[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const user = useSelector((state: RootState) => state.auth.user);
  const unreadCount = useSelector(selectUnreadCount);
  const dispatch = useDispatch<AppDispatch>();

  const fetchProjectsAndDespesas = async () => {
    try {
      setLoading(true);
      const [projectRes, despesaRes] = await Promise.all([
        api.get('/projeto'),
        api.get('/despesa')
      ]);

      const allProjects = projectRes.data;
      const allDespesas = despesaRes.data;
      const userId = Number(user?.userId);

      const userProjects = allProjects.filter((project: any) =>
        project.funcionarios?.some((func: any) => String(func.userId) === String(userId))
      );

      const formattedProjects: Project[] = userProjects.map((project: any) => ({
        id: project.projetoId,
        name: project.nome,
        descricao: project.descricao,
        department: project.departamentos?.map((dep: any) => dep.nome).join(', ') || '',
        category: project.categorias?.map((cat: any) => cat.nome) || [],
        total: project.categorias?.reduce((acc: number, cat: any) => acc + (cat.valor_maximo || 0), 0) || 0,
        spent: 0,
        encerrado: project.status === 'encerrado',
      }));

      const projetoIds = formattedProjects.map(p => p.id);

      const totalPorProjeto = allDespesas
        .filter(
          (d: any) => projetoIds.includes(d.projetoId) &&
            d.userId.toString() === user?.userId.toString())
        .reduce((acc: { [key: number]: number }, d: any) => {
          if (!acc[d.projetoId]) acc[d.projetoId] = 0;
          acc[d.projetoId] += d.valor_gasto;
          return acc;
        }, {});

      const projetosAtualizados = formattedProjects.map(p => ({
        ...p,
        spent: Number((totalPorProjeto[p.id] || 0).toFixed(2))
      }));

      const ativosFiltrados = projetosAtualizados.filter(p => !p.encerrado);
      const encerradosFiltrados = projetosAtualizados.filter(p => p.encerrado);

      setAtivos(ativosFiltrados);
      setEncerrados(encerradosFiltrados);

      setProjects(projetosAtualizados);
    } catch (error) {
      console.error('Erro ao buscar projetos e despesas:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProjectsAndDespesas();
    setRefreshing(false);
  };

  useEffect(() => {
    if (isScreenFocused) {
      fetchProjectsAndDespesas();
    }
  }, [isScreenFocused]);

  useEffect(() => {
    if (!isScreenFocused) return;
    const interval = setInterval(() => {
      dispatch(fetchNotifications());
    }, 3000);
    return () => clearInterval(interval);
  }, [dispatch, isScreenFocused]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.top, { backgroundColor: theme.colors.primary }]}>
        <Text style={[styles.title, { color: theme.colors.sempre_branco }]}>Bem vindo(a)!</Text>
        {/* botão de notificação */}
        <View style={styles.rightIcons}>
          {/* Ícone de notificação com badge */}
          <TouchableOpacity onPress={() => navigation.navigate("Notificacao")} style={styles.badgeWrapper}>
            <FontAwesome5
              name="bell"
              style={[styles.iconRight, isScreenFocused && { color: theme.colors.sempre_branco }]}
            />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* foto do perfil */}
          <TouchableOpacity onPress={() => navigation.navigate('Perfil')}>
            {user ? (
              <Foto
                tipo="user"
                tipoId={+user.userId}
                width={50}
                height={50}
                borderRadius={25}
                borderWidth={3}
                borderColor={theme.colors.sempre_branco}
                refreshKey={user.profileImage}
                fallbackSource={require('../../assets/perfil.png')}
              />
            ) : (
              <Image
                source={userProfileImage ? { uri: userProfileImage } : require('../../assets/perfil.png')}
                style={styles.image}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.projectsList} 
        contentContainerStyle={{ paddingBottom: 30 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]} 
            tintColor={theme.colors.primary} 
          />
        }
      >
        {ativos.length > 0 && (
          <>
            <Text style={[styles.projectTitle, { color: theme.colors.text, marginBottom: -1, fontSize: 18 }]}>Projetos Ativos</Text>
            <FlatList
              data={ativos}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ProjectCard project={item} isEncerrado={false} />
              )}
              scrollEnabled={false} 
              ListEmptyComponent={
                <Text style={{ color: theme.colors.cinza }}>Nenhum projeto ativo</Text>
              }
            />
          </>
        )}

        {encerrados.length > 0 && (
          <>
            <Text style={[styles.projectTitle, { color: theme.colors.cinza, marginTop: 30, marginBottom: -1, fontSize: 18 }]}>Projetos Encerrados</Text>
            <FlatList
              data={encerrados}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ProjectCard project={item} isEncerrado={true} />
              )}
              scrollEnabled={false}
              ListEmptyComponent={
                <Text style={{ color: theme.colors.cinza }}>Nenhum projeto encerrado</Text>
              }
            />
          </>
        )}

        {ativos.length === 0 && encerrados.length === 0 && (
          <Text style={{ color: theme.colors.cinza, marginTop: 20 }}>Nenhum projeto encontrado</Text>
        )}
      </ScrollView>
    </View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 50,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  iconRight: {
    fontSize: 24,
    color: theme.colors.sempre_branco,
    marginRight: 16,
  },
  projectTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  projectsList: {
    flex: 1,
    padding: 30,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badgeWrapper: {
    marginRight: 16,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.red,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: theme.colors.sempre_branco,
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default Home;