import api from './api';

export interface User {
  id: number;
  name: string;
  email: string;
}

export const userService = {
  // Update this function to handle the response structure
  getProjectUsers: async (projectId: number) => {
    const res = await api.get(`/projects/${projectId}/users`);
    // Flatten the response: map "item.user" to just "user"
    return res.data.map((item: any) => item.user);
  },

  getAllUsers: async () => {
    const res = await api.get('/users');
    return res.data;
  }
};