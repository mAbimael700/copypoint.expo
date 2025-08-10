import {Tabs} from 'expo-router'
import {Ionicons} from '@expo/vector-icons'
import {BadgeDollarSign, House, SettingsIcon} from "lucide-react-native";

export default function AppLayout() {
    return (
        <Tabs screenOptions={{headerShown: false}}>
            <Tabs.Screen
                name="index" // Cambiado de "sales/index" a "index"
                options={{
                    title: "Home",
                    tabBarIcon: ({size, color}) => (
                        <House color={color} size={size} />
                    )
                }}
            />

            <Tabs.Screen
                name="sales/index"
                options={{
                    title: "Sales",
                    tabBarIcon: ({size, color}) => (
                        <BadgeDollarSign size={size} color={color}/>
                    )
                }}
            />

            <Tabs.Screen
                name="settings/index"
                options={{
                    title: "Settings",
                    tabBarIcon: ({size, color}) => (
                        <SettingsIcon size={size} color={color}/>
                    )
                }}
            />
        </Tabs>
    )
}