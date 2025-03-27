import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Switch  } from 'react-native';
import { style } from "./styles";
import Indicadores from '../../components/perfil/Indicadores';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomButton from '../../components/perfil/Botao';
import CustomSwitchButton from '../../components/perfil/BotaoOpcao';

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

                <CustomButton
                    titulo="Informações pessoais"
                    onPress={() => alert("Informações pessoais")}
                    iconName="chevron-forward"
                    iconColor="#000"
                />

                <CustomButton
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
                    trackColor={{ false: "#E0E0E0", true: "#1F48AA" }}
                    thumbColor="#ffffff"
                />
                
            </View>

            <View style={style.containerBotoes}>
                <CustomButton
                    titulo="Sair"
                    onPress={() => alert("Botão Language clicado")}
                    iconName="log-out-outline"
                    iconColor="#ff0000"
                    iconSize={40}
                />
            </View>
            
        </View>
    );
};

export default Perfil;