import api, { withAuth } from './index';

export const getActivityDay = async () => {
  const config = await withAuth();
  const res = await api.get('/user/activity', config);
  return res.data.data.activity;
};

export const userApi = {
  // 내 이름 가져오기
  getMyName: async () => {
    const config = await withAuth();
    return api.get('/user/name', config);
  },

  // 선택된 날짜 기준으로 교체 가능한 유저 목록 가져오기
  getUserListByDate: async (dateString: string) => {
    const config = await withAuth();
    return api.get(`/user/user-list?changeRequestFromUserListDate=${dateString}`, config);
  },
};
