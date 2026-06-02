import api from './instance'

export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  signup: (data: { email: string; password: string; name: string }) =>
    api.post('/auth/signup', data),

  getProfile: () =>
    api.get('/users/me'),

  logout: () =>
    api.post('/auth/logout'),

  reissue: (refreshToken: string) =>
    api.post('/auth/reissue', { refreshToken }),
}
