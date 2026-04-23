import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import GreenScreen from '../screens/GreenScreen';
import DoctorAvailabilityScreen from '../screens/Availability';
import DoctorsProfile from '../screens/DoctorsProfile';
import BookingScreen from '../screens/Booking';
import { createStackNavigator } from '@react-navigation/stack';
const Tab = createBottomTabNavigator();
const AvailabilityStack = createStackNavigator();

const AvailabilityStackNavigator = () => {
    return (
        <AvailabilityStack.Navigator>
            <AvailabilityStack.Screen
                name="DoctorsProfile"
                component={(props: any) => <DoctorsProfile {...props} />}
                options={{ headerShown: false }}
            />
            <AvailabilityStack.Screen
                name="AvailabilityDetails"
                component={(props: any) => <DoctorAvailabilityScreen {...props} />}
                options={{ title: "Availability" }}
            />
            <AvailabilityStack.Screen
                name="Booking"
                component={(props: any) => <BookingScreen {...props} />}
                options={{ title: "Booking" }}
            />
        </AvailabilityStack.Navigator>
    );
};

export default function ButtonTab () {
    return (
        <Tab.Navigator>
            <Tab.Screen name="GreenScreen" component={GreenScreen} />
            <Tab.Screen name="Doctors" component={AvailabilityStackNavigator} />
           
        </Tab.Navigator>
    );
};
