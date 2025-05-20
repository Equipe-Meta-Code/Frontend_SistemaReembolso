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
        width: 100,
        height: 100,
        marginTop: 12,
        fontSize: 100,
        color: themas.colors.primary,
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
        borderColor: theme.colors.cinza,
        borderRadius: 8,
        padding: 10,
        marginTop: 8,
      },
      modalOverlay: {
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
  modalContainer: {
    position: 'absolute',
    top: '40%',
    left: '10%',
    right: '10%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    zIndex: 10,
  },
  modalButton: {
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  modalTexto: {
    fontSize: 18,
    color: themas.colors.primary,
  },
  botoesUpload: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  comprovantesContainer: {
    marginTop: 12,
    gap: 2,
  },
  comprovanteRecebido: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',         // centraliza verticalmente todos os filhos
    backgroundColor: themas.colors.cinza_muito_claro,
    paddingHorizontal: 5,
  },

  textoComprovante: {
    flex: 1,
    fontSize: 14,
    lineHeight: 30,
    color: themas.colors.primary,
    fontStyle: 'italic',
    marginLeft: 5,
  },
  botoesComprovante: {
    flexDirection: 'row',
    gap: 10,
  },
  modalContent: {
    position: 'absolute',
    top: '10%',
    left: '5%',
    right: '5%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: themas.colors.primary,
    borderRadius: 4,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
    fundoModalEscuro: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: themas.colors.transparente,
  },
  conteudoModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconDelete: {
    marginRight: 5,
  }
});