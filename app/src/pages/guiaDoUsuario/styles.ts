import { StyleSheet, Dimensions } from 'react-native';

export const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    height: 150,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    elevation: 4,
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 34, // Compensa o botão de voltar
  },
  scrollContent: {
    padding: 20,
  },
  accordionItem: {
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 1,
  },
  accordionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    alignItems: 'center',
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    paddingRight: 10,
  },
  answerContainer: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  answerText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
