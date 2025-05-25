import { StyleSheet,Dimensions} from "react-native";
import { themas } from "../../global/themes";


export const createStyles = (theme: any) => StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    boxTop:{
        height:Dimensions.get('window').height/5,
        width:'100%',
        backgroundColor: theme.colors.primary,
        alignItems:'flex-start',
        justifyContent:'center',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    boxMid:{
        flex:1,
        backgroundColor: theme.colors.secondary,
        width:'100%',
        paddingBlockStart:20,
        paddingHorizontal:20,
    },

    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20, 
    },
    title: {
        fontSize: 18,
        color: theme.colors.sempre_branco,  
        fontWeight: 'bold',
        marginLeft: 10, 
    },
    arrowBackIcon: {
        paddingLeft: 10, 
    },
    
    description: {
        fontSize: 16,  
        color: theme.colors.sempre_branco, 
        textAlign: 'left', 
        paddingLeft:20,//
   
    },
    welcomeTitle: {
        marginTop: 10,
        fontSize: 24,   
        fontWeight: 'bold', 
        color: theme.colors.black, 
    },
    instruction: {
        fontSize: 16,   
        color: theme.colors.black, 
        textAlign: 'left',  
        marginTop: 10, 
    },
    forgotPassword: {
        paddingTop:10,
        color: theme.colors.primary, 
        fontSize: 14,
        marginTop: 10,
        textAlign: 'center',
        textDecorationLine: 'underline', 
    },
    lineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20, 
    },
    noAccountText: {
        paddingTop:20,
        fontSize: 16,
        color: theme.colors.gray,    
        textAlign: 'center', 
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    checkbox: {
        padding: 10,
    },
    checkboxText: {
        marginLeft: 10,
        fontSize: 14,
        color: theme.colors.cinza,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    eyeIcon: {
        marginLeft: -30, 
    },
    errorContainer: {
        marginTop: 10,
        marginBottom: 10,
        padding: 10,
        backgroundColor: theme.colors.rosa_muito_claro, // Fundo vermelho claro
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.colors.red, // Borda vermelha
      },
      errorMessage: {
        color: theme.colors.red, // Cor do texto vermelho
        fontSize: 14,
        fontWeight: 'bold',
      }
})