// components/task/ListMenu.tsx
import { IconButton, Menu, MenuItem } from "@mui/material";
import { EllipsisVertical } from "lucide-react";
import { useTranslation } from "react-i18next";

type Props = {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  onClose: () => void;
  onDelete: () => void;
  onRename: () => void;
  onDeleteCompleted: () => void;
  disableDelete: boolean;
};

export const ListMenu = ({
  anchorEl,
  open,
  onClick,
  onClose,
  onDelete,
  onRename,
  onDeleteCompleted,
  disableDelete,
}: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <IconButton onClick={onClick}>
        <EllipsisVertical size={20} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={onDelete} disabled={disableDelete}>
          {t("delete-list")}
        </MenuItem>
        <MenuItem onClick={onRename}>{t("rename-list")}</MenuItem>
        <MenuItem onClick={onDeleteCompleted}>
          {t("delete-completed-tasks")}
        </MenuItem>
      </Menu>
    </>
  );
};
