import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  patchTask,
  deleteTask,
  moveTask,
  clearCompletedTasks,
  TaskFilter,
} from "@/service/task.service";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";

export const useGetTasks = ({
  listId,
  filter = null,
  dueMin,
  dueMax,
  maxResults = 10,
}: {
  listId: string;
  filter?: TaskFilter;
  dueMin?: string;
  dueMax?: string;
  maxResults?: number;
}) => {
  return useInfiniteQuery({
    queryKey: ["tasks", listId, filter],
    // queryKey: ["tasks", listId, filter, dueMin, dueMax],
    queryFn: ({ pageParam = undefined }) =>
      getTasks({
        listId,
        filter,
        dueMin,
        dueMax,
        maxResults,
        pageToken: pageParam,
      }),
    getNextPageParam: (lastPage) => lastPage.nextPageToken ?? undefined,
    initialPageParam: undefined,
    enabled: !!listId,
    refetchOnWindowFocus: false,
  });
};

export const useGetTask = (listId: string, taskId: string) => {
  return useQuery({
    queryKey: ["task", listId, taskId],
    queryFn: () => getTask(listId, taskId),
    enabled: !!listId && !!taskId,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      listId: string;
      title: string;
      notes?: string;
      due?: string;
    }) => createTask(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey[0] === "tasks" &&
          query.queryKey[1] === variables.listId,
      });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      listId: string;
      taskId: string;
      title?: string;
      notes?: string;
      due?: string;
      status?: "needsAction" | "completed";
    }) => updateTask(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey[0] === "tasks" &&
          query.queryKey[1] === variables.listId,
      });
    },
  });
};

export const usePatchTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      data: {
        listId: string;
        taskId: string;
      } & Partial<{
        title: string;
        notes: string;
        due: string;
        status: "needsAction" | "completed";
      }>
    ) => patchTask(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey[0] === "tasks" &&
          query.queryKey[1] === variables.listId,
      });
    },
  });
};

export const useDeleteTask = (listId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId: string) => deleteTask(listId, taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", listId] });
    },
  });
};

export const useMoveTask = (listId: string, taskId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (options?: { parent?: string; previous?: string }) =>
      moveTask(listId, taskId, options),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", listId] });
    },
  });
};

export const useClearCompletedTasks = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (listId: string) => clearCompletedTasks(listId),
    onSuccess: (_data, listId) => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey[0] === "tasks" &&
          query.queryKey[1] === listId,
      });
    },
  });
};
