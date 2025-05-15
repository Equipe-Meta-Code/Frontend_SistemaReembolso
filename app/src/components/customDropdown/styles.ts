import { StyleSheet} from "react-native";
import { themas } from "../../global/themes";

export const styles = StyleSheet.create({
    boxTop: {
        backgroundColor: themas.colors.primary,
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
        borderColor: themas.colors.verde,
    },
    boxBottom: {
        height: '65%',
        width: '85%',
        margin: 'auto',
    },
    title: {
        color: themas.colors.secondary,
        fontSize: 32,
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
        color: themas.colors.black,
        fontSize: 16,
        marginTop: 30,
    },
    dropdown: {
        height: 50,
        borderColor: themas.colors.cinza,
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginTop: 12,
        backgroundColor: themas.colors.secondary,
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
        backgroundColor: themas.colors.secondary,
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
      },
});