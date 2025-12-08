import api from "./api"; 

export interface Task {
  id: number;
  summary: string;
  description: string;
  projectId: number;
  statusId: number;
  priorityId: number;
  typeId: number;
  assignedToId: number | null;
  dueDate: string | null; 
  createdById: number;
   message: string;
  status?: string;
  priority?: string;
  type?: string;
  assignedTo?: string; 
}

export const taskService = {
  getTasksByProject: async (projectId: number | string): Promise<Task[]> => {
    const response = await api.get(`/projects/${projectId}/tasks`);
    return response.data;
  },

  getAllTasks: async (): Promise<Task[]> => {
    const response = await api.get(`/tasks`);
    return response.data;
  },

  createTask: async (taskData: any): Promise<Task> => {
    const response = await api.post("/tasks", taskData);
    return response.data;
  },

  updateTask: async (id: number, taskData: any): Promise<Task> => {
    const response = await api.patch(`/tasks/${id}`, taskData);
    return response.data;
  },

  deleteTask: async (id: number) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  }
};