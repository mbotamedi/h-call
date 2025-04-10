import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import FooterMenu from "../components/FooterMenu";

const backgroundImage = require("../../assets/images/login-bg.jpg");

const DetalhesChamados = ({ route, navigation }) => {
  const ticket = route.params?.ticket || {
    id: "001",
    title: "Troca de Tuner",
    description:
      "Solicitado a compra dos turnes, aguardando retorno do departamento de compras.",
    status: "Aguardando Compras",
    date: "15/03/2023 14:30",
    department: "Departamento Técnico",
    priority: "Média",
    location: "Setor B - Prateleira 4",
    requester: "João Silva",
    history: [
      { date: "15/03/2023 14:30", action: "Chamado aberto" },
      { date: "15/03/2023 15:45", action: "Encaminhado para compras" },
    ],
  };

  const getStatusColor = (status) => {
    const statusColors = {
      "Aguardando Compras": "#FFA000",
      "Em Andamento": "#1976D2",
      Concluído: "#388E3C",
      Cancelado: "#D32F2F",
    };
    return statusColors[status] || "#757575";
  };

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar backgroundColor="#1976D2" barStyle="light-content" />

        {/* Header simplificado */}
        {/*} <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
        </View>*/}

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
                  <Text style={styles.historyDate}>{item.date}</Text>
                  <Text style={styles.historyAction}>{item.action}</Text>
                </View>
                {index < ticket.history.length - 1 && (
                  <View style={styles.historyLine} />
                )}
              </View>
            ))}
          </View>

          {/* Botão de Atualizar Status - agora dentro do ScrollView */}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  backButton: {
    padding: 8,
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
});

export default DetalhesChamados;
