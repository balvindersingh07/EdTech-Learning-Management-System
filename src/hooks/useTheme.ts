import { setTheme, toggleTheme } from "@/store/slices/uiSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { ThemeMode } from "@/store/slices/uiSlice";

export function useTheme() {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((s) => s.ui.theme);

  return {
    mode,
    setMode: (m: ThemeMode) => dispatch(setTheme(m)),
    toggle: () => dispatch(toggleTheme()),
    isDark: mode === "dark",
  };
}
