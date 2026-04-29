import { NavigationContainer } from "@react-navigation/native";
// Remove these two unused lines:
// import MainNavigation from "./src/navigation/MainNavigation";
// import { StyleSheet, Alert } from "react-native";
import MyTab from "./src/navigation/ButtonTab";

export default function App() {
  return (
    <NavigationContainer>
      <MyTab />
    </NavigationContainer>
  );
}