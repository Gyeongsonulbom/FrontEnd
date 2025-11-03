import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, TextInput, TouchableWithoutFeedback, Keyboard, TouchableOpacity, useColorScheme, Alert } from 'react-native';
import { useTheme, useNavigation } from '@react-navigation/native';
import Icon from '../../assets/icon.svg';
import Mail from '../../assets/Mail.svg';
import Lock from '../../assets/Lock.svg'
import { Shadow } from 'react-native-shadow-2';
import { useFonts } from 'expo-font';
import Checkbox from 'expo-checkbox';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../../api/authApi';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LoginScreen'>;

const Login = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const [isChecked, setChecked] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { colors } = useTheme(); // 현재 theme에서 색상 받아오기
  const scheme = useColorScheme() == 'dark';

  const [fontsLoaded] = useFonts({
    'Pretendard-SemiBold': require('../../assets/fonts/Pretendard-SemiBold.ttf'),
    'Pretendard-Medium': require('../../assets/fonts/Pretendard-Medium.ttf')
  })

  if (!fontsLoaded) return null;

  const handleLoginButton = async () => {
    try {
      const res = await authApi.login(username, password);
      const token = res.data.data.accessToken;
      const userId = res.data.data.userId;

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('userId', userId.toString());
      navigation.navigate('HomeScreen', { qrData: '' });
    } catch (err: any) {
      console.log('로그인 실패:', err.response?.data?.message || err.message);
    }
  };

  const isFormFilled = username.length > 0 && password.length > 0;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.LogoTitle}>
          <Icon width={70} height={70} />
          <Text style={[styles.Title, {color: '#479BFF'}]}>경소늘봄</Text>
          <Text style={[styles.SubTitle,  {color: '#99999999'}]}>서비스를 이용하기 위해 로그인을 해주세요.</Text>
        </View>
        <View style={styles.ContentContainer}>
        <View style={styles.InputContainer}>
          <Shadow
            distance={16}
            startColor={scheme ? 'rgba(40, 138, 255, 0.1)' : 'rgba(0,0,0,0.1)'} // 그림자 색상
            offset={[0, 4]}
            containerStyle={{ alignItems: 'center' }}
          >
            <View style={[styles.Id, {backgroundColor: scheme ? '#181A20' : '#fff'}]}>
              <View style={styles.IdInputContainer}>
                <View style={styles.Mail}>
                  <Mail width={25} height={24} />
                </View>
                <TextInput 
                  style={styles.IdPlaceHolder} 
                  placeholder='아이디를 입력해주세요.' 
                  placeholderTextColor="#999999" 
                  maxLength={25}
                  onChangeText={username => setUsername(username)}
                  id='username'
                />
              </View>
            </View>
          </Shadow>
          <Shadow
            distance={16}
            startColor={scheme ? 'rgba(40, 138, 255, 0.1)' : 'rgba(17, 34, 55, 0.1)'} // 그림자 색상
            offset={[0, 4]}
            containerStyle={{ alignItems: 'center' }}
          >
            <View style={[styles.Password, {backgroundColor: scheme ? '#181A20' : '#fff'}]}>
                <View style={styles.IdInputContainer}>
                  <View style={styles.Mail}>
                    <Lock width={25} height={24} />
                  </View>
                  <TextInput
                    style={styles.IdPlaceHolder} 
                    placeholder='비밀번호를 입력해주세요.' 
                    placeholderTextColor="#999999" 
                    maxLength={25}
                    onChangeText={password => setPassword(password)}
                    id='password'
                    secureTextEntry={true}
                  />
                </View>
            </View>
          </Shadow>
        </View>
        <View style={styles.IdSaveContainer}>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setChecked(!isChecked)} activeOpacity={0.8}>
            <Checkbox
              style={styles.checkbox}
              value={isChecked}
              onValueChange={setChecked}
              color={isChecked ? '#479BFF' : undefined}
            />
            <Text style={styles.IdSaveText}>아이디 저장하기</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={[styles.LoginButton,
          {
            backgroundColor: isFormFilled ? '#479BFF' : (scheme ? '#181A20' : '#FFFFFF'),
            borderWidth: isFormFilled ? 0 : 1,
            borderColor: scheme ? '#FFFFFF' : '#E5E5E5'
          }
          

        ]} onPress={handleLoginButton} disabled={!isFormFilled}>
          <Text style={[styles.LoginButtonText, {color: isFormFilled ? '#FFFFFF' : (scheme ? '#FFFFFF' : '#999999') }]}>로그인</Text>
        </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  LogoTitle:{
    marginTop: 150,
    marginLeft: Platform.OS == 'android' ? 40 : 36
  },
  Title: {
    marginTop: 20,
    marginBottom: 5,
    fontSize: 24,
    color: '#ffffff',
    fontFamily: 'Pretendard-SemiBold',
  },
  SubTitle: {
    fontSize: 16,
    color: '#999999',
    fontFamily: 'Pretendard-Medium',
  },
  InputContainer: {
    marginTop: 95,
    gap: 30
  },
  ContentContainer: {
    alignItems: 'center'
  },
  IdInputContainer: {
    flexDirection: 'row',      // 가로로 정렬
    alignItems: 'center',      // 세로 가운데 정렬
    height: '100%',
  },
  Id: {
    width: Platform.OS === 'android' ? 330 : 320,
    height: 60,
    backgroundColor: '#181A20',
    borderColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 10,
  },
  Mail: {
    marginLeft: 10
  },
  IdPlaceHolder: {
    width: Platform.OS === 'android' ? 311 : 305,
    marginLeft: 5,
    color: '#777C89',
    fontFamily: 'Pretendard-Medium',
  },
  Password: {
    width: Platform.OS === 'android' ? 330 : 320,
    height: 60,
    backgroundColor: '#181A20',
    borderColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 10,
    fontFamily: 'Pretendard-Medium',
  },
  IdSaveContainer: {
    alignSelf: 'flex-start',
    marginLeft: 42,
    marginTop: 10
  },
  checkbox: {
    width: 20,
    height: 20,
    borderColor: "#999999",
    borderWidth: 1,
    borderRadius: 4,
  },
  IdSaveText: {
    fontSize: 12,
    marginLeft: 5,
    color: '#999999',
    fontFamily: 'Pretendard-Medium',
  },
  PasswordForgot: {
    fontSize: 12,
    marginLeft: 90,
    color: '#999999',
    fontFamily: 'Pretendard-Medium',
  },
  LoginButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: Platform.OS === 'android' ? 330 : 320,
    height: 60,
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 70,
  },
  LoginButtonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16
  }
});

export default Login;
