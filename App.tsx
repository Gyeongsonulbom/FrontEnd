import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme, DarkTheme, Theme } from '@react-navigation/native';
import { RootStackParamList } from './navigation/types';
import Attendance from './components/Attendance/Attendance';
import Main from './components/Main';
import Login from './components/Login/Login';
import Home from './components/Home/Home';
import DayManagerChange from './components/DayManagerChange/DayManagerChange';
import { useColorScheme } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InfoDetailList from './components/Info/InfoDetailList';
import InfoDetail from './components/Info/InfoDetail';
import NotificationDetailList from './components/Notification/NotificationDetailList';
import NotificationDetail from './components/Notification/NotificationDetail';
import usePushToken from './hooks/UsePushToken';
import { registerToken } from './api/notificationAPi';
import { useEffect } from 'react';

const MyLightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#FFFFFF',
    primary: '#1E90FF',
    card: '#F0F0F0',
    text: '#000000',
    border: '#D3D3D3',
    notification: '#FF6347',
  },
};

const MyDarkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#181A20',
    primary: '#1E90FF',
    card: '#20232A',
    text: '#FFFFFF',
    border: '#30363D',
    notification: '#FF6347',
  },
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {

  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? MyDarkTheme : MyLightTheme;

  console.log("Current color scheme:", scheme); // 'light' 또는 'dark'

  const expoPushToken = usePushToken();

  useEffect(() => {
    if (!expoPushToken) return;

    const sendToken = async () => {
      console.log('Registering token:', expoPushToken);
      await registerToken(expoPushToken);
    };

    sendToken();
  }, [expoPushToken]);



  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen name='Main' component={Main} options={{ headerShown: false }} />
        <Stack.Screen name='LoginScreen' component={Login} options={{ headerShown: false }} />
        <Stack.Screen name='HomeScreen' component={Home} options={{ headerShown: false }} />
        <Stack.Screen name='AttendanceScreen' component={Attendance} options={{ headerShown: false }} />
        <Stack.Screen name='DayManagerChangeScreen' component={DayManagerChange} options={{ headerShown: false }} />
        <Stack.Screen name='InfoDetailListScreen' component={InfoDetailList} options={{ headerShown: false }} />
        <Stack.Screen name='InfoDetailScreen' component={InfoDetail} options={{ headerShown: false }} />
        <Stack.Screen name='NotificationDetailListScreen' component={NotificationDetailList} options={{ headerShown: false }} />
        <Stack.Screen name='NotificationDetailScreen' component={NotificationDetail} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

