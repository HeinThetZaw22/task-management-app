import { useEffect, useState } from "react";
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
import {
  useClearCompletedTasks,
  useGetTasks,
  usePatchTask,
} from "@/query/task.query";
import { Task, TaskList } from "@/types/types";
import toast from "react-hot-toast";
import TaskItem from "@/components/task/task-item";
import AddTaskButton from "@/components/task/add-task-button";
import EmptyPage from "@/components/empty-page";
import { FilterMenu } from "@/components/home/filter-menu";
import { ListMenu } from "@/components/home/list-menu";
import TaskLoadingSkeleton from "@/components/home/task-loading-skeleton";
import TaskListDialog from "@/components/home/tasklist-dialog";
import ConfirmDialog from "@/components/confirm-dialog";
import { useInView } from "react-intersection-observer";
import WeeklyDatePicker from "@/components/weekly-datepicker";
import { isSameDay } from "date-fns";
import { useTranslation } from "react-i18next";
import Loader from "@/components/loader";

const Home = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingList, setEditingList] = useState<null | TaskList>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [dueMin, setDueMin] = useState<string | undefined>();
  const [dueMax, setDueMax] = useState<string | undefined>();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [useDateFilter, setUseDateFilter] = useState(false);
  const { t } = useTranslation();

  const getInitialSelectedListId = () => {
    return sessionStorage.getItem("selectedListId");
  };

  const [selectedListId, setSelectedListId] = useState<string | null>(
    getInitialSelectedListId()
  );
  const [filter, setFilter] = useState<null | "completed" | "uncompleted">(
    null
  );
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const isFilterMenuOpen = Boolean(filterAnchorEl);

  const [listMenuAnchorEl, setListMenuAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const isListMenuOpen = Boolean(listMenuAnchorEl);

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
  const { mutate: clearCompletedTasks } = useClearCompletedTasks();
  const allTasks = data?.pages.flatMap((page) => page.items) ?? [];

  const filteredTasks = allTasks
    .filter((task: Task) => {
      if (useDateFilter) {
        if (!task.due) return false;

        const dueDate = new Date(task.due);
        const min = dueMin ? new Date(dueMin) : null;
        const max = dueMax ? new Date(dueMax) : null;

        if ((min && dueDate < min) || (max && dueDate > max)) {
          return false;
        }

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
    .sort((a: Task, b: Task) => a.position.localeCompare(b.position));

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
    if (inView && hasNextPage && isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage]);

  const handleToggleComplete = (task: Task) => {
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
  };

  const handleOpenNewListDialog = () => {
    setEditingList(null);
    setDialogOpen(true);
  };

  const handleOpenRenameDialog = (list: TaskList) => {
    setEditingList(list);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDialogSubmit = ({
    id,
    title,
  }: {
    id?: string;
    title: string;
  }) => {
    if (id) {
      updateTasklist(
        { id, title },
        {
          onSuccess: () => {
            toast.success("Task list renamed");
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
          setSelectedListId(newList.id);
          sessionStorage.setItem("selectedListId", newList.id);
        },
        onError: () => toast.error("Failed to create task list"),
      });
    }
    setDialogOpen(false);
  };

  const handleListMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setListMenuAnchorEl(event.currentTarget);
  };

  const handleListMenuClose = () => {
    setListMenuAnchorEl(null);
  };

  const handleDeleteList = () => {
    handleListMenuClose();
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!activeListId) return;
    deleteTasklist(activeListId, {
      onSuccess: () => {
        toast.success("Task list deleted");
        setSelectedListId(null);
        sessionStorage.removeItem("selectedListId");
      },
      onError: () => {
        toast.error("Failed to delete task list");
      },
    });
    setConfirmDeleteOpen(false);
  };

  const handleCancelDelete = () => {
    setConfirmDeleteOpen(false);
  };

  const handleRenameList = () => {
    handleListMenuClose();
    const list = taskLists?.items.find((l) => l.id === activeListId);
    if (list) handleOpenRenameDialog(list);
  };

  const handleDeleteCompletedTasks = () => {
    handleListMenuClose();
    clearCompletedTasks(activeListId || "", {
      onSuccess: () => {
        toast.success("Deleted complete tasks");
        refetch();
      },
      onError: () => {
        toast.error("Failed to delete complete tasks");
      },
    });
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterChange = (value: null | "completed" | "uncompleted") => {
    setFilter(value);
    handleFilterClose();
  };

  const handleToggleDateFilter = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const checked = event.target.checked;
    setUseDateFilter(checked);

    if (!checked) {
      setDueMin(undefined);
      setDueMax(undefined);
      setSelectedDate(null);
    }
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
          setSelectedListId(newVal);
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
            handleOpenNewListDialog();
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
              setDueMin(dueMin);
              setDueMax(dueMax);
              setSelectedDate(selectedDate);
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
                <FilterMenu
                  anchorEl={filterAnchorEl}
                  open={isFilterMenuOpen}
                  onClick={handleFilterClick}
                  onClose={handleFilterClose}
                  currentFilter={filter}
                  onChange={handleFilterChange}
                />

                <ListMenu
                  anchorEl={listMenuAnchorEl}
                  open={isListMenuOpen}
                  onClick={handleListMenuClick}
                  onClose={handleListMenuClose}
                  onDelete={handleDeleteList}
                  onRename={handleRenameList}
                  onDeleteCompleted={handleDeleteCompletedTasks}
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
        onClose={handleDialogClose}
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
        onCancel={handleCancelDelete}
      />
    </Box>
  );
};

export default Home;
