import api from './api';

export interface User {
  id: number;
  name: string;
  email: string;
}

export const userService = {
  getProjectUsers: async (projectId: number) => {
    const res = await api.get(`/projects/${projectId}/users`);
    // backend returns: [{ user: { id, name, email }}]
    return res.data.map((obj: any) => obj.user);
  }
};
