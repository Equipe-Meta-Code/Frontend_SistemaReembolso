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
      marginBottom: 5,
      textShadowColor: 'rgba(0, 0, 0, 0.4)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 4,
    },
    motto: {
      fontSize: 17,
      color: theme.colors.sempre_branco,
      textAlign: 'left',
      marginTop: 10,
      marginBottom: 60,
      fontWeight: '400',
    },
    buttonWrapper: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    backgroundImage: {
      flex: 1,
      width: '100%',
      height: '100%',
      justifyContent: 'flex-end',
    },
    imageOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.5)', // 50% de opacidade preta
      zIndex: 1,
    },
    overlay: {
      flex: 1,
      justifyContent: 'flex-end',
      paddingHorizontal: 24,
      paddingBottom: 100,
      backgroundColor: 'rgba(0,0,0,0.25)',
      zIndex: 2,
    },
  });