import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  StatusBar,
  SafeAreaView,
  TextInput,
} from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import LogoutButton from "../components/LogoutButtons";
import CustomModal from "../components/CustomModal";

// Importe sua imagem (ajuste o caminho conforme necessário)
const backgroundImage = require("../../assets/images/login-bg.jpg"); // Caminho para sua imagem

const TelaPerfil = ({ navigation }) => {
  // Dados do usuário (poderiam vir de uma API)
  const [user, setUser] = useState({
    name: "João Silva",
    email: "joao.silva@empresa.com",
    position: "Técnico de Suporte",
    department: "TI",
    registration: "12345",
    phone: "(11) 98765-4321",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  });

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState("");

  const handleEdit = (field) => {
    setEditingField(field);
    setEditValue(user[field]);
    setEditModalVisible(true);
  };

  const saveEdit = () => {
    setUser({ ...user, [editingField]: editValue });
    setEditModalVisible(false);
  };

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar backgroundColor="#1976D2" barStyle="light-content" />

        {/* Header */}
        <View style={styles.header}>
          {/*} <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>*/}
          <Text style={styles.headerTitle}>Meu Perfil</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Seção do Avatar */}
          <View style={styles.avatarContainer}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <TouchableOpacity style={styles.editAvatarButton}>
              {/*<MaterialIcons name="edit" size={18} color="#6200EE" />*/}
            </TouchableOpacity>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userPosition}>{user.position}</Text>
          </View>
          {/* Informações Pessoais */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações Pessoais</Text>

            <View style={styles.infoCard}>
              <InfoItem
                icon="person"
                label="Nome Completo"
                value={user.name}
                onPress={() => handleEdit("name")}
              />
              <InfoItem
                icon="mail"
                label="E-mail"
                value={user.email}
                onPress={() => handleEdit("email")}
              />
              <InfoItem
                icon="phone"
                label="Telefone"
                value={user.phone}
                onPress={() => handleEdit("phone")}
              />
            </View>
          </View>
          {/* Informações Profissionais */}
          {/*} <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações Profissionais</Text>

            <View style={styles.infoCard}>
              <InfoItem
                icon="work"
                label="Cargo"
                value={user.position}
                onPress={() => handleEdit("position")}
              />
              <InfoItem
                icon="business"
                label="Departamento"
                value={user.department}
                onPress={() => handleEdit("department")}
              />
              <InfoItem
                icon="badge"
                label="Matrícula"
                value={user.registration}
              />
            </View>
          </View>*/}
          {/* Configurações e Ações */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Configurações</Text>

            <View style={styles.infoCard}>
              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuItemLeft}>
                  <MaterialCommunityIcons name="lock" size={22} color="#555" />
                  <Text style={styles.menuItemText}>Alterar Senha</Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#999" />
              </TouchableOpacity>

              {/*<TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuItemLeft}>
                  <MaterialCommunityIcons name="bell" size={22} color="#555" />
                  <Text style={styles.menuItemText}>Notificações</Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#999" />
              </TouchableOpacity>*/}

              {/*<TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuItemLeft}>
                  <MaterialIcons name="help" size={22} color="#555" />
                  <Text style={styles.menuItemText}>Ajuda e Suporte</Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#999" />
              </TouchableOpacity>*/}
            </View>
          </View>

          <LogoutButton
            onPress={() => console.log("Usuário deslogado")}
            navigation={navigation}
          />
        </ScrollView>

        {/* Modal de Edição */}
        <CustomModal
          visible={editModalVisible}
          onClose={() => setEditModalVisible(false)}
          title={`Editar ${editingField}`}
          onConfirm={saveEdit}
        >
          <TextInput
            style={styles.input}
            value={editValue}
            onChangeText={setEditValue}
            autoFocus={true}
            placeholder={`Digite o novo ${editingField}`}
          />
        </CustomModal>
      </SafeAreaView>
    </ImageBackground>
  );
};

// Componente auxiliar para itens de informação
const InfoItem = ({ icon, label, value, onPress }) => (
  <TouchableOpacity style={styles.infoItem} onPress={onPress}>
    <MaterialIcons name={icon} size={22} color="#6200EE" />
    <View style={styles.infoTextContainer}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
    {onPress && <MaterialIcons name="edit" size={18} color="#999" />}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "rgba(248, 248, 248, 0.8)", // Fundo semi-transparente,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#6200EE",
    paddingVertical: 15,
    paddingHorizontal: 16,
    elevation: 4,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  avatarContainer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#6200EE",
  },
  editAvatarButton: {
    position: "absolute",
    right: "35%",
    bottom: 30,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 6,
    elevation: 3,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 16,
    color: "#333",
  },
  userPosition: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  section: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6200EE",
    marginBottom: 12,
    marginLeft: 8,
  },
  infoCard: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 8,
    elevation: 2,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  infoLabel: {
    fontSize: 13,
    color: "#777",
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
    marginTop: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 16,
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
  },
  saveButton: {
    backgroundColor: "#6200EE",
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TelaPerfil;
