import { IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { ArrowUpDown, Check } from "lucide-react";
import { useTranslation } from "react-i18next";

type Props = {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  currentFilter: null | "completed" | "uncompleted";
  onChange: (value: null | "completed" | "uncompleted") => void;
};

export const FilterMenu = ({
  anchorEl,
  open,
  onClose,
  onClick,
  currentFilter,
  onChange,
}: Props) => {
  const { t } = useTranslation();

  const renderMenuItem = (
    label: string,
    value: null | "completed" | "uncompleted"
  ) => (
    <MenuItem
      onClick={() => onChange(value)}
      selected={currentFilter === value}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        minWidth: "160px",
      }}
    >
      <Typography>{label}</Typography>
      {currentFilter === value && <Check size={16} />}
    </MenuItem>
  );

  return (
    <>
      <IconButton onClick={onClick}>
        <ArrowUpDown size={20} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {renderMenuItem(t("all"), null)}
        {renderMenuItem(t("completed"), "completed")}
        {renderMenuItem(t("uncompleted"), "uncompleted")}
      </Menu>
    </>
  );
};
