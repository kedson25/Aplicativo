import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';

export default function MainLayout() {
    return (
        <AuthProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="home/home" />
                <Stack.Screen name="home/chat" />
                <Stack.Screen name="(auth)/cadastro/page" />
                <Stack.Screen name="(painel)/profile/page" />
            </Stack>
        </AuthProvider>
    );
}