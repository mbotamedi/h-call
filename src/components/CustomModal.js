import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const CustomModal = ({
  visible,
  onClose,
  title,
  children,
  confirmText = "Confirmar",
  onConfirm,
  cancelText = "Cancelar",
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Cabeçalho do Modal */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#6200EE" />
            </TouchableOpacity>
          </View>

          {/* Conteúdo do Modal (personalizável) */}
          <View style={styles.modalBody}>{children}</View>

          {/* Rodapé do Modal com botões */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.modalButtonText}>{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.confirmButton]}
              onPress={onConfirm}
            >
              <Text style={styles.modalButtonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  modalBody: {
    padding: 16,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
  },
  confirmButton: {
    backgroundColor: "#6200EE",
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CustomModal;
