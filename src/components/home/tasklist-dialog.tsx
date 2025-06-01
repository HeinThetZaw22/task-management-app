import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { useState, useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: { id?: string; title: string }) => void;
  initialTitle?: string;
  listId?: string;
};

export default function TaskListDialog({
  open,
  onClose,
  onSubmit,
  initialTitle = "",
  listId,
}: Props) {
  const [title, setTitle] = useState(initialTitle);

  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle]);

  const handleSubmit = () => {
    onSubmit({ id: listId, title: title.trim() });
    setTitle("");
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{listId ? "Rename Task List" : "New Task List"}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Task List Title"
          fullWidth
          variant="standard"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={!title.trim()}>
          {listId ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
