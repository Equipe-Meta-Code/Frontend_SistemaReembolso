import { StyleSheet} from "react-native";
import { themas } from "../../global/themes";

export const styles = StyleSheet.create({
    container: {
        backgroundColor: themas.colors.secondary,
    },
    boxTop: {
        backgroundColor: themas.colors.primary,
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
      color: themas.colors.secondary,
      paddingLeft: '7%',
      paddingTop: '12%',
    },
    title: {
        color: themas.colors.secondary,
        fontSize: 32,
        fontWeight: 'bold', 
      },
    subTitle: {
        color: themas.colors.secondary,
        fontSize: 16,
        marginTop: 12,
    },
    textTop: {
        color: themas.colors.secondary,
        fontSize: 16,
    },
    textBottom: {
        color: '#000000',
        fontSize: 16,
        marginTop: 30,
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
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
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
      },
      inputMask: {
        borderWidth: 0.5,
        borderColor: 'gray',
        padding: 10,
        height: 50,
        borderRadius: 8,
        marginTop: 12,
      },
      inputDescription: {
        borderWidth: 0.5,
        borderColor: 'gray',
        paddingLeft: 10,
        height: 90,
        borderRadius: 8,
        marginTop: 12,
      },
      image: {
        width: 150,
        height: 150,
        marginTop: 12,
        fontSize: 140,
        color: themas.colors.primary,
        margin: 'auto',
      },
      teste: {
        height: 150,
        
      },
      button: {
        backgroundColor: themas.colors.primary,
        paddingVertical: 18,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 20,           
      },
      buttonText: {
        color: themas.colors.secondary,
        fontSize: 16,
        fontWeight: 'bold',
      },
      errorMessage: {
        marginTop: 16,
        fontWeight: 'bold',
        padding: 10,
        borderRadius: 8,
        color: '#721c24',
        backgroundColor: '#f8d7da',
        borderColor: '#f5c6cb',
        margin: 'auto',
      },
      pacoteErrorMessage: {
        marginTop: 16,
        padding: 10,
        borderRadius: 8,
        color: 'red',
        margin: 'auto',
      },
      successMessage: {
        color: '#155724',
        backgroundColor: '#d4edda',
        borderColor: '#c3e6cb',
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
        backgroundColor: '#e0e0e0',
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
        color: 'red',
        fontSize: 16,
        marginTop: 6,
      },
      aviso: {
        color: 'gray',
        fontSize: 16,
        marginTop: 6,
      },

      link: {
        color: '#1f4baa',
        marginTop: 8,
        textDecorationLine: 'underline',
      },
      
      smallButton: {
        backgroundColor: '#1f4baa',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
      },
      
      inputNome: {
        borderWidth: 1,
        borderColor: '#ccc',
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
  modalText: {
    fontSize: 18,
    color: themas.colors.primary,
  },
  botoesUpload: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  }

      
});