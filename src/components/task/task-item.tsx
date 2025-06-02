import { Task } from "@/types/types";
import {
  format,
  formatDistanceToNow,
  isToday,
  isTomorrow,
  isPast,
  parseISO,
} from "date-fns";
import {
  Box,
  Typography,
  Checkbox,
  ListItem,
  useTheme,
  Button,
  useMediaQuery,
  Dialog,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import EditTask from "@/pages/task/edit/edit-task";
import { useTranslation } from "react-i18next";

interface TaskItemProps {
  task: Task;
  tasklistId: string;
  onClick: (task: Task) => void;
}

const getTruncatedTitle = (title: string, wordLimit = 5) => {
  const words = title.trim().split(/\s+/);
  return words.length > wordLimit
    ? words.slice(0, wordLimit).join(" ") + "..."
    : title;
};

const TaskItem = ({ task, tasklistId, onClick }: TaskItemProps) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [openDialog, setOpenDialog] = useState(false);
  const { t } = useTranslation();

  const handleItemClick = () => {
    if (isMobile) {
      navigate(`/edit-task?taskId=${task.id}&tasklistId=${tasklistId}`);
    } else {
      setOpenDialog(true);
    }
  };

  const wordLimit = isMobile ? 3 : 15;
  const noteLimit = isMobile ? 5 : 15;

  const isCompleted = task.status === "completed";
  const dueDate = task.due ? parseISO(task.due) : null;
  const isDueToday = dueDate && isToday(dueDate);

  const borderColor = isCompleted
    ? "success.main"
    : isDueToday
    ? "primary.main"
    : "grey.200";

  const badgeLabel = isCompleted
    ? t("completed")
    : isDueToday
    ? t("pending")
    : t("to-do");
  const badgeColor = isCompleted
    ? "success"
    : isDueToday
    ? "primary"
    : "inherit";

  const renderDue = () => {
    if (!task.due) return null;

    // const time = format(dueDate!, "p");

    if (isTomorrow(dueDate!)) return `Due: Tomorrow`;
    if (isToday(dueDate!)) return `Due: Today`;
    if (isPast(dueDate!))
      return `Due: ${formatDistanceToNow(dueDate!, { addSuffix: true })}`;
    return `Due: ${format(dueDate!, "EEE, MMM d, p")}`;
  };

  const renderCompleted = () => {
    if (!task.completed) return "";
    const completedDate = parseISO(task.completed);
    return ` (Completed ${formatDistanceToNow(completedDate, {
      addSuffix: true,
    })})`;
  };

  return (
    <>
      <ListItem
        onClick={handleItemClick}
        sx={{
          cursor: "pointer",
          borderRadius: 1.5,
          borderLeft: `4px solid`,
          borderLeftColor: borderColor,
          boxShadow: 1,
          px: 1.5,
          py: 1,
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
          bgcolor: "background.paper",
        }}
        disablePadding
      >
        <Checkbox
          checked={isCompleted}
          onClick={(e) => {
            e.stopPropagation();
            onClick(task);
          }}
          color="primary"
          sx={{ mt: 0.5 }}
        />

        <Box sx={{ flexGrow: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                textDecoration: isCompleted ? "line-through" : "none",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                flexGrow: 1,
                flexShrink: 1,
                minWidth: 0,
              }}
            >
              {getTruncatedTitle(task.title, wordLimit)}
            </Typography>

            <Button
              variant="contained"
              color={badgeColor as any}
              size="small"
              sx={{
                textTransform: "none",
                borderRadius: 1,
                fontSize: "0.75rem",
                px: 1.2,
                py: 0,
                height: "1.5rem",
                width: "80px",
                color: "common.white",
                flexShrink: 0,
                whiteSpace: "nowrap",
                bgcolor:
                  badgeColor === "success"
                    ? "success.main"
                    : badgeColor === "primary"
                    ? "primary.main"
                    : "grey.500",
                "&:hover": {
                  bgcolor:
                    badgeColor === "success"
                      ? "success.dark"
                      : badgeColor === "primary"
                      ? "primary.dark"
                      : "grey.600",
                },
              }}
              disableElevation
              onClick={(e) => e.stopPropagation()}
            >
              {badgeLabel}
            </Button>
          </Box>

          {task.notes && (
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {getTruncatedTitle(task.notes, noteLimit)}
            </Typography>
          )}

          {task.due && !isCompleted && (
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {renderDue()}
            </Typography>
          )}

          {isCompleted && (
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {renderCompleted()}
            </Typography>
          )}
        </Box>
      </ListItem>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
        scroll="body"
        slotProps={{
          paper: {
            sx: (theme) => ({
              bgcolor:
                theme.palette.mode === "dark"
                  ? theme.palette.background.default
                  : undefined,
            }),
          },
        }}
      >
        <EditTask
          dialogMode
          taskId={task.id}
          tasklistId={tasklistId}
          onClose={() => setOpenDialog(false)}
        />
      </Dialog>
    </>
  );
};

export default TaskItem;
