import { lazy, useCallback, useEffect, useMemo } from "react";
import {
  Tabs,
  Tab,
  Box,
  Typography,
  Paper,
  CircularProgress,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import Navbar from "@/components/navbar";
import {
  useCreateTaskList,
  useDeleteTaskList,
  useGetTaskLists,
  useUpdateTaskList,
} from "@/query/tasklist.query";
import { useGetTasks, usePatchTask } from "@/query/task.query";
import { Task, TaskList } from "@/types/types";
import toast from "react-hot-toast";
import TaskItem from "@/components/task/task-item";
import AddTaskButton from "@/components/task/add-task-button";
import EmptyPage from "@/components/empty-page";
import { FilterMenu } from "@/components/home/filter-menu";
import { ListMenu } from "@/components/home/list-menu";
import TaskLoadingSkeleton from "@/components/home/task-loading-skeleton";
import { useInView } from "react-intersection-observer";
import { isSameDay } from "date-fns";
import { useTranslation } from "react-i18next";
import Loader from "@/components/loader";
import { useSelector, useDispatch } from "react-redux";
import {
  setDialogOpen,
  setEditingList,
  setConfirmDeleteOpen,
  setDueMin,
  setDueMax,
  setSelectedDate,
  setUseDateFilter,
  setSelectedListId,
  setFilter,
} from "@/redux/slices/uiSlice";
import type { RootState, AppDispatch } from "@/redux/store";

const WeeklyDatePicker = lazy(() => import("@/components/weekly-datepicker"));
const TaskListDialog = lazy(() => import("@/components/home/tasklist-dialog"));
const ConfirmDialog = lazy(() => import("@/components/confirm-dialog"));

const Home = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const {
    dialogOpen,
    editingList,
    confirmDeleteOpen,
    dueMin,
    dueMax,
    selectedDate,
    useDateFilter,
    selectedListId,
    filter,
  } = useSelector((state: RootState) => state.ui);

  const { data: taskLists } = useGetTaskLists();
  const { mutate: createTasklist } = useCreateTaskList();
  const { mutate: updateTasklist } = useUpdateTaskList();
  const { mutate: deleteTasklist } = useDeleteTaskList();

  const initialListId = taskLists?.items?.[0]?.id || null;
  const activeListId = selectedListId || initialListId;
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useGetTasks({
    listId: activeListId || "",
    filter,
    ...(useDateFilter && {
      dueMax,
      dueMin,
    }),
  });
  const { mutate: patchTask } = usePatchTask();
  const allTasks = data?.pages.flatMap((page) => page.items) ?? [];

  const filteredTasks = useMemo(() => {
    if (!allTasks) return [];

    return allTasks
      .filter((task: Task) => {
        if (useDateFilter) {
          if (!task.due) return false;

          const dueDate = new Date(task.due);
          const min = dueMin ? new Date(dueMin) : null;
          const max = dueMax ? new Date(dueMax) : null;

          if ((min && dueDate < min) || (max && dueDate > max)) return false;

          if (selectedDate && !isSameDay(new Date(selectedDate), dueDate)) {
            return false;
          }
        }

        return true;
      })
      .filter((task: Task) => {
        if (filter === "completed") return task.status === "completed";
        if (filter === "uncompleted") return task.status === "needsAction";
        return true;
      })
      .sort((a, b) => a.position.localeCompare(b.position));
  }, [allTasks, useDateFilter, dueMin, dueMax, selectedDate, filter]);

  const { ref, inView } = useInView();

  useEffect(() => {
    const savedFilter = sessionStorage.getItem("filter");
    if (savedFilter)
      setFilter(savedFilter as "completed" | "uncompleted" | null);
  }, []);

  useEffect(() => {
    if (filter !== null) {
      sessionStorage.setItem("filter", filter);
    } else {
      sessionStorage.removeItem("filter");
    }
  }, [filter]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage]);

  const handleToggleComplete = useCallback(
    (task: Task) => {
      if (!activeListId) return;
      const taskListId = activeListId;
      patchTask(
        {
          listId: taskListId,
          taskId: task.id,
          status: task.status === "completed" ? "needsAction" : "completed",
        },
        {
          onSuccess: () => {
            toast.success(
              `Task ${task.completed ? "marked incomplete" : "completed"}`
            );
            refetch();
          },
          onError: () => {
            toast.error("Failed to update task status");
          },
        }
      );
    },
    [activeListId, patchTask, refetch]
  );

  const handleDialogSubmit = useCallback(
    ({ id, title }: { id?: string; title: string }) => {
      if (id) {
        updateTasklist(
          { id, title },
          {
            onSuccess: () => {
              toast.success("Task list renamed");
              refetch();
            },
            onError: (e) => {
              console.log(e);
              toast.error("Failed to update task list");
            },
          }
        );
      } else {
        createTasklist(title, {
          onSuccess: (newList: TaskList) => {
            toast.success("Task list created");
            refetch();
            dispatch(setSelectedListId(newList.id));
            sessionStorage.setItem("selectedListId", newList.id);
          },
          onError: () => toast.error("Failed to create task list"),
        });
      }
      dispatch(setDialogOpen(false));
    },
    [updateTasklist, createTasklist, refetch, dispatch]
  );

  const handleToggleDateFilter = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const checked = event.target.checked;
      dispatch(setUseDateFilter(checked));

      if (!checked) {
        dispatch(setDueMin(undefined));
        dispatch(setDueMax(undefined));
        dispatch(setSelectedDate(null));
      }
    },
    [dispatch]
  );

  const handleConfirmDelete = () => {
    if (!selectedListId) return;
    deleteTasklist(selectedListId, {
      onSuccess: () => {
        toast.success("Task list deleted");
        dispatch(setSelectedListId(null));
      },
      onError: () => {
        toast.error("Failed to delete task list");
      },
    });
    dispatch(setConfirmDeleteOpen(false));
  };

  if (!taskLists?.items?.length) {
    return <Loader />;
  }

  return (
    <Box sx={{ p: 2, maxWidth: "1024px", mx: "auto" }}>
      <Navbar />

      <Tabs
        value={activeListId || ""}
        onChange={(_, newVal) => {
          if (newVal === "new") return;
          dispatch(setSelectedListId(newVal));
          sessionStorage.setItem("selectedListId", newVal);
        }}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}
      >
        {taskLists.items.map((list: TaskList) => (
          <Tab key={list.id} label={list.title} value={list.id} />
        ))}
        <Tab
          label="+ New List"
          value="new"
          onClick={(e) => {
            e.stopPropagation();
            dispatch(setEditingList(null));
            dispatch(setDialogOpen(true));
          }}
        />
      </Tabs>

      <Box>
        <FormControlLabel
          control={
            <Checkbox
              checked={useDateFilter}
              onChange={handleToggleDateFilter}
            />
          }
          label={t("filter-week")}
        />
        {useDateFilter && (
          <WeeklyDatePicker
            onFilterChange={({ dueMin, dueMax, selectedDate }) => {
              dispatch(setDueMin(dueMin));
              dispatch(setDueMax(dueMax));
              dispatch(setSelectedDate(selectedDate));
            }}
          />
        )}
      </Box>

      {taskLists.items.map((list: TaskList) => {
        if (activeListId !== list.id) return null;

        return (
          <Paper
            key={list.id}
            elevation={1}
            sx={{ mt: 2, mb: 10, p: 2, borderRadius: 2 }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>
                {list.title} ({filteredTasks.length})
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <FilterMenu />

                <ListMenu
                  items={taskLists?.items || []}
                  activeListId={activeListId}
                  disableDelete={activeListId === taskLists?.items?.[0]?.id}
                />
              </Box>
            </Box>

            {isLoading ? (
              <TaskLoadingSkeleton length={5} />
            ) : filteredTasks?.length ? (
              <Box
                component="ul"
                sx={{
                  listStyle: "none",
                  p: 0,
                  mt: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {filteredTasks.map((task: Task, index: number) => {
                  const isLast = index === filteredTasks.length - 1;
                  return (
                    <Box
                      key={task.id}
                      component="div"
                      ref={isLast ? ref : null}
                    >
                      <TaskItem
                        tasklistId={activeListId}
                        task={task}
                        onClick={handleToggleComplete}
                      />
                    </Box>
                  );
                })}
                {isFetchingNextPage && (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    my={2}
                  >
                    <CircularProgress size={24} />
                    <Typography variant="body2" ml={1}>
                      Loading more tasks...
                    </Typography>
                  </Box>
                )}
              </Box>
            ) : (
              <EmptyPage />
            )}
          </Paper>
        );
      })}

      <Box sx={{ position: "fixed", bottom: 32, right: 32, zIndex: 1300 }}>
        <AddTaskButton
          tasklistId={activeListId || ""}
          tasklists={taskLists.items}
        />
      </Box>

      <TaskListDialog
        open={dialogOpen}
        onClose={() => dispatch(setDialogOpen(false))}
        onSubmit={handleDialogSubmit}
        initialTitle={editingList?.title}
        listId={editingList?.id}
      />

      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Delete this task list?"
        content="This action cannot be undone. All tasks in the list will be deleted."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => dispatch(setConfirmDeleteOpen(false))}
      />
    </Box>
  );
};

export default Home;
