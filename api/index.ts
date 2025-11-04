import axios, { AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://124.63.142.219:3100/api',
  timeout: 5000,
});

// 토큰이 필요한 요청만 헤더를 추가하도록 도와주는 함수
export const withAuth = async (config: AxiosRequestConfig = {}) => {
  const token = await AsyncStorage.getItem('token');
  return {
    ...config,
    headers: {
      ...(config.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
};

export default api;
