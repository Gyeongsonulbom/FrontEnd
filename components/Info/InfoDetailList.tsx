import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, useColorScheme, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import X from '../../assets/x.svg';
import LightArrow from '../../assets/arrow-left.svg'
import { useFonts } from 'expo-font';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { getInfoDetailList } from '../../api/info';

type InfoDetailListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'InfoDetailListScreen'>;

const InfoDetailList = () => {
  const [data, setData] = useState<any[]>([]);
  const navigation = useNavigation<InfoDetailListScreenNavigationProp>();
  const { colors } = useTheme();
  const scheme = useColorScheme() == 'dark';

  const [fontsLoaded] = useFonts({
    'Pretendard-SemiBold': require('../../assets/fonts/Pretendard-SemiBold.ttf'),
    'Pretendard-Medium': require('../../assets/fonts/Pretendard-Medium.ttf')
  });

  if (!fontsLoaded) return null; // 리스트 데이터 저장용 상태

  // 데이터 불러오기 함수
  const fetchData = async () => {
    try {
      const res = await getInfoDetailList();
      setData(res);
    } catch (err: any) {
      console.log("데이터 요청 실패:", err.response?.data || err.message);
    }
  };

  // 컴포넌트 마운트 시 한 번 실행
  useEffect(() => {
    fetchData();
  }, []);

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('InfoDetailScreen', { id: item.id })} 
      activeOpacity={0.8}
    >
      <View style={[styles.item, {backgroundColor: scheme ? '#181A20' : '#FFFFFF', borderColor: scheme ? '#FFFFFF' : '#E5E5E5'}]}>
        <Text style={[styles.title, {color: scheme ? '#FFFFFF' : '#1A1A1A'}]}>{item.title}</Text>
        <Text style={[styles.content, {color: scheme ? '#FFFFFF' : '#1A1A1A'}]}>{item.content.length > 30 ? item.content.slice(0, 30) + '...' : item.content }</Text>
        <View style={styles.infoMeta}>
          <Text style={styles.infoMetaText}>{item.writerName}</Text>
          <Text style={styles.infoMetaText}>조회 {item.views}회</Text>
          <Text style={styles.infoMetaText}>{item.date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );


  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.BackButton}>
        {scheme ?
          (<X onPress={navigation.goBack} />) :
          (<LightArrow onPress={navigation.goBack} />)
        }
        <Text style={[styles.BackButtonText, {color: scheme ? '#FFFFFF' : '#1A1A1A'}]}>도움말</Text>
      </View>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
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
    transform: [{ translateX: -60 }], // ← 텍스트 가로 중앙 정렬 (글자 폭에 따라 조정)
  },
  item: {
    marginTop: 20,
    width: 342,
    height: 110,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    borderWidth: 1
  },
  title: {
    fontSize: 18,
    marginTop: 10,
    marginLeft: 20,
    fontWeight: '600',
  },
  content: {
    fontSize: 12,
    marginTop: 5,
    marginLeft: 20,
    color: '#555',
  },
  infoMeta: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
    marginLeft: 20,
  },
  infoMetaText: {
    color: '#999999'
  }
});

export default InfoDetailList;
