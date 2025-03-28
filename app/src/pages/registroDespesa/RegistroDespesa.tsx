import { Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { styles } from './styles';
import CustomDropdown from '../../components/customDropdown';
import CustomDatePicker from '../../components/customDate/index';
import { TextInputMask } from 'react-native-masked-text';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import api2 from '../../services/api2';
import api from '../../services/api';

const RegistroDespesa = () => {
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [category, setCategory] = useState("");
    const [categoriesByProject, setCategoriesByProject] = useState<{ [key: string]: { label: string; value: string }[] }>({});
    const [selectedProject, setSelectedProject] = useState("");
    const [projects, setProjects] = useState([]);
    const [date, setDate] = useState("");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState('');

    type Category = {
      id_categoria: string;
      nome: string;
      valor_maximo: number;
    };
    
    type Project = {
      id: string;
      name: string;
      categorias: Category[];
    };

    const categoriesObj: { [key: string]: { label: string; value: string }[] } = {};

    const fetchData = async () => {
        try {
          let response = await api.get('/projetos');
          const projectList = response.data[0].projects; 
          const formattedProjects = projectList.map((project:{ id: string; name: string }) => ({
            label: project.name,  
            value: project.id, 
          }));

          projectList.forEach((project: Project) => {
            categoriesObj[project.id] = project.categorias.map((category: Category) => ({
              label: category.nome,
              value: category.nome,
            }));
          });

          setProjects(formattedProjects);
          setCategoriesByProject(categoriesObj);
        } catch (error) {
          console.error("Erro ao buscar projetos:", error);
        }
      };

      const filteredCategories = categoriesByProject[selectedProject] || [];
      
      useEffect(() => {
        fetchData();
      }, []);
    
  
    const handleCategoryChange = (value: string) => {
      setCategory(value);
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
      const parsedValue = parseFloat(amount.replace(/[^\d.-]/g, ''))/100;
  
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
        const response = await api2.post("/despesa", {
          projetoId: selectedProject,
          categoria: category,
          data: finalDate,
          valor_gasto: parsedValue,
          descricao: description,
        });
        console.log(response.data);
        setSuccessMessage("Despesa cadastrada com sucesso!");
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