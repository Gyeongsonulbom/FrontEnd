import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Alert, Modal, TouchableOpacity, Image, useColorScheme } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import Arrow from '../../assets/Left Arrow.svg';
import LightArrow from '../../assets/arrow-left.svg'
import { CameraView, Camera } from 'expo-camera';
import { useFonts } from 'expo-font';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import LottieView from 'lottie-react-native';
import { attendanceApi } from '../../api/attendanceApi';

type AttendanceScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AttendanceScreen'>;

const Attendance = () => {
  const navigation = useNavigation<AttendanceScreenNavigationProp>();
  const { colors } = useTheme();
  const scheme = useColorScheme() == 'dark';
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraActive, setCameraActive] = useState(true);
  const [scanned, setScanned] = useState(false);
  const animationRef = useRef<LottieView>(null);
  const [status, setStatus] = useState<'idle' | 'success' | 'fail'>('idle');
  const [message, setMessage] = useState('');

  const [fontsLoaded] = useFonts({
    'Pretendard-SemiBold': require('../../assets/fonts/Pretendard-SemiBold.ttf'),
    'Pretendard-Medium': require('../../assets/fonts/Pretendard-Medium.ttf')
  });

  if (!fontsLoaded) return null;

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // 상태 변경 감지 후 애니메이션 재생
  useEffect(() => {
    if (status !== 'idle') {
      animationRef.current?.play();

      // 3초 후 모달 닫기
      const timer = setTimeout(() => {
        navigation.navigate("HomeScreen", { qrData: '' });
        setStatus('idle');
      }, 3000);

      return () => clearTimeout(timer); // cleanup
    }
  }, [status]);


  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    setCameraActive(false);
    setScanned(true);

    try {
      const res = await attendanceApi.checkAttendance(data); // ✅ 분리된 API 사용
      setStatus('success');
      setMessage(res.data.message);
    } catch (err: any) {
      console.log('출석 실패:', err.response?.data?.message);
      setStatus('fail');
      setMessage(err.response?.data?.message || '서버 오류가 발생했습니다.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.BackButton}>
        {scheme ?
          (<Arrow style={styles.BackButtonImg} onPress={navigation.goBack} />) :
          (<LightArrow style={styles.BackButtonImg} onPress={navigation.goBack} />)
        }
        <Text style={[styles.BackButtonText, {color: scheme ? '#FFFFFF' : '#1A1A1A'}]}>출석체크</Text>
      </View>

      <View style={[styles.CameraViewer, {borderColor: scheme ? '#FFFFFF' : '#999999' }]}>
        
      {cameraActive && (
        <CameraView
          style={[StyleSheet.absoluteFillObject]}
          onBarcodeScanned={handleBarCodeScanned}
        />
      )}
      </View>
      <Text style={[styles.Description, {color: scheme ? '#FFFFFF' : '#1A1A1A'}]}>
        도서관에 있는 QR코드를 통해{'\n'}출석체크를 해주세요!
      </Text>

      <Modal visible={status !== 'idle'} transparent animationType="fade">
        <View style={[styles.modalBackground, {backgroundColor: scheme ? '#1A1A1A' : '#FFFFFF'}]}>
          <View style={styles.modalContent}>
            <LottieView
              ref={animationRef}
              source={
                status === 'success'
                  ? require('../../assets/lottie/success.json')
                  : require('../../assets/lottie/fail.json')
              }
              autoPlay={false}
              loop={false}
              style={styles.lottie}
            />
            <Text style={[styles.modalText, {color: scheme ? '#FFFFFF' : '#1A1A1A'}]}>{message}</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  BackButtonImg: {
    marginLeft: 32,
  },
  BackButton: {
    width: 375,
    height: 56,
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 60,
  },
  BackButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontFamily: 'Pretendard-SemiBold',
    marginLeft: 100,
  },
  CameraViewer: {
    width: 256,
    height: 256,
    marginTop: 60,
    overflow: 'hidden',
    borderRadius: 20,
    borderWidth: 1,
  },
  Description: {
    fontSize: 20,
    fontFamily: 'Pretendard-SemiBold',
    marginTop: 50,
    textAlign: 'center',
    lineHeight: 32
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  lottie: { width: 150, height: 150 },
  modalText: { marginTop: 20, fontSize: 24, fontFamily: 'Pretendard-SemiBold', textAlign: 'center' },
});

export default Attendance;
