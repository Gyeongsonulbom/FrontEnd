import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, useColorScheme, FlatList, Dimensions, Animated, Easing } from 'react-native';
import { useFocusEffect, useNavigation, useTheme } from '@react-navigation/native';
import Icon from '../../assets/icon.svg';
import Bell from '../../assets/bell.svg';
import BellNotice from '../../assets/bell-notice.svg';
import DownArrow from '../../assets/chevron-down.svg';
import RightArrow from '../../assets/chevron-right.svg';
import Calender from '../../assets/calendar.svg'
import LightCalender from '../../assets/calendar-light.svg'
import LightRightArrow from '../../assets/chevron-right-light.svg';
import LightDownArrow from '../../assets/chevron-down-light.svg';
import { useFonts } from 'expo-font';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Shadow } from 'react-native-shadow-2';
import { getActivityDay } from '../../api/user';
import { getInfoList } from '../../api/info';
import useNotificationSocket from '../../api/useNotificationSocket';
import { getNotificationDetailList } from '../../api/notificationAPi';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'HomeScreen'>;

 // 타입 정의
type InfoData = {
  id: number;
  title: string;
  content: string;
  date: string;
};

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  
  const { colors } = useTheme(); // 현재 theme에서 색상 받아오기
  const scheme = useColorScheme() == 'dark';
  const [activityDays, setActivityDays] = useState<number>();
  const [data, setData] = useState<InfoData[]>([]);
  const [noticeExpanded, setNoticeExpanded] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifications = useNotificationSocket();

  const [fontsLoaded] = useFonts({
    'Pretendard-SemiBold': require('../../assets/fonts/Pretendard-SemiBold.ttf'),
    'Pretendard-Medium': require('../../assets/fonts/Pretendard-Medium.ttf')
  })

  const noticeHeight = useRef(new Animated.Value(100)).current;

  const toggleNotice = () => {
    Animated.timing(noticeHeight, {
      toValue: noticeExpanded ? 100 : 150, // 펼치기 / 접기
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false
    }).start();
    setNoticeExpanded(prev => !prev);
  };

  const { width } = Dimensions.get('window');


  const getThisWeekDates = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

    const week = [];
    const days = ['월','화','수','목','금'];

    for (let i = 0; i < 5; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      week.push({
        day: days[i],
        date: date.getDate(),
        dayNum: i + 1
      });
    }

    return week;
  };

  const weekDays = getThisWeekDates(); // 월~금 날짜 배열
  const today = new Date().getDate();  // 오늘 날짜
  const months = new Date().getMonth();

  useEffect(() => {
    fetchData();
    
    const intervals = [
      setInterval(fetchData, 5000),
      setInterval(fetchUnreadNotifications, 5000)
    ];
    return () => intervals.forEach(clearInterval);
  }, []);

  const fetchData = async () => {
    try {
      const [activity, info] = await Promise.all([getActivityDay(), getInfoList()]);
      setActivityDays(activity);
      setData(info);
    } catch (err) {
      console.log('에러:', err);
    }
  };

  const fetchUnreadNotifications = async () => {
    try {
      const res = await getNotificationDetailList(); // API 호출
      const count = res.filter((item: any) => item.isRead === 0).length;
      setUnreadCount(count);
    } catch (err) {
      console.log('알림 가져오기 실패', err);
    }
  };

  useFocusEffect(
      useCallback(() => {
        fetchUnreadNotifications();
    }, [])
  );


  if (!fontsLoaded) return null;

  const dynamicStyle = {
    backgroundColor: scheme ? '#181A20' : '#FFFFFF',
    borderColor: scheme ? '#FFFFFF' : '#E5E5E5',
    borderWidth: 1,
    color: scheme ? '#FFFFFF' : '#1A1A1A'
  };

  // 문자열을 maxChars마다 줄바꿈
  const wrapText = (text: string, maxChars: number) => {
    if (!text) return '';
    let result = '';
    let start = 0;

    while (start < text.length) {
      result += text.slice(start, start + maxChars);
      start += maxChars;
      if (start < text.length) result += '\n'; // 줄바꿈 추가
    }

    return result;
  };


  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.LogoTitle}>
        <Icon width={24} height={24} />
        <Text style={styles.Title}>경소늘봄</Text>
        <TouchableOpacity style={styles.Icon} onPress={() => navigation.navigate('NotificationDetailListScreen')}>
          {unreadCount !== 0 ? (
            <BellNotice width={24} height={24}  />
          ) : (
            <Bell width={24} height={24} />
            )
          }
        </TouchableOpacity>
      </View>
      <Shadow
        distance={16}
        startColor={scheme ? 'rgba(40, 138, 255, 0.1)' : 'rgba(0,0,0,0.1)'} // 그림자 색상
        offset={[0, 20]}
      >
        <Animated.View style={[styles.NoticeContainer, dynamicStyle, { height: noticeHeight }]}>
            <View style={[styles.NoticeIconTitle, { justifyContent: 'space-between', alignItems: 'center' }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Bell style={styles.Notice} width={24} height={24} />
                <Text style={[styles.NoticeTitle, { color: scheme ? '#FFFFFF' : '#1A1A1A', marginLeft: 10 }]}>
                  {notifications.length > 0 ? notifications[notifications.length - 1].title : '도서부 활동 내용'}
                </Text>
              </View>
              {notifications.length === 0 ? (
                <View>
                  {scheme ? (
                    <DownArrow style={styles.DownArrow} width={24} height={24} />
                  ) : (
                    <LightDownArrow style={styles.DownArrow} width={24} height={24} />
                  )}
                </View>
              ) :
              (
                <TouchableOpacity onPress={toggleNotice}>
                  {scheme ? (
                    <DownArrow style={styles.DownArrow} width={24} height={24} />
                  ) : (
                    <LightDownArrow style={styles.DownArrow} width={24} height={24} />
                  )}
                </TouchableOpacity>
              )}
            </View>

            <View style={{ flex: 1, marginTop: 10 }}>
              {notifications.length === 0 ? (
                <Text style={[styles.NoticeDescription, { color: scheme ? '#FFFFFF' : '#1A1A1A' }]}>
                  오늘은 새로운 알림이 없습니다.
                </Text>
              ) : (
                notifications.map((item, index) => (
                  <Text key={index} style={[styles.NoticeDescription, { color: scheme ? '#FFFFFF' : '#1A1A1A' }]}>
                    {noticeExpanded
                      ? wrapText(item.content, 20)
                      : item.content.length > 20
                      ? item.content.slice(0, 20) + '...'
                      : item.content
                    }
                  </Text>
                ))
              )}
            </View>

            {notifications.length > 0 && (
              <Text style={[styles.NoticeTime, { color: scheme ? '#AAAAAA' : '#999999' }]}>
                {notifications[notifications.length - 1].createdAt}
              </Text>
            )}
        </Animated.View>
    </Shadow>
    <Shadow
        distance={16}
        startColor={scheme ? 'rgba(40, 138, 255, 0.1)' : 'rgba(0,0,0,0.1)'} // 그림자 색상
        offset={[0, 20]}
      >
        <View style={[styles.CalenderContainer, dynamicStyle]}>
          <View style={styles.CalenderIconText}>
            {scheme ? (
              <Calender style={styles.CalenderIcon} width={24} height={24} />
              ) 
              :
              ( 
                <LightCalender style={styles.CalenderIcon} width={24} height={24} />
              )
            }
            <Text style={[styles.CalenderMonth, {color: scheme ? '#FFFFFF' : '#1A1A1A' }]}>{months + 1}월</Text>
            <TouchableOpacity style={styles.StampTouch} onPress={() => navigation.navigate('AttendanceScreen')}>
              <Text style={[styles.GoStamp, {color: scheme ? '#FFFFFF' : '#1A1A1A'}]}>출석하러가기</Text>
              {scheme ? (
                <RightArrow />
                ) : (
                <LightRightArrow />
                )
              }
            </TouchableOpacity>
          </View>
          <View style={styles.Calenderweek}>
            {weekDays.map(({ day, date }) => (
              <View
                key={day}
              >
                <Text style={{color: scheme ? '#FFFFFF' : '#1A1A1A'}}>{day}</Text>
              </View>
            ))}
          </View>
          <View style={styles.Calenderweekly}>
            {weekDays.map(({ day, date, dayNum }) => (
              <View
                key={date}
                style={[
                  styles.Calenderweeklyday,
                  {
                    backgroundColor: (() => {
                      if (today && activityDays && dayNum === activityDays) return '#479BFF';
                      if (date === today) return '#FDDE62';
                      return '#FFFFFF'; // 기본값
                    })(),
                    borderColor: scheme ? 'transparent' : '#E5E5E5',
                    borderWidth: Platform.OS === 'android' ? (scheme ? 0 : 1) : (scheme ? 0 : 1),
                  }
                ]}
              >
                <Text>{date}</Text>
              </View>
            ))}
          </View>
          <View style={styles.CalenderColorBoxContainer}>
            <View style={styles.CalenderColorBoxLegendItem}>
                <View style={[styles.CalenderColorBox, { backgroundColor: '#FDDE62' }]} />
                <Text style={[styles.CalenderColorBoxLegendText, { color: scheme ? '#FFFFFF' : '#1A1A1A' }]}>오늘 날짜</Text>
            </View>
            <View style={styles.CalenderColorBoxLegendItem}>
                <View style={[styles.CalenderColorBox, { backgroundColor: '#479BFF' }]} />
                <Text style={[styles.CalenderColorBoxLegendText, { color: scheme ? '#FFFFFF' : '#1A1A1A' }]}>도서부 활동일</Text>
            </View>
          </View>
        </View>
      </Shadow>
      <Shadow
        distance={16}
        startColor={scheme ? 'rgba(40, 138, 255, 0.1)' : 'rgba(0,0,0,0.1)'} // 그림자 색상
        offset={[0, 20]}
      >
        <View style={[styles.DayManagerChange, {backgroundColor: scheme ? '#1A1A1A' : '#FFFFFF',borderColor: scheme ? '#FFFFFF' : '#E5E5E5', borderWidth: 1}]}>
            <Text style={[styles.DayManagerChangeText, {color: scheme ? '#FFFFFF' : '#1A1A1A'}]}>담당 요일 변경</Text>
            <TouchableOpacity onPress={() => navigation.navigate('DayManagerChangeScreen')}>
              {scheme ? (
                <RightArrow style={styles.DayManagerChangeGo} />
                ) : (
                <LightRightArrow style={styles.DayManagerChangeGo} />
                )
              }
            </TouchableOpacity>
          </View>
      </Shadow>
      <View style={[styles.info]}>
        <Text style={[styles.infoTitle, {color: scheme ? '#FFFFFF' : '#1A1A1A'}]}>도움말</Text>
        <TouchableOpacity style={styles.infoDetail} onPress={() => navigation.navigate('InfoDetailListScreen')}>
          <Text style={{color: scheme ? '#FFFFFF' : '#1A1A1A'}}>더보기</Text>
          {scheme ? (
              <RightArrow />
              ) : (
              <LightRightArrow />
              )
            }
        </TouchableOpacity>
      </View>
      <View>
          <FlatList
            data={data}
            horizontal
            pagingEnabled={false} // 한 화면 전체가 아닌 카드 단위로 슬라이드
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            snapToInterval={width * 0.7 + 10} // 카드 너비 + 간격
            decelerationRate="fast"
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => navigation.navigate('InfoDetailScreen', { id: item.id })}
                activeOpacity={0.8}
              >
                <Shadow
                    distance={8}
                    startColor={scheme ? 'rgba(40, 138, 255, 0.1)' : 'rgba(0,0,0,0.1)'} // 그림자 색상
                    offset={[5, 15]}
                  >
                  <View style={[styles.card, { backgroundColor: scheme ? '#1A1A1A' : '#FFFFFF', borderColor: scheme ? '#FFFFFF' : '#E5E5E5', borderWidth: 1}]}>
                    <Text style={[styles.title, { color: scheme ? '#FFFFFF' : '#1A1A1A'}]}>{item.title}</Text>
                    <Text style={[styles.content, { color: scheme ? '#FFFFFF' : '#1A1A1A'}]}>{item.content}</Text>
                    <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                      <Text style={[styles.date, { color: '#999999'}]}>{item.date}</Text>
                    </View>
                  </View>
                </Shadow>
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingHorizontal: Platform.OS === 'android' ? 40 : 25 }}
          />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  LogoTitle:{
    marginTop: Platform.OS === 'android' ? 70 : 64,
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
    marginLeft: 215,
    alignItems: 'center',
    flexDirection: 'row',
  },
  NoticeContainer: {
    width: 342,
    height: 100,
    borderRadius: 10,
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
    marginTop: 10,
    marginRight: 10
  },
  NoticeTitle: {
    marginTop: 10,
    marginLeft: 10,
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18
  },
  NoticeDescription: {
    fontSize: 14,
    marginLeft: 35,
    color: '#999999'
  },
  NoticeTime: {
    fontSize: 12,
    color: '#999999',
    alignSelf: 'flex-end', // 부모 View 기준으로 정렬
    marginBottom: 10,
    marginRight: 10
  },
  CalenderContainer: {
    backgroundColor: '#479BFF',
    width: 342,
    height: 180,
    borderRadius: 10,
    marginTop: 20
  },
  CalenderIconText: {
    marginLeft: 10,
    flexDirection:'row'
  },
  CalenderIcon: {
    marginTop: 10
  },
  CalenderMonth: {
    marginTop: 10,
    marginLeft: 10,
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18
  },
  StampTouch: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 150
  },
  GoStamp: {
    fontFamily: 'Pretendard-Medium',
  },
  Calenderweek: {
    flexDirection: 'row',
    gap: 50,
    marginLeft: 40,
    marginTop: Platform.OS === 'android' ? 20 : 30
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
  CalenderColorBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    marginRight: 10,
    gap: 5
  },
  CalenderColorBoxLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  CalenderColorBox: {
    width: 14,
    height: 14,
    borderRadius: 2
  },
  CalenderColorBoxLegendText: {
    fontSize: 14,
    fontFamily: 'Pretendard-SemiBold'
  },
  DayManagerChange: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 342,
    height: 60,
    borderRadius: 10,
    marginTop: 20
  },
  DayManagerChangeText: {
    fontFamily: 'Pretendard-SemiBold',
    marginLeft: 20
  },
  DayManagerChangeGo: {
    marginLeft: 200
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 230,
    marginTop: 20
  },
  infoTitle: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18
  },
  infoDetail: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  card: {
    width: 150,
    height: Platform.OS === 'android' ? 220 : 200,
    borderRadius: 10,
    padding: 15,
    marginRight: 10,
    marginTop: 10
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    marginBottom: 10,
  },
  date: {
    fontSize: 12,
    alignSelf: 'flex-end'
  },
});

export default HomeScreen;
