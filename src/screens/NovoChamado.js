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
  ActivityIndicator,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import FooterMenu from "../components/FooterMenu";
import { TicketService, AuthService } from "../route/apiService";

const backgroundImage = require("../../assets/images/login-bg.jpg");

const NovoChamado = ({ navigation }) => {
  const [requisitor, setRequisitor] = useState("");
  const [equipamento, setEquipamento] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [referencia, setReferencia] = useState("");
  const [descricao, setDescricao] = useState("");
  const [anexo, setAnexo] = useState(null);
  const [tipoAnexo, setTipoAnexo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const equipamentos = [
    "NoteBook",
    "Desktop",
    "Impressora",
    "Telefone",
    "Projetor",
    "TV",
    "Camera",
    "Outros",
  ];

  const departamentos = [
    "Diretoria",
    "Administrativo",
    "Secretaria",
    "Sala dos Professores",
    "TI",
    "Lab01",
    "Lab02",
    "Lab03",
    "Lab04",
    "Lab05",
    "Lab06",
    "Lab07",
    "Sala01",
    "Sala02",
    "Sala03",
    "Sala04",
    "Sala05",
    "Sala06",
    "Sala07",
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const role = await AuthService.getUserRole();
        setUserRole(role);
        AuthService.getUserData;
        const userData = await AuthService.getUserData();
        if (userData && userData.name) {
          setRequisitor(userData.name); // Preenche o requisitor com o nome do usuário
        } else {
          throw new Error("Dados do usuário não encontrados.");
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
        Alert.alert(
          "Erro",
          "Não foi possível carregar os dados do usuário. Faça login novamente.",
          [{ text: "OK", onPress: () => navigation.navigate("Login") }]
        );
      }
    };
    fetchUserData();
  }, [navigation]);

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

        if (!result.canceled && result.assets && result.assets.length > 0) {
          setAnexo(result.assets[0].uri);
          setTipoAnexo("file");
        }
      }
    } catch (error) {
      console.error("Erro ao selecionar anexo:", error);
      Alert.alert(
        "Erro",
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

  const convertImageToBase64 = async (uri) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      const fileSizeMB = fileInfo.size / (1024 * 1024);
      if (fileSizeMB > 5) {
        throw new Error("A imagem excede o tamanho máximo de 5MB.");
      }

      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      console.error("Erro ao converter imagem para base64:", error);
      throw new Error(
        error.message || "Falha ao converter a imagem para base64."
      );
    }
  };

  const enviarChamado = async () => {
    if (!requisitor || !equipamento || !departamento || !descricao) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (!userRole) {
      Alert.alert(
        "Erro",
        "Permissões do usuário não carregadas. Tente novamente."
      );
      return;
    }
    if (userRole === "admin") {
      Alert.alert(
        "Erro",
        "Usuários com a role 'admin' não podem criar tickets."
      );
      return;
    }
    if (userRole !== "user" && userRole !== "master") {
      Alert.alert(
        "Erro",
        "Apenas usuários com role 'user' ou 'master' podem criar tickets."
      );
      return;
    }

    setLoading(true);
    try {
      let ticketData = {
        name: requisitor,
        item: equipamento,
        department: departamento,
        reference: referencia || "Sem referência",
        explain: descricao,
        images: [],
      };

      if (anexo && tipoAnexo === "image") {
        const base64Image = await convertImageToBase64(anexo);
        const fileName = anexo.split("/").pop();
        const imageType = fileName.toLowerCase().endsWith(".png")
          ? "image/png"
          : "image/jpeg";

        ticketData.images = [
          {
            image_name: fileName,
            image_content: base64Image,
            image_type: imageType,
          },
        ];
      } else if (anexo && tipoAnexo === "file") {
        Alert.alert(
          "Aviso",
          "A API não suporta anexos de arquivos (PDF, DOC, XLS). Apenas imagens são permitidas."
        );
        setLoading(false);
        return;
      }

      console.log(
        "Dados enviados para a API:",
        JSON.stringify(ticketData, null, 2)
      );

      await TicketService.createTicket(ticketData);

      Alert.alert("Sucesso", "Chamado criado com sucesso!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Erro ao criar o ticket:", error.message);
      Alert.alert("Erro", error.message || "Falha ao criar o ticket.");
    } finally {
      setLoading(false);
    }
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
              editable={true} // Alterado para permitir edição
              selectTextOnFocus={true} // Alterado para permitir seleção
            />

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
              style={[
                styles.enviarButton,
                loading && styles.enviarButtonDisabled,
              ]}
              onPress={enviarChamado}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.enviarText}>ENVIAR CHAMADO</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  enviarButtonDisabled: {
    backgroundColor: "#99C9FF",
  },
  enviarText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default NovoChamado;