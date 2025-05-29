import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, TextInput, TouchableWithoutFeedback, Keyboard, TouchableOpacity, useColorScheme } from 'react-native';
import { useTheme, useNavigation} from '@react-navigation/native';
import Icon from '../../assets/icon.svg';
import Mail from '../../assets/Mail.svg';
import Lock from '../../assets/Lock.svg'
import Arrow from '../../assets/Left Arrow.svg'
import { useFonts } from 'expo-font';
import Checkbox from 'expo-checkbox';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LoginScreen'>;

const Login = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const [isChecked, setChecked] = useState(false);

  const { colors } = useTheme(); // 현재 theme에서 색상 받아오기
  const seheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    'Pretendard-SemiBold': require('../../assets/fonts/Pretendard-SemiBold.ttf'),
    'Pretendard-Medium': require('../../assets/fonts/Pretendard-Medium.ttf')
  })

  if (!fontsLoaded) return null;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.BackButton}>
          <Arrow style={styles.BackButtonImg} onPress={navigation.goBack} />
          <Text style={styles.BackButtonText}>로그인</Text>
        </View>
        <View style={styles.LogoTitle}>
          <Icon width={70} height={70} />
          <Text style={[styles.Title, {color: seheme === 'dark' ? '#fff' : '#479BFF'}]}>경소늘봄</Text>
          <Text style={[styles.SubTitle,  {color: seheme === 'dark' ? '#fff' : '#999999'}]}>서비스를 이용하기 위해 로그인을 해주세요.</Text>
        </View>
        <View style={styles.InputContainer}>
          <View style={[styles.Id, {backgroundColor: seheme === 'dark' ? '#252932' : '#fff'}]}>
            <View style={styles.IdInputContainer}>
              <View style={styles.Mail}>
                <Mail width={25} height={24} />
              </View>
              <TextInput style={styles.IdPlaceHolder} placeholder='아이디를 입력해주세요.' placeholderTextColor="#777C89" maxLength={25}></TextInput>
            </View>
          </View>
          <View style={[styles.Password, {backgroundColor: seheme === 'dark' ? '#252932' : '#fff'}]}>
              <View style={styles.IdInputContainer}>
                <View style={styles.Mail}>
                  <Lock width={25} height={24} />
                </View>
                <TextInput style={styles.IdPlaceHolder} placeholder='비밀번호를 입력해주세요.' placeholderTextColor="#777C89" maxLength={25}></TextInput>
              </View>
          </View>
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
          <Text style={styles.PasswordForgot}>비밀번호를 잊어버리셨나요?</Text>
        </View>
        <TouchableOpacity style={styles.LoginButton} onPress={() => navigation.navigate('HomeScreen', { qrData: '' })}>
          <Text style={styles.LoginButtonText}>로그인</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  BackButtonImg: {
    marginLeft: 32
  },
  BackButton: {
    width: 375,
    height: 56,
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 60
  },
  BackButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontFamily: 'Pretendard-SemiBold',
    marginLeft: 110
  },
  LogoTitle:{
    marginTop: 28,
    marginLeft: 32
  },
  Title: {
    marginTop: 30,
    marginBottom: 10,
    fontSize: 28,
    color: '#ffffff',
    fontFamily: 'Pretendard-SemiBold',
  },
  SubTitle: {
    fontSize: 14,
    color: '#777C89',
    fontFamily: 'Pretendard-Medium',
  },
  InputContainer: {
    marginTop: 100,
    marginLeft: 32,
    gap: 30
  },
  IdInputContainer: {
    flexDirection: 'row',      // 가로로 정렬
    alignItems: 'center',      // 세로 가운데 정렬
    height: '100%',
  },
  Id: {
    width: Platform.OS === 'android' ? 330 : 320,
    height: 60,
    // backgroundColor: '#252932',
    borderColor: '#35383F',
    borderWidth: 1,
    borderRadius: 10
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
    backgroundColor: '#252932',
    borderColor: '#35383F',
    borderWidth: 1,
    borderRadius: 10,
    fontFamily: 'Pretendard-Medium',
  },
  IdSaveContainer: {
    alignItems: 'center',
    flexDirection:'row',
    marginLeft: 32,
    marginTop: 10
  },
  checkbox: {
    width: 16,
    height: 16
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
    backgroundColor: '#479BFF',
    borderRadius: 10,
    marginTop: 70,
    marginLeft: 32
  },
  LoginButtonText: {
    color: '#ffffff',
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16
  }
});

export default Login;
