import { StyleSheet } from 'react-native';

export const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    logo: {
      width: 100,
      height: 100,
      marginBottom: 20,
      resizeMode: 'contain',
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.colors.sempre_branco,
      marginBottom: 10,
      textShadowColor: 'rgba(0, 0, 0, 0.4)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 4,
    },
    motto: {
      fontSize: 16,
      color: theme.colors.sempre_branco,
      textAlign: 'center',
      paddingHorizontal: 16,
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0.5, height: 0.5 },
      textShadowRadius: 3,
    },
    buttonWrapper: {
      position: 'absolute',
      bottom: 60,
      width: '100%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
  });
