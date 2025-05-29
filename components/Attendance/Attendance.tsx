import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Alert, Linking } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import Arrow from '../../assets/Left Arrow.svg';
import { useFonts } from 'expo-font';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from "expo-camera";
import LottieView from 'lottie-react-native';

type AttendanceScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AttendanceScreen'>;

const Attendance = () => {
  const navigation = useNavigation<AttendanceScreenNavigationProp>();
  const { colors } = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);

  const animation = useRef<LottieView>(null);
  const scannedRef = useRef(false);

  useEffect(() => {
    if (loading && animation.current) {
      animation.current.reset();
      animation.current.play();
    }
  }, [loading]);

  const [fontsLoaded] = useFonts({
    'Pretendard-SemiBold': require('../../assets/fonts/Pretendard-SemiBold.ttf'),
    'Pretendard-Medium': require('../../assets/fonts/Pretendard-Medium.ttf')
  });

  if (!fontsLoaded) return null;

  const checkPermissions = async () => {
    if (!permission) return;

    if (permission.status !== "granted") {
      if (!permission.canAskAgain) {
        Alert.alert(
          "권한 필요",
          "앱 설정에서 카메라 권한을 변경해주세요.",
          [
            { text: "취소", style: "cancel" },
            { text: "설정 열기", onPress: () => Linking.openSettings() },
          ],
          { cancelable: false }
        );
      } else {
        requestPermission();
      }
    }
  };

  useEffect(() => {
    checkPermissions();
  }, [permission]);

  const handleBarcodeScanned = ({ data }: BarcodeScanningResult) => {
    if (scannedRef.current) return;
    scannedRef.current = true;
  
    setScanned(true);
    setLoading(true);
  
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('HomeScreen', { qrData: data });
    }, 2000);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.BackButton}>
        <Arrow style={styles.BackButtonImg} onPress={navigation.goBack} />
        <Text style={styles.BackButtonText}>출석체크</Text>
      </View>
      <View style={styles.CameraBorder}>
        <View style={styles.LoadingContainer}>
          {loading ? (
            <LottieView
              key={Date.now()}
              autoPlay
              loop={false}
              ref={animation}
              style={{
                width: 250,
                height: 250,
                backgroundColor: 'transparent',
              }}
              source={require('../../assets/Checked.json')}
            />
          ) : !scanned ? (
            <CameraView
              style={styles.Camera}
              barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
              onBarcodeScanned={handleBarcodeScanned}
            />
          ) : null}
        </View>
      </View>
      <Text style={styles.QRText}>
        도서관에 있는 QR코드를 통해{'\n'}
        출석체크를 해주세요!
      </Text>
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
    marginLeft: 94,
  },
  CameraBorder: {
    marginTop: 46,
    flexDirection: 'row',
    alignItems: 'center',
    width: 256,
    height: 256,
    borderColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 5,
    overflow: 'hidden',
  },
  Camera: {
    width: '100%',
    height: '100%',
  },
  QRText: {
    marginTop: 46,
    color: '#ffffff',
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 32,
  },
  LoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  LoadingText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Pretendard-Medium',
  },  
});

export default Attendance;
