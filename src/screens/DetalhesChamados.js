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
import { TicketService } from "../route/apiService";

const backgroundImage = require("../../assets/images/login-bg.jpg");

const DetalhesChamados = ({ route, navigation }) => {
  const { id } = route.params;
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        setLoading(true);
        setError(null); // Limpa o erro anterior
        const ticketData = await TicketService.getTicketById(id);
        console.log("Dados recebidos da API:", ticketData);

        if (!ticketData) {
          throw new Error(
            "Nenhum dado de ticket retornado pela API. Verifique se o servidor está online."
          );
        }

        const mappedTicket = {
          id: ticketData.id ? ticketData.id.slice(0, 8) : "Desconhecido",
          title: ticketData.name || "Sem título",
          description: ticketData.explain || "Sem descrição",
          status: ticketData.tickt_status || "Desconhecido", // Ajustado para tickt_status
          date: ticketData.date
            ? new Date(ticketData.date).toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Data não informada",
          department: ticketData.department || "Não informado",
          priority: "Média",
          location: "Não informado",
          requester: ticketData.email || "Desconhecido", // Alterado de author para email
          history: ticketData.history
            ? ticketData.history.map((item) => ({
                date: item.date,
                action: item.return,
              }))
            : [],
        };
        setTicket(mappedTicket);
      } catch (err) {
        console.error("Erro ao buscar detalhes do ticket:", err.message);
        setError(err.message || "Erro ao carregar os detalhes do ticket.");
      } finally {
        setLoading(false);
      }
    };

    fetchTicketDetails();
  }, [id]);

  const getStatusColor = (status) => {
    const statusColors = {
      pending: "#FFA000",
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

  if (!ticket) {
    return (
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar backgroundColor="#1976D2" barStyle="light-content" />
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              Nenhum dado de ticket disponível.
            </Text>
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

          <Text style={styles.sectionTitle}>Histórico</Text>
          <View style={styles.historyCard}>
            {ticket.history.length > 0 ? (
              ticket.history.map((item, index) => (
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
              ))
            ) : (
              <Text style={styles.historyAction}>
                Nenhum histórico disponível.
              </Text>
            )}
          </View>
        </ScrollView>

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