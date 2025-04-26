import { StyleSheet} from "react-native";

export const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
    },
    boxTop: {
        backgroundColor: '#1f4baa',
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
      color: '#FFFFFF',
      paddingLeft: '7%',
      paddingTop: '12%',
    },
    title: {
        color: '#FFFFFF',
        fontSize: 32,
        fontWeight: 'bold', 
      },
    subTitle: {
        color: '#FFFFFF',
        fontSize: 16,
        marginTop: 12,
    },
    textTop: {
        color: '#FFFFFF',
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
        marginTop: 12,
        fontSize: 140,
        color: '#1f4baa',
        margin: 'auto',
      },
      teste: {
        height: 150,
        
      },
      button: {
        backgroundColor: '#1f4baa',
        paddingVertical: 18,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 20,           
      },
      buttonText: {
        color: '#fff',
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
      }
      
});