import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import Icon from "./Icon";

const Input = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  iconName,
  rightIcon,
}) => {
  return (
    <View style={styles.container}>
      {iconName && (
        <Icon name={iconName} size={20} color="#666" style={styles.icon} />
      )}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />
      {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    height: 50,
  },
  input: {
    flex: 1,
    height: "100%",
    paddingLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
  rightIcon: {
    marginLeft: 10,
  },
});

export default Input;
