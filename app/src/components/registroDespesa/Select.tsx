import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { themas } from "../../global/themes";
import { useTheme } from '../../context/ThemeContext';

const Select = () => {
    const { theme } = useTheme();
    const styles = createStyles (theme);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select</Text>
        </View>
    );
};

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.cinza_muito_claro,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.chumbo,
    },
});

export default Select;