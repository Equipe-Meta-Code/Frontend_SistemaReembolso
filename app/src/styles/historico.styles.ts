import { StyleSheet } from "react-native";
import { themas } from "../global/themes";

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
    backgroundColor: themas.colors.secondary,
  },

  listContainer: {
    paddingBottom: 80,
  },

  // Cabeçalho Azul
  header: {
    backgroundColor: themas.colors.primary,
    padding: 20,
    paddingTop: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  // card de resumo no topo da tela
  cardInformacoes: {
    backgroundColor: themas.colors.cinza_muito_claro, 
    borderRadius: 10,            
    padding: 12,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    elevation: 3,
  },  
  totalTitle: {
    fontSize: 14,
    color: themas.colors.cinza,
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 26,
    color: themas.colors.primary,
    marginBottom: 4,
    fontWeight: "bold",
  },
  pendingValue: {
    color: themas.colors.mostarda_escuro_opaco, 
    fontSize: 15,
  },
  approvedValue: {
    color: themas.colors.verde_medio, 
    fontSize: 15,
  },  
  rejectedValue: {
    color: themas.colors.vinho_claro,
    fontSize: 15,
  },
  subText: {
    fontSize: 13,
    color: themas.colors.cinza_medio,
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
    color: themas.colors.azul_escuro, 
  },


  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 22,
    color: themas.colors.secondary,
    fontWeight: "bold",
  },
  highlight: {
    color: themas.colors.verde_medio,
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
    backgroundColor: themas.colors.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  iconWrapper: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: themas.colors.cinza_muito_claro,
    marginRight: 10,
  },
  icon: {
    fontSize: 18,
    fontWeight: "bold",
    color: themas.colors.azul_escuro,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: themas.colors.secondary,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: themas.colors.cinza_claro, 
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 5,
  },
  headerText: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    color: themas.colors.azul_escuro,
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
    color: themas.colors.chumbo_claro,
    textAlign: "center",
  },
  tipoDespesa: {
    width: COLUMN_WIDTHS.projeto,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    color: themas.colors.azul_escuro,
  },
  valor: {
    width: COLUMN_WIDTHS.valor,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
    color: themas.colors.azul_escuro,
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
    backgroundColor: themas.colors.primary,
    borderRadius: 40,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    shadowColor: themas.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: themas.colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  circleText: {
    color: themas.colors.primary,
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
    color: themas.colors.secondary,
    textAlign: "center", 
    flex: 1, 
    marginLeft: 15,
  },
  buttonValue: {
    fontSize: 16, 
    fontWeight: "bold",
    color: themas.colors.secondary,
    marginRight: 5,
  },
  
});