import { StyleSheet, Dimensions } from "react-native";
import { themas } from "../../global/themes";

export const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  boxTop: {
    height: Dimensions.get('window').height / 5,
    width: '100%',
    backgroundColor: theme.colors.primary,
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
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
    paddingLeft: 20
  },
  description: {
    fontSize: 16,
    color: themas.colors.secondary,
    textAlign: 'left',
    marginTop: 10,
    paddingLeft: 20
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
    marginBottom: 20,
  },
});
