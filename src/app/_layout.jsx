import { Stack } from 'expo-router/stack';

export default function Layout() {
    return (


        <Stack>
            {/* <Stack.Screen name="index" options={{ headerShown: false }} /> */}
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            {/* <Stack.Screen name="horario" options={{ headerShown: true }} />
            <Stack.Screen name="Profissional" options={{ headerShown: true }} /> */}

        </Stack>

    );
}
