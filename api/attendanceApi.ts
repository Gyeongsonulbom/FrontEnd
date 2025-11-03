import api, { withAuth } from './index';

export const attendanceApi = {
  checkAttendance: async (uuid: string) => {
    const config = await withAuth(); // 토큰 자동 추가
    return api.post('/user/attendance', { uuid }, config);
  },
};
