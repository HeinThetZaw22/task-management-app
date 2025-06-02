import React from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { EllipsisVertical } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import {
  setConfirmDeleteOpen,
  setDialogOpen,
  setEditingList,
  setListMenuAnchorEl,
} from "@/redux/slices/uiSlice";
import { TaskList } from "@/types/types";
import { useClearCompletedTasks } from "@/query/task.query";
import toast from "react-hot-toast";

export const ListMenu = ({
  disableDelete,
  items,
  activeListId,
}: {
  disableDelete: boolean;
  activeListId: string;
  items: TaskList[];
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { mutate: clearCompletedTasks } = useClearCompletedTasks();

  const { listMenuAnchorEl, selectedListId } = useSelector(
    (state: RootState) => state.ui
  );
  const open = Boolean(listMenuAnchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    dispatch(setListMenuAnchorEl(event.currentTarget));
  };

  const handleClose = () => {
    dispatch(setListMenuAnchorEl(null));
  };

  const handleDelete = () => {
    handleClose();
    dispatch(setConfirmDeleteOpen(true));
  };

  const handleRename = () => {
    const list = items.find((l) => l.id === selectedListId);
    if (list) {
      dispatch(setEditingList(list));
      dispatch(setDialogOpen(true));
    }
    handleClose();
  };

  const handleDeleteCompleted = () => {
    handleClose();
    clearCompletedTasks(activeListId || "", {
      onSuccess: () => {
        toast.success("Deleted complete tasks");
      },
      onError: () => {
        toast.error("Failed to delete complete tasks");
      },
    });
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <EllipsisVertical size={20} />
      </IconButton>
      <Menu
        anchorEl={listMenuAnchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={handleDelete} disabled={disableDelete}>
          {t("delete-list")}
        </MenuItem>
        <MenuItem onClick={handleRename}>{t("rename-list")}</MenuItem>
        <MenuItem onClick={handleDeleteCompleted}>
          {t("delete-completed-tasks")}
        </MenuItem>
      </Menu>
    </>
  );
};
