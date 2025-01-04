import { Stack } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function Page() {
    return (
        <View style={styles.container}>
            <Text>Pagina de Perfil</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, // Ocupa toda a tela
        alignItems: 'center', // Alinha horizontalmente
        justifyContent: 'center', // Alinha verticalmente
    },
});
