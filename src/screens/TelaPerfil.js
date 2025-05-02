import React, { useState, useEffect } from "react";
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
  Alert,
} from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LogoutButton from "../components/LogoutButtons";
import CustomModal from "../components/CustomModal";
import { AuthService } from "../route/apiService";

const backgroundImage = require("../../assets/images/login-bg.jpg");
const DEFAULT_AVATAR = require("../../assets/images/avatar.png");

const TelaPerfil = ({ navigation }) => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: null,
  });
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(true);

  // Carregar dados do usuário e avatar do AsyncStorage
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AuthService.getUserProfile();
        console.log("teste user darta", userData);
        const avatarKey = `avatar_${userData.email.replace(/[@.]/g, "_")}`;
        const savedAvatar = await AsyncStorage.getItem(avatarKey);
        setUser({
          name: userData.name || userData.email?.split("@")[0] || "Usuário",
          email: userData.email || "",
          phone: userData.phone || "",
          avatar: savedAvatar || null,
        });
      } catch (error) {
        try {
          const storedUserData = await AuthService.getUserData();
          if (storedUserData) {
            const avatarKey = `avatar_${storedUserData.email.replace(
              /[@.]/g,
              "_"
            )}`;
            const savedAvatar = await AsyncStorage.getItem(avatarKey);
            setUser({
              name:
                storedUserData.name ||
                storedUserData.email?.split("@")[0] ||
                "Usuário",
              email: storedUserData.email || "",
              phone: storedUserData.phone || "",
              avatar: savedAvatar || null,
            });
          } else {
            throw new Error("Dados do usuário não encontrados.");
          }
        } catch (fallbackError) {
          Alert.alert(
            "Erro",
            fallbackError.message || "Falha ao carregar os dados do usuário."
          );
          navigation.navigate("Login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigation]);

  // Função formatPhone movida para o escopo correto
  const formatPhone = (phone) => {
    if (!phone) return "";
    const cleaned = phone.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  };

  // Selecionar imagem da galeria
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão negada",
        "É necessário permitir o acesso à galeria para selecionar uma foto."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const newAvatar = result.assets[0].uri;
      setUser((prevUser) => ({ ...prevUser, avatar: newAvatar }));
      const avatarKey = `avatar_${user.email.replace(/[@.]/g, "_")}`;
      await AsyncStorage.setItem(avatarKey, newAvatar);
    }
  };

  const handleEdit = (field) => {
    setEditingField(field);
    setEditValue(user[field]);
    setEditModalVisible(true);
  };

  const saveEdit = async () => {
    setUser({ ...user, [editingField]: editValue });
    setEditModalVisible(false);
    try {
      const userData = await AuthService.getUserData();
      await AsyncStorage.setItem(
        "user_data",
        JSON.stringify({
          ...userData,
          [editingField]: editValue,
        })
      );
    } catch (error) {
      console.error("Erro ao atualizar user_data:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      Alert.alert("Sucesso", "Você foi deslogado com sucesso.");
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      Alert.alert("Erro", error.message || "Falha ao realizar logout.");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </SafeAreaView>
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
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.avatarContainer}>
            <Image
              source={user.avatar ? { uri: user.avatar } : DEFAULT_AVATAR}
              style={styles.avatar}
            />
            <TouchableOpacity
              style={styles.editAvatarButton}
              onPress={pickImage}
            >
              <MaterialIcons name="edit" size={18} color="#6200EE" />
            </TouchableOpacity>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userPosition}>{user.position}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações Pessoais</Text>
            <View style={styles.infoCard}>
              <InfoItem icon="person" label="Nome Completo" value={user.name} />
              <InfoItem icon="mail" label="E-mail" value={user.email} />
              <InfoItem
                icon="phone"
                label="Telefone"
                value={formatPhone(user.phone)}
              />
            </View>
          </View>

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
            </View>
          </View>

          <LogoutButton onPress={handleLogout} navigation={navigation} />
        </ScrollView>

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
    backgroundColor: "rgba(248, 248, 248, 0.8)",
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
    color: "rgba(33, 34, 33, 0.98)",
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
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
  },
});

export default TelaPerfil;
