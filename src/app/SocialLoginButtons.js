import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';

const SocialLoginButtons = ({ onGoogleLogin, onFacebookLogin }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.loginWithText}>Ou faça login com</Text>
            <View style={styles.iconContainer}>
                <TouchableOpacity onPress={onGoogleLogin} style={styles.iconButton}>
                    <Image
                        source={require('@/assets/images/google (1).png')}
                        style={styles.icon}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={onFacebookLogin} style={styles.iconButton}>
                    <Image
                        source={require('@/assets/images/facebook.png')}
                        style={styles.icon}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center', // Centraliza o conteúdo
        alignItems: 'center', // Centraliza os itens
    },
    loginWithText: {
        color: '#fff', // Cor do texto (ajustar conforme necessário)
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10, // Espaçamento abaixo do texto
    },
    iconContainer: {
        flexDirection: 'row', // Define o layout lado a lado
        justifyContent: 'center', // Alinha os itens horizontalmente no centro
        alignItems: 'center', // Alinha os itens verticalmente no centro
    },
    iconButton: {
        marginHorizontal: 15, // Aumenta o espaçamento entre os botões
    },
    icon: {
        width: 40, // Ajuste o tamanho do ícone conforme necessário
        height: 40, // Ajuste o tamanho do ícone conforme necessário
    },
});

export default SocialLoginButtons;
