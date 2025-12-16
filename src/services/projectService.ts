import api from './api';

export interface Project {
  id: number;
  title: string;
  description?: string;
  createdOn: string;
  currentUserRole?: number; 
  _count?: { tasks: number };
  updatedOn: string;
  status: number;
  projectOwnerId: number;
  // NEW: Owner Object to display name
  owner?: {
    id: number;
    name: string;
  };
}

export const projectService = {
  getAllProjects: async () => {
    const response = await api.get<Project[]>('/projects');
    return response.data;
  },

  getProjectDetails: async (id: number) => {
    const response = await api.get<Project>(`/projects/${id}`);
    return response.data;
  },

  createProject: async (data: { title: string; description: string ; status?: number; projectOwnerId?:number }) => {
    const response = await api.post('/projects', data);
    return response.data;
  },
  
  updateProject: async (id: number, data: { title: string; description?: string ; status?: number; projectOwnerId?:number }) => {
    const response = await api.patch(`/projects/${id}`, data);
    return response.data;
  },

  deleteProject: async (id: number) => {
    const response = await api.delete<{ message: string }>(`/projects/${id}`);
    return response.data;
  },

  addMember: async (projectId: number, email: string, roleId: number) => {
    const response = await api.post(`/projects/${projectId}/members`, { email, roleId });
    return response.data;
  },
};