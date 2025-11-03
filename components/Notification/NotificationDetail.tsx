import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, useColorScheme, ActivityIndicator } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import Arrow from '../../assets/Left Arrow.svg';
import LightArrow from '../../assets/arrow-left.svg'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getNotificationDetail } from '../../api/notificationAPi';

type NotificationDetailScreenRouteProp = RouteProp<RootStackParamList, 'NotificationDetailScreen'>;
type NotificationDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'NotificationDetailScreen'>;

const NotificationDetailScreen = () => {
  const route = useRoute<NotificationDetailScreenRouteProp>();
  const navigation = useNavigation<NotificationDetailScreenNavigationProp>();
  const { id } = route.params;
  const scheme = useColorScheme() === 'dark';

  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await getNotificationDetail(id); // API 호출
        setItem(res);
      } catch (err) {
        console.log('상세 데이터 로드 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

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

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  if (!item) return <Text style={{ flex: 1, textAlign: 'center', marginTop: 50 }}>데이터가 없습니다.</Text>;

  return (
    <View style={[styles.container, { backgroundColor: scheme ? '#181A20' : '#FFFFFF' }]}>
      <View style={styles.BackButton}>
        {scheme ?
          (<Arrow onPress={navigation.goBack} />) :
          (<LightArrow onPress={navigation.goBack} />)
        }
        <Text style={[styles.BackButtonText, {color: scheme ? '#FFFFFF' : '#1A1A1A'}]}>상세 보기</Text>
      </View>

      <View style={styles.NotificationContainer}>
        <Text style={[styles.title, { color: scheme ? '#FFFFFF' : '#000000' }]}>{item.title}</Text>
          <View style={styles.infoMeta}>
              <Text style={styles.infoMetaText}>{item.formattedDate}</Text>
          </View>
        <Text style={[styles.content, { color: scheme ? '#FFFFFF' : '#000000' }]}> {wrapText(item.content, 25)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center'},
  BackButton: {
    width: '100%',
    height: 68,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: 70,
    marginTop: 60,
  },
  BackButtonText: {
    fontSize: 20,
    fontFamily: 'Pretendard-SemiBold',
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -75 }],
  },
  NotificationContainer: {
    alignItems: 'flex-start', // 자식 요소 좌측 정렬
    width: '90%',             // 좌우 공간 확보
    marginLeft: 40,  
  },
  title: { fontSize: 20, fontWeight: 'bold', marginTop: 30 },
  content: {marginTop: 20},
  infoMeta: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  infoMetaText: {
    color: '#999999'
  }
});

export default NotificationDetailScreen;
