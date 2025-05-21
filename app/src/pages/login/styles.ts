import { StyleSheet,Dimensions} from "react-native";
import { themas } from "../../global/themes";


export const createStyles = (theme: any) => StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    boxTop: {
        height: Dimensions.get('window').height / 5,
        width: '100%',
        backgroundColor: theme.colors.primary,
        alignItems: 'flex-start',
        justifyContent: 'center',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    boxMid: {
        flex: 1,
        backgroundColor: theme.colors.secondary,
        width: '100%',
        paddingTop: 20,
        paddingHorizontal: 20,
        paddingBottom: Dimensions.get('window').height / 4 + 20, 
    },
    title: {
        fontSize: 18,   
        color: themas.colors.secondary,  
        fontWeight: 'bold',
        paddingLeft:20  
    },
    description: {
        fontSize: 16,    
        color: themas.colors.secondary,  
        textAlign: 'left',  
        marginTop: 10,  
        paddingLeft:20
    },
    welcomeTitle: {
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
        fontSize: 16,
        marginTop: 30,
        textAlign: 'center',
        textDecorationLine: 'underline', 
        marginBottom: 40,
    },
    lineContainer: {
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20, 
    },
    noAccountText: {
        paddingTop:60,
        fontSize: 16,
        color: theme.colors.gray,  
        textAlign: 'center', 
        marginBottom: 40,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    eyeIcon: {
        marginLeft: -30, 
    },
    erroInput: {
        borderColor: theme.colors.red,
        borderWidth: 1,
      },
      
      erroTexto: {
        color: theme.colors.red,
        fontSize: 12,
        marginTop: 4,
        marginBottom: 8,
      },

    // Verificacao2FA.tsx
    inputGroup: {
        width: '100%',
        gap: 16,
        paddingHorizontal: 10,
        marginTop: 60,
    },
    resendText: {
        marginTop: 16,
        color: theme.colors.primary,
        textAlign: 'center',
        textDecorationLine: 'underline',
        fontSize: 14,
    },

      
})