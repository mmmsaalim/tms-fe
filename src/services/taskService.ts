// src/services/taskService.ts

const API_URL = "http://localhost:3000/tasks";

export interface Task {
  id: number;
  title: string;
  assignedTo: string;
  status: string;
  createdAt?: string;
}

export const taskService = {
  // 1. Get All Tasks
  getAllTasks: async (): Promise<Task[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch tasks");
    return response.json();
  },

  // 2. Create Task
  createTask: async (taskData: Omit<Task, "id">): Promise<Task> => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });
    if (!response.ok) throw new Error("Failed to create task");
    return response.json();
  },

  // 3. Delete Task
  deleteTask: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete task");
  }
};