import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import Colors from '@/constants/Colors';
import ProtectedRoute from '../../components/ProtectedRoute';

const Home = () => {
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            const userDocRef = doc(db, 'users', user.uid);
            const unsubscribe = onSnapshot(userDocRef, (doc) => {
                if (doc.exists()) {
                    const userData = doc.data();
                    setUserName(userData.name);
                    setUserRole(userData.isAdmin ? 'Admin' : 'User');
                } else {
                    console.log('No such document!');
                }
                setLoading(false);
            }, (error) => {
                console.error('Erro ao buscar dados do usuário:', error);
                setLoading(false);
            });

            // Cleanup subscription on unmount
            return () => unsubscribe();
        } else {
            setLoading(false);
        }
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log('Deslogado com sucesso!');
            router.push('/'); // Redireciona para a página de login
        } catch (error) {
            console.error('Erro ao deslogar:', error);
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={Colors.purple} />
            </View>
        );
    }

    return (
        <ProtectedRoute>
            <View style={styles.container}>
                <Text style={styles.welcomeText}>Bem-vindo, {userName}!</Text>
                <Text style={styles.roleText}>Papel: {userRole}</Text>
                <Pressable style={styles.button} onPress={handleLogout}>
                    <Text style={styles.buttonText}>Deslogar</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={() => router.push('home/chat')}>
                    <Text style={styles.buttonText}>Ir para o Chat</Text>
                </Pressable>
            </View>
        </ProtectedRoute>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.zinc,
        padding: 20,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.white,
        marginBottom: 20,
    },
    roleText: {
        fontSize: 18,
        color: Colors.white,
        marginBottom: 20,
    },
    button: {
        backgroundColor: Colors.purple,
        borderRadius: 8,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        maxWidth: 200,
        marginTop: 10,
    },
    buttonText: {
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default Home;