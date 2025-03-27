import { StyleSheet} from "react-native";

export const styles = StyleSheet.create({
    boxTop: {
        backgroundColor: '#1f4baa',
        height: '35%',
    },
    boxTopTwo: {
        alignItems: 'center',
        marginTop: 92,
    },
    boxTitle: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '70%',
        borderWidth: 2, 
        borderColor: 'green',
    },
    boxBottom: {
        height: '65%',
        width: '85%',
        margin: 'auto',
    },
    title: {
        color: '#FFFFFF',
        fontSize: 32,
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
        backgroundColor: '#FFFFFF',
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
});