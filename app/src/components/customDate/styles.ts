import { StyleSheet} from "react-native";
import { themas } from "../../global/themes";

export const createStyles = (theme: any) => StyleSheet.create({
    datePickerButton: {
        padding: 15,
        borderWidth: 0.5,
        borderColor: theme.colors.cinza,
        borderRadius: 8,
        backgroundColor:theme.colors.secondary,
        height: 50,
        marginTop: 12,
      },
      dateText: {
        fontSize: 16,
        color: theme.colors.black,
      },
});