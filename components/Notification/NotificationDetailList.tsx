import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, useColorScheme, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation, useTheme } from '@react-navigation/native';
import X from '../../assets/x.svg';
import LightArrow from '../../assets/arrow-left.svg'
import NotReadDot from '../../assets/NotReadDot.svg'
import { useFonts } from 'expo-font';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { getNotificationDetailList } from '../../api/notificationAPi';

type NotificationDetailListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'NotificationDetailListScreen'>;

const NotificationDetailList = () => {
  const [data, setData] = useState<any[]>([]);
  const navigation = useNavigation<NotificationDetailListScreenNavigationProp>();
  const { colors } = useTheme();
  const scheme = useColorScheme() == 'dark';

  const [fontsLoaded] = useFonts({
    'Pretendard-SemiBold': require('../../assets/fonts/Pretendard-SemiBold.ttf'),
    'Pretendard-Medium': require('../../assets/fonts/Pretendard-Medium.ttf')
  });

  if (!fontsLoaded) return null; 

  const fetchData = async () => {
    try {
      const res = await getNotificationDetailList();
      setData(res);
    } catch (err: any) {
      console.log("데이터 요청 실패:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('NotificationDetailScreen', { id: item.id })} 
      activeOpacity={0.8}
    >
      <View style={[styles.item, {backgroundColor: scheme ? '#181A20' : '#FFFFFF', borderColor: scheme ? '#FFFFFF' : '#E5E5E5'}]}>
        {item.isRead ? (
          <View></View>
        ) :
          <NotReadDot style={styles.Dot} />
        }
        <Text 
          style={[
            styles.title,
            { color: item.isRead ? '#999999' : (scheme ? '#FFFFFF' : '#1A1A1A') }
          ]}
        >
          {item.title}
        </Text>

        <Text 
          style={[
            styles.content,
            { color: item.isRead ? '#999999' : (scheme ? '#FFFFFF' : '#1A1A1A') }
          ]}
        >
          {item.content.length > 30 
            ? item.content.slice(0, 20) + '...' 
            : item.content 
          }
        </Text>

        <View style={styles.infoMeta}>
          <Text style={styles.infoMetaText}>{item.formattedDate}</Text>
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
        <Text style={[styles.BackButtonText, {color: scheme ? '#FFFFFF' : '#1A1A1A'}]}>알림</Text>
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
    transform: [{ translateX: -60 }],
  },
  item: {
    marginTop: 20,
    width: 342,
    height: 110,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    borderWidth: 1
  },
  Dot: {
    position: 'absolute',
    top: 16,
    left:8
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

export default NotificationDetailList;
