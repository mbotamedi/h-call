// src/services/apiService.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Configuração base do Axios
const api = axios.create({
  baseURL: "https://situation-songs-defend-hacker.trycloudflare.com/api",
  timeout: 10000,
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

// Interceptor para tratar respostas e erros globais
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem("jwt_token");
      throw new Error("Sessão expirada. Faça login novamente.");
    }
    const message =
      error.response?.data?.message ||
      "Falha na comunicação com o servidor. Tente novamente.";
    return Promise.reject(new Error(message));
  }
);

// Serviço de autenticação
export const AuthService = {
  login: async (email, password) => {
    try {
      const response = await api.post("/auth/enter", {
        email,
        password,
      });

      const data = response.data;
      if (data.status) {
        await AsyncStorage.setItem("jwt_token", data.data.token);
        return data.data;
      } else {
        throw new Error(data.message || "Erro ao realizar login.");
      }
    } catch (error) {
      throw new Error(error.message || "Falha na comunicação com o servidor.");
    }
  },

  getUserData: async () => {
    const userData = await AsyncStorage.getItem("user_data");
    return userData ? JSON.parse(userData) : null;
  },

  logout: async () => {
    await AsyncStorage.removeItem("jwt_token");
    await AsyncStorage.removeItem("user_data");
  },
};

// Serviço para gerenciar tickets
export const TicketService = {
  getTickets: async () => {
    try {
      const response = await api.get("/ticket/");
      const data = response.data;
      if (data.code === "success") {
        return data.data.tickets;
      } else {
        throw new Error(data.message || "Falha ao buscar os tickets.");
      }
    } catch (error) {
      throw new Error(error.message || "Erro ao conectar com o servidor.");
    }
  },

  getTicketById: async (ticketId) => {
    try {
      const response = await api.get("/ticket/details", {
        params: { id: ticketId },
      });
      const data = response.data;
      if (data.code === "success") {
        return data.data.ticket;
      } else {
        throw new Error(
          data.message || "Falha ao buscar os detalhes do ticket."
        );
      }
    } catch (error) {
      throw new Error(error.message || "Erro ao conectar com o servidor.");
    }
  },

  createTicket: async (ticketData) => {
    try {
      const response = await api.post("/ticket", ticketData);
      const data = response.data;
      if (data.status) {
        return data; // Retorna a resposta da API
      } else {
        throw new Error(data.message || "Falha ao criar o ticket.");
      }
    } catch (error) {
      throw new Error(error.message || "Erro ao conectar com o servidor.");
    }
  },
};

export default api;