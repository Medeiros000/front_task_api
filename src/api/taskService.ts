import api from "./axios";
import { Task } from "../types/class";

export const taskService = {
	// O filtro de título entra aqui como um objeto de params
	async getAll(title?: string) {
		const response = await api.get<Task[]>("/tasks", {
			params: { title },
		});
		return response.data;
	},

  async getById(id: number) {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  },

	async create(data: { title: string; description?: string }) {
		const response = await api.post<Task>("/tasks", data);
		return response.data;
	},

	async update(id: number, data: { title: string; description?: string; status?: boolean }) {
		const response = await api.put<Task>(`/tasks/${id}`, data);
		return response.data;
	},

	async delete(id: number) {
		await api.delete(`/tasks/${id}`);
	},
};
