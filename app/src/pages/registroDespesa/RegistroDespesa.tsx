import { Text, View, ScrollView, TextInput, TouchableOpacity, Alert, Modal, TouchableWithoutFeedback, Pressable } from 'react-native';
import React, { useState, useEffect, useMemo } from 'react';
import { createStyles } from "./styles";
import { useTheme } from '../../context/ThemeContext';
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
import * as DocumentPicker from 'expo-document-picker';
import { useActionSheet } from '@expo/react-native-action-sheet';
import ComprovantePreview from '../../components/registroDespesa/ComprovantePreview';
import { FontAwesome  } from '@expo/vector-icons';

const GAS_PRICE = 6.20; // preço fixo da gasolina
const KM_PER_LITER = 10; // litro fixo para exemplos

const RegistroDespesa = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [error, setError] = useState("");
  const [pacoteError, setPacoteError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showLimitMessage, setShowLimitMessage] = useState(false);
  const [categoriesByProject, setCategoriesByProject] = useState<{ [key: string]: { label: string; value: string }[] }>({});
  const [projects, setProjects] = useState([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [pacotes, setPacotes] = useState<{ label: string; value: string }[]>([]);
  const [creatingPacote, setCreatingPacote] = useState(false);
  const [newPacoteName, setNewPacoteName] = useState("");
  const [mostrarModalPrevisualizacao, setMostrarModalPrevisualizacao] = useState(false);
  const [uriPrevisualizacao, setUriPrevisualizacao] = useState<string>("");
  const [previsualizacaoMime, setPrevisualizacaoMime] = useState<string>("");
  const [showPickerModal, setShowPickerModal] = useState(false);

  const [despesas, setDespesas] = useState<any[]>([{
    projetoId: '',
    pacoteId: '',
    categoria: '',
    categoryName: '',
    date: '',
    amount: '',
    amountFormatted: 0,
    description: '',
    km: '',
    kmCost: 0,
    quantidade: '',
    quantidadeTotal: 0,
    comprovantes: [],
    totalGastoCategoria: 0,
  }]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentDespesa = despesas[currentIndex];
  const [valor_maximo, setValorMaximo] = useState(0);
  const user = useSelector((state: RootState) => state.auth.user);

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
      setAllProjects(userProjects);

      const formattedProjects = userProjects.map((projeto: Project) => ({
        label: projeto.nome,
        value: projeto.projetoId.toString(),
      }));

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
      const pacotesFiltrados = pacotes.filter(
        (pacote) =>
          pacote.userId.toString() === user?.userId.toString() &&
          pacote.projetoId.toString() === projetoId &&
          pacote.status === "Rascunho"
      );
      const pacotesFormatados = pacotesFiltrados.map((pacote) => ({
        label: pacote.nome,
        value: pacote.pacoteId.toString(),
      }));
      setPacotes(pacotesFormatados);
    } catch (error) {
      console.error("Erro ao buscar pacotes:", error);
    }
  };

  const fetchTotalGastoCategoria = async (projetoId: string, categoriaId: string, idx: number) => {
    try {
      let response = await api.get('/despesa');
      const despesasApi = response.data;
      const despesasFiltradas = despesasApi.filter(
        (despesa: any) =>
          despesa.projetoId.toString() === projetoId &&
          despesa.categoria.toString() === categoriaId &&
          despesa.userId.toString() === user?.userId.toString()
      );
      const total = despesasFiltradas.reduce((acc: number, curr: any) => {
        return acc + parseFloat(curr.valor_gasto);
      }, 0);

      setDespesas(prev => {
        const novo = [...prev];
        novo[idx] = { ...novo[idx], totalGastoCategoria: total };
        return novo;
      });
    } catch (error) {
      console.error("Erro ao buscar despesas por categoria:", error);
    }
  };

  useEffect(() => {
    const d = currentDespesa;
    if (!d.projetoId || !d.categoria) {
      setValorMaximo(0);
      return;
    }
    const selectedProjectData = allProjects.find(
      (project) => project.projetoId.toString() === d.projetoId
    );
    const selectedCategoryData = selectedProjectData?.categorias.find(
      (cat) => cat.categoriaId.toString() === d.categoria
    );
    setValorMaximo(selectedCategoryData?.valor_maximo || 0);
  }, [currentDespesa.projetoId, currentDespesa.categoria, allProjects, currentIndex]);

  useEffect(() => {
    if (currentDespesa.projetoId && currentDespesa.categoria) {
      fetchTotalGastoCategoria(currentDespesa.projetoId, currentDespesa.categoria, currentIndex);
    }
  }, [currentDespesa.projetoId, currentDespesa.categoria, currentIndex]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (currentDespesa.projetoId) {
      fetchPacotes(currentDespesa.projetoId);
      fetchData();
    }
  }, [currentDespesa.projetoId]);

  const updateCurrentDespesa = (field: string, value: any) => {
    setDespesas(prev => {
      const novo = [...prev];
      novo[currentIndex] = { ...novo[currentIndex], [field]: value };
      return novo;
    });
  };

  const handleProjectChange = (value: string) => {
    if (currentIndex === 0) {
      updateCurrentDespesa('projetoId', value);
      updateCurrentDespesa('categoria', '');
      updateCurrentDespesa('categoryName', '');
      updateCurrentDespesa('amount', '');
      updateCurrentDespesa('amountFormatted', 0);
      updateCurrentDespesa('pacoteId', '');
      updateCurrentDespesa('date', '');
      updateCurrentDespesa('description', '');
      updateCurrentDespesa('km', '');
      updateCurrentDespesa('kmCost', 0);
      updateCurrentDespesa('quantidade', '');
      updateCurrentDespesa('quantidadeTotal', 0);
      updateCurrentDespesa('comprovantes', []);
      updateCurrentDespesa('totalGastoCategoria', 0);
    }
  };

  const handlePacoteChange = (value: string) => {
    if (currentIndex === 0) {
      updateCurrentDespesa('pacoteId', value);
    }
  };

  const handleCategoryChange = (value: string) => {
    updateCurrentDespesa('categoria', value);
    const selected = (categoriesByProject[currentDespesa.projetoId] || []).find(cat => cat.value === value);
    updateCurrentDespesa('categoryName', selected ? selected.label : '');
    updateCurrentDespesa('amount', '');
    updateCurrentDespesa('amountFormatted', 0);
    updateCurrentDespesa('quantidade', '');
    updateCurrentDespesa('quantidadeTotal', 0);
    updateCurrentDespesa('description', '');
    updateCurrentDespesa('km', '');
    updateCurrentDespesa('kmCost', 0);
  };

  const handleDateChange = (date: string) => {
    updateCurrentDespesa('date', date);
  };

  const handleAmountChange = (value: string) => {
    updateCurrentDespesa('amount', value);
    const parsedAmount = parseFloat(value.replace(/[R$\s.]/g, '').replace(',', '.')) || 0;
    updateCurrentDespesa('amountFormatted', parsedAmount);

    if (['Material', 'Materiais'].includes(currentDespesa.categoryName)) {
      const parsedQuantity = parseFloat(currentDespesa.quantidade?.replace(',', '.') || '0') || 0;
      updateCurrentDespesa('quantidadeTotal', parsedAmount * parsedQuantity);
    }
  };

  const handleQuantidadeChange = (value: string) => {
    updateCurrentDespesa('quantidade', value);
    const parsedQuantity = parseFloat(value.replace(',', '.')) || 0;
    updateCurrentDespesa('quantidadeTotal', parsedQuantity * (currentDespesa.amountFormatted || 0));
  };

  const handleDescriptionChange = (value: string) => {
    updateCurrentDespesa('description', value);
  };

  const handleKmChange = (value: string) => {
    updateCurrentDespesa('km', value);
    const parsed = parseFloat(value.replace(',', '.')) || 0;
    const litersConsumed = parsed / KM_PER_LITER;
    const cost = litersConsumed * GAS_PRICE;
    updateCurrentDespesa('kmCost', cost);
  };

  const adicionarComprovante = (uri: string, mimeType: string) => {
    setDespesas(prev => {
      const novo = [...prev];
      novo[currentIndex] = {
        ...novo[currentIndex],
        comprovantes: [
          ...(novo[currentIndex].comprovantes || []),
          { id: Date.now().toString(), uri, mimeType }
        ]
      };
      return novo;
    });
  };

  const removerComprovante = (idx: number) => {
    setDespesas(prev => {
      const novo = [...prev];
      novo[currentIndex] = {
        ...novo[currentIndex],
        comprovantes: (novo[currentIndex].comprovantes || []).filter((_: any, i: number) => i !== idx)
      };
      return novo;
    });
  };

  const { showActionSheetWithOptions } = useActionSheet();
  const openImagePickerOptions = () => {
    const options = ['Cancelar', 'Tirar foto', 'Galeria', 'Selecionar PDF'];
    const cancelButtonIndex = 0;
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (buttonIndex?: number) => {
        switch (buttonIndex) {
          case 1: return tirarFoto();
          case 2: return escolherGaleria();
          case 3: return selecionarPDF();
          default: return;
        }
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

  const handlePrevisualizar = (c: ComprovanteItem) => {
    setUriPrevisualizacao(c.uri);
    setPrevisualizacaoMime(c.mimeType);
    setMostrarModalPrevisualizacao(true);
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
        : ['Material', 'Materiais'].includes(categoryName)
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
        ['Material', 'Materiais'].includes(categoryName)
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
        setSelectedPacote('');
        setCategory('');
        setSelectedProject('');
        setDate('');
        setAmount('');
        setDescription('');
        setKm('');
        setQuantidade('');
        setQuantidadeTotal(0);
        setTotalGastoCategoria(0);
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
    : ['Material', 'Materiais'].includes(categoryName)
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
                placeholderTextColor={theme.colors.text}
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
          ) : ['Material', 'Materiais'].includes(categoryName) ? (
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
            <>
              <TextInputMask
                type={'money'}
                value={amount}
                onChangeText={handleAmountChange}
                style={styles.inputMask}
                placeholder='R$ 0,00'
                placeholderTextColor={theme.colors.text}
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
                          ? theme.colors.vinho_claro
                          : theme.colors.primary,
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
          <TextInput
            value={description}
            onChangeText={handleDescriptionChange}
            placeholder="Digite uma descrição"
            style={styles.inputDescription}
            placeholderTextColor={theme.colors.text}
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
                <TouchableOpacity onPress={() => handlePrevisualizar(c)}>
                  <Text style={styles.textoComprovante}>
                    {c.uri.split('/').pop()}
                  </Text>
                </TouchableOpacity>
                <View style={styles.botoesComprovante}>
                  <TouchableOpacity onPress={() => removerComprovante(i)}>
                    <FontAwesome 
                      name="trash-o" 
                      size={24} 
                      color={themas.colors.red} 
                      style={styles.iconDelete}
                    />
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
      <Modal visible={mostrarModalPrevisualizacao} transparent animationType="fade">
        <View style={styles.fundoModalEscuro} />
        <View style={styles.conteudoModal}>
          <ComprovantePreview
            uri={uriPrevisualizacao}
            mimeType={previsualizacaoMime}
            onClose={() => setMostrarModalPrevisualizacao(false)}
          />
        </View>
      </Modal>
    </>
  );
};

export default RegistroDespesa;