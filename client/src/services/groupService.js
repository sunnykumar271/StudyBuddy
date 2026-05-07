import api from './api';

export const groupService = {
  create: (data) => api.post('/groups/create', data),
  getAll: (params) => api.get('/groups', { params }),
  getById: (id) => api.get(`/groups/${id}`),
  getMine: () => api.get('/groups/mine'),
  join: (id) => api.post(`/groups/${id}/join`),
};
