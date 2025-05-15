import { StyleSheet} from "react-native";
import { themas } from "../../global/themes";

export const styles = StyleSheet.create({
    datePickerButton: {
        padding: 15,
        borderWidth: 0.5,
        borderColor: themas.colors.cinza,
        borderRadius: 8,
        backgroundColor:themas.colors.secondary,
        height: 50,
        marginTop: 12,
      },
      dateText: {
        fontSize: 16,
        color: themas.colors.black,
      },
});