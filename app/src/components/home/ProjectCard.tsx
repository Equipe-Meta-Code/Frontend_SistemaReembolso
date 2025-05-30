import React from 'react'; 
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { themas } from "../../global/themes";
import { useTheme } from '../../context/ThemeContext';

export interface Project {
  id: string;
  department?: string; // Torna opcional para evitar erros
  descricao?: string;
  name: string;
  category?: string[];
  total: number;
  spent: number;
}

interface ProjectCardProps {
  project: Project;
  isEncerrado?: boolean;
}

type RootStackParamList = {
  Pacotes: { projectId: string };
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project, isEncerrado }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const progress = project.total > 0 ? project.spent / project.total : 0;
  const valueLeft = project.total - project.spent;
  const { theme } = useTheme(); 
  const styles = createStyles (theme); 

  // Cores de texto mais claras se encerrado
  const textColor = isEncerrado ? theme.colors.cinza : theme.colors.text;
  const descriptionColor = isEncerrado ? theme.colors.cinza_medio || theme.colors.cinza : theme.colors.text;

  return (
    <TouchableOpacity onPress={() => navigation.navigate('Pacotes', { projectId: project.id })} >
      <View style={[styles.card, { backgroundColor: theme.colors.secondary, opacity: isEncerrado ? 0.5 : 1 }]}>
        {project.department && (
          <View style={styles.departmentContainer}>
            {project.department.split(',').map((department, index) => (
              <Text
                key={index}
                style={[styles.department, { backgroundColor: theme.colors.amarelo_muito_claro }]}
              >
                {department.trim()}
              </Text>
            ))}
          </View>
        )}

        <Text style={[styles.cardTitle, { color: textColor }]}>{project.name || 'Sem Nome'}</Text>

        {project.descricao && (
          <Text style={[styles.cardDescription, { color: descriptionColor }]}>{project.descricao}</Text>
        )}

        <Text style={{ color: textColor }}>
          Limite de Gastos: R${project.total?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </Text>

        <ProgressBar
          progress={progress}
          color={valueLeft >= 0 ? themas.colors.primary : themas.colors.vinho_escuro_opaco}
          style={styles.progressBar}
        />

        <Text style={{ color: textColor }}>
          Gasto: R${project.spent?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) ?? '0,00'}
          {valueLeft >= 0 ? (
            <> / Restante: R${valueLeft.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</>
          ) : (
            <>
              {' '}
              /{' '}
              <Text style={{ color: themas.colors.vinho_escuro_opaco }}>
                Limite Ultrapassado: R${Math.abs(valueLeft).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Text>
            </>
          )}
        </Text>

        <Text style={[styles.category, { color: textColor }]}>
          {project.category?.length ? project.category.join(' • ') : 'Sem Categoria'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  card: {

    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: theme.colors.black,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: theme.colors.text,
  },
  cardDescription: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5,
    color: theme.colors.text,
  },
  category: {
    fontSize: 14,
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
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    marginRight: 5,
    marginBottom: 5,
  },
});

export default ProjectCard;
