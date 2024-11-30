import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
export default function TabLayout() {
    async function handleLogout() {
        try {
            // Limpa os dados do AsyncStorage
            await AsyncStorage.removeItem("my-key");
            console.log("Usuário deslogado com sucesso.");

            // Redireciona para a tela de login
            router.push('/');
        } catch (error) {
            console.error("Erro ao deslogar: ", error);
        }
    }

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#27A4FE',
                headerRight: () => (
                    <TouchableOpacity
                        onPress={handleLogout}
                        style={{
                            marginRight: 15,
                            padding: 5,
                            backgroundColor: '#fff',
                            borderRadius: 8,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.2,
                            shadowRadius: 4,
                            elevation: 1,
                        }}
                    >
                        <AntDesign name="logout" size={20} color="black" />
                    </TouchableOpacity>
                ),
                headerStyle: {
                    backgroundColor: '#f5f5f5',
                },
                headerTitleStyle: {
                    fontWeight: 'bold',
                    fontSize: 18,
                },
            }}
        >
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => <FontAwesome6 size={20} name="user-large" color={color} />,
                }}
            />
            <Tabs.Screen
                name="new"
                options={{
                    title: 'Agendar',
                    tabBarIcon: ({ color }) => <Ionicons name="add-circle" size={30} color={color} />,
                }}
            />
            <Tabs.Screen
                name="agendamentos"
                options={{
                    title: 'Agendamentos',
                    tabBarIcon: ({ color }) => <FontAwesome6 size={20} name="table-list" color={color} />,
                }}
            />
            {/* <Tabs.Screen
                name="horario"
                options={{
                    title: 'horarios',
                    tabBarIcon: ({ color }) => <MaterialCommunityIcons name="calendar-clock" size={24} color={color} />,
                }}
            /> */}

        </Tabs>
    );
}
