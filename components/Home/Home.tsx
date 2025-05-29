import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useTheme, RouteProp, useRoute } from '@react-navigation/native';
import Icon from '../../assets/icon.svg';
import Bell from '../../assets/bell.svg';
import Notice from '../../assets/bell-notice.svg';
import User from '../../assets/user.svg';
import DownArrow from '../../assets/chevron-down.svg';
import RightArrow from '../../assets/chevron-right.svg';
import Calender from '../../assets/calendar.svg'
import { useFonts } from 'expo-font';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'HomeScreen'>;

type AttendanceSuccessRouteProp = RouteProp<RootStackParamList, 'HomeScreen'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const route = useRoute<AttendanceSuccessRouteProp>();
  
  const { colors } = useTheme(); // 현재 theme에서 색상 받아오기

  const [fontsLoaded] = useFonts({
    'Pretendard-SemiBold': require('../../assets/fonts/Pretendard-SemiBold.ttf'),
    'Pretendard-Medium': require('../../assets/fonts/Pretendard-Medium.ttf')
  })

  if (!fontsLoaded) return null;

  const { qrData } = route.params;

  Alert.alert(qrData);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.LogoTitle}>
        <Icon width={24} height={24} />
        <Text style={styles.Title}>경소늘봄</Text>
        <View style={styles.Icon}>
          <Bell width={24} height={24} />
          <User width={24} height={24} />
        </View>
      </View>
      <View style={styles.NoticeContainer}>
        <View style={styles.NoticeIconTitle}>
          <Notice style={styles.Notice} width={24} height={24} />
          <Text style={styles.NoticeTitle}>도서부 활동 내용</Text>
          <DownArrow style={styles.DownArrow} width={24} height={24} />
        </View>
        <View>
          <Text style={styles.NoticeDescription}>서가배열 해야하고요. 오늘 간식은 ...</Text>
        </View>
        <View>
          <Text style={styles.NoticeTime}>오후 12:48</Text>
        </View>
      </View>

      <View style={styles.CalenderContainer}>
        <View style={styles.CalenderIconText}>
          <Calender style={styles.CalenderIcon} width={24} height={24} />
          <Text style={styles.CalenderMonth}>5월</Text>
          <TouchableOpacity style={styles.StampTouch} onPress={() => navigation.navigate('AttendanceScreen')}>
            <Text style={styles.GoStamp}>출석하러가기</Text>
            <RightArrow style={styles.RightArrow}/>
          </TouchableOpacity>
        </View>
        <View style={styles.Calenderweek}>
          <Text style={styles.Calenderweekday}>월</Text>
          <Text style={styles.Calenderweekday}>화</Text>
          <Text style={styles.Calenderweekday}>수</Text>
          <Text style={styles.Calenderweekday}>목</Text>
          <Text style={styles.Calenderweekday}>금</Text>
        </View>
        <View style={styles.Calenderweekly}>
          <View style={styles.Calenderweeklyday}>
            <Text>26</Text>
          </View>
          <View style={styles.Calenderweeklyday}>
            <Text>27</Text>
          </View>
          <View style={styles.Calenderweeklyday}>
            <Text>28</Text>
          </View>
          <View style={[styles.Calenderweeklyday, { backgroundColor: '#FFFF98'}]}>
            <Text>29</Text>
          </View>
          <View style={styles.Calenderweeklyday}>
            <Text>30</Text>
          </View>
        </View>
      </View>
      <View style={styles.DayManagerChange}>
          <Text style={styles.DayManagerChangeText}>담당 요일 변경</Text>
          <RightArrow style={styles.DayManagerChangeGo} />
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  LogoTitle:{
    marginTop: 64,
    marginLeft: 32,
    alignItems: 'center',
    flexDirection: 'row'
  },
  Title: {
    marginLeft: 5,
    fontSize: 20,
    fontFamily: 'Pretendard-SemiBold',
    color: '#479BFF'
  },
  Icon: {
    marginLeft: 160,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 20
  },
  NoticeContainer: {
    width: 342,
    height: 100,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginLeft: 24,
    marginTop: 20
  },
  NoticeIconTitle: {
    flexDirection: 'row'
  },
  Notice: {
    marginLeft: 10,
    marginTop: 10
  },
  DownArrow: {
    marginLeft: 140,
    marginTop: 10
  },
  NoticeTitle: {
    marginTop: 15,
    marginLeft: 10,
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18
  },
  NoticeDescription: {
    fontSize: 14,
    marginTop: 10,
    marginLeft: 44,
    color: '#999999'
  },
  NoticeTime: {
    marginTop: 8,
    marginLeft: 260,
    color: '#999999'
  },
  CalenderContainer: {
    backgroundColor: '#479BFF',
    width: 342,
    height: 160,
    borderRadius: 10,
    marginLeft: 24,
    marginTop: 20
  },
  CalenderIconText: {
    marginLeft: 10,
    alignItems:'center',
    flexDirection:'row'
  },
  CalenderIcon: {
    marginTop: 11
  },
  CalenderMonth: {
    marginTop: 10,
    marginLeft: 10,
    color: '#ffffff',
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18
  },
  StampTouch: {
    flexDirection: 'row'
  },
  GoStamp: {
    color: '#ffffff',
    fontFamily: 'Pretendard-Medium',
    marginLeft: 170,
    marginTop: 12
  },
  RightArrow: {
    marginTop: 8
  },
  Calenderweek: {
    flexDirection: 'row',
    gap: 49,
    marginLeft: 40,
    marginTop: 20
  },
  Calenderweekday: {
    color: '#ffffff',
    fontFamily: 'Pretendard-Medium',
  },
  Calenderweekly: {
    marginLeft: 22,
    flexDirection: 'row',
    gap: 12
  },
  Calenderweeklyday: {
    marginTop: 5,
    width: 50,
    height: 50,
    backgroundColor: '#ffffff',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  DayManagerChange: {
    backgroundColor: '#004494',
    flexDirection: 'row',
    alignItems: 'center',
    width: 342,
    height: 60,
    borderRadius: 10,
    marginTop: 20,
    marginLeft: 24
  },
  DayManagerChangeText: {
    fontFamily: 'Pretendard-SemiBold',
    color: '#ffffff',
    marginLeft: 20
  },
  DayManagerChangeGo: {
    marginLeft: 200
  }
});

export default HomeScreen;
