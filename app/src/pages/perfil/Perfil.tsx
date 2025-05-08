import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Switch  } from 'react-native';
import { style } from "./styles";
import Indicadores from '../../components/perfil/Indicadores';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomButton from '../../components/perfil/Botao';
import CustomSwitchButton from '../../components/perfil/BotaoOpcao';
import api from '../../services/api'; 

import { useDispatch, useSelector } from 'react-redux';
import { logoutAction } from '../../(redux)/authSlice';
import { RootState } from "../../(redux)/store";
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Float } from 'react-native/Libraries/Types/CodegenTypes';
import Foto from '../../com../../components/foto/Foto';

interface Funcionario {
    userId: number;
    name: string;
  }

interface Categoria {
    id_categoria: string;
    nome: string;
    valor_maximo: number;
}

interface Departamento {
    id_departamento: string;
    nome: string;
}

interface Projeto {
    id: string;
    createdAt: number;
    name: string;
    descricao: string;
    data: number;
    categorias: Categoria[];
    departamentos: Departamento[];
    funcionarios: Funcionario[];
    projetoId: number;
}

interface Despesa {
    _id: string;
    projetoId: string;
    userId: string;
    categoria: string;
    data: string;
    valor_gasto: Float;
    descricao: string;
    aprovacao: string;
  }

const Perfil = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const toggleDarkMode = () => {
        setIsDarkMode(previousState => !previousState);
    };

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    type RootStackParamList = {
        InfosPessoais: undefined;
        Login: undefined;
    };

    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();
    /* console.log("Usuário do Redux:", user?.userId); */
    
    const handleLogout = () => {
        dispatch(logoutAction());
        // sem navegar manualmente
      };

    const [despesas, setDespesas] = useState<Despesa[]>([]);
    const [totalFiltrado, setTotalFiltrado] = useState<number>(0);
    const [quantidadeProjetos, setQuantidadeProjetos] = useState<number>(0);

    useEffect(() => {

        const fetchDespesas = async () => {
            
          try {
            const response = await api.get("/despesa");
            const todasDespesas: Despesa[] = response.data;

            const despesasFiltradas = todasDespesas.filter(
                (despesa: Despesa) =>
                  despesa.aprovacao === "Pendente" && String(despesa.userId) === String(user?.userId)
            );
              
            const total = despesasFiltradas.reduce(
              (acc: number, despesa: Despesa) => acc + despesa.valor_gasto,
              0
            );

            setDespesas(despesasFiltradas);
            setTotalFiltrado(total);
            /* console.log('Despesas sem filtro:', response.data)
            console.log('Despesas filtradas:', despesas)
            console.log('Despesas Somadas:', total) */
          } catch (err) {
            console.error("Erro ao carregar despesas", err);
          } finally {
            console.log("Carregou as despesas");
          }

        };

        const fetchProjectsCount = async () => {

            try {
                const response = await api.get<Projeto[]>('/projeto');
                const projetos = response.data;
                const userId = user?.userId?.toString();
                const projetosDoUsuario = projetos.filter((projeto: Projeto) =>
                    projeto.funcionarios.some(
                        (funcionario: Funcionario) => String(funcionario.userId) === String(userId)
                    )
                );
                const quantidade = projetosDoUsuario.length;
                setQuantidadeProjetos(quantidade);
            } catch (error) {
                console.error('Erro ao buscar a quantidade de projetos:', error);
            }

        };

        fetchDespesas();
        fetchProjectsCount();

        const interval = setInterval(() => {
            fetchDespesas();
            fetchProjectsCount();
        }, 3000);

        return () => clearInterval(interval)

    }, [user?.userId]);

    const userProfileImage = useSelector((state: RootState) => state.auth.user?.profileImage);
    // Removed duplicate RootStackParamList declaration
      
    return (
        <View style={style.container}>
            <View style={style.corTopo}></View>
            <View style={style.topoPerfil}>
                <View style={style.imagemPerfil}>
                    {user ? (
                    <Foto
                        tipo="user"
                        tipoId={+user.userId}
                        width={150}
                        height={150}
                        borderRadius={100}
                        borderWidth={3}
                        borderColor="#fff"
                        refreshKey={user.profileImage}
                        fallbackSource={require('../../assets/perfil.png')}
                    />
                    ) : (
                    <Image
                        source={userProfileImage ? { uri: userProfileImage } : require('../../assets/perfil.png')}
                        style={style.fotoPerfil}
                    />
                    )}
                </View>
                {user ? (
                    <>
                        <Text style={style.nomeFuncionario}>
                            {user?.name || 'Nome não disponível'}
                        </Text>

                        <Text style={style.emailFuncionario}>
                            {user?.email || 'Email não disponível'}
                        </Text>
                    </>
                ) : (
                    <Text>No user logged in</Text>
                )}
            </View>
            <View style={style.divisor} />

            <View style={style.containerMostradores}>
                <Indicadores titulo="Projetos" quantia={`${quantidadeProjetos}`} />
                <Indicadores 
                    titulo="Pendente" 
                    quantia={`R$${totalFiltrado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
                />
                
            </View>
            <View style={style.subtituloContainer}>

                <Text style={style.subtitulo}>Geral</Text>
            </View>

            <View style={style.containerBotoes}>

                <CustomButton
                    titulo="Informações pessoais"
                    onPress={() => navigation.navigate('InfosPessoais')}
                    iconName="chevron-forward"
                    iconColor="#000"
                />

{/*                 <CustomButton
                    titulo="Manual do usuário"
                    onPress={() => alert("Manual do usuário")}
                    iconName="chevron-forward"
                    iconColor="#000"
                />

                <CustomButton
                    titulo="Alterar Senha"
                    onPress={() => alert("Alterar Senha")}
                    iconName="chevron-forward"
                    iconColor="#000"
                />

                <CustomSwitchButton
                    titulo="Darkmode"
                    value={isDarkMode}
                    onValueChange={toggleDarkMode}
                    trackColor={{ false: "themas.colors.cinza_claro", true: themas.colors.primary }}
                    thumbColor=themas.colors.secondary
                /> */}
                
            </View>

            <View style={style.containerBotoes}>
                <CustomButton
                    titulo="Sair"
                    onPress={handleLogout}
                    iconName="log-out-outline"
                    iconColor="#ff0000"
                    iconSize={40}
                />
            </View>

        </View>
    );
};

export default Perfil;