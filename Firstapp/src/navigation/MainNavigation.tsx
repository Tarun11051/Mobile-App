import { createStackNavigator } from "@react-navigation/stack";
import GreenScreen from "../screens/GreenScreen";
import YellowScreen from "../screens/YellowScreen";
import GoldScreen from "../screens/GoldScreen";
import PatientProfileScreen from "../screens/PatientProfileScreen";

const Stack = createStackNavigator();
const MainNavigation = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="GreenScreen" component={GreenScreen} />
            <Stack.Screen name="YellowScreen" component={YellowScreen} />
            <Stack.Screen name="GoldScreen" component={GoldScreen} />
            <Stack.Screen name="PatientProfile" component={PatientProfileScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

export default MainNavigation;