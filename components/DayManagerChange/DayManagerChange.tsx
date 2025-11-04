import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, Platform, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import Arrow from '../../assets/Left Arrow.svg';
import LightArrow from '../../assets/arrow-left.svg'
import DownArrow from '../../assets/chevron-down.svg';
import LightDownArrow from '../../assets/chevron-down-light.svg';
import RightArrow from '../../assets/Arrow.svg';
import LightRightArrow from '../../assets/LightArrow.svg'
import { useFonts } from 'expo-font';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import Calender from '../../assets/calendar.svg'
import LightCalender from '../../assets/calendar-light.svg'
import { Shadow } from 'react-native-shadow-2';
import { Dropdown } from 'react-native-element-dropdown';
import { changeRequestApi } from '../../api/changeRequestApi';
import { userApi } from '../../api/user';

type DayManagerChangeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DayManagerChangeScreen'>;

const DayManagerChange = () => {
  const [selectedDate, setSelectedDate] = useState<number>();
  const [fromValue, setFromValue] = useState(null);
  const [toUser, setToUser] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [Reason, setReason] = useState('');
  const [data, setData] = useState<{ label: string; value: string }[]>([]);
  const navigation = useNavigation<DayManagerChangeScreenNavigationProp>();
  const { colors } = useTheme();
  const scheme = useColorScheme() == 'dark';

  const [fontsLoaded] = useFonts({
    'Pretendard-SemiBold': require('../../assets/fonts/Pretendard-SemiBold.ttf'),
    'Pretendard-Medium': require('../../assets/fonts/Pretendard-Medium.ttf')
  });

  const isFormFilled = selectedDate !== null && !!fromValue && Reason.trim() !== '';

  if (!fontsLoaded) return null;

  const handleChangeReason = (input: string) => {
    const lines = input.split('\n'); // 줄바꿈 기준으로 배열
    if (lines.length > 4) {
      // 4줄 이상이면 마지막 줄 제거
      const limited = lines.slice(0, 4).join('\n');
      setReason(limited);
    } else {
      setReason(input);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await userApi.getMyName();
        setToUser(res.data.data.userName);
      } catch (err: any) {
        console.log('유저 이름 불러오기 실패:', err.response?.data?.message);
      }
    })();
  }, []);

  const getThisWeekDates = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 일(0)~토(6)
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7)); // 월요일로 이동

    const week = [];

    for (let i = 0; i < 5; i++) { // 월~금
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);

      week.push({
        day: ['월', '화', '수', '목', '금'][i],
        date: date.getDate(),
      });
    }

    return week;
  };

  const weekDays = getThisWeekDates();
  const months = new Date().getMonth();

  const dynamicStyle = {
    backgroundColor: scheme ? '#181A20' : '#FFFFFF',
    borderColor: scheme ? '#FFFFFF' : '#E5E5E5',
    borderWidth: 1,
    color: scheme ? '#FFFFFF' : '#1A1A1A'
  };
  
  useEffect(() => {
    if (!selectedDate) return;
    (async () => {
      setLoading(true);
      try {
        const dateString = getSelectedDateString();
        const res = await userApi.getUserListByDate(dateString!);
        const formatted = res.data.data.map((user: { userName: string; userId: number }) => ({
          label: user.userName,
          value: user.userId.toString(),
        }));
        setData(formatted);
      } catch (err) {
        console.error('유저 목록 로드 실패:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedDate]);


  const getSelectedDateString = () => {
    if (selectedDate == null) return null;

    const today = new Date();
    const dayOfWeek = today.getDay(); // 일(0)~토(6)
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7)); // 이번 주 월요일

    const selected = new Date(monday);
    // selectedDate는 getThisWeekDates에서 나온 date
    selected.setDate(selectedDate);

    const year = selected.getFullYear();
    const month = selected.getMonth() + 1; // 월은 0~11이므로 +1
    const day = selected.getDate();

    // YYYY-MM-DD 형태로 반환
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    const dateString = getSelectedDateString();
    try {
      await changeRequestApi.submitChangeRequest(dateString!, fromValue!, Reason);
      navigation.navigate('HomeScreen', { qrData: '' });
    } catch (err) {
      console.log('변경 요청 실패:', err);
    }
  };


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.BackButton}>
          {scheme ?
            (<Arrow style={styles.BackButtonImg} onPress={navigation.goBack} />) :
            (<LightArrow style={styles.BackButtonImg} onPress={navigation.goBack} />)
          }
          <Text style={[styles.BackButtonText, {color: scheme ? '#FFFFFF' : '#1A1A1A'}]}>담당 요일 변경</Text>
        </View>
        <Shadow
          distance={16}
          startColor={scheme ? 'rgba(40, 138, 255, 0.1)' : 'rgba(0,0,0,0.1)'} // 그림자 색상
          offset={[0, 20]}
        >
          <View style={[styles.CalenderContainer, dynamicStyle]}>
            <View style={styles.CalenderIconText}>
              {scheme ? (
                <Calender style={styles.CalenderIcon} width={24} height={24} />
              ) :
              ( 
                <LightCalender style={styles.CalenderIcon} width={24} height={24} />
              )
              }
              <Text style={[styles.CalenderMonth, {color: scheme ? '#FFFFFF' : '#1A1A1A' }]}>{months + 1}월</Text>
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
              {weekDays.map(({ day, date }) => (
                <TouchableOpacity
                  key={date}
                  onPress={() => setSelectedDate(date)}
                  style={[
                    styles.Calenderweeklyday,
                    { 
                      borderColor: scheme ? 'transparent' : '#E5E5E5', 
                      borderWidth: scheme ? 0 : 1,
                      backgroundColor: date === selectedDate ? '#479BFF' : '#FFFFFF'
                    }
                  ]}
                >
                  <Text>{date}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Shadow>
        {selectedDate ? 
          (
            <View style={styles.ChangeContainer}>
              <View style={styles.ChangeDateSelect}>
                <Text style={[styles.ChangeDateSelectText, {color: scheme ? '#FFFFFF' : '#1A1A1A'}]}>
                  바꾸고 싶은 날짜가 {selectedDate}일이 맞나요?
                </Text>
              </View>
              <View style={styles.ChangePersonSelect}>
                <Text style={[styles.ChangePersonSelectText, {color: scheme ? '#FFFFFF' : '#1A1A1A'}]}>바꾸고 싶은 도서부원을 선택해주세요</Text>
              </View>
              <View style={styles.ChangePersonSelectDropDown}>
                <Shadow
                  distance={8}
                  startColor={scheme ? 'rgba(40, 138, 255, 0.1)' : 'rgba(0,0,0,0.1)'} // 그림자 색상
                  offset={[0, 2]}
                >
                  <View style={[styles.ToFromDropDown, {borderWidth: 1, borderColor: scheme ? '#FFFFFF' : '#E5E5E5', backgroundColor: scheme ? '#1A1A1A' : '#FFFFFF' }]}>
                    <Text style={{color: scheme ? '#FFFFFF' : '#1A1A1A', fontFamily: 'Pretendard-SemiBold', fontSize: 18 }}>{toUser}</Text>
                  </View>
                </Shadow>
                  {scheme ? (
                    <LightRightArrow style={{position: 'absolute', left: 160, alignSelf: 'center'}} />
                  ) : (
                  <RightArrow style={{position: 'absolute', left: 160, alignSelf: 'center'}} />
                  )}
                <Shadow
                  distance={8}
                  startColor={scheme ? 'rgba(40, 138, 255, 0.1)' : 'rgba(0,0,0,0.1)'} // 그림자 색상
                  offset={[0, 2]}
                >
                  <Dropdown
                    data={data}
                    labelField="label"
                    valueField="value"
                    onChange={item => {
                      setFromValue(item.value);
                    }}
                    renderRightIcon={() => scheme ? (<DownArrow style={{ marginRight: 10 }} />) : (<LightDownArrow style={{ marginRight: 10 }} />)}
                    iconStyle={{position: 'absolute', right: 10}}
                    placeholder={'이름 선택'}
                    value={fromValue}
                    style={[styles.ToFromDropDown, {borderWidth: 1, borderColor: scheme ? '#FFFFFF' : '#E5E5E5', backgroundColor: scheme ? '#1A1A1A' : '#FFFFFF' }]}
                    placeholderStyle={[styles.placeholderStyle, {color: scheme ? '#FFFFFF' : '#1A1A1A'}]}
                    selectedTextStyle={[styles.selectedTextStyle, {color: scheme ? '#FFFFFF' : '#1A1A1A'}]}
                    containerStyle={[styles.containerStyle]}
                    renderItem={(item) => (
                      <Text style={{ color: scheme ? '#FFFFFF' : '#1A1A1A', padding: 10, fontFamily: 'Pretendard-SemiBold', backgroundColor: scheme ? '#1A1A1A' : '#FFFFFF'}}>{item.label}</Text> // 목록 아이템 텍스트 색
                    )}
                    disable={loading || !data || data.length === 0}
                  />
                </Shadow>
              </View>
              <Shadow
                  distance={8}
                  startColor={scheme ? 'rgba(40, 138, 255, 0.1)' : 'rgba(0,0,0,0.1)'} // 그림자 색상
                  offset={[2, 16]}
              >
                <View style={[styles.ReasonContainer, {borderColor: scheme ? '#FFFFFF' : '#E5E5E5', backgroundColor: scheme ? '#1A1A1A' : '#FFFFFF'}]}>
                  <TextInput 
                    placeholder='맞다면 사유를 적어주세요.' 
                    placeholderTextColor="#767676"
                    value={Reason}
                    onChangeText={handleChangeReason}
                    scrollEnabled={false} 
                    maxLength={Platform.OS === 'android' ? 120 : 124 }
                    multiline={true}
                    style={[styles.ReasonTextInput, {color: scheme ? '#FFFFFF' : '#1A1A1A'}]} 
                    textAlignVertical="top"
                  />
                </View>
              </Shadow>
              <TouchableOpacity style={[styles.sendButtonContainer,
                        {
                          backgroundColor: isFormFilled ? '#479BFF' : (scheme ? '#181A20' : '#FFFFFF'),
                          borderWidth: isFormFilled ? 0 : 1,
                          borderColor: scheme ? '#FFFFFF' : '#E5E5E5'
                        }
                      ]} onPress={handleSubmit} disabled={!isFormFilled}>
                <Text style={[styles.sendButtonText, {color: isFormFilled ? '#FFFFFF' : (scheme ? '#FFFFFF' : '#999999') }]}>제출</Text>
              </TouchableOpacity>
            </View>
          ) :
          (
            <Text>
            </Text>
          )
        }
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  BackButtonImg: {
    position: 'absolute',
    left: 20, 
  },
  BackButton: {
    width: 375,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 60,
  },
  BackButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontFamily: 'Pretendard-SemiBold',
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
    ChangeContainer: {
      alignSelf: 'flex-start',
      marginLeft: Platform.OS === 'android' ? 35 : 25
    },
    ChangeDateSelect: {
      marginTop: 20,
    },
    ChangeDateSelectText: {
      fontFamily: 'Pretendard-SemiBold',
      fontSize: 18
    },
    ChangePersonSelect: {
      marginTop: 20,
    },
    ChangePersonSelectText: {
      fontFamily: 'Pretendard-SemiBold',
      fontSize: 14
    },
    ChangePersonSelectDropDown: {
      marginTop: 10,
      flexDirection: 'row',
      gap: 60
    },
    ToFromDropDown: {
      width: 140,
      height: 40,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center'
    },
    placeholderStyle: {
      textAlign: 'center',
      left: 15,
      fontFamily: 'Pretendard-SemiBold',
      fontSize: 18
    },
    selectedTextStyle: {
      textAlign: 'center',
      left: 15,
      fontFamily: 'Pretendard-SemiBold',
      fontSize: 18
    },
    containerStyle: {
      borderRadius: 8,
      overflow: 'hidden'
    },
    ReasonContainer: {
      marginTop: 15,
      borderWidth: 1,
      width: 342,
      height: 114,
      borderRadius: 10
    },
    ReasonTextInput: {
      marginTop: Platform.OS === 'android' ? 0 : 10,
      marginLeft: 10,
      fontSize: 16,
      width: 322,
      height: 110,
      fontFamily: 'Pretendard-SemiBold',
    },
    sendButtonContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 342,
      height: 60,
      borderWidth: 1,
      borderRadius: 10,
      marginTop: 30,
    },
    sendButtonText: {
      fontFamily: 'Pretendard-SemiBold',
      fontSize: 16
    }
});

export default DayManagerChange;
