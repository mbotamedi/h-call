import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./src/Login";
import StatusChamado from "./src/screens/StatusChamado";
import NovoChamado from "./src/screens/NovoChamado";
import DetalhesChamados from "./src/screens/DetalhesChamados";
import TelaPerfil from "./src/screens/TelaPerfil";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="StatusChamado"
          component={StatusChamado}
          options={{ title: "Status dos Chamados" }}
        />
        <Stack.Screen
          name="NovoChamado"
          component={NovoChamado}
          options={{ title: "Novo Chamado" }}
        />
        <Stack.Screen
          name="DetalhesChamados"
          component={DetalhesChamados}
          options={{ title: "Detalhes Chamados" }}
        />
        <Stack.Screen
          name="TelaPerfil"
          component={TelaPerfil}
          options={{ title: "Tela Perfil" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
