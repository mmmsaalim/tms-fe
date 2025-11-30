import api from './api';

// Match your Prisma Schema structure
export interface Task {
  id: number;
  summary: string;
  description?: string;
  status: string; // The backend should return the status Name, not ID, or handle mapping
  assignedTo?: string; // Backend should return User name
  priority: string;
  projectId: number;
  // ... other fields
}

export const taskService = {
  // Get tasks specific to a project
  getTasksByProject: async (projectId: string | number) => {
    // Assumes Backend has GET /projects/:id/tasks
    const response = await api.get<Task[]>(`/projects/${projectId}/tasks`);
    return response.data;
  },

  getAllTasks: async () => {
    const response = await api.get<Task[]>('/tasks');
    return response.data;
  },

  createTask: async (taskData: any) => {
    const response = await api.post<Task>('/tasks', taskData);
    return response.data;
  },

  deleteTask: async (id: number) => {
    await api.delete(`/tasks/${id}`);
  }
};