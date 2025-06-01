import apiClient from "@/service/apiClient";
import { TaskList, TaskListResponse } from "@/types/types";

export const getTasklists = async (): Promise<TaskListResponse> => {
  const res = await apiClient.get(`/tasks/v1/users/@me/lists`);
  return res.data;
};

export const getTasklist = async (tasklistId: string): Promise<TaskList> => {
  const res = await apiClient.get(`/tasks/v1/users/@me/lists/${tasklistId}`);
  return res.data;
};

export const createTasklist = async (title: string): Promise<TaskList> => {
  const res = await apiClient.post(`/tasks/v1/users/@me/lists`, { title });
  return res.data;
};

export const updateTasklist = async ({
  tasklistId,
  title,
}: {
  tasklistId: string;
  title: string;
}): Promise<TaskList> => {
  const res = await apiClient.put(`/tasks/v1/users/@me/lists/${tasklistId}`, {
    id: tasklistId,
    title,
  });
  return res.data;
};

export const patchTasklist = async ({
  tasklistId,
  title,
}: {
  tasklistId: string;
  title: string;
}): Promise<TaskList> => {
  const res = await apiClient.patch(`/tasks/v1/users/@me/lists/${tasklistId}`, {
    id: tasklistId,
    title,
  });
  return res.data;
};

export const deleteTasklist = async (tasklistId: string): Promise<void> => {
  await apiClient.delete(`/tasks/v1/users/@me/lists/${tasklistId}`);
};
