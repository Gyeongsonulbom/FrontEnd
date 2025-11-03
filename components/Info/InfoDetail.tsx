import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, useColorScheme, ActivityIndicator } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { getInfoDetail } from '../../api/info'; // id로 상세 조회 API
import Arrow from '../../assets/Left Arrow.svg';
import LightArrow from '../../assets/arrow-left.svg'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type InfoDetailScreenRouteProp = RouteProp<RootStackParamList, 'InfoDetailScreen'>;
type InfoDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'InfoDetailListScreen'>;

const InfoDetailScreen = () => {
  const route = useRoute<InfoDetailScreenRouteProp>();
  const navigation = useNavigation<InfoDetailScreenNavigationProp>();
  const { id } = route.params;
  const scheme = useColorScheme() === 'dark';

  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await getInfoDetail(id); // API 호출
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

      <View>
        <Text style={[styles.title, { color: scheme ? '#FFFFFF' : '#000000' }]}>{item.title}</Text>
          <View style={styles.infoMeta}>
              <Text style={styles.infoMetaText}>{item.writerName}</Text>
              <Text style={styles.infoMetaText}>조회 {item.views}회</Text>
              <Text style={styles.infoMetaText}>{item.date}</Text>
          </View>
        <Text style={[styles.content, { color: scheme ? '#FFFFFF' : '#000000' }]}> {wrapText(item.content, 35)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center'},
  BackButton: {
    width: '100%',
    height: 68,
    justifyContent: 'center', // 전체 수직 중앙
    alignItems: 'flex-start',
    marginLeft: 70, // 아이콘은 왼쪽 정렬
    marginTop: 60,
  },
  BackButtonText: {
    fontSize: 20,
    fontFamily: 'Pretendard-SemiBold',
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -70 }], // ← 텍스트 가로 중앙 정렬 (글자 폭에 따라 조정)
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

export default InfoDetailScreen;
