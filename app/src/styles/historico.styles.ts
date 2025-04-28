import { StyleSheet } from "react-native";

export const COLUMN_WIDTHS = {
  data: 78,
  projeto: 100,
  descricao: 120,
  valor: 90,
  status: 100,
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  listContainer: {
    paddingBottom: 80,
  },

  // Cabeçalho Azul
  header: {
    backgroundColor: "#1E4DB7",
    padding: 20,
    paddingTop: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  // card de resumo no topo da tela
  cardInformacoes: {
    backgroundColor: "rgb(247, 247, 247)", 
    borderRadius: 10,            
    padding: 12,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    elevation: 3,
  },  
  totalTitle: {
    fontSize: 14,
    color: "#7F8C8D",
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 26,
    color: "rgb(43, 66, 143)",
    marginBottom: 4,
    fontWeight: "bold",
  },
  pendingValue: {
    color: "rgb(179, 129, 3)", 
    fontSize: 15,
  },
  approvedValue: {
    color: "rgb(20, 148, 49)", 
    fontSize: 15,
  },  
  rejectedValue: {
    color: "rgb(185, 0, 0)",
    fontSize: 15,
  },
  subText: {
    fontSize: 13,
    color: "#7F8C8D",
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rightColumn: {
    justifyContent: "center",
    marginRight: 10,
  }, 
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  statusLabel: {
    fontSize: 12,
    color: "#2C3E50", 
  },


  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
  },
  highlight: {
    color: "#28B463",
  },

  // Seção de Despesas
  section: {
    marginVertical: 5,
    paddingHorizontal: 15,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 8,
    backgroundColor: "#1E4DB7",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  iconWrapper: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: "#ECF0F1",
    marginRight: 10,
  },
  icon: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#FFF",
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#D5DBDB",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 5,
  },
  headerText: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2C3E50",
  },

  // Itens de Despesas
  despesaItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 5,
    elevation: 1,
  },

  
  data: {
    width: COLUMN_WIDTHS.data,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  tipoDespesa: {
    width: COLUMN_WIDTHS.projeto,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    color: "#2C3E50",
  },
  valor: {
    width: COLUMN_WIDTHS.valor,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  status: {
    fontSize: 14,
    width: COLUMN_WIDTHS.status,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 5,
    borderRadius: 5,
  },

  // Botão fixo no final da tela
  fixedButton: {
    position: "absolute",
    bottom: 10,
    left: "5%",
    right: "5%",
    backgroundColor: "#1E4DB7",
    borderRadius: 40,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  circleText: {
    color: "#1E4DB7",
    fontSize: 12,
    fontWeight: "bold",
  },
  textContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center", 
    flex: 1, 
    marginLeft: 15,
  },
  buttonValue: {
    fontSize: 16, 
    fontWeight: "bold",
    color: "#FFF",
    marginRight: 5,
  },
  
});