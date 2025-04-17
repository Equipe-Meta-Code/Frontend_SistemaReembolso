import { Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useMemo } from 'react';
import { styles } from './styles';
import CustomDropdown from '../../components/customDropdown';
import CustomDatePicker from '../../components/customDate/index';
import { TextInputMask } from 'react-native-masked-text';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import api from '../../services/api';
import {  useSelector } from 'react-redux';
import { RootState } from "../../(redux)/store";

const RegistroDespesa = () => {
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [category, setCategory] = useState("");
    const [categoriesByProject, setCategoriesByProject] = useState<{ [key: string]: { label: string; value: string }[] }>({});
    const [selectedProject, setSelectedProject] = useState("");
    const [projects, setProjects] = useState([]);
    const [date, setDate] = useState("");
    const [amount, setAmount] = useState("");
    const [amountFormatted, setAmountFormatted] = useState(0);
    const [description, setDescription] = useState('');
    const [allProjects, setAllProjects] = useState<Project[]>([]);
    const [totalGastoCategoria, setTotalGastoCategoria] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const user = useSelector((state: RootState) => state.auth.user);

    type Category = {
      categoriaId: string;
      nome: string;
      valor_maximo: number;
    };
    
    type Project = {
      projetoId: string;
      nome: string;
      categorias: Category[];
    };

    const fetchData = async () => {
        try {
          let response = await api.get('/projeto');

          const projetos = response.data;
          setAllProjects(projetos);

          // Transforma a lista de projetos para o dropdown
          const formattedProjects = projetos.map((projeto: Project) => ({
            label: projeto.nome,
            value: projeto.projetoId.toString(), // Certifique-se de que é string
          }));
      
          // Cria um objeto com categorias agrupadas por projeto
          const categoriasPorProjeto: { [key: string]: { label: string; value: string }[] } = {};
      
          projetos.forEach((projeto: any) => {
            const categoriasFormatadas = projeto.categorias.map((cat: Category) => ({
              label: cat.nome,
              value: cat.categoriaId.toString(),
            }));
            categoriasPorProjeto[projeto.projetoId.toString()] = categoriasFormatadas;
          });
      
          setProjects(formattedProjects);
          setCategoriesByProject(categoriasPorProjeto);
        } catch (error) {
          console.error("Erro ao buscar projetos:", error);
        }
      };

      useEffect(() => {
        if (selectedProject && category) {
          const fetchDataDespesas = async () => {
            try {
              let response = await api.get('/despesa');
      
              const despesas = response.data;
      
              const despesasFiltradas = despesas.filter(
                (despesa: any) =>
                  despesa.projetoId.toString() === selectedProject &&
                  despesa.categoria.toString() === category
              );
      
              const total = despesasFiltradas.reduce((acc: number, curr: any) => {
                return acc + parseFloat(curr.valor_gasto);
              }, 0);
      
              setTotalGastoCategoria(total);
      
            } catch (error) {
              console.error("Erro ao buscar despesas por categoria:", error);
            }
          };
      
          fetchDataDespesas();
        }
      }, [selectedProject, category]);

      const filteredCategories = categoriesByProject[selectedProject] || [];
      
      useEffect(() => {
        fetchData();
      }, []);

      const valor_maximo = useMemo(() => {
        if (!selectedProject || !category) return 0;
      
        const selectedProjectData = allProjects.find(
          (project) => project.projetoId.toString() === selectedProject
        );
      
        const selectedCategoryData = selectedProjectData?.categorias.find(
          (cat) => cat.categoriaId.toString() === category
        );
      
        return selectedCategoryData?.valor_maximo || 0;
      }, [selectedProject, category, allProjects]);
    
  
    const handleCategoryChange = (value: string) => {
      setCategory(value);

      const selected = filteredCategories.find(cat => cat.value === value);
      if (selected) {
        setCategoryName(selected.label);
      }
    };
  
    const handleProjectChange = (value: string) => {
        setSelectedProject(value);
        setCategory("");
    };
    const handleDateChange = (date: string) => {
      setDate(date);
    };
  
    const handleAmountChange = (value: string) => {
      setAmount(value);
      setAmountFormatted(parseFloat(value.replace(/[R$\s.]/g, '').replace(',', '.')));
    };
  
    const handleDescriptionChange = (value: string) => {
      setDescription(value);
    };

    const handleSubmit = async () => {
      fetchData();
      setError(""); // Limpar mensagem de erro anterior
      setSuccessMessage(""); // Limpar mensagem de sucesso anterior
      
      if (!category || !selectedProject || !date || !amount || !description) {
        setError("Por favor, preencha todos os campos.");
        return;
      }
      const parsedValue = parseFloat(amount.replace(/[R$\s.]/g, '').replace(',', '.'));
  
      if (isNaN(parsedValue)) {
        setError("Valor inválido. Por favor, insira um valor válido.");
        return;
      }
  
      let dateSplitted = date.split("/");
      let day = dateSplitted[0]
      let month = dateSplitted[1]
      let year = dateSplitted[2]
  
      let dateFormated = year+'-'+month+'-'+day;
  
      let finalDate = new Date(dateFormated)
    
      try {
        const response = await api.post("/despesa", {
          projetoId: selectedProject,
          userId: user?.userId,
          categoria: category,
          data: finalDate,
          valor_gasto: parsedValue,
          descricao: description,
          aprovacao: "Pendente",
        });
        console.log(response.data);
        setSuccessMessage("Despesa cadastrada com sucesso!");
        
        setTimeout(() => {
          setCategory("");
          setSelectedProject("");
          setDate("");
          setAmount("");
          setDescription("");
          setSuccessMessage("");
        }, 1500);
      } catch(error) {
        console.error("Erro ao cadastrar despesa:", error);
        setError("Erro ao cadastrar despesa. Por favor, tente novamente.");
      }
    };
  
    return (
      <>
        <ScrollView
              contentContainerStyle={{ flexGrow: 1}}
              keyboardShouldPersistTaps="handled"
              style={styles.container}
          >
        <View style={styles.boxTop}>
          <AntDesign name="arrowleft" style={styles.arrow} />
            <View style={styles.boxTitle}>
              <Text style={styles.title}>Novo Registro</Text>
              <Text style={styles.subTitle}>Insira as informações sobre o seu novo gasto para poder registrá-lo no projeto</Text>
            </View>
          <View style={styles.boxTopTwo}>
            <Text style={styles.textTop}>Projeto</Text>
            <CustomDropdown 
            data={projects}
            placeholder='Selecione um projeto'
            value={selectedProject}
            onValueChange={handleProjectChange}
          />
          </View>
        </View>
        <View style={styles.boxBottom}>
          <Text style={styles.textBottom}>Categoria</Text>
          <CustomDropdown 
            data={filteredCategories}
            placeholder='Selecione uma categoria'
            value={category}
            onValueChange={handleCategoryChange}
          />
  
          <Text style={styles.textBottom}>Data</Text>
          <CustomDatePicker
            value={date}
            onValueChange={handleDateChange}
          />
  
          <Text style={styles.textBottom}>Valor Gasto</Text>
          <TextInputMask
            type={'money'}
            value={amount}
            onChangeText={handleAmountChange}
            style={styles.inputMask}
            placeholder='R$ 0,00'
            />
            {amountFormatted > valor_maximo &&
              <Text style={{ color: 'red' }}>O valor informado excede o limite de R$ {valor_maximo} permitido para esta categoria. Caso deseje continuar, 
                por favor insira uma descrição justificando a despesa.</Text>}
          
          <Text style={styles.textBottom}>Descrição</Text>
          <TextInput
            value={description}
            onChangeText={handleDescriptionChange}
            placeholder="Digite uma descrição"
            style={styles.inputDescription}
          />
  
          <Text style={styles.textBottom}>Adicione o comprovante</Text>
          <TouchableOpacity>
            <MaterialCommunityIcons 
              name="image-plus" 
              style={styles.image} 
            />
          </TouchableOpacity>
  
          {successMessage && <Text style={styles.successMessage}>{successMessage}</Text>}
          {error && <Text style={styles.errorMessage}>{error}</Text>}
  
          <TouchableOpacity 
            style={styles.button}
            onPress={handleSubmit}>
            <Text style={styles.buttonText}>Registrar Gasto</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.teste}></View>
        </ScrollView>
      </>
    );
};

export default RegistroDespesa;