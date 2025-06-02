import { TaskList } from "@/types/types";
import { PlusIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AddTask from "@/pages/task/create/add-task";
import { useState } from "react";

const AddTaskButton = ({
  tasklistId,
  tasklists,
}: {
  tasklistId: string;
  tasklists: TaskList[];
}) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
  const navigate = useNavigate();

  const tasklist = tasklists.find((t) => t.id === tasklistId);
  const title = tasklist?.title || "";

  const handleClick = () => {
    if (isLargeScreen) {
      setOpen(true);
    } else {
      navigate(`/add-task/${tasklistId}?title=${encodeURIComponent(title)}`);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          p: 2.5,
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          boxShadow: 3,
          transition: "background-color 0.2s ease",
          "&:hover": {
            backgroundColor:
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[800],
          },
        }}
      >
        <PlusIcon color={theme.palette.text.primary} />
      </IconButton>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogContent
          sx={(theme) => ({
            p: 0,
            bgcolor:
              theme.palette.mode === "dark"
                ? theme.palette.background.default
                : "background.paper",
          })}
        >
          <AddTask
            onClose={handleClose}
            tasklistId={tasklistId}
            title={title}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddTaskButton;
