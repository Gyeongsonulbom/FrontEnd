import { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useNotificationSocket = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    const initSocket = async () => {
      const userId = await AsyncStorage.getItem('userId'); // await 필수
      if (!userId) return;

      const socket = new SockJS('http://10.175.37.49:3100/api/ws-notification'); 
      const client = new Client({
        webSocketFactory: () => socket as any,
        reconnectDelay: 5000,
        // debug: (str) => console.log(str),
      });

      client.onConnect = () => {
        // console.log('WebSocket 연결됨, userId:', userId);

        client.subscribe(`/api/topic/user-${userId}`, (message) => {
          if (message.body) {
            const data = JSON.parse(message.body);
            setNotifications((prev) => [...prev, data]);
          }
        });
      };

      client.activate();
      clientRef.current = client;
    };

    initSocket();

    return () => {
      clientRef.current?.deactivate();
    };
  }, []);

  return notifications;
};

export default useNotificationSocket;
