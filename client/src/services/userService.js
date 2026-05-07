import api from './api';

export const userService = {
  getAll: (params) => api.get('/users', { params }),
  getMatches: () => api.get('/users/matches'),
  getById: (id) => api.get(`/users/${id}`),
  editProfile: (data) => api.put('/users/edit-profile', data),
  completeOnboarding: (data) => api.put('/users/onboarding', data),
};
