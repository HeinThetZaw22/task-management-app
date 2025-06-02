import { setFilter, setFilterAnchorEl } from "@/redux/slices/uiSlice";
import { RootState } from "@/redux/store";
import { IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { ArrowUpDown, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

export const FilterMenu = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const anchorEl = useSelector((state: RootState) => state.ui.filterAnchorEl);
  const currentFilter = useSelector((state: RootState) => state.ui.filter);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    dispatch(setFilterAnchorEl(event.currentTarget));
  };

  const handleClose = () => {
    dispatch(setFilterAnchorEl(null));
  };

  const handleChange = (value: null | "completed" | "uncompleted") => {
    dispatch(setFilter(value));
    dispatch(setFilterAnchorEl(null));
  };

  const renderMenuItem = (
    label: string,
    value: null | "completed" | "uncompleted"
  ) => (
    <MenuItem
      onClick={() => handleChange(value)}
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
      <IconButton onClick={handleClick}>
        <ArrowUpDown size={20} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
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
