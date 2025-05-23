import { Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useMemo } from 'react';
import { styles } from './styles';
import CustomDropdown from '../../components/customDropdown';
import CustomDatePicker from '../../components/customDate/index';
import { TextInputMask } from 'react-native-masked-text';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import api from '../../services/api';
import { useSelector } from 'react-redux';
import { RootState } from "../../(redux)/store";
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { themas } from '../../global/themes';

const GAS_PRICE = 6.20; // preço fixo da gasolina

const RegistroDespesa = () => {
  const [error, setError] = useState("");
  const [pacoteError, setPacoteError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showLimitMessage, setShowLimitMessage] = useState(false);
  const [category, setCategory] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [categoriesByProject, setCategoriesByProject] = useState<{ [key: string]: { label: string; value: string }[] }>({});
  const [date, setDate] = useState("");
  const [projects, setProjects] = useState([]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState('');
  const [amountFormatted, setAmountFormatted] = useState(0);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [totalGastoCategoria, setTotalGastoCategoria] = useState(0);
  const user = useSelector((state: RootState) => state.auth.user);
  const [selectedPacote, setSelectedPacote] = useState("");
  const [pacotes, setPacotes] = useState<{ label: string; value: string }[]>([]);
  const [creatingPacote, setCreatingPacote] = useState(false);
  const [newPacoteName, setNewPacoteName] = useState("");
  const [kmCost, setKmCost] = useState(0);
  const [km, setKm] = useState('');

    type RootStackParamList = {
      Home: undefined;
      RegistroDespesa: undefined;
      Historico: undefined;
      Perfil: undefined;
    };

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

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

    type Pacote = {
      pacoteId: number;
      nome: string;
      projetoId: string;
      userId: string;
      status: string;
    };

    const fetchData = async () => {
        try {
          let response = await api.get('/projeto');

          const projetos = response.data;
          const userId = Number(user?.userId);
          const userProjects = projetos.filter((project: any) =>
            project.funcionarios?.some((func: any) => func.userId === userId)
          );          
          /* console.log('projetos', projetos)
          console.log('user projetos', userProjects) */

          setAllProjects(userProjects);

          // Transforma a lista de projetos para o dropdown
          const formattedProjects = userProjects.map((projeto: Project) => ({
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

      const fetchPacotes = async (projetoId: string) => {
        try {
          const response = await api.get('/pacote');
          const pacotes: Pacote[] = response.data;
          /* console.log(pacotes) */

          // Filtra os pacotes
          const pacotesFiltrados = pacotes.filter(
            (pacote) =>
              pacote.userId.toString() === user?.userId.toString() &&
              pacote.projetoId.toString() === projetoId &&
              pacote.status === "Rascunho"
          );
      
          // Formata os pacotes filtrados para o dropdown
          const pacotesFormatados = pacotesFiltrados.map((pacote) => ({
            label: pacote.nome,
            value: pacote.pacoteId.toString(),
          }));
      
          setPacotes(pacotesFormatados); 
          console.log('formatados:',pacotesFormatados)
        } catch (error) {
          console.error("Erro ao buscar pacotes:", error);
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
      
      // Para criar um novo pacote de despesas
      const handleCreatePacote = async () => {

        if (!newPacoteName || !selectedProject) {
          setError("Informe o nome do pacote.");
          return;
        }

        const pacoteExistente = pacotes.find(
          (p) => p.label.trim().toLowerCase() === newPacoteName.trim().toLowerCase()
        );

        if (pacoteExistente) {
          setPacoteError("Já existe um pacote com esse nome neste projeto.");
          return;
        }
      
        try {
          const response = await api.post("/pacote", {
            nome: newPacoteName,
            projetoId: selectedProject,
            userId: user?.userId,
          });
      
          const novoPacote = response.data;
      
          // Formata para o dropdown
          const novoPacoteFormatado = {
            label: novoPacote.nome,
            value: novoPacote.pacoteId.toString(),
          };

          //Adiciona o novo pacote ao estado pacotes, mantendo os que já existiam
          setPacotes((prev) => [...prev, novoPacoteFormatado]);

          setSelectedPacote(novoPacote.pacoteId.toString());
          setCreatingPacote(false);
          setNewPacoteName("");
        } catch (error) {
          console.error("Erro ao criar pacote:", error);
          setError("Erro ao criar pacote. Tente novamente.");
        }
      };

      useEffect(() => {
        fetchData();
      }, []);

      useEffect(() => {
        if (selectedProject) {
          fetchPacotes(selectedProject);  
          fetchData();
        }
      }, [selectedProject]);

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
      setAmount("");
      setAmountFormatted(0);
    };
  
    const handleProjectChange = (value: string) => {
        setSelectedProject(value);
        setCategory("");
        setAmount("");
        setAmountFormatted(0);
    };
    
    const handlePacoteChange = (value: string) => {
      setSelectedPacote(value);
    };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchPacotes(selectedProject);
      fetchData();
    }
  }, [selectedProject]);

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

  const handleKmChange = (value: string) => {
    setKm(value);
    const parsed = parseFloat(value.replace(',', '.')) || 0;
    setKmCost(parsed * GAS_PRICE);
  };

  const handleSubmit = async () => {
    fetchData();
    setError(""); // Limpar mensagem de erro anterior
    setSuccessMessage(""); // Limpar mensagem de sucesso anterior

    if (!selectedPacote || !category || !selectedProject || !date || (categoryName === 'Transporte' ? !km : !amount) || !description) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    // Converte antes:
    const parsedKm = parseFloat(km.replace(',', '.'));
    const parsedAmount = parseFloat(amount.replace(/[R$\s.]/g, '').replace(',', '.'));

    // Validação dinâmica:
    if (categoryName === 'Transporte') {
      if (isNaN(parsedKm)) {
        setError("KM inválido. Insira um número válido.");
        return;
      }
    } else {
      if (isNaN(parsedAmount)) {
        setError("Valor inválido. Por favor, insira um valor válido.");
        return;
      }
    }

    let dateSplitted = date.split("/");
    let day = dateSplitted[0]
    let month = dateSplitted[1]
    let year = dateSplitted[2]

    let dateFormated = year + '-' + month + '-' + day;

    let finalDate = new Date(dateFormated)

    let finalValue = 0;
    if (categoryName === 'Transporte') {
      finalValue = kmCost;            // usa o custo calculado pelo km
    } else {
      finalValue = parseFloat(
        amount.replace(/[R$\s.]/g, '').replace(',', '.')
      );
    }

    try {
      const response = await api.post("/despesa", {
        pacoteId: selectedPacote,
        projetoId: selectedProject,
        userId: user?.userId,
        categoria: category,
        data: finalDate,
        valor_gasto: finalValue,
        descricao: description,
        aprovacao: "Pendente",
        km: categoryName === 'Transporte' ? parseFloat(km.replace(',', '.')) : undefined,
      });
      /* console.log(response.data); */
      setSuccessMessage("Despesa cadastrada com sucesso!");

      setTimeout(() => {
        setSelectedPacote("");
        setCategory("");
        setSelectedProject("");
        setDate("");
        setAmount("");
        setDescription("");
        setSuccessMessage("");
        setKm("");
        setCategoryName("");
        setTotalGastoCategoria(0);
      }, 1500);
    } catch (error) {
      console.error("Erro ao cadastrar despesa:", error);
      setError("Erro ao cadastrar despesa. Por favor, tente novamente.");
    }
  };

  const newAmount = categoryName === 'Transporte'
  ? kmCost
  : amountFormatted;
  const projectedTotal = totalGastoCategoria + newAmount;
  const fillPercent = Math.min((projectedTotal / valor_maximo) * 100, 100);

  useEffect(() => {
    if (totalGastoCategoria > valor_maximo) {
      setShowLimitMessage(true);
  
      const timer = setTimeout(() => {
        setShowLimitMessage(false);
      }, 20000); 
  
      return () => clearTimeout(timer); 
    }
  }, [totalGastoCategoria, valor_maximo]);
  
  return (
    <>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        style={styles.container}
      >
        <View style={styles.boxTop}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <AntDesign name="arrowleft" style={styles.arrow} />
          </TouchableOpacity>
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

          <Text style={styles.textBottom}>Pacote</Text>
          <CustomDropdown
            data={pacotes}
            placeholder='Selecione um pacote'
            value={selectedPacote}
            onValueChange={handlePacoteChange}
          />

          {/* Se o usuário quiser criar um novo pacote */}
          {!creatingPacote ? (
            <TouchableOpacity onPress={() => {
                setCreatingPacote(true);
                setPacoteError("");
            }}>
              <Text style={styles.link}> + Criar novo pacote </Text>
            </TouchableOpacity>
          ) : (
            <>
              <TextInput
                placeholder="Nome do novo pacote"
                value={newPacoteName}
                onChangeText={setNewPacoteName}
                style={styles.inputNome}
              />
              
              <TouchableOpacity style={styles.smallButton} onPress={handleCreatePacote}>
                <Text style={styles.buttonText}> Criar Pacote </Text>
              </TouchableOpacity>
              {pacoteError && (
                <Text style={[styles.pacoteErrorMessage, { marginTop: 4 }]}>
                  {pacoteError}
                </Text>)}
              
              <TouchableOpacity onPress={() => setCreatingPacote(false)}>
                <Text style={styles.link}> Cancelar </Text>
              </TouchableOpacity>
            </>
          )}

          <Text style={styles.textBottom}>Categoria</Text>
          <CustomDropdown
            data={filteredCategories}
            placeholder='Selecione uma categoria'
            value={category}
            onValueChange={handleCategoryChange}
          />

          {categoryName === 'Transporte' ? (
            // SE for Transporte → mostra só KM e custo estimado
            <>
              <Text style={styles.textBottom}>Quilômetros (KM)</Text>
              <TextInput
                placeholder="0"
                value={km}
                onChangeText={handleKmChange}
                keyboardType="numeric"
                style={styles.inputMask}
              />
              <Text style={styles.aviso}>
                {`Custo estimado: R$ ${kmCost.toFixed(2).replace('.', ',')}`}
              </Text>
            </>
          ) : (
            // SENÃO (outras categorias) → mostra o campo de Valor gasto
            <>
              <Text style={styles.textBottom}>Valor gasto</Text>
              <TextInputMask
                type={'money'}
                value={amount}
                onChangeText={handleAmountChange}
                style={styles.inputMask}
                placeholder='R$ 0,00'
              />
            </>
          )}


          <Text style={styles.textBottom}>Data</Text>
          <CustomDatePicker
            value={date}
            onValueChange={handleDateChange}
          />

          {totalGastoCategoria > valor_maximo && showLimitMessage && (
            <Text style={styles.limit}>O valor máximo já foi atingido. Caso deseje continuar,
              por favor insira uma descrição justificando a despesa.</Text>
          )}

            {amountFormatted > valor_maximo - totalGastoCategoria && totalGastoCategoria < valor_maximo && selectedProject && category &&
              <Text style={styles.limit}>O valor informado excede o limite de R$ {valor_maximo} permitido para esta categoria. Caso deseje continuar, 
                por favor insira uma descrição justificando a despesa.</Text>}
  
          {selectedProject && category && 
            <>
              <Text style={styles.textBottom}>Progresso de gasto em {categoryName}</Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${fillPercent}%` },
                    {
                      backgroundColor:
                        projectedTotal > valor_maximo
                          ? '#E55451'
                          : themas.colors.primary,
                    },
                  ]}
                />
                <Text style={styles.progressBarText}>
                  {`R$ ${projectedTotal.toFixed(2)} / R$ ${valor_maximo}`}
                </Text>
              </View>
              <Text style={styles.progressBarPorcentent}>
                {projectedTotal > valor_maximo
                  ? 'Limite excedido!'
                  : `Você está em ${((projectedTotal / valor_maximo) * 100).toFixed(0)}% do limite.`}
              </Text>
            </>
          }

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