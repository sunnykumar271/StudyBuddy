import api from './api';

export const connectionService = {
  sendRequest: (receiverId) => api.post('/connections/request', { receiverId }),
  acceptRequest: (connectionId) => api.post('/connections/accept', { connectionId }),
  rejectRequest: (connectionId) => api.post('/connections/reject', { connectionId }),
  getMyConnections: () => api.get('/connections'),
  getPending: () => api.get('/connections/pending'),
  getConnectionStatus: (targetUserId) =>
  api.get(`/connections/status/${targetUserId}`),
};
