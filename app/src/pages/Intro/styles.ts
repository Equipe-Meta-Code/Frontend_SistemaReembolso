import { StyleSheet } from 'react-native';

export const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
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
      color: theme.colors.black,
      marginBottom: 10,
    },
    motto: {
      fontSize: 16,
      color: theme.colors.cinza,
      textAlign: 'center',
    },
  });
