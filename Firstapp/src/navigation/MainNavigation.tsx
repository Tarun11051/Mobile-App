import { createStackNavigator } from "@react-navigation/stack";
import GreenScreen from "../screens/GreenScreen";
import YellowScreen from "../screens/YellowScreen";
import GoldScreen from "../screens/GoldScreen";

import DoctorAvailabilityScreen from "../screens/Availability";

const Stack = createStackNavigator();
const MainNavigation = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="GreenScreen" component={GreenScreen} />
            <Stack.Screen name="YellowScreen" component={YellowScreen} />
            <Stack.Screen name="GoldScreen" component={GoldScreen} />
            
            <Stack.Screen name="Availability" component={DoctorAvailabilityScreen} />
        </Stack.Navigator>
    );
};

export default MainNavigation;