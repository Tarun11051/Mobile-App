import {NavigationContainer} from "@react-navigation/native";
import MainNavigation from "./src/navigation/MainNavigation";
import { StyleSheet, Alert } from "react-native";
import MyTab from "./src/navigation/ButtonTab";

export default function App() {
 
  return (
    <NavigationContainer>
      <MyTab />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131212'
  }
});
