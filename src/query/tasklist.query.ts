import {
  getTasklists,
  getTasklist,
  createTasklist,
  updateTasklist,
  patchTasklist,
  deleteTasklist,
} from "@/service/tasklist.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TaskListResponse, TaskList } from "@/types/types";

export const useGetTaskLists = () =>
  useQuery<TaskListResponse, Error>({
    queryKey: ["tasklists"],
    queryFn: getTasklists,
    refetchOnWindowFocus: false,
  });

export const useGetTaskList = (tasklistId: string) =>
  useQuery<TaskList, Error>({
    queryKey: ["tasklist", tasklistId],
    queryFn: () => getTasklist(tasklistId),
    enabled: !!tasklistId,
  });

export const useCreateTaskList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTasklist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasklists"] });
    },
  });
};

export const useUpdateTaskList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) =>
      updateTasklist({ tasklistId: id, title }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasklists"] });
    },
  });
};

export const usePatchTaskList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: patchTasklist,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tasklists"] });
      queryClient.invalidateQueries({ queryKey: ["tasklist", data.id] });
    },
  });
};

export const useDeleteTaskList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTasklist,
    onSuccess: (_, tasklistId) => {
      queryClient.invalidateQueries({ queryKey: ["tasklists"] });
      queryClient.removeQueries({ queryKey: ["tasklist", tasklistId] });
    },
  });
};
