import api from './api';

export interface CreateProjectDto {
  title: string;
  description?: string;
  createdOn?: string; 
  dueDate?: string;   
  status?: number;         
  projectOwnerId?: number;  
  createdById?: number;    
}

export interface Project {
  id: number;
  title: string;
  description?: string;
  createdOn: string;
  dueDate?: string;
  updatedOn?: string; 
  updatedBy?: number; 
}

export const projectService = {
  getAllProjects: async () => {
    const response = await api.get<Project[]>('/projects');
    return response.data;
  },

  createProject: async (data: CreateProjectDto) => {
    const response = await api.post<Project>('/projects', data);
    return response.data;
  },
  
  updateProject: async (id: number, data: { title: string; description?: string; dueDate?: string }) => {
    const response = await api.patch(`/projects/${id}`, data);
    return response.data;
  },

  deleteProject: async (id: number) => {
    const response = await api.delete<{ message: string }>(`/projects/${id}`);
    return response.data;
  }
};