import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { themas } from "../../global/themes";

const Select = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: themas.colors.cinza_muito_claro,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: themas.colors.chumbo,
    },
});

export default Select;