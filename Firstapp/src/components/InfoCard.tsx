import React from "react";
import { View, Text, StyleSheet } from "react-native";

const InfoCard = ({ title, children }: any) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
};

export default InfoCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});