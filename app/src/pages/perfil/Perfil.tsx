import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { style } from "./styles";

const Perfil = () => {
    return (
        <View style={style.container}>
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
                <View style={style.departamento}>
                    <Text style={style.departamentoTexto}>
                        Logística
                    </Text>        
                </View>
            </View>

            <View style={style.botoes}>

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
            </View>
        </View>
    );
};

export default Perfil;