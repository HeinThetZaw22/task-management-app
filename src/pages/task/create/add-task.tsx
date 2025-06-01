import { useState } from "react";
import {
  Box,
  Button,
  Switch,
  Chip,
  Typography,
  CircularProgress,
  TextField,
  Stack,
  Paper,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useCreateTask } from "@/query/task.query";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import {
  requestNotificationPermission,
  saveNotification,
} from "@/utils/notification-db";

const AddTask = ({
  onClose,
  tasklistId,
  title,
}: {
  onClose: () => void;
  tasklistId: string;
  title: string;
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { tasklistId: routeTasklistId } = useParams();
  const { t } = useTranslation();

  const finalTasklistId = tasklistId || routeTasklistId || "";
  const finalTitle =
    title || decodeURIComponent(searchParams.get("title") || "");

  const [taskTitle, setTaskTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [due, setDue] = useState<Date | null>(null);
  const [notification, setNotification] = useState(false);

  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));

  const handleCancel = () => {
    if (isLargeScreen) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  const { mutate: createTask, isPending: isLoading } = useCreateTask();

  const handleCreateTask = async () => {
    if (!taskTitle.trim()) return;

    createTask(
      {
        listId: finalTasklistId || "",
        title: taskTitle,
        notes,
        due: due?.toISOString(),
      },
      {
        onSuccess: async (data) => {
          toast.success("Added new task");

          if (notification && due) {
            const granted = await requestNotificationPermission();
            if (granted) {
              await saveNotification({
                taskId: data.id,
                title: taskTitle,
                due: due.toISOString(),
              });
            }
          }

          handleCancel();
        },
      }
    );
  };

  return (
    <Box
      display="flex"
      sx={{ maxWidth: "1240px", mx: "auto" }}
      flexDirection="column"
      height="100%"
    >
      {/* Header */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        px={2}
        py={1.5}
        boxShadow={1}
        borderBottom={1}
        borderColor="divider"
        bgcolor="background.paper"
      >
        <Button
          onClick={handleCancel}
          variant="text"
          type="button"
          sx={{ px: 0, color: "primary.main" }}
        >
          {t("cancel")}
        </Button>

        <Typography variant="subtitle1" fontWeight={500}>
          {finalTitle || "New Task"}
        </Typography>

        <Box width="64px" />
      </Box>

      {/* Main Content */}
      <Box flexGrow={1} px={2} py={3}>
        <Stack spacing={4}>
          {/* Inputs */}
          <Stack spacing={2}>
            <TextField
              label={t("title")}
              variant="outlined"
              size="small"
              fullWidth
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
            <TextField
              label={t("note")}
              variant="outlined"
              size="small"
              fullWidth
              multiline
              minRows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Stack>

          {/* Due & Status */}
          <Paper variant="outlined">
            <Stack divider={<Divider />} spacing={0}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                px={2}
                py={1.5}
              >
                <Typography variant="body2" fontWeight={500}>
                  {t("due-date")}
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    value={due}
                    onChange={(newValue) => setDue(newValue)}
                    slotProps={{
                      textField: {
                        size: "small",
                        sx: { minWidth: 200 },
                      },
                    }}
                  />
                </LocalizationProvider>
              </Box>

              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                px={2}
                py={1.5}
              >
                <Typography variant="body2" fontWeight={500}>
                  {t("status")}
                </Typography>
                <Chip label="Not Started" variant="outlined" size="small" />
              </Box>
            </Stack>
          </Paper>

          {/* Notification Toggle */}
          <Paper
            variant="outlined"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
            }}
          >
            <Typography variant="body2" fontWeight={500}>
              {t("notification")}
            </Typography>
            <Switch
              checked={notification}
              onChange={(e) => setNotification(e.target.checked)}
            />
          </Paper>
        </Stack>
      </Box>

      {/* Footer */}
      <Box px={2} py={2} borderTop={1} borderColor="divider">
        <Button
          onClick={handleCreateTask}
          variant="contained"
          fullWidth
          sx={{ py: 1.2 }}
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress size={20} sx={{ color: "white" }} />
          ) : (
            t("add-task")
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default AddTask;
