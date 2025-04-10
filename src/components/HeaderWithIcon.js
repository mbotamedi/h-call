import React from "react";
import { View, Image, StyleSheet } from "react-native";
import Icon from "./Icon";

const HeaderWithIcon = ({ iconName, imageSource }) => {
  return (
    <View style={styles.container}>
      {iconName && (
        <Icon name={iconName} size={100} color="#007AFF" style={styles.icon} />
      )}
      {imageSource && (
        <Image source={imageSource} style={styles.image} resizeMode="contain" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 20,
  },
  icon: {
    marginBottom: 10,
  },
  image: {
    width: 150,
    height: 150,
  },
});

export default HeaderWithIcon;
