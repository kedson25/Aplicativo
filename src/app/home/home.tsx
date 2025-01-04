import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { getDoc, doc } from 'firebase/firestore';
import Colors from '@/constants/Colors';
import ProtectedRoute from '../../components/ProtectedRoute';

const Home = () => {
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        setUserName(userDoc.data().name);
                    } else {
                        console.log('No such document!');
                    }
                }
            } catch (error) {
                console.error('Erro ao buscar dados do usuário:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserName();
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
                <Pressable style={styles.button} onPress={handleLogout}>
                    <Text style={styles.buttonText}>Deslogar</Text>
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
    button: {
        backgroundColor: Colors.purple,
        borderRadius: 8,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        maxWidth: 200,
    },
    buttonText: {
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default Home;