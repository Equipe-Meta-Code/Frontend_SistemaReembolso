import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

export interface Project {
  id: string;
  department: string;
  name: string;
  total: number;
  spent: number;
  category: string[];
}

type RootStackParamList = {
  Historico: { projectId: string };
};

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const progress = project.total > 0 ? project.spent / project.total : 0;
  const valueLeft = project.total - project.spent;

  return (
    <TouchableOpacity onPress={() => navigation.navigate('Historico', { projectId: project.id })}>
      <View style={styles.card}>
        <View style={styles.departmentContainer}>
          {project.department?.split(',').map((department: string, index: number) => (
            <Text key={index} style={[styles.department, { backgroundColor: "#FFFCF1" }]}>
              {department.trim()}
            </Text>
          ))}
        </View>

        <Text style={styles.cardTitle}>{project.name}</Text>

        <Text>Limite de Gastos: R${project.total.toFixed(2)}</Text>

        <ProgressBar progress={progress} color="#1F48AA" style={styles.progressBar} />

        <Text>Gasto: R${project.spent.toFixed(2)} / Restante: R${valueLeft.toFixed(2)}</Text>

        <Text style={styles.category}>{project.category?.join(' • ') || 'Sem Categoria'}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  category: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 5,
    marginTop: 5,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  departmentContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  department: {
    color: '#D7AA0D',
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    marginRight: 5,
    marginBottom: 5,
  },
});

export default ProjectCard;
