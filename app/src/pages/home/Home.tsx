import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { RootState } from "../../(redux)/store";
import { FontAwesome5 } from '@expo/vector-icons';

import api from '../../services/api';
import Foto from '../../components/foto/Foto';
import ProjectCard from '../../components/home/ProjectCard';
import { useTheme } from '../../context/ThemeContext';
import { selectUnreadCount } from '../../(redux)/notificationsSlice';

interface Project {
  id: string;
  department: string;
  name: string;
  descricao: string;
  category: string[];
  total: number;
  spent: number;
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
  const user = useSelector((state: RootState) => state.auth.user);
  const unreadCount = useSelector(selectUnreadCount);

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

      setProjects(projetosAtualizados);
    } catch (error) {
      console.error('Erro ao buscar projetos e despesas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isScreenFocused) {
      fetchProjectsAndDespesas();
    }
  }, [isScreenFocused]);

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
              style={[styles.iconRight, isScreenFocused && { color: theme.colors.secondary }]}
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
                borderColor={theme.colors.secondary}
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

      <View style={styles.projectsList}>
        <Text style={[styles.projectTitle, { color: theme.colors.text }]}>Projetos</Text>
        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : (
          <FlatList
            data={projects}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ProjectCard project={item} />}
            refreshing={loading}
            onRefresh={fetchProjectsAndDespesas}
          />
        )}
      </View>
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