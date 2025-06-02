import { TaskList } from "@/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface HomeUIState {
  dialogOpen: boolean;
  editingList: TaskList | null;
  confirmDeleteOpen: boolean;
  dueMin?: string;
  dueMax?: string;
  selectedDate: string | null;
  useDateFilter: boolean;
  selectedListId: string | null;
  filter: null | "completed" | "uncompleted";
  filterAnchorEl: any;
  listMenuAnchorEl: any;
}

const initialState: HomeUIState = {
  dialogOpen: false,
  editingList: null,
  confirmDeleteOpen: false,
  dueMin: undefined,
  dueMax: undefined,
  selectedDate: null,
  useDateFilter: false,
  selectedListId: sessionStorage.getItem("selectedListId") || null,
  filter: (sessionStorage.getItem("filter") as any) || null,
  filterAnchorEl: null,
  listMenuAnchorEl: null,
};

const homeUISlice = createSlice({
  name: "homeUI",
  initialState,
  reducers: {
    setDialogOpen(state, action: PayloadAction<boolean>) {
      state.dialogOpen = action.payload;
    },
    setEditingList(state, action: PayloadAction<TaskList | null>) {
      state.editingList = action.payload;
    },
    setConfirmDeleteOpen(state, action: PayloadAction<boolean>) {
      state.confirmDeleteOpen = action.payload;
    },
    setDueMin(state, action: PayloadAction<string | undefined>) {
      state.dueMin = action.payload;
    },
    setDueMax(state, action: PayloadAction<string | undefined>) {
      state.dueMax = action.payload;
    },
    setSelectedDate(state, action: PayloadAction<string | null>) {
      state.selectedDate = action.payload;
    },
    setUseDateFilter(state, action: PayloadAction<boolean>) {
      state.useDateFilter = action.payload;
    },
    setSelectedListId(state, action: PayloadAction<string | null>) {
      state.selectedListId = action.payload;
      if (action.payload) {
        sessionStorage.setItem("selectedListId", action.payload);
      } else {
        sessionStorage.removeItem("selectedListId");
      }
    },
    setFilter(
      state,
      action: PayloadAction<null | "completed" | "uncompleted">
    ) {
      state.filter = action.payload;
      if (action.payload !== null) {
        sessionStorage.setItem("filter", action.payload);
      } else {
        sessionStorage.removeItem("filter");
      }
    },
    setFilterAnchorEl(state, action: PayloadAction<HTMLElement | null>) {
      state.filterAnchorEl = action.payload;
    },
    setListMenuAnchorEl(state, action: PayloadAction<HTMLElement | null>) {
      state.listMenuAnchorEl = action.payload;
    },
  },
});

export const {
  setDialogOpen,
  setEditingList,
  setConfirmDeleteOpen,
  setDueMin,
  setDueMax,
  setSelectedDate,
  setUseDateFilter,
  setSelectedListId,
  setFilter,
  setFilterAnchorEl,
  setListMenuAnchorEl,
} = homeUISlice.actions;

export default homeUISlice.reducer;
