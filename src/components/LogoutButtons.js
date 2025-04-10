import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const LogoutButton = ({ onPress, navigation }) => {
  const handleLogout = () => {
    if (onPress) onPress(); // Chama a função personalizada se existir
    navigation.navigate("Login"); // Navega para a tela de Login
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleLogout}>
      <MaterialIcons name="logout" size={20} color="#D32F2F" />
      <Text style={styles.buttonText}>Sair da Conta</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 10,
    elevation: 2,
    marginTop: 20,
  },
  buttonText: {
    color: "#D32F2F",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default LogoutButton;
