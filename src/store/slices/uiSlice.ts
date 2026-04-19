import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ThemeMode = "light" | "dark";

export interface UiState {
  sidebarOpen: boolean;
  theme: ThemeMode;
}

const storedTheme = localStorage.getItem("lms_theme") as ThemeMode | null;
if (!storedTheme) {
  localStorage.setItem("lms_theme", "dark");
}

const initialState: UiState = {
  sidebarOpen: true,
  theme: storedTheme === "light" ? "light" : "dark",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
    toggleTheme(state) {
      state.theme = state.theme === "dark" ? "light" : "dark";
      localStorage.setItem("lms_theme", state.theme);
      document.documentElement.classList.toggle("dark", state.theme === "dark");
    },
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.theme = action.payload;
      localStorage.setItem("lms_theme", state.theme);
      document.documentElement.classList.toggle("dark", state.theme === "dark");
    },
  },
});

export const { toggleSidebar, setSidebarOpen, toggleTheme, setTheme } = uiSlice.actions;
export default uiSlice.reducer;
