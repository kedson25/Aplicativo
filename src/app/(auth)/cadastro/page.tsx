import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import Colors from '@/constants/Colors';

export default function Cadastro() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSignUp = async () => {
        setLoading(true);
        setError('');
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await setDoc(doc(db, 'users', user.uid), {
                name,
                email,
            });
            console.log('Cadastro bem-sucedido!');
            router.push('home/home'); // Redireciona para a página "home"
        } catch (err) {
            console.error('Erro ao cadastrar:', err);
            setError('Erro ao cadastrar. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.logoText}>
                    Poly<Text style={{ color: Colors.purple }}>App</Text>
                </Text>
                <Text style={styles.slogan}>Welcome to Poly!</Text>
            </View>

            <View style={styles.form}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Nome</Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder="Digite seu nome..."
                        placeholderTextColor={Colors.darkGray}
                        style={styles.input}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Digite seu email..."
                        placeholderTextColor={Colors.darkGray}
                        style={styles.input}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Senha</Text>
                    <TextInput
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Digite sua senha..."
                        placeholderTextColor={Colors.darkGray}
                        style={styles.input}
                        secureTextEntry
                    />
                </View>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <Pressable style={styles.button} onPress={handleSignUp}>
                    {loading ? (
                        <ActivityIndicator size="small" color={Colors.white} />
                    ) : (
                        <Text style={styles.buttonText}>Cadastrar</Text>
                    )}
                </Pressable>
            </View>

            <View style={styles.linkContainer}>
                <Link href="/">
                    <Text style={{ color: Colors.white }}>Já possui uma conta? </Text>
                    <Text style={{ color: Colors.purple }}>Faça login</Text>
                </Link>
            </View>

            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 34,
        backgroundColor: Colors.zinc,
        justifyContent: 'center', // Centraliza o conteúdo na tela
        paddingLeft: 14,
        paddingRight: 14,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 23,
    },
    logoText: {
        fontSize: 34,
        fontWeight: 'bold',
        color: Colors.white,
        marginBottom: 0,
    },
    slogan: {
        fontSize: 16,
        color: Colors.white,
    },
    form: {
        paddingHorizontal: 20,
        paddingTop: 2,
        alignSelf: 'center', // Centraliza o formulário horizontalmente
        width: '100%',
        maxWidth: 400, // Limita a largura do formulário em telas grandes
    },
    inputContainer: {
        marginBottom: 3, // Margem ajustada para 3
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.white,
        marginBottom: 3, // Margem ajustada para 3
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: Colors.white,
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
        color: Colors.white,
        backgroundColor: Colors.black,
    },
    button: {
        backgroundColor: Colors.purple,
        borderRadius: 8,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
    linkContainer: {
        marginTop: 20,
        alignItems: 'center',
        color: Colors.white,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 10,
    },
});