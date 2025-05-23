import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Configuração base do Axios
const api = axios.create({
  baseURL: "http://192.168.173.200:7070/api",
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
      await AsyncStorage.removeItem("user_role");
      throw new Error("Sessão expirada. Faça login novamente.");
    }
    const message =
      error.response?.data?.message ||
      `Falha na comunicação com o servidor. Tente novamente. Detalhes: ${
        error.message || "Sem detalhes adicionais"
      } (Status: ${error.response?.status || "N/A"})`;
    return Promise.reject(new Error(message));
  }
);

// Serviço de autenticação
export const AuthService = {
  login: async (email, password) => {
    console.log(api);
    try {
      const response = await api.post("/auth/enter", {
        email,
        password,
      });

      const data = response.data;
      if (data.status) {
        await AsyncStorage.setItem("jwt_token", data.data.token);
        await AsyncStorage.setItem("user_role", data.data.user.role);
        await AsyncStorage.setItem(
          "user_data",
          JSON.stringify({
            email: data.data.user.email || email,
            name: data.data.user.name || email.split("@")[0],
            phone: data.data.user.phone || "",
          })
        );
        return data.data;
      } else {
        throw new Error(data.message || "Erro ao realizar login.");
      }
    } catch (error) {
      throw new Error(error.message || "Falha na comunicação com o servidor.");
    }
  },

  getUserProfile: async () => {
    try {
      const response = await api.get("/user");
      const data = response.data.data.user;
      console.log("Resposta do endpoint /user:", data); // Log da resposta
      if (data) {
        await AsyncStorage.setItem(
          "user_data",
          JSON.stringify({
            email: data.email,
            name: data.name,
            phone: data.phone || "",
          })
        );
        console.log("Dados salvos no AsyncStorage:", {
          email: data.email,
          name: data.name,
          phone: data.phone || "",
        }); // Log dos dados salvos
        await AsyncStorage.setItem("user_role", data.role);
        return data;
      } else {
        throw new Error("Falha ao buscar dados do usuário.");
      }
    } catch (error) {
      console.error("Erro em getUserProfile:", error.message); // Log do erro
      throw new Error(error.message || "Erro ao conectar com o servidor.");
    }
  },

  getUserData: async () => {
    const userData = await AsyncStorage.getItem("user_data");
    return userData ? JSON.parse(userData) : null;
  },

  logout: async () => {
    await AsyncStorage.removeItem("jwt_token");
    await AsyncStorage.removeItem("user_data");
    await AsyncStorage.removeItem("user_role");
  },

  getUserRole: async () => {
    try {
      const role = await AsyncStorage.getItem("user_role");
      if (!role) {
        throw new Error("Nenhuma role encontrada. Faça login novamente.");
      }
      return role;
    } catch (error) {
      throw new Error(error.message || "Erro ao obter a role do usuário.");
    }
  },

  updateUserProfile: async (newPassword) => {
    try {
      const response = await api.patch("/self/" + newPassword);
      const data = response.data;
      if (data.status) {
        return data;
      } else {
        throw new Error(data.message || "Falha ao atualizar a senha.");
      }
    } catch (error) {
      throw new Error(error.message || "Erro ao conectar com o servidor.");
    }
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
      console.error("Erro na requisição getTicketById:", error.message);
      return null;
    }
  },

  createTicket: async (ticketData) => {
    try {
      const response = await api.post("/ticket/", ticketData);
      const data = response.data;
      if (data.status) {
        return data;
      } else {
        throw new Error(data.message || "Falha ao criar o ticket.");
      }
    } catch (error) {
      throw new Error(error.message || "Erro ao conectar com o servidor.");
    }
  },
};

export default api;
