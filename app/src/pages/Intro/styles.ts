import { StyleSheet } from 'react-native';

export const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    logo: {
      width: 150,
      height: 150,
      marginBottom: 30,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.colors.secondary,
      marginBottom: 10,
    },
    motto: {
      fontSize: 16,
      color: theme.colors.secondary,
      textAlign: 'center',
    },
  });
