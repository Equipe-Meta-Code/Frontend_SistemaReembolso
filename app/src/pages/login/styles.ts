import { StyleSheet,Dimensions} from "react-native";


export const style = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    boxTop: {
        height: Dimensions.get('window').height / 5,
        width: '100%',
        backgroundColor: '#1F48AA',
        alignItems: 'flex-start',
        justifyContent: 'center',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    boxMid: {
        flex: 1,
        backgroundColor: 'white',
        width: '100%',
        paddingTop: 20,
        paddingHorizontal: 20,
        paddingBottom: Dimensions.get('window').height / 4 + 20, 
    },
    title: {
        fontSize: 18,   
        color: 'white',  
        fontWeight: 'bold',
        paddingLeft:20  
    },
    description: {
        fontSize: 16,    
        color: 'white',  
        textAlign: 'left',  
        marginTop: 10,  
        paddingLeft:20
    },
    welcomeTitle: {
        fontSize: 24,    
        fontWeight: 'bold',  
        color: 'black',  
    },
    instruction: {
        fontSize: 16,    
        color: 'black',  
        textAlign: 'left',  
        marginTop: 10,   
    },
    inputTitle: {
        paddingTop:5,
        fontSize: 16,
        color: 'black',
        marginTop: 20, 
        alignSelf: 'flex-start', 
        marginLeft: 10, 
    },
    input: {
        width: '100%',
        height: 40, 
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        marginTop: 5,
        borderColor: '#D3D3D3',
    },
    forgotPassword: {
        paddingTop:10,
        color: '#1F48AA',
        fontSize: 16,
        marginTop: 10,
        textAlign: 'center',
        textDecorationLine: 'underline', 
    },
    loginButton: {
        marginTop: 40,
        backgroundColor: '#1F48AA', 
        paddingVertical: 19,
        paddingHorizontal: 50,
        borderRadius: 25, 
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    lineContainer: {
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20, 
    },
    noAccountText: {
        paddingTop:70,
        fontSize: 16,
        color: '#D3D3D3',  
        textAlign: 'center', 
    },
    signupButton: {
        backgroundColor: '#1F48AA', 
        paddingVertical: 19,
        paddingHorizontal: 130,
        borderRadius: 25, 
        justifyContent: 'center',
        alignItems: 'center',
    },
    signupButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    eyeIcon: {
        marginLeft: -30, 
    },
})