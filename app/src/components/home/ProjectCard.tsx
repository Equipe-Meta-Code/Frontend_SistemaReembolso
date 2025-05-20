import React from 'react'; 
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { themas } from "../../global/themes";

export interface Project {
  id: string;
  department?: string; // Torna opcional para evitar erros
  descricao?: string;
  name: string;
  category?: string[];
  total: number;
  spent: number;
}

type RootStackParamList = {
  Pacotes: { projectId: string };
};

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const progress = project.total > 0 ? project.spent / project.total : 0;
  const valueLeft = project.total - project.spent;

  return (
    <TouchableOpacity onPress={() => navigation.navigate('Pacotes', { projectId: project.id })}>
      <View style={styles.card}>

        {project.department && (
          <View style={styles.departmentContainer}>
            {project.department.split(',').map((department, index) => (
              <Text key={index} style={[styles.department, { backgroundColor: themas.colors.amarelo_muito_claro }]}>  
                {department.trim()}
              </Text>
            ))}
          </View>
        )}

        <Text style={styles.cardTitle}>{project.name || 'Sem Nome'}</Text>

        {project.descricao && <Text style={styles.cardDescription}>{project.descricao}</Text>}

        <Text>Limite de Gastos: R${project.total?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Text>

        <ProgressBar 
          progress={progress} 
          color={valueLeft >= 0 ? themas.colors.primary : themas.colors.vinho_escuro_opaco} 
          style={styles.progressBar} 
        />


        <Text>
          Gasto: R$
          {project.spent?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) ?? '0,00'}
          {valueLeft >= 0 ? (
            <> / Restante: R${valueLeft.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</>
          ) : (
            <> / <Text style={{ color: themas.colors.vinho_escuro_opaco }}>
              Limite Ultrapassado: R${Math.abs(valueLeft).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Text></>
          )}
        </Text>

        <Text style={styles.category}>
          {project.category?.length ? project.category.join(' • ') : 'Sem Categoria'}
        </Text>

      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: themas.colors.secondary,
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: themas.colors.black,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardDescription: {
    color: themas.colors.cinza,
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5,
  },
  category: {
    fontSize: 14,
    color: themas.colors.cinza,
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
    color: themas.colors.amarelo,
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    marginRight: 5,
    marginBottom: 5,
  },
});

export default ProjectCard;
