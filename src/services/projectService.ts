import api from './api'; // Assuming you have an axios instance setup here

// 1. Define what creates a project (Input DTO)
export interface CreateProjectDto {
  title: string;
  description?: string;
  status?: number;          // <--- ALLOW THIS
  projectOwnerId?: number;  // <--- ALLOW THIS
  createdById?: number;     // <--- ALLOW THIS
}

// 2. Define what a project looks like (Output)
export interface Project {
  id: number;
  title: string;
  description?: string;
  createdOn: string; // or Date
  // ... other fields from DB
}

export const projectService = {
  getAllProjects: async () => {
    const response = await api.get<Project[]>('/projects');
    return response.data;
  },

  // 3. UPDATE THE ARGUMENT TYPE HERE
  createProject: async (data: CreateProjectDto) => {
    const response = await api.post<Project>('/projects', data);
    return response.data;
  },

  deleteProject: async (id: number) => {
    await api.delete(`/projects/${id}`);
  }
};