import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { useEffect, useState } from 'react';

export default function usePushToken() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  useEffect(() => {
    const registerForPushNotificationsAsync = async () => {
      if (!Device.isDevice) {
        alert('실제 기기에서만 푸시 알림이 동작합니다!');
        return;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('푸시 알림 권한이 필요합니다.');
        return;
      }

      const tokenData = await Notifications.getExpoPushTokenAsync();
      setExpoPushToken(tokenData.data);
      console.log('Expo Push Token:', tokenData.data); // <- 서버로 전송
    };

    registerForPushNotificationsAsync();
  }, []);

  return expoPushToken;
}
