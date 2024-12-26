import React, { useEffect, useState } from 'react';
import { View, Button, StyleSheet, Text, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

// Configurar o comportamento das notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState(null);
  const [notification, setNotification] = useState(false);
  const notificationListener = React.useRef();
  const responseListener = React.useRef();

  console.log("O componente foi carregado!");


  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permissão para notificações foi negada!');
        return;
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      setExpoPushToken(token);

      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    })();

    // Ouvir notificações recebidas
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    // Lidar com respostas do usuário
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const sendNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Olá! 🚀',
        body: 'Esta é uma notificação de teste.',
        data: { data: 'dados personalizados' },
      },
      trigger: { seconds: 2 },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expo Notifications</Text>
      <Button title="Enviar Notificação Local" onPress={sendNotification} />

      {notification && (
        <View style={styles.notificationContainer}>
          <Text>Notificação Recebida:</Text>
          <Text>{notification.request.content.title}</Text>
          <Text>{notification.request.content.body}</Text>
        </View>
      )}

      {expoPushToken && (
        <View style={styles.tokenContainer}>
          <Text>Expo Push Token:</Text>
          <Text selectable>{expoPushToken}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  notificationContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  tokenContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});