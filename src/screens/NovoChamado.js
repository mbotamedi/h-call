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
import * as ImageManipulator from "expo-image-manipulator";
import FooterMenu from "../components/FooterMenu";
import { TicketService, AuthService } from "../route/apiService";

const backgroundImage = require("../../assets/images/login-bg.jpg");

const NovoChamado = ({ navigation }) => {
  const [requisitor, setRequisitor] = useState("");
  const [equipamento, setEquipamento] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [referencia, setReferencia] = useState("");
  const [descricao, setDescricao] = useState("");
  const [anexos, setAnexos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);
  const [cameraPermission, requestCameraPermission] =
    ImagePicker.useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] =
    ImagePicker.useMediaLibraryPermissions();

  const MAX_ANEXOS = 5;
  const MAX_FILE_SIZE_MB = 5;

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
      setIsLoadingUserData(true);
      try {
        const role = await AuthService.getUserRole();
        if (!role) {
          throw new Error("Sessão expirada. Faça login novamente.");
        }
        setUserRole(role);

        const userData = await AuthService.getUserData();
        if (userData && userData.name) {
          setRequisitor(userData.name);
        } else {
          throw new Error("Dados do usuário não encontrados.");
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error.message);
        Alert.alert(
          "Erro de Autenticação",
          error.message || "Sessão expirada. Faça login novamente.",
          [
            {
              text: "OK",
              onPress: () => {
                AuthService.logout();
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Login" }],
                });
              },
            },
          ]
        );
      } finally {
        setIsLoadingUserData(false);
      }
    };
    fetchUserData();
  }, [navigation]);

  const selecionarAnexo = async (tipo) => {
    if (anexos.length >= MAX_ANEXOS) {
      Alert.alert(
        "Limite atingido",
        `Você pode anexar no máximo ${MAX_ANEXOS} arquivos.`
      );
      return;
    }

    try {
      let result;

      if (tipo === "camera") {
        if (!cameraPermission?.granted) {
          const { status } = await requestCameraPermission();
          if (status !== "granted") {
            Alert.alert(
              "Permissão negada",
              "Permita o acesso à câmera para continuar."
            );
            return;
          }
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ["images"],
          allowsEditing: false,
          aspect: [4, 3],
          quality: 0.8,
        });
      } else if (tipo === "galeria") {
        if (!mediaLibraryPermission?.granted) {
          const { status } = await requestMediaLibraryPermission();
          if (status !== "granted") {
            Alert.alert(
              "Permissão negada",
              "Permita o acesso à galeria para continuar."
            );
            return;
          }
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: false,
          aspect: [4, 3],
          quality: 0.8,
        });
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
      }

      if (!result.canceled && result.assets && result.assets.length > 0) {
        let uri = result.assets[0].uri;
        let tipoAnexo = tipo === "arquivo" ? "file" : "image";

        if (tipoAnexo === "image") {
          const manipResult = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: 600 } }],
            { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
          );
          uri = manipResult.uri;
        }

        const fileInfo = await FileSystem.getInfoAsync(uri);
        const fileSizeMB = fileInfo.size / (1024 * 1024);
        if (fileSizeMB > MAX_FILE_SIZE_MB) {
          Alert.alert(
            "Erro",
            `O arquivo excede o tamanho máximo de ${MAX_FILE_SIZE_MB}MB.`
          );
          return;
        }

        setAnexos([...anexos, { uri, tipo: tipoAnexo }]);
      }
    } catch (error) {
      console.error("Erro ao selecionar anexo:", error.message, error.stack);
      Alert.alert("Erro", "Falha ao processar o anexo. Tente novamente.");
    }
  };

  const removerAnexo = (index) => {
    setAnexos(anexos.filter((_, i) => i !== index));
  };

  const renderAnexo = () => {
    if (anexos.length === 0) return null;

    return (
      <View style={styles.anexosContainer}>
        {anexos.map((anexo, index) => (
          <View key={index} style={styles.anexoItem}>
            {anexo.tipo === "image" ? (
              <Image source={{ uri: anexo.uri }} style={styles.anexoPreview} />
            ) : (
              <View style={styles.arquivoContainer}>
                <Icon name="insert-drive-file" size={40} color="#007AFF" />
                <Text
                  style={styles.arquivoNome}
                  numberOfLines={1}
                  ellipsizeMode="middle"
                >
                  {anexo.uri.split("/").pop().length > 20
                    ? `${anexo.uri
                        .split("/")
                        .pop()
                        .substring(0, 10)}...${anexo.uri
                        .split("/")
                        .pop()
                        .substring(anexo.uri.split("/").pop().length - 7)}`
                    : anexo.uri.split("/").pop()}
                </Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.removerButton}
              onPress={() => removerAnexo(index)}
            >
              <Icon name="close" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  const convertFileToBase64 = async (uri, tipo) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      const fileSizeMB = fileInfo.size / (1024 * 1024);
      if (fileSizeMB > MAX_FILE_SIZE_MB) {
        throw new Error(
          `O arquivo excede o tamanho máximo de ${MAX_FILE_SIZE_MB}MB.`
        );
      }

      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const fileName = uri.split("/").pop().toLowerCase();
      let mimeType;

      if (tipo === "image") {
        mimeType = fileName.endsWith(".png") ? "image/png" : "image/jpeg";
      } else {
        if (fileName.endsWith(".pdf")) mimeType = "application/pdf";
        else if (fileName.endsWith(".doc")) mimeType = "application/msword";
        else if (fileName.endsWith(".docx"))
          mimeType =
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        else if (fileName.endsWith(".xls"))
          mimeType = "application/vnd.ms-excel";
        else if (fileName.endsWith(".xlsx"))
          mimeType =
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        else throw new Error("Tipo de arquivo não suportado.");
      }

      return {
        name: fileName,
        content: `data:${mimeType};base64,${base64}`,
        ...(tipo === "image" ? { type: mimeType } : { file_type: mimeType }),
      };
    } catch (error) {
      console.error("Erro ao converter arquivo para base64:", error.message);
      throw error;
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
        explain: descricao,
        item: equipamento,
        reference: referencia || "Sem referência",
        department: departamento,
        images: [],
        attachments: [],
      };

      if (anexos.length > 0) {
        for (const anexo of anexos) {
          const convertedFile = await convertFileToBase64(
            anexo.uri,
            anexo.tipo
          );
          if (anexo.tipo === "image") {
            ticketData.images.push({
              name: convertedFile.name,
              content: convertedFile.content,
              type: convertedFile.type,
            });
          } else {
            ticketData.attachments.push({
              name: convertedFile.name,
              content: convertedFile.content,
              file_type: convertedFile.file_type,
            });
          }
        }
      }

      await TicketService.createTicket(ticketData);

      Alert.alert("Sucesso", "Chamado criado com sucesso!", [
        { text: "OK", onPress: () => navigation.navigate("StatusChamado") },
      ]);
    } catch (error) {
      console.error("Erro ao criar o ticket:", error.message);
      Alert.alert(
        "Erro",
        error.message ||
          "Falha ao criar o ticket. Verifique os dados e tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingUserData) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator
          size="large"
          color="#007AFF"
          style={styles.loading}
        />
      </SafeAreaView>
    );
  }

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
              editable={true}
              selectTextOnFocus={true}
            />

            <Text style={styles.label}>Equipamento:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={equipamento}
                onValueChange={setEquipamento}
              >
                <Picker.Item label="Selecione um equipamento" value="" />
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
                <Picker.Item label="Selecione um departamento" value="" />
                {departamentos.map((item, index) => (
                  <Picker.Item key={index} label={item} value={item} />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Referência (Opcional):</Text>
            <TextInput
              style={styles.input}
              value={referencia}
              onChangeText={setReferencia}
              placeholder="Referência do chamado"
            />

            <Text style={styles.label}>Descrição:</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={descricao}
              onChangeText={setDescricao}
              placeholder="Descreva o problema"
              multiline
              numberOfLines={4}
            />

            <Text style={styles.label}>Anexos (máximo {MAX_ANEXOS}):</Text>
            <View style={styles.anexoButtons}>
              <TouchableOpacity
                style={styles.anexoButton}
                onPress={() => selecionarAnexo("camera")}
              >
                <Icon name="camera-alt" size={24} color="#fff" />
                <Text style={styles.anexoButtonText}>Câmera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.anexoButton}
                onPress={() => selecionarAnexo("galeria")}
              >
                <Icon name="photo-library" size={24} color="#fff" />
                <Text style={styles.anexoButtonText}>Galeria</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.anexoButton}
                onPress={() => selecionarAnexo("arquivo")}
              >
                <Icon name="attach-file" size={24} color="#fff" />
                <Text style={styles.anexoButtonText}>Arquivo</Text>
              </TouchableOpacity>
            </View>

            {renderAnexo()}

            <TouchableOpacity
              style={[
                styles.submitButton,
                loading && styles.submitButtonDisabled,
              ]}
              onPress={enviarChamado}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Enviar Chamado</Text>
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
  container: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  contentContainer: {
    padding: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    color: "#000000",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 15,
  },
  anexoButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  anexoButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    marginHorizontal: 5,
    flexDirection: "row",
    justifyContent: "center",
  },
  anexoButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 5,
  },
  anexosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  anexoItem: {
    width: 100,
    height: 100,
    marginRight: 10,
    marginBottom: 10,
    position: "relative",
  },
  anexoPreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  arquivoContainer: {
    width: 100,
    height: 100,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  arquivoNome: {
    fontSize: 12,
    color: "#333",
    textAlign: "center",
    marginTop: 5,
  },
  removerButton: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "#FF3B30",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#aaa",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default NovoChamado;