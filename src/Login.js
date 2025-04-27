import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Alert,
  ActivityIndicator,
} from "react-native";
import Input from "./components/Input";
import CustomButton from "./components/Buttons";
import HeaderWithIcon from "./components/HeaderWithIcon";
import Icon from "./components/Icon";
import { AuthService } from "./route/apiService";

const backgroundImage = require("../assets/images/login-bg.jpg");

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Erro", "Por favor, insira um e-mail válido");
      return;
    }

    setLoading(true);

    try {
      const response = await AuthService.login(email, password);
      let name = response.user.name; // Atualiza o estado com o nome do usuário
      /*if ((name = "")) {
        name = "Usuario não encontra";
      }*/
      Alert.alert(
        "Bem-vindo!",
        `Olá, ${name}! Seu login foi realizado com sucesso.`
      );
      navigation.navigate("StatusChamado");
    } catch (error) {
      Alert.alert("Erro", error.message || "Ocorreu um erro durante o login");
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <HeaderWithIcon
          //iconName="notifications-active"
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
            autoCorrect={false}
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

          <View style={styles.buttonContainer}>
            {loading ? (
              <ActivityIndicator
                size="large"
                color="#0066cc"
                style={styles.loading}
              />
            ) : (
              <CustomButton
                title="Entrar"
                onPress={handleLogin}
                iconName="login"
                style={styles.loginButton}
              />
            )}
          </View>

          {/*<TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
          </TouchableOpacity>*/}
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

  buttonContainer: {
    alignItems: "center", // Centraliza horizontalmente
    width: "100%", // Garante que o contêiner ocupe a largura total
    paddingHorizontal: 20, // Espaçamento lateral opcional
  },
  loginButton: {
    marginTop: 30,
    width: 200, // Largura fixa para o botão (ajuste conforme necessário)
    backgroundColor: "#0066cc",
    alignSelf: "center", // Reforça a centralização
  },
  loading: {
    marginTop: 30,
    alignSelf: "center", // Centraliza o indicador
  },
  forgotPassword: {
    marginTop: 15,
    alignSelf: "flex-end",
  },
  forgotPasswordText: {
    color: "#0066cc",
    fontSize: 14,
  },
});

export default Login;
