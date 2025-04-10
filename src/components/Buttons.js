import React from "react";
import {
  TouchableOpacity,
  Text, // Certifique-se que Text está importado
  View,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Icon from "./Icon";

export const CustomButton = ({ title, onPress, iconName }) => {
  return (
    <TouchableOpacity style={styles.customButton} onPress={onPress}>
      <View style={styles.buttonContent}>
        {iconName && typeof iconName === "string" && (
          <Icon name={iconName} size={20} color="white" style={styles.icon} />
        )}
        {title && <Text style={styles.customButtonText}>{title}</Text>}
      </View>
    </TouchableOpacity>
  );
};

export const LogoutButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.logoutButton} onPress={onPress}>
      <MaterialIcons name="logout" size={20} color="#D32F2F" />
      <Text style={styles.logoutButtonText}>Sair da Conta</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  customButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 5,
    width: "80%",
    marginTop: 20,
  },
  buttonContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  customButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  icon: {
    marginRight: 10,
  },
  logoutButton: {
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
  logoutButtonText: {
    color: "#D32F2F",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default CustomButton;
