import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { withAuth } from './index';
import usePushToken from '../hooks/UsePushToken';

export const getNotifications = async () => {
  try {
    const res = await api.get('/api/notifications');
    return res.data; // NotificationDto 배열
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getNotificationDetailList = async () => {
  try {
    const config = await withAuth();
    const res = await api.get('/user/notification-list', config);
    return res.data.data; // NotificationDto 배열
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getNotificationDetail = async (id: number) => {
  try {
    const config = await withAuth();
    const res = await api.get(`/user/notification/${id}`, config);
    return res.data.data; // NotificationDto 배열
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const registerToken = async (expoPushToken: string) => {
  if (!expoPushToken) return;

  try {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      console.warn('⚠️ userId가 없습니다. 로그인 후 다시 시도하세요.');
      return;
    }

    const config = await withAuth();

    const res = await api.post(
      '/push/register',
      {
        userId: Number(userId),
        expoPushToken,
      },
      config
    );

    console.log('✅ 푸시 토큰 등록 성공:', res.data);
  } catch (err: any) {
    console.error('❌ 푸시 토큰 등록 실패:', err.response?.data || err.message);
  }
};