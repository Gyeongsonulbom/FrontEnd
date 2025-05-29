import React from 'react';
import { View, Text, StyleSheet, Image, Platform, useColorScheme } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import Icon from '../assets/icon.svg'
import { useFonts } from 'expo-font';
import { TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type MainScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;


const Main = () => {
  const navigation = useNavigation<MainScreenNavigationProp>();
  const { colors } = useTheme(); // 현재 theme에서 색상 받아오기

  const scheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    'Pretendard-SemiBold': require('../assets/fonts/Pretendard-SemiBold.ttf'),
    'Pretendard-Medium': require('../assets/fonts/Pretendard-Medium.ttf')
  })

  if (!fontsLoaded) return null;

  console.log(scheme)

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.LogoTitle}>
        <Icon width={128} height={128} />
        <Text style={[ styles.Title, { color: scheme === 'dark' ? '#fff' : '#479BFF'} ] }>경소늘봄</Text>
        <Text style={[ styles.SubTitle, { color: scheme === 'dark' ? '#fff' : '#999999'} ]}>도서부 출석체크를 빠르게 완벽하게</Text>
      </View>
      <View style={styles.ButtonContainer}>
        <TouchableOpacity style={styles.LoginButton} onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.LoginText}>로그인</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  LogoTitle:{
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Title: {
    marginTop: 30,
    marginBottom: 10,
    fontSize: 36,
    fontFamily: 'Pretendard-SemiBold',
  },
  SubTitle: {
    fontFamily: 'Pretendard-Medium',
  },
  ButtonContainer: {
    marginTop: Platform.OS === 'android' ? 100 : 150,
    gap: 20
  },
  LoginButton: {
    width: 311,
    height: 60,
    backgroundColor: '#479BFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  LoginText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
  },
  SignupButton: {
    width: 311,
    height: 60,
    backgroundColor: '#4D4D4D',
    borderStyle: 'solid',
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  SignupText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
  },
});

export default Main;
