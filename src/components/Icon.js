import React from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const Icon = ({ name, size = 24, color = "#228B22", style }) => {
  return <MaterialIcons name={name} size={size} color={color} style={style} />;
};

export default Icon;
