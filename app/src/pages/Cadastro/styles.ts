import { StyleSheet,Dimensions} from "react-native";


export const style = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    boxTop:{
        height:Dimensions.get('window').height/5,
        width:'100%',
        backgroundColor:'#1F48AA',
        alignItems:'flex-start',
        justifyContent:'center',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    boxMid:{
        flex:1,
        backgroundColor:'white',
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
        color: 'white',  
        fontWeight: 'bold',
        marginLeft: 10, 
    },
    arrowBackIcon: {
        paddingLeft: 10, 
    },
    
    description: {
        fontSize: 16,  
        color: 'white', 
        textAlign: 'left', 
        paddingLeft:20,//
   
    },
    welcomeTitle: {
        marginTop: 10,
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
        marginLeft: 0, 
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
        fontSize: 14,
        marginTop: 10,
        textAlign: 'center',
        textDecorationLine: 'underline', 
    },
    loginButton: {
        marginTop: 20,
        backgroundColor: '#1F48AA', 
        paddingVertical: 16,
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
        paddingTop:20,
        fontSize: 16,
        color: '#D3D3D3', 
        textAlign: 'center', 
    },
    signupButton: {
        backgroundColor: '#1F48AA', 
        paddingVertical: 19,
        paddingHorizontal: 126,
        borderRadius: 25, 
        justifyContent: 'center',
        alignItems: 'center',
    },
    signupButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
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
        color: 'gray',
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