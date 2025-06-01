import { useEffect, useState } from "react";
import {
  Button,
  Switch,
  Chip,
  CircularProgress,
  MenuItem,
  Typography,
  Box,
  Paper,
  Divider,
  TextField,
  useTheme,
} from "@mui/material";
import { useDeleteTask, useGetTask, useUpdateTask } from "@/query/task.query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import toast from "react-hot-toast";
import { parseISO } from "date-fns";
import { ChevronLeft, SquarePen, X } from "lucide-react";
import ConfirmDialog from "@/components/confirm-dialog";
import { useTranslation } from "react-i18next";
import {
  requestNotificationPermission,
  saveNotification,
} from "@/utils/notification-db";

interface EditTaskProps {
  dialogMode?: boolean;
  taskId?: string;
  tasklistId?: string;
  onClose?: () => void;
}

const EditTask = ({
  dialogMode = false,
  taskId: propTaskId,
  tasklistId: propTasklistId,
  onClose,
}: EditTaskProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [due, setDue] = useState<Date | null>(null);
  const [status, setStatus] = useState<"needsAction" | "completed">(
    "needsAction"
  );
  const [notification, setNotification] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { t } = useTranslation();

  const taskId = dialogMode
    ? propTaskId || ""
    : searchParams.get("taskId") || "";
  const tasklistId = dialogMode
    ? propTasklistId || ""
    : searchParams.get("tasklistId") || "";

  const { data: taskDetail } = useGetTask(tasklistId, taskId);
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask();
  const { mutate: deleteTask, isPending: isDeleting } =
    useDeleteTask(tasklistId);

  useEffect(() => {
    if (taskDetail) {
      setTaskTitle(taskDetail.title || "");
      setNotes(taskDetail.notes || "");
      setDue(taskDetail.due ? parseISO(taskDetail.due) : null);
      setStatus(taskDetail.status || "needsAction");
    }
  }, [taskDetail]);

  const handleConfirmDelete = () => {
    deleteTask(taskId, {
      onSuccess: () => {
        toast.success("Deleted task");
        dialogMode && onClose ? onClose() : navigate(-1);
      },
    });
    setIsConfirmOpen(false);
  };

  const handleUpdateTask = async () => {
    if (!taskTitle.trim()) return;

    if (notification && due) {
      const granted = await requestNotificationPermission();
      if (granted) {
        await saveNotification({
          taskId: taskId || "",
          title: taskTitle,
          due: due.toISOString(),
        });
      }
    }

    updateTask(
      {
        listId: tasklistId || "",
        taskId: taskId || "",
        title: taskTitle,
        notes,
        due: due?.toISOString(),
        status,
      },
      {
        onSuccess: () => {
          toast.success("Updated task");
          dialogMode && onClose ? onClose() : navigate(-1);
        },
      }
    );
  };

  return (
    <Box
      height="100%"
      display="flex"
      sx={{ maxWidth: "1240px", mx: "auto" }}
      flexDirection="column"
    >
      {/* Header */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        px={1}
        py={2}
        component={Paper}
        elevation={1}
      >
        <Button
          onClick={() => (dialogMode && onClose ? onClose() : navigate(-1))}
        >
          <ChevronLeft color={theme.palette.text.primary} />
        </Button>

        <Typography variant="subtitle1" fontWeight={500}>
          {isEditing ? t("update-task") : t("task-detail")}
        </Typography>

        {isEditing ? (
          <Button onClick={() => setIsEditing(false)}>
            <X color={theme.palette.text.secondary} />
          </Button>
        ) : (
          <Button onClick={() => setIsEditing(true)}>
            <SquarePen color={theme.palette.text.primary} />
          </Button>
        )}
      </Box>

      {/* Content */}
      <Box
        flexGrow={1}
        px={2}
        py={4}
        display="flex"
        flexDirection="column"
        gap={4}
      >
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label={t("title")}
            variant="outlined"
            size="small"
            fullWidth
            disabled={!isEditing}
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />
          <TextField
            label={t("note")}
            variant="outlined"
            size="small"
            fullWidth
            disabled={!isEditing}
            multiline
            minRows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Box>

        <Paper variant="outlined">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            px={2}
            py={2}
          >
            <Typography variant="body2" fontWeight={500}>
              {t("due-date")}
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                value={due}
                disabled={!isEditing}
                onChange={(newValue) => setDue(newValue)}
                slotProps={{
                  textField: { size: "small" },
                }}
              />
            </LocalizationProvider>
          </Box>
          <Divider />
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            px={2}
            py={2}
          >
            <Typography variant="body2" fontWeight={500}>
              {t("status")}
            </Typography>
            {!isEditing ? (
              <Chip
                label={status === "completed" ? t("completed") : t("pending")}
                color={status === "completed" ? "success" : "default"}
                variant="outlined"
                size="small"
              />
            ) : (
              <TextField
                select
                size="small"
                value={status}
                disabled={!isEditing}
                onChange={(e) =>
                  setStatus(e.target.value as "needsAction" | "completed")
                }
                sx={{ minWidth: 150 }}
              >
                <MenuItem value="needsAction">Pending</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </TextField>
            )}
          </Box>
        </Paper>

        <Paper
          variant="outlined"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
          }}
        >
          <Typography variant="body2" fontWeight={500}>
            {t("notification")}
          </Typography>
          <Switch
            disabled={!isEditing}
            checked={notification}
            onChange={(e) => setNotification(e.target.checked)}
          />
        </Paper>
      </Box>

      {/* Action buttons */}
      <Box px={2} py={2} borderTop={`1px solid ${theme.palette.divider}`}>
        {isEditing ? (
          <Button
            onClick={handleUpdateTask}
            variant="contained"
            fullWidth
            sx={{ py: 1 }}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <CircularProgress size={20} sx={{ color: "#fff" }} />
            ) : (
              t("update-task")
            )}
          </Button>
        ) : (
          <Button
            variant="outlined"
            fullWidth
            color="error"
            sx={{
              py: 1,
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark" ? "#522" : "#fddede",
              },
            }}
            disabled={isDeleting}
            onClick={() => setIsConfirmOpen(true)}
          >
            {isDeleting ? (
              <CircularProgress size={20} sx={{ color: "error.main" }} />
            ) : (
              t("delete-task")
            )}
          </Button>
        )}
      </Box>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={isConfirmOpen}
        title="Delete Task"
        content="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </Box>
  );
};

export default EditTask;
