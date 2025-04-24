// src/services/apiService.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Configuração base do Axios
const api = axios.create({
  baseURL: "https://managers-mason-hints-jesse.trycloudflare.com/api", // Substitua pela URL da sua API
  timeout: 10000, // 10 segundos de timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar o token JWT automaticamente
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("jwt_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Funções específicas da API
export const AuthService = {
  login: async (email, password) => {
    try {
      let response = await api.post("/auth/enter", {
        user_email: email,
        user_password: password,
      });

      response = response.data;
      if (response.status) {
        await AsyncStorage.setItem("jwt_token", response.data.token);
        return response.data;
      } else {
        throw new Error(response.data.message || "Erro no login");
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Falha na comunicação com o servidor"
      );
    }
  },
  // Adicione esta função para obter os dados do usuário
  getUserData: async () => {
    const userData = await AsyncStorage.getItem("user_data");
    return userData ? JSON.parse(userData) : null;
  },
};

// Para outras requisições autenticadas no futuro
export default api;
