import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DoctorAvailabilityScreen from "../screens/Availability";

const Stack = createNativeStackNavigator();

const MainNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Availability" 
        component={DoctorAvailabilityScreen} 
      />
    </Stack.Navigator>
  );
};

export default MainNavigation;