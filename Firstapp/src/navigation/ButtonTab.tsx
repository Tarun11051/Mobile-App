import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import GreenScreen from '../screens/GreenScreen';
import YellowScreen from '../screens/YellowScreen';
import GoldScreen from '../screens/GoldScreen';
import PatientProfileScreen from '../screens/PatientProfileScreen';

const Tab = createBottomTabNavigator();

export default function ButtonTab () {
    return (
        <Tab.Navigator>
            <Tab.Screen name="GreenScreen" component={GreenScreen} />
            <Tab.Screen name="YellowScreen" component={YellowScreen} />
            <Tab.Screen name="PatientProfileScreen" component={PatientProfileScreen} />
        </Tab.Navigator>
    );
};
