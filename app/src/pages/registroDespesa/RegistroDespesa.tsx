import { Text, View, ScrollView, TextInput, TouchableOpacity, Alert, Platform, Modal, TouchableWithoutFeedback, Pressable  } from 'react-native';
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
import * as ImagePicker from 'expo-image-picker';
import Comprovante from '../../components/registroDespesa/Comprovante';
import * as DocumentPicker from 'expo-document-picker';
import { useActionSheet } from '@expo/react-native-action-sheet';

const GAS_PRICE = 6.20; // preço fixo da gasolina
const KM_PER_LITER = 10; // litro fixo para exemplos

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
  const [quantidade, setQuantidade] = useState('');
  const [quantidadeTotal, setQuantidadeTotal] = useState(0);

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

  interface ComprovanteItem {
    id: string;
    uri: string;
    mimeType: string;
  }

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
      console.log('formatados:', pacotesFormatados)
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
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
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
    const parsedAmount = parseFloat(value.replace(/[R$\s.]/g, '').replace(',', '.')) || 0;
    setAmountFormatted(parsedAmount);

    if (categoryName === 'Materiais') {
      const parsedQuantity = parseFloat(quantidade.replace(',', '.')) || 0;
      setQuantidadeTotal(parsedAmount * parsedQuantity);
    }
  };

  /*  Função para atualizar quantidade e total de materiais */
  const handleQuantidadeChange = (value: string) => {
    setQuantidade(value);
    const parsedQuantity = parseFloat(value.replace(',', '.')) || 0;
    setQuantidadeTotal(parsedQuantity * amountFormatted);
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
  };

  const handleKmChange = (value: string) => {
    setKm(value);
    const parsed = parseFloat(value.replace(',', '.')) || 0;

    const litersConsumed = parsed / KM_PER_LITER;
    const cost = litersConsumed * GAS_PRICE;

    setKmCost(cost);
  };

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [comprovantes, setComprovantes] = useState<ComprovanteItem[]>([]);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');

  const { showActionSheetWithOptions } = useActionSheet();
  const [showPickerModal, setShowPickerModal] = useState(false);

  const openImagePickerOptions = () => {
    const options = ['Cancelar', 'Tirar foto', 'Galeria', 'Selecionar PDF'];
    const cancelButtonIndex = 0;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
        switch (buttonIndex) {
          case 1: return tirarFoto();
          case 2: return escolherGaleria();
          case 3: return selecionarPDF();
          default: return;
        }
      (buttonIndex?: number) => {
      }
    );
  };

  const adicionarComprovante = (uri: string, mimeType: string) => {
    setComprovantes(prev => [
      ...prev,
      { id: Date.now().toString(), uri, mimeType }
    ]);
  };

  const escolherGaleria = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return Alert.alert('Permissão negada');
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 1 });
    if (result.canceled) return;
    const asset = result.assets[0];
    const inferredType = asset.type === 'video' ? asset.type : 'image';
    adicionarComprovante(
      asset.uri,
      inferredType === 'image'
        ? 'image/jpeg'
        : asset.uri.endsWith('.png')
          ? 'image/png'
          : `video/${asset.uri.split('.').pop()}`
    );
  };


  const tirarFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return Alert.alert('Permissão negada');
    const result = await ImagePicker.launchCameraAsync({ quality: 1 });
    if (result.canceled) return;
    adicionarComprovante(result.assets[0].uri, 'image/jpeg');
  };

  const selecionarPDF = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      copyToCacheDirectory: true,
    });
    if (res.canceled) return;
    const getMimeTypeFromUri = (uri: string) => {
      if (uri.endsWith('.pdf')) return 'application/pdf';
      if (uri.endsWith('.png')) return 'image/png';
      if (uri.endsWith('.jpg') || uri.endsWith('.jpeg')) return 'image/jpeg';
      return 'application/octet-stream';
    };
    adicionarComprovante(
      res.assets[0].uri,
      getMimeTypeFromUri(res.assets[0].uri)
    );
  };



  const removerComprovante = (idx: number) =>
    setComprovantes(prev => prev.filter((_, i) => i !== idx));

  const editarComprovante = async (idx: number) => {
    const res = await DocumentPicker.getDocumentAsync({ type: '*/*' });
    if (res.canceled) return;
    setComprovantes(prev => {
      const copia = [...prev];
      copia[idx] = {
        id: copia[idx].id,
        uri: res.assets[0].uri,
        mimeType: res.assets[0].mimeType ?? 'application/octet-stream'
      };
      return copia;
    });
  };



  const handleImageUpload = async (despesaId: number) => {
    if (comprovantes.length === 0) return;

    await Promise.all(comprovantes.map(c => {
      const fd = new FormData();
      fd.append('receipt', {
        uri: c.uri,
        name: c.uri.split('/').pop()!,
        type: c.mimeType
      } as any);
      fd.append('tipo', 'expense');
      fd.append('tipoId', String(despesaId));
      return api.post('/uploadcomprovante', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }));
  };



  const handleSubmit = async () => {
    // limpa
    setError('');
    setSuccessMessage('');
    fetchData();

    if (
      !selectedPacote ||
      !category ||
      !selectedProject ||
      !date ||
      (categoryName === 'Transporte' ? !km : !amount)
    ) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    // calcula valor
    const valor =
      categoryName === 'Transporte'
        ? kmCost
        : categoryName === 'Materiais'
          ? quantidadeTotal
          : parseFloat(amount.replace(/[R$\s.]/g, '').replace(',', '.')) || 0;
    const projected = totalGastoCategoria + valor;

    // justificativa
    if (projected > valor_maximo && description.trim() === '') {
      setError('Justifique o motivo da despesa.');
      return;
    }

    // comprovante se exceder
    if (projected > valor_maximo && comprovantes.length === 0) {
      setError('Anexe pelo menos um comprovante da despesa.');
      return;
    }

    // payload
    const [d, m, y] = date.split('/');
    const payload = {
      pacoteId: selectedPacote,
      projetoId: selectedProject,
      userId: user?.userId,
      categoria: category,
      data: new Date(`${y}-${m}-${d}`),
      valor_gasto: valor,
      descricao: description.trim() || 'Sem Descrição',
      aprovacao: 'Pendente',
      km:
        categoryName === 'Transporte'
          ? parseFloat(km.replace(',', '.'))
          : undefined,
      quantidade:
        categoryName === 'Materiais'
          ? parseFloat(quantidade.replace(',', '.'))
          : undefined,
    };

    try {
      const { data: novaDespesa } = await api.post('/despesa', payload);
      setSuccessMessage('Despesa cadastrada com sucesso!');

      // upload comprovantes
      await Promise.all(
        comprovantes.map(c => {
          const fd = new FormData();
          fd.append('receipt', {
            uri: c.uri,
            name: c.uri.split('/').pop()!,
            type: c.mimeType
          } as any);
          fd.append('tipo', 'expense');
          fd.append('tipoId', String(novaDespesa.despesaId));
          return api.post('/uploadcomprovante', fd, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        })
      );
      Alert.alert('Sucesso', 'Todos os comprovantes enviados!');

      // limpa tudo
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
        setQuantidade("");
        setQuantidadeTotal(0);

        setComprovantes([]);
        setSuccessMessage('');
      }, 1500);
    } catch (err) {
      console.error(err);
      setError('Erro ao cadastrar despesa. Tente novamente.');
    }
  };

  const newAmount = categoryName === 'Transporte'
    ? kmCost
    : categoryName === 'Materiais'
      ? quantidadeTotal
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

  useEffect(() => {
    if (selectedProject) {
      fetchPacotes(selectedProject);
      fetchData();
    }
  }, [selectedProject]);

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

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
          ) : categoryName === 'Materiais' ? (
            <>
              <Text style={styles.textBottom}>Valor unitário</Text>
              <TextInputMask
                type={'money'}
                value={amount}
                onChangeText={handleAmountChange}
                style={styles.inputMask}
                placeholder="R$ 0,00"
              />

              <Text style={styles.textBottom}>Quantidade</Text>
              <TextInput
                placeholder="0"
                value={quantidade}
                onChangeText={handleQuantidadeChange}
                keyboardType="numeric"
                style={styles.inputMask}
              />

              <Text style={styles.aviso}>
                {`Valor total: R$ ${formatCurrency(quantidadeTotal)}`}
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
                          ? themas.colors.vinho_claro
                          : themas.colors.primary,
                    },
                  ]}
                />
                <Text style={styles.progressBarText}>
                  {`R$ ${formatCurrency(projectedTotal)} / R$ ${formatCurrency(valor_maximo)}`}
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

          <TouchableOpacity onPress={openImagePickerOptions}>
      
              <MaterialCommunityIcons
                name="image-plus"
                style={styles.image}
              />

          </TouchableOpacity>

          <View style={styles.comprovantesContainer}>
            {comprovantes.map((c, i) => (
              <View key={c.id} style={styles.comprovanteRecebido}>
                <Text style={styles.textoComprovante}>{c.uri.split('/').pop()}</Text>
                <View style={styles.botoesComprovante}>
                  <TouchableOpacity onPress={() => editarComprovante(i)}>
                    <MaterialCommunityIcons name="square-edit-outline" size={24} color={themas.colors.primary}/>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => removerComprovante(i)}>
                    <MaterialCommunityIcons name="trash-can-outline" size={24} color={themas.colors.red}/>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
            
       

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

      <Modal transparent animationType="fade" visible={showPickerModal}>
        <TouchableWithoutFeedback onPress={() => setShowPickerModal(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContainer}>
          <Pressable style={styles.modalButton} onPress={() => { tirarFoto(); setShowPickerModal(false); }}>
            <Text style={styles.modalTexto}>Tirar foto</Text>
          </Pressable>
          <Pressable style={styles.modalButton} onPress={() => { escolherGaleria(); setShowPickerModal(false); }}>
            <Text style={styles.modalTexto}>Galeria</Text>
          </Pressable>
          <Pressable style={styles.modalButton} onPress={() => { selecionarPDF(); setShowPickerModal(false); }}>
            <Text style={styles.modalTexto}>Selecionar PDF</Text>
          </Pressable>
        </View>
      </Modal>
    </>
  );
};

export default RegistroDespesa;