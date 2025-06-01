import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

type ConfirmDialogProps = {
  open: boolean;
  title?: string;
  content?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmDialog = ({
  open,
  title = "Are you sure?",
  content = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{cancelText}</Button>
        <Button color="error" onClick={onConfirm}>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
