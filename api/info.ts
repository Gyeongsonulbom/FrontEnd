import api, { withAuth } from './index';

export const getInfoList = async () => {
  const res = await api.get('/info');
  return res.data.data.map((item: any) => ({
    id: item.infoId.toString(),
    title: item.infoName,
    content: item.infoContent,
    date: item.createdAt,
  }));
};

export const getInfoDetailList = async () => {
  const res = await api.get('/info/detail-list');
  return res.data.data.map((item: any) => ({
    id: item.infoId.toString(),
    title: item.infoName,
    content: item.infoContent,
    date: item.createdAt,
    writerName: item.infoWriterName,
    views: item.infoViews
  }));
};

export const getInfoDetail = async (id: number) => {
  const res = await api.get(`/info/${id}`);
  const item = res.data.data; // 단일 객체라고 가정

  return {
    title: item.infoName,
    content: item.infoContent,
    date: item.createdAt,
    writerName: item.infoWriterName,
    views: item.infoViews,
  };
};

