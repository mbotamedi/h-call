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
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("jwt_token");
        console.log(
          "Token no fetchUserData:",
          token ? `Presente: ${token.substring(0, 20)}...` : "Ausente"
        );
        if (!token) {
          throw new Error("Nenhum token encontrado. Faça login novamente.");
        }
        const userData = await AuthService.getUserProfile();
        console.log(userData);
        const avatarKey = `avatar_${userData.email.replace(/[@.]/g, "_")}`;
        const savedAvatar = await AsyncStorage.getItem(avatarKey);
        setUser({
          name: userData.name || userData.email?.split("@")[0] || "Usuário",
          email: userData.email || "",
          phone: userData.phone || "",
          avatar: savedAvatar || null,
        });
      } catch (error) {
        console.error(
          "Erro ao carregar dados do usuário:",
          error.message,
          error.response?.data
        );
        if (
          error.message.includes("Acesso negado") ||
          error.message.includes("sessão expirada")
        ) {
          Alert.alert(
            "Sessão Expirada",
            "Sua sessão expirou. Faça login novamente.",
            [
              {
                text: "OK",
                onPress: () =>
                  navigation.reset({ index: 0, routes: [{ name: "Login" }] }),
              },
            ]
          );
        } else {
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
            console.error("Erro no fallback:", fallbackError.message);
            Alert.alert(
              "Erro",
              fallbackError.message ||
                "Falha ao carregar os dados do usuário. Faça login novamente.",
              [
                {
                  text: "OK",
                  onPress: () =>
                    navigation.reset({ index: 0, routes: [{ name: "Login" }] }),
                },
              ]
            );
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigation]);

  const formatPhone = (phone) => {
    if (!phone) return "";
    const cleaned = phone.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    return match ? `(${match[1]}) ${match[2]}-${match[3]}` : phone;
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão negada",
        "É necessário permitir o acesso à galeria."
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

  const handleEdit = () => {
    setNewPassword("");
    setShowNewPassword(false);
    setEditModalVisible(true);
  };

  const validatePassword = (password) => {
    // Requisitos: mínimo 8 caracteres, 1 letra maiúscula, 1 minúscula, 1 número, 1 caractere especial, sem espaços
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const noSpaces = !/\s/.test(password);
    return (
      minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar &&
      noSpaces
    );
  };

  const saveEdit = async () => {
    setEditModalVisible(false);
    try {
      if (!newPassword) {
        Alert.alert("Erro", "Por favor, digite a nova senha.");
        return;
      }
      if (!validatePassword(newPassword)) {
        Alert.alert(
          "Erro",
          "A nova senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma minúscula, um número, um caractere especial (ex.: !@#$%) e sem espaços."
        );
        return;
      }
      await AuthService.updateUserProfile(newPassword);
      Alert.alert("Sucesso", "Senha atualizada com sucesso.");
    } catch (error) {
      console.error("Erro ao atualizar senha:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        code: error.code,
      });
      const errorMessage =
        error.message === "invalid new password"
          ? "A senha fornecida é inválida. Tente uma senha com pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números, caracteres especiais e sem espaços."
          : error.message ||
            "Falha ao atualizar a senha. Verifique a conexão ou contate o suporte.";
      Alert.alert("Erro", errorMessage);
    }
  };

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      Alert.alert("Sucesso", "Você foi deslogado com sucesso.");
      navigation.reset({ index: 0, routes: [{ name: "Login" }] });
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
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
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
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações Pessoais</Text>
            <View style={styles.infoCard}>
              <InfoItem icon="person" label="Nome" value={user.name} />
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
              <TouchableOpacity style={styles.menuItem} onPress={handleEdit}>
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
          title="Alterar Senha"
          onConfirm={saveEdit}
        >
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNewPassword}
              placeholder="Digite a nova senha"
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => {
                console.log(
                  "Toggling new password visibility, estado atual:",
                  showNewPassword
                );
                setShowNewPassword(!showNewPassword);
              }}
            >
              <MaterialCommunityIcons
                name={showNewPassword ? "eye-off" : "eye"}
                size={24}
                color="#555"
              />
            </TouchableOpacity>
          </View>
        </CustomModal>
      </SafeAreaView>
    </ImageBackground>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <View style={styles.infoItem}>
    <MaterialIcons name={icon} size={22} color="#6200EE" />
    <View style={styles.infoTextContainer}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    padding: 5,
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
  },
});

export default TelaPerfil;