import authReducer from "@/store/slices/authSlice";
import coursesReducer from "@/store/slices/coursesSlice";
import enrollmentReducer from "@/store/slices/enrollmentSlice";
import uiReducer from "@/store/slices/uiSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: coursesReducer,
    enrollment: enrollmentReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
