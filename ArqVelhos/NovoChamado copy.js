import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image,
  ImageBackground,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
//import AsyncStorage from "@react-native-async-storage/async-storage";
import FooterMenu from "../components/FooterMenu"; // Importe o novo componente

const backgroundImage = require("../../assets/images/login-bg.jpg");

const NovoChamado = ({ navigation }) => {
  const [requisitor, setRequisitor] = useState("");
  const [equipamento, setEquipamento] = useState("NoteBook");
  const [departamento, setDepartamento] = useState("Diretoria");
  const [referencia, setReferencia] = useState("");
  const [descricao, setDescricao] = useState("");
  const [anexo, setAnexo] = useState(null);
  const [tipoAnexo, setTipoAnexo] = useState(null);
  const equipamentos = [
    "NoteBook",
    "Desktop",
    "Impressora",
    "Telefone",
    "Projetor",
    "Outros",
  ];

  const departamentos = [
    "Diretoria",
    "Administrativo",
    "Financeiro",
    "RH",
    "TI",
    "Marketing",
    "Vendas",
    "Operações",
  ];

  const selecionarAnexo = async (tipo) => {
    try {
      let result;

      if (tipo === "camera") {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });

        if (!result.canceled) {
          setAnexo(result.assets[0].uri);
          setTipoAnexo("image");
        }
      } else if (tipo === "galeria") {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });

        if (!result.canceled) {
          setAnexo(result.assets[0].uri);
          setTipoAnexo("image");
        }
      } else if (tipo === "arquivo") {
        result = await DocumentPicker.getDocumentAsync({
          type: [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          ],
          copyToCacheDirectory: true,
        });

        if (result.type === "success") {
          setAnexo(result.uri);
          setTipoAnexo("file");
        }
      }
    } catch (error) {
      console.error("Erro ao selecionar anexo:", error);
      alert(
        "Erro ao selecionar o arquivo. Por favor, selecione um tipo válido (PDF, DOC, XLS)."
      );
    }
  };

  const renderAnexo = () => {
    if (!anexo) return null;

    if (tipoAnexo === "image") {
      return <Image source={{ uri: anexo }} style={styles.anexoPreview} />;
    } else {
      const fileName = anexo.split("/").pop();
      return (
        <View style={styles.arquivoContainer}>
          <Icon name="insert-drive-file" size={40} color="#007AFF" />
          <Text
            style={styles.arquivoNome}
            numberOfLines={1}
            ellipsizeMode="middle"
          >
            {fileName.length > 20
              ? `${fileName.substring(0, 10)}...${fileName.substring(
                  fileName.length - 7
                )}`
              : fileName}
          </Text>
        </View>
      );
    }
  };

  const enviarChamado = () => {
    const chamadoData = {
      requisitor,
      equipamento,
      departamento,
      referencia,
      descricao,
      anexo,
      tipoAnexo,
    };

    console.log("Dados do chamado:", chamadoData);
    alert("Chamado enviado com sucesso!");
    navigation.goBack();
  };

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#1976D2" barStyle="light-content" />
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          style={styles.scrollView}
        >
          <View style={styles.contentContainer}>
            <Text style={styles.titulo}>Abertura de Chamado</Text>

            <Text style={styles.label}>Requisitor:</Text>
            <TextInput
              style={styles.input}
              value={requisitor}
              onChangeText={setRequisitor}
              placeholder="Nome do requisitor"
              editable={requisitor === ""} // Só permite editar se estiver vazio
              selectTextOnFocus={requisitor === ""}
            />

            {/* Restante do formulário permanece igual */}
            <Text style={styles.label}>Equipamento:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={equipamento}
                onValueChange={setEquipamento}
              >
                {equipamentos.map((item, index) => (
                  <Picker.Item key={index} label={item} value={item} />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Departamento:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={departamento}
                onValueChange={setDepartamento}
              >
                {departamentos.map((item, index) => (
                  <Picker.Item key={index} label={item} value={item} />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Referência:</Text>
            <TextInput
              style={styles.input}
              value={referencia}
              onChangeText={setReferencia}
              placeholder="Número de patrimônio ou identificação"
            />

            <Text style={styles.label}>Descrição do Chamado:</Text>
            <TextInput
              style={[styles.input, styles.descricaoInput]}
              value={descricao}
              onChangeText={setDescricao}
              placeholder="Descreva o problema detalhadamente"
              multiline
              numberOfLines={4}
            />

            <Text style={styles.label}>Anexo:</Text>
            <View style={styles.anexoButtonsContainer}>
              <TouchableOpacity
                style={styles.anexoButton}
                onPress={() => selecionarAnexo("camera")}
              >
                <Icon name="photo-camera" size={24} color="#007AFF" />
                <Text style={styles.anexoButtonText}>Câmera</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.anexoButton}
                onPress={() => selecionarAnexo("galeria")}
              >
                <Icon name="photo-library" size={24} color="#007AFF" />
                <Text style={styles.anexoButtonText}>Galeria</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.anexoButton}
                onPress={() => selecionarAnexo("arquivo")}
              >
                <Icon name="attach-file" size={24} color="#007AFF" />
                <Text style={styles.anexoButtonText}>Arquivo</Text>
              </TouchableOpacity>
            </View>

            {renderAnexo()}

            <TouchableOpacity
              style={styles.enviarButton}
              onPress={enviarChamado}
            >
              <Text style={styles.enviarText}>ENVIAR CHAMADO</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        {/* Menu inferior - agora usando o componente separado */}
        <FooterMenu navigation={navigation} />
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    backgroundColor: "rgba(245, 245, 245, 0.9)",
    borderRadius: 10,
    padding: 20,
    margin: 10,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#555",
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  descricaoInput: {
    height: 100,
    textAlignVertical: "top",
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 15,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  anexoButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  anexoButton: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 5,
  },
  anexoButtonText: {
    color: "#007AFF",
    marginTop: 5,
    fontSize: 12,
  },
  anexoPreview: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginBottom: 15,
    backgroundColor: "#eee",
    borderRadius: 5,
  },
  arquivoContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    marginBottom: 15,
  },
  arquivoNome: {
    marginTop: 10,
    color: "#555",
    fontSize: 14,
  },
  enviarButton: {
    backgroundColor: "#007AFF",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  enviarText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  footerButton: {
    alignItems: "center",
  },
});

export default NovoChamado;
