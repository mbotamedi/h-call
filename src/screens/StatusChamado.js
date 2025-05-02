import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import FooterMenu from "../components/FooterMenu";
import { TicketService } from "../route/apiService";

const backgroundImage = require("../../assets/images/login-bg.jpg");

const StatusChamado = ({ navigation }) => {
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para buscar tickets
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const tickets = await TicketService.getTickets();
      const mappedTickets = tickets.map((ticket) => ({
        id: ticket.id,
        numero: ticket.id.slice(0, 8),
        descricao: ticket.item,
      }));
      setChamados(mappedTickets);
    } catch (err) {
      setError(err.message || "Erro ao carregar os tickets.");
    } finally {
      setLoading(false);
    }
  };

  // Busca tickets quando a tela ganha foco
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchTickets();
    });

    // Limpa o listener quando o componente é desmontado
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.row}
      onPress={() => navigation.navigate("DetalhesChamados", { id: item.id })}
    >
      <Text style={[styles.cell, styles.cellNumero]}>{item.numero}</Text>
      <Text style={[styles.cell, styles.cellDescricao]}>{item.descricao}</Text>
      <View style={[styles.cell, styles.cellDetalhar]}>
        <Icon name="arrow-forward" size={24} color="#007AFF" />
      </View>
    </TouchableOpacity>
  );

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#1976D2" barStyle="light-content" />

        {/* Cabeçalho da tabela */}
        <View style={styles.tableHeader}>
          <Text style={[styles.headerText, styles.headerNumero]}>Número</Text>
          <Text style={[styles.headerText, styles.headerDescricao]}>
            Descrição
          </Text>
          <Text style={[styles.headerText, styles.headerDetalhar]}>
            Detalhar
          </Text>
        </View>

        {/* Exibe indicador de carregamento ou erro */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <FlatList
            data={chamados}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
          />
        )}

        {/* Menu inferior */}
        <FooterMenu navigation={navigation} />
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: "rgba(248, 248, 248, 0.8)",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ddd",
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  headerText: {
    fontWeight: "bold",
    color: "#555",
  },
  headerNumero: {
    width: 80,
    textAlign: "left",
    paddingLeft: 5,
  },
  headerDescricao: {
    flex: 1,
    textAlign: "left",
    paddingLeft: 50,
  },
  headerDetalhar: {
    width: 80,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 8,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 2,
    borderRadius: 5,
  },
  cell: {
    paddingTop: 10,
    width: 50,
    height: 50,
    textAlign: "center",
  },
  cellNumero: {
    width: 80,
    paddingLeft: 10,
  },
  cellDescricao: {
    flex: 1,
    paddingLeft: 10,
  },
  cellDetalhar: {
    width: 80,
    alignItems: "center",
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 16,
    textAlign: "center",
  },
});

export default StatusChamado;