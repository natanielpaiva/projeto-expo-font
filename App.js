import React from 'react';
import { useFonts } from 'expo-font';
import { Text, View, StyleSheet } from 'react-native';
import AppLoading from 'expo-app-loading';

const App = () => {
    const [fontsLoaded] = useFonts({
        'CustomFont': require('./assets/fonts/stocky.ttf'),
    });

    if (!fontsLoaded) {
        return <AppLoading />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                Olá, mundo com fonte personalizada!
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, // Faz o componente ocupar toda a tela
        justifyContent: 'center', // Centraliza verticalmente
        alignItems: 'center', // Centraliza horizontalmente
        backgroundColor: '#f0f0f0', // Cor de fundo clara para destaque
    },
    text: {
        fontFamily: 'CustomFont',
        fontSize: 24, // Aumenta o tamanho da fonte
        color: '#333', // Define uma cor para o texto
    },
});

export default App;