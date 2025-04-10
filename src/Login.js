import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from "react-native";
import Input from "./components/Input";
import CustomButton from "./components/Buttons";
import HeaderWithIcon from "./components/HeaderWithIcon";
import Icon from "./components/Icon";

// Importe sua imagem (ajuste o caminho conforme necessário)
const backgroundImage = require("../assets/images/login-bg.jpg");

const Login = ({ navigation }) => {
  // Receba a prop navigation
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (email && password) {
      Alert.alert("Sucesso", "Login realizado com sucesso");
      navigation.navigate("StatusChamado"); // Navega para a tela de Status
    } else {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
    }
  };

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <HeaderWithIcon
          iconName="notifications-active" // Ícone de sirene
          imageSource={require("../assets/images/logo.png")}
        />

        <Text style={styles.title}>Abertura de Chamados</Text>
        <Text style={styles.subtitle}>Acesse sua conta</Text>

        <View style={styles.formContainer}>
          <Input
            placeholder="Digite seu e-mail"
            value={email}
            onChangeText={setEmail}
            iconName="email"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            placeholder="Digite sua senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            iconName="lock"
            rightIcon={
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
              >
                <Icon
                  name={showPassword ? "visibility" : "visibility-off"}
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>
            }
          />

          <CustomButton
            title="Entrar"
            onPress={handleLogin}
            iconName="login"
            style={styles.loginButton}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
  },
  loginButton: {
    marginTop: 30,
    width: "100%",
  },
});

export default Login;
