import { Stack, Link, useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { View, Text, StyleSheet, TextInput, Pressable, ActivityIndicator } from 'react-native';
import SocialLoginButtons from '../app/SocialLoginButtons'; // Importe o novo componente
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function Login() {
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState(''); 
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        setLoading(true); // Inicia o carregamento
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log('Login bem-sucedido!');
            router.push('home/home'); // Redireciona para a página "home"
        } catch (err) {
            console.error('Erro ao fazer login:', err);
            setError('Email ou senha incorretos.');
        } finally {
            setLoading(false); // Finaliza o carregamento
        }
    };

    // Função de login do Google
    const handleGoogleLogin = () => {
        console.log('Google login clicado!');
        // Aqui você pode adicionar sua lógica para o login com o Google
    };

    // Função de login do Facebook
    const handleFacebookLogin = () => {
        console.log('Facebook login clicado!');
        // Aqui você pode adicionar sua lógica para o login com o Facebook
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.logoText}>
                    Poly<Text style={{ color: Colors.purple }}>App</Text>
                </Text>
                <Text style={styles.slogan}>Adicione seus dados de login</Text>
            </View>

            <View style={styles.form}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        value={email}
                        onChangeText={setEmail} // Atualiza o estado do email
                        placeholder="Digite seu email..."
                        placeholderTextColor={Colors.darkGray}
                        style={styles.input}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>
                <View style={styles.inputContainer}>
                    <View style={styles.row}>
                        <Text style={styles.label}>Senha</Text>
                        <Link href="(painel)/profile/page" style={styles.forgotPassword}>
                            Esqueceu sua senha?
                        </Link>
                    </View>
                    <TextInput
                        value={password}
                        onChangeText={setPassword} // Atualiza o estado da senha
                        placeholder="Digite sua senha..."
                        placeholderTextColor={Colors.darkGray}
                        style={styles.input}
                        secureTextEntry
                    />
                </View>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <Pressable style={styles.button} onPress={handleLogin}>
                    {loading ? (
                        <ActivityIndicator size="small" color={Colors.white} />
                    ) : (
                        <Text style={styles.buttonText}>Entrar</Text>
                    )}
                </Pressable>
            </View>

            <View style={styles.linkContainer}>
                <Link href="(auth)/cadastro/page">
                    <Text style={{ color: Colors.white }}>Não possui uma conta? </Text>
                    <Text style={{ color: Colors.purple }}>Cadastre-se</Text>
                </Link>
            </View>

            {/* <View style={styles.login3}>
                <SocialLoginButtons  
                    onGoogleLogin={handleGoogleLogin} 
                    onFacebookLogin={handleFacebookLogin} 
                />
            </View> */}
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
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 3, // Margem ajustada para 3
    },
    forgotPassword: {
        fontSize: 12,
        color: Colors.purple,
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
    loginWithText: {
        color: Colors.white,
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20, // Ajuste de espaçamento entre o texto e os botões
    },
    login3: {
        marginTop: 20, // Ajuste de espaçamento entre o texto e os botões
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 10,
    },
});