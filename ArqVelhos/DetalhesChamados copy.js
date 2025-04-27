import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import FooterMenu from "../components/FooterMenu";
import { TicketService } from "../route/apiService"; // Importa o TicketService

const backgroundImage = require("../../assets/images/login-bg.jpg");

const DetalhesChamados = ({ route, navigation }) => {
  const { id } = route.params; // Obtém o ID do ticket passado pela navegação
  const [ticket, setTicket] = useState(null); // Estado para armazenar os dados do ticket
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [error, setError] = useState(null); // Estado para erros

  // Busca os detalhes do ticket da API quando a tela é carregada
  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        setLoading(true);
        const ticketData = await TicketService.getTicketById(id); // Busca o ticket pelo ID
        // Mapeia os dados da API para o formato esperado pela tela
        const mappedTicket = {
          id: ticketData.id.split("_")[1].slice(0, 8), // Extrai uma parte curta do ID
          title: ticketData.name || "Sem título",
          description: ticketData.explain || "Sem descrição",
          status: ticketData.status || "Desconhecido",
          date: new Date(ticketData.date).toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }), // Formata a data
          department: ticketData.department || "Não informado",
          priority: ticketData.priority || "Média",
          location: ticketData.location || "Não informado",
          requester: ticketData.author || "Desconhecido",
          history: ticketData.history || [],
        };
        setTicket(mappedTicket);
      } catch (err) {
        setError(err.message || "Erro ao carregar os detalhes do ticket.");
      } finally {
        setLoading(false);
      }
    };

    fetchTicketDetails();
  }, [id]);

  const getStatusColor = (status) => {
    const statusColors = {
      pending: "#FFA000", // Ajustado para corresponder ao status "pending" da API
      "Em Andamento": "#1976D2",
      Concluído: "#388E3C",
      Cancelado: "#D32F2F",
    };
    return statusColors[status] || "#757575";
  };

  if (loading) {
    return (
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar backgroundColor="#1976D2" barStyle="light-content" />
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
          <FooterMenu navigation={navigation} />
        </SafeAreaView>
      </ImageBackground>
    );
  }

  if (error) {
    return (
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar backgroundColor="#1976D2" barStyle="light-content" />
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
          <FooterMenu navigation={navigation} />
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar backgroundColor="#1976D2" barStyle="light-content" />

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ID e Status */}
          <View style={styles.idStatusContainer}>
            <Text style={styles.ticketId}>#{ticket.id}</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(ticket.status) },
              ]}
            >
              <Text style={styles.statusText}>{ticket.status}</Text>
            </View>
          </View>

          {/* Card de Informações Principais */}
          <View style={styles.card}>
            <Text style={styles.ticketTitle}>{ticket.title}</Text>
            <Text style={styles.ticketDescription}>{ticket.description}</Text>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <MaterialIcons name="person" size={20} color="#555" />
              <Text style={styles.detailText}>{ticket.requester}</Text>
            </View>

            <View style={styles.detailRow}>
              <MaterialIcons name="date-range" size={20} color="#555" />
              <Text style={styles.detailText}>{ticket.date}</Text>
            </View>

            <View style={styles.detailRow}>
              <MaterialIcons name="business" size={20} color="#555" />
              <Text style={styles.detailText}>{ticket.department}</Text>
            </View>

            <View style={styles.detailRow}>
              <MaterialIcons name="priority-high" size={20} color="#555" />
              <Text style={styles.detailText}>
                Prioridade: {ticket.priority}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <MaterialIcons name="place" size={20} color="#555" />
              <Text style={styles.detailText}>{ticket.location}</Text>
            </View>
          </View>

          {/* Histórico de Atualizações */}
          <Text style={styles.sectionTitle}>Histórico</Text>
          <View style={styles.historyCard}>
            {ticket.history.map((item, index) => (
              <View key={index} style={styles.historyItem}>
                <View style={styles.historyDot} />
                <View style={styles.historyContent}>
                  <Text style={styles.historyDate}>
                    {new Date(item.date).toLocaleString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                  <Text style={styles.historyAction}>{item.action}</Text>
                </View>
                {index < ticket.history.length - 1 && (
                  <View style={styles.historyLine} />
                )}
              </View>
            ))}
          </View>

          {/* Botão de Atualizar Status */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: getStatusColor(ticket.status) },
              ]}
              onPress={() =>
                navigation.navigate("UpdateStatus", { ticketId: ticket.id })
              }
            >
              <MaterialIcons name="edit" size={24} color="white" />
              <Text style={styles.actionButtonText}>Atualizar Status</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Footer Menu */}
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
  safeArea: {
    flex: 1,
    backgroundColor: "rgba(248, 248, 248, 0.8)",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  idStatusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  ticketId: {
    fontSize: 16,
    color: "#555",
    fontWeight: "bold",
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  ticketTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  ticketDescription: {
    fontSize: 15,
    color: "#555",
    marginBottom: 16,
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  detailText: {
    marginLeft: 10,
    fontSize: 15,
    color: "#555",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 16,
    marginBottom: 12,
    color: "#333",
  },
  historyCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    elevation: 2,
  },
  historyItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  historyDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#1976D2",
    marginRight: 12,
    marginTop: 4,
  },
  historyLine: {
    position: "absolute",
    left: 5,
    top: 16,
    bottom: -8,
    width: 2,
    backgroundColor: "#BBDEFB",
  },
  historyContent: {
    flex: 1,
    paddingBottom: 16,
  },
  historyDate: {
    fontSize: 13,
    color: "#757575",
    marginBottom: 2,
  },
  historyAction: {
    fontSize: 15,
    color: "#333",
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 28,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  actionButtonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 8,
    fontSize: 16,
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

export default DetalhesChamados;
