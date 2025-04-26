import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ProjectCard from '../../components/home/ProjectCard';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import api from '../../services/api';
import { useSelector } from 'react-redux';
import { RootState } from "../../(redux)/store";
import { themas } from '../../global/themes';

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
};

const Home: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [projects, setProjects] = useState<Project[]>([]);
  const [despesas, setDespesas] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await api.get('/projeto'); 
        const data = response.data;
        const userId = Number(user?.userId);
        const userProjects = data.filter((project: any) =>
          project.funcionarios?.includes(7) //Incluir o id do usuário aqui
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
        setProjects(formattedProjects);
      } catch (error) {
        console.error('Erro ao buscar projetos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (projects.length > 0) {
    const fetchDespesas = async () => {
      setLoading(true);
      try {
        const response = await api.get('/despesa'); 
        const data = response.data;
  
        const projetoIds = projects.map(p => p.id);
  
        const totalPorProjeto = data
          .filter((d: any) => projetoIds.includes(d.projetoId))
          .reduce((acc: { [key: number]: number }, d: any) => {
            if (!acc[d.projetoId]) acc[d.projetoId] = 0;
            acc[d.projetoId] += d.valor_gasto;
            return acc;
          }, {});
  
        const resultado = projects.map(p => ({
          projetoId: p.id,
          nomeProjeto: p.name,
          total_despesas: Number((totalPorProjeto[p.id] || 0).toFixed(2))
        }));
  
        setDespesas(resultado);
        const projetosAtualizados = projects.map(p => ({
          ...p,
          spent: Number((totalPorProjeto[p.id] || 0).toFixed(2))
        }));
        setProjects(projetosAtualizados);
      } catch (error) {
        console.error('Erro ao buscar despesas:', error);
      } finally {
        setLoading(false);
      }
    };
      fetchDespesas();
    } 
  }, [projects.length]);

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.title}>Bem vindo(a)!</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Perfil')}>
          <Image source={require('../../assets/perfil.png')} style={styles.image} />
        </TouchableOpacity>
      </View>        
      
      <View style={styles.projectsList}>
        <Text style={styles.projectTitle}>Projetos</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
            data={projects}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ProjectCard project={item} />}
          />
        )}
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 50,
    backgroundColor: themas.colors.primary,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  projectTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  projectsList: {
    flex: 1,
    padding: 30,
  },
});

export default Home;
