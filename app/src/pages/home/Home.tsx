import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ProjectCard from '../../components/home/ProjectCard';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import api from '../../api'; 

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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await api.get('/projetos'); 
        const data = response.data;

        const formattedProjects: Project[] = data[0].projects.map((project: any) => ({
          id: project.id,
          name: project.name,
          descricao: project.descricao,
          department: project.departamentos.map((dep: any) => dep.nome).join(', '),
          category: project.categorias.map((cat: any) => cat.nome),
          total: project.categorias.reduce((acc: number, cat: any) => acc + cat.valor_maximo, 0),
          spent: 0, // Adicionar valor gasto
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

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.title}>Welcome!</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Perfil')}>
          <Image source={require('../../../assets/icon.png')} style={styles.image} />
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
    backgroundColor: '#1F48AA',
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
