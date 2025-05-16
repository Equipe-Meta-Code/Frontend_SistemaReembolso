import { StyleSheet} from "react-native";
import { themas } from "../../global/themes";

export const createStyles = (theme: any) => StyleSheet.create({
    container: {
        backgroundColor: theme.colors.secondary,
    },
    boxTop: {
        backgroundColor: theme.colors.primary,
        height: '28%',
    },
    boxTitle: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '70%',
        margin: 'auto',
    },
    boxTopTwo: {
        width: '85%',
        margin: 'auto',
    },
    boxBottom: {
        width: '85%',
        margin: 'auto',
    },
    arrow: {
      fontSize: 24,
      color: theme.colors.sempre_branco,
      paddingLeft: '7%',
      paddingTop: '12%',
    },
    title: {
        color: theme.colors.sempre_branco,
        fontSize: 32,
        fontWeight: 'bold', 
      },
    subTitle: {
        color: theme.colors.sempre_branco,
        fontSize: 16,
        marginTop: 12,
    },
    textTop: {
        color: theme.colors.sempre_branco,
        fontSize: 16,
    },
    textBottom: {
        color: theme.colors.black,
        fontSize: 16,
        marginTop: 30,
    },
    dropdown: {
        height: 50,
        borderColor: theme.colors.cinza,
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginTop: 12,
      },
      placeholderStyle: {
        fontSize: 16,
      },
      selectedTextStyle: {
        fontSize: 16,
      },
      inputSearchStyle: {
        height: 40,
        fontSize: 16,
      },
      iconStyle: {
        width: 20,
        height: 20,
      },
      icon: {
        marginRight: 5,
      },
      label: {
        position: 'absolute',
        backgroundColor: theme.colors.secondary,
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
      },
      inputMask: {
        borderWidth: 0.5,
        borderColor: theme.colors.cinza,
        padding: 10,
        height: 50,
        borderRadius: 8,
        marginTop: 12,
      },
      inputDescription: {
        borderWidth: 0.5,
        borderColor: theme.colors.cinza,
        paddingLeft: 10,
        height: 90,
        borderRadius: 8,
        marginTop: 12,
      },
      image: {
        marginTop: 12,
        fontSize: 140,
        color: theme.colors.primary,
        margin: 'auto',
      },
      teste: {
        height: 150,
        
      },
      button: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 18,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 20,           
      },
      buttonText: {
        color: theme.colors.sempre_branco,
        fontSize: 16,
        fontWeight: 'bold',
      },
      errorMessage: {
        marginTop: 16,
        fontWeight: 'bold',
        padding: 10,
        borderRadius: 8,
        color: theme.colors.vinho,
        backgroundColor: theme.colors.rosa_muito_claro,
        borderColor: theme.colors.rosa_claro,
        margin: 'auto',
      },
      pacoteErrorMessage: {
        marginTop: 16,
        padding: 10,
        borderRadius: 8,
        color: theme.colors.red,
        margin: 'auto',
      },
      successMessage: {
        color: theme.colors.verde_escuro,
        backgroundColor: theme.colors.verde_claro,
        borderColor: theme.colors.verde_claro,
        marginTop: 16,
        fontWeight: 'bold',
        padding: 10,
        borderRadius: 8,
        margin: 'auto',
      },
      progressBar: {
        marginTop: 12,
        height: 18,
        borderRadius: 5,
        backgroundColor: theme.colors.cinza_claro,
        overflow: 'hidden',
      },
      progressBarFill: {
        height: '100%',
      },
      progressBarText: {
        position: 'absolute',
        width: '100%',
        textAlign: 'center',
        fontWeight: 'bold',
      },
      progressBarPorcentent: {
        textAlign: 'center',
        justifyContent: 'center',
        marginTop: 6,
        fontSize: 16,
      },
      limit: {
        color: theme.colors.red,
        fontSize: 16,
        marginTop: 6,
      },
      aviso: {
        color: theme.colors.cinza,
        fontSize: 16,
        marginTop: 6,
      },

      link: {
        color: theme.colors.primary,
        marginTop: 8,
        textDecorationLine: 'underline',
      },
      
      smallButton: {
        backgroundColor: theme.colors.primary,
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
      },
      
      inputNome: {
        borderWidth: 1,
        borderColor: theme.colors.cinza_claro,
        borderRadius: 8,
        padding: 10,
        marginTop: 8,
      }
      
});