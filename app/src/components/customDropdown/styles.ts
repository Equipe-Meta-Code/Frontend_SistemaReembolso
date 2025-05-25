import { StyleSheet} from "react-native";
import { themas } from "../../global/themes";

export const createStyles = (theme: any) => StyleSheet.create({
    boxTop: {
        backgroundColor: theme.colors.primary,
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
        borderColor: theme.colors.verde,
    },
    boxBottom: {
        height: '65%',
        width: '85%',
        margin: 'auto',
    },
    title: {
        color: theme.colors.secondary,
        fontSize: 32,
      },
    subTitle: {
        color: theme.colors.secondary,
        fontSize: 16,
        marginTop: 12,
    },
    textTop: {
        color: theme.colors.secondary,
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
        backgroundColor: theme.colors.secondary,
      },
      placeholderStyle: {
        color: theme.colors.text,
        fontSize: 16,
      },
      selectedTextStyle: {
        color: theme.colors.text,
        fontSize: 16,
      },
      inputSearchStyle: {
        height: 40,
        color: theme.colors.text,
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
});