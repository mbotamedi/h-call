import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const FooterMenu = ({ navigation }) => {
  return (
    <View style={styles.footer}>
      {[
        { icon: "home", screen: "StatusChamado" },
        { icon: "add-circle", screen: "NovoChamado" },
        { icon: "person", screen: "TelaPerfil" },
      ].map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.footerButton}
          onPress={() => navigation.navigate(item.screen)}
        >
          <Icon name={item.icon} size={30} color="#007AFF" />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#eee",
  },
  footerButton: {
    padding: 10,
  },
});

export default FooterMenu;
