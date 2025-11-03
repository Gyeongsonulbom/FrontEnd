import api, { withAuth } from './index';

export const changeRequestApi = {
  submitChangeRequest: async (date: string, changeUserId: string, reason: string) => {
    const config = await withAuth();
    return api.post(
      '/user/change-requests',
      {
        changeDate: date,
        changeUserId,
        changeReason: reason,
      },
      config
    );
  },
};
