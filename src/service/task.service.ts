import apiClient from "@/service/apiClient";

export type TaskFilter = null | "completed" | "uncompleted";

interface GetTasksParams {
  listId: string;
  filter?: TaskFilter;
  dueMin?: string;
  dueMax?: string;
  pageToken?: string;
  maxResults?: number;
}

export const getTasks = async ({
  listId,
  filter = null,
  dueMin,
  dueMax,
  pageToken,
  maxResults = 10,
}: GetTasksParams) => {
  const params: Record<string, string | boolean | number | undefined> = {
    maxResults,
    pageToken,
    showDeleted: false,
  };

  // if (dueMin) params.dueMin = dueMin;
  // if (dueMax) params.dueMax = dueMax;

  const usingDueRange = dueMin || dueMax;
  if (usingDueRange) {
    params.showCompleted = true;
  } else if (filter === "completed") {
    params.showCompleted = true;
  } else if (filter === "uncompleted") {
    params.showCompleted = false;
  }

  const res = await apiClient.get(`/tasks/v1/lists/${listId}/tasks`, {
    params,
  });

  return res.data;
};


export const getTask = async (listId: string, taskId: string) => {
  const res = await apiClient.get(`/tasks/v1/lists/${listId}/tasks/${taskId}`);
  return res.data;
};

export const createTask = async ({
  listId,
  title,
  notes,
  due,
}: {
  listId: string;
  title: string;
  notes?: string;
  due?: string;
}) => {
  const res = await apiClient.post(`/tasks/v1/lists/${listId}/tasks`, {
    title,
    notes,
    due,
  });
  return res.data;
};

export const updateTask = async (data: {
  listId: string;
  taskId: string;
  title?: string;
  notes?: string;
  due?: string;
  status?: "needsAction" | "completed";
}) => {
  const { listId, taskId, ...restOfTaskData } = data;

  const requestBody = {
    id: taskId,
    ...restOfTaskData,
  };

  const res = await apiClient.put(
    `/tasks/v1/lists/${listId}/tasks/${taskId}`,
    requestBody
  );
  return res.data;
};

export const patchTask = async (
  data: {
    listId: string;
    taskId: string;
  } & Partial<{
    title: string;
    notes: string;
    due: string;
    status: "needsAction" | "completed";
  }>
) => {
  const { listId, taskId, ...taskData } = data;

  const res = await apiClient.patch(
    `/tasks/v1/lists/${listId}/tasks/${taskId}`,
    taskData
  );
  return res.data;
};

export const deleteTask = async (listId: string, taskId: string) => {
  await apiClient.delete(`/tasks/v1/lists/${listId}/tasks/${taskId}`);
};

export const moveTask = async (
  listId: string,
  taskId: string,
  options?: { parent?: string; previous?: string }
) => {
  const res = await apiClient.post(
    `/tasks/v1/lists/${listId}/tasks/${taskId}/move`,
    null,
    {
      params: options,
    }
  );
  return res.data;
};

export const clearCompletedTasks = async (listId: string) => {
  await apiClient.post(`/tasks/v1/lists/${listId}/clear`);
};
