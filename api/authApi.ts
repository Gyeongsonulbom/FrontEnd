import api from './index';

export const authApi = {
  login: async (userId: string, userPassword: string) => {
    return api.post('/auth/login', {
      userId,
      userPassword,
    });
  },
};
