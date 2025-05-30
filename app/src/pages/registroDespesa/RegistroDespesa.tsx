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
        project.funcionarios?.some((func: any) => func.userId === userId) &&
        project.status !== "encerrado"
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

  const handlePrevisualizar = (c: ComprovanteItem) => {
    setUriPrevisualizacao(c.uri);
    setPrevisualizacaoMime(c.mimeType);
    setMostrarModalPrevisualizacao(true);
  };

  const handleNovaDespesa = () => {
    if (!currentDespesa.projetoId || !currentDespesa.pacoteId) {
      setError('Selecione Projeto e Pacote antes de criar nova despesa.');
      return;
    }
    setDespesas(prev => [
      ...prev,
      {
        projetoId: currentDespesa.projetoId,
        pacoteId: currentDespesa.pacoteId,
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
      }
    ]);
    setCurrentIndex(despesas.length);
    setError('');
    setSuccessMessage('');
  };

  const handleProximo = () => {
    if (currentIndex < despesas.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setError('');
      setSuccessMessage('');
    }
  };

  const handleAnterior = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setError('');
      setSuccessMessage('');
    }
  };

  const handleSubmit = async () => {
    setError('');
    setSuccessMessage('');
    fetchData();

    for (const d of despesas) {
      if (
        !d.pacoteId ||
        !d.categoria ||
        !d.projetoId ||
        !d.date ||
        (d.categoryName === 'Transporte' ? !d.km : !d.amount)
      ) {
        setError('Por favor, preencha todos os campos de todas as despesas.');
        return;
      }
    }

    try {
      for (const d of despesas) {
        const valor =
          d.categoryName === 'Transporte'
            ? d.kmCost
            : ['Material', 'Materiais'].includes(d.categoryName)
              ? d.quantidadeTotal
              : parseFloat(d.amount.replace(/[R$\s.]/g, '').replace(',', '.')) || 0;

        const [day, month, year] = d.date.split('/');
        const payload = {
          pacoteId: d.pacoteId,
          projetoId: d.projetoId,
          userId: user?.userId,
          categoria: d.categoria,
          data: new Date(`${year}-${month}-${day}`),
          valor_gasto: valor,
          descricao: d.description.trim() || 'Sem Descrição',
          aprovacao: 'Pendente',
          km: d.categoryName === 'Transporte'
            ? parseFloat(d.km.replace(',', '.'))
            : undefined,
          quantidade: ['Material', 'Materiais'].includes(d.categoryName)
            ? parseFloat(d.quantidade.replace(',', '.'))
            : undefined,
        };
        const { data: novaDespesa } = await api.post('/despesa', payload);

        if (d.comprovantes && d.comprovantes.length > 0) {
          await Promise.all(
            d.comprovantes.map((c: any) => {
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
        }
      }
      setSuccessMessage('Todas as despesas cadastradas com sucesso!');
      setDespesas([{
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
      setCurrentIndex(0);
      setTimeout(() => {
        setSuccessMessage('');
      }, 1500);
    } catch (err) {
      setError('Erro ao cadastrar despesas. Tente novamente.');
    }
  };

  const filteredCategories = categoriesByProject[currentDespesa.projetoId] || [];

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const newAmount = currentDespesa.categoryName === 'Transporte'
    ? currentDespesa.kmCost
    : ['Material', 'Materiais'].includes(currentDespesa.categoryName)
      ? currentDespesa.quantidadeTotal
      : currentDespesa.amountFormatted;

  const projectedTotal = (currentDespesa.totalGastoCategoria || 0) + newAmount;
  const fillPercent = valor_maximo > 0 ? Math.min((projectedTotal / valor_maximo) * 100, 100) : 0;

  useEffect(() => {
    if ((currentDespesa.totalGastoCategoria || 0) > valor_maximo) {
      setShowLimitMessage(true);
      const timer = setTimeout(() => {
        setShowLimitMessage(false);
      }, 20000);
      return () => clearTimeout(timer);
    }
  }, [currentDespesa.totalGastoCategoria, valor_maximo, currentIndex]);

  const isFirst = currentIndex === 0;
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
              value={currentDespesa.projetoId}
              onValueChange={handleProjectChange}
            />
          </View>
        </View>
        <View style={styles.boxBottom}>

          <Text style={styles.textBottom}>Pacote</Text>
          <CustomDropdown
            data={pacotes}
            placeholder='Selecione um pacote'
            value={currentDespesa.pacoteId}
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
            isFirst && (
              <>
                <TextInput
                  placeholder="Nome do novo pacote"
                  value={newPacoteName}
                  onChangeText={setNewPacoteName}
                  style={styles.inputNome}
                  placeholderTextColor={theme.colors.text}
                />

                <TouchableOpacity style={styles.smallButton} onPress={async () => {
                  if (!newPacoteName || !currentDespesa.projetoId) {
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
                      projetoId: currentDespesa.projetoId,
                      userId: user?.userId,
                    });
                    const novoPacote = response.data;
                    const novoPacoteFormatado = {
                      label: novoPacote.nome,
                      value: novoPacote.pacoteId.toString(),
                    };
                    setPacotes((prev) => [...prev, novoPacoteFormatado]);
                    updateCurrentDespesa('pacoteId', novoPacote.pacoteId.toString());
                    setCreatingPacote(false);
                    setNewPacoteName("");
                  } catch (error) {
                    setError("Erro ao criar pacote. Tente novamente.");
                  }
                }}>
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
            )
          )}

          <Text style={styles.textBottom}>Categoria</Text>
          <CustomDropdown
            data={filteredCategories}
            placeholder='Selecione uma categoria'
            value={currentDespesa.categoria}
            onValueChange={handleCategoryChange}
          />

          {currentDespesa.categoryName === 'Transporte' ? (
            <>
              <Text style={styles.textBottom}>Quilômetros (KM)</Text>
              <TextInput
                placeholder="0"
                value={currentDespesa.km}
                onChangeText={handleKmChange}
                keyboardType="numeric"
                style={styles.inputMask}
              />
              <Text style={styles.aviso}>
                {`Custo estimado: R$ ${currentDespesa.kmCost?.toFixed(2).replace('.', ',') || '0,00'}`}
              </Text>
            </>
          ) : ['Material', 'Materiais'].includes(currentDespesa.categoryName) ? (
            <>
              <Text style={styles.textBottom}>Valor unitário</Text>
              <TextInputMask
                type={'money'}
                value={currentDespesa.amount}
                onChangeText={handleAmountChange}
                style={styles.inputMask}
                placeholder="R$ 0,00"
              />

              <Text style={styles.textBottom}>Quantidade</Text>
              <TextInput
                placeholder="0"
                value={currentDespesa.quantidade}
                onChangeText={handleQuantidadeChange}
                keyboardType="numeric"
                style={styles.inputMask}
              />

              <Text style={styles.aviso}>
                {`Valor total: R$ ${formatCurrency(currentDespesa.quantidadeTotal || 0)}`}
              </Text>

            </>
          ) : (
            <>
              <TextInputMask
                type={'money'}
                value={currentDespesa.amount}
                onChangeText={handleAmountChange}
                style={styles.inputMask}
                placeholder='R$ 0,00'
                placeholderTextColor={theme.colors.text}
              />
            </>
          )}
          <Text style={styles.textBottom}>Data</Text>
          <CustomDatePicker
            value={currentDespesa.date}
            onValueChange={handleDateChange}
          />
          {currentDespesa.totalGastoCategoria > valor_maximo && showLimitMessage && (
            <Text style={styles.limit}>O valor máximo já foi atingido. Caso deseje continuar,
              por favor insira uma descrição justificando a despesa.</Text>
          )}
          {currentDespesa.amountFormatted > valor_maximo - (currentDespesa.totalGastoCategoria || 0) && (currentDespesa.totalGastoCategoria || 0) < valor_maximo && currentDespesa.projetoId && currentDespesa.categoria &&
            <Text style={styles.limit}>O valor informado excede o limite de R$ {valor_maximo} permitido para esta categoria. Caso deseje continuar,
              por favor insira uma descrição justificando a despesa.</Text>}
          {currentDespesa.projetoId && currentDespesa.categoria &&
            <>
              <Text style={styles.textBottom}>Progresso de gasto em {currentDespesa.categoryName}</Text>
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
            value={currentDespesa.description}
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
            {(currentDespesa.comprovantes || []).map((c: any, i: number) => (
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

          <View style={{ alignItems: 'center', marginBottom: 10 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: theme.colors.text }}>
              {despesas.length > 0 ? `${currentIndex + 1}/${despesas.length}` : '1/1'}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            {currentIndex > 0 && (
              <TouchableOpacity style={styles.botoesMultiplasDespesas} onPress={handleAnterior}>
                <Text style={styles.textoDespesas}>Anterior</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.botoesMultiplasDespesas}
              onPress={handleNovaDespesa}
              disabled={!currentDespesa.projetoId || !currentDespesa.pacoteId}
            >
              <Text style={styles.textoDespesas}>Nova Despesa</Text>
            </TouchableOpacity>
            {currentIndex < despesas.length - 1 && (
              <TouchableOpacity style={styles.botoesMultiplasDespesas} onPress={handleProximo}>
                <Text style={styles.textoDespesas}>Próximo</Text>
              </TouchableOpacity>
            )}
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