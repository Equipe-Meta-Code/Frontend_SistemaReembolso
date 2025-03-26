import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Switch  } from 'react-native';
import { style } from "./styles";
import Indicadores from '../../components/perfil/Indicadores';
import Ionicons from 'react-native-vector-icons/Ionicons';



const Perfil = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setIsDarkMode(previousState => !previousState);
    };

    return (
        <View style={style.container}>
            <View style={style.corTopo}></View>
            <View style={style.topoPerfil}>
                <View style={style.imagemPerfil}>
                    <Image
                    source={require('../../assets/perfil.png')}
                    style={style.fotoPerfil}
                    />
                </View>
                <Text style={style.nomeFuncionario}>
                Pedro Henrique Ribeiro
                </Text>

                <Text style={style.emailFuncionario}>
                    pedro09.2004@gmail.com
                </Text>        
               
            </View>
            <View style={style.divisor} />

            <View style={style.containerMostradores}>
                <Indicadores titulo="Projetos" quantia={"2"} />
                <Indicadores titulo="Pendente" quantia={"R$4K"} />
            </View>
            <View style={style.subtituloContainer}>

                <Text style={style.subtitulo}>Geral</Text>
            </View>

            <View style={style.containerBotoes}>
                <TouchableOpacity style={style.botao} onPress={() => alert("Botão Personal Info clicado")}>
                    <Text style={style.textoBotao}>Informações pessoais</Text>
                    <Ionicons name="chevron-forward" size={20} color="#000" />
                </TouchableOpacity>

                </View>
                
            </View>


                <View style={style.editContainer}>
                    <Text style={style.textoBotao}>
                        Editar Perfil
                    </Text>
                </View>

                <View style={style.editContainer}>
                <Text style={style.textoBotao}>
                    Alterar Senhaa
                </Text>
                </View>
            </View> */}
        </View>
    );
};

export default Perfil;