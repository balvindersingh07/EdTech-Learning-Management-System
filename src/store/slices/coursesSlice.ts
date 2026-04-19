import { instructorCourseService } from "@/services/instructor/instructorCourseService";
import { studentCourseService } from "@/services/student/studentCourseService";
import type { Course } from "@/types";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface CoursesState {
  items: Course[];
  selected: Course | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  filters: { category: string; q: string };
}

const initialState: CoursesState = {
  items: [],
  selected: null,
  status: "idle",
  error: null,
  filters: { category: "all", q: "" },
};

export type CourseListScope = "catalog" | "teaching";

export const fetchCourseList = createAsyncThunk(
  "courses/fetchList",
  async (arg: { scope: CourseListScope }, { rejectWithValue }) => {
    try {
      if (arg.scope === "catalog") {
        return await studentCourseService.catalog();
      }
      return await instructorCourseService.listMine();
    } catch (e) {
      return rejectWithValue(e instanceof Error ? e.message : "Failed to load courses");
    }
  },
);

export const fetchCourseById = createAsyncThunk(
  "courses/fetchById",
  async (arg: { id: string; scope: CourseListScope }, { rejectWithValue }) => {
    try {
      if (arg.scope === "teaching") {
        return await instructorCourseService.getById(arg.id);
      }
      return await studentCourseService.getById(arg.id);
    } catch (e) {
      return rejectWithValue(e instanceof Error ? e.message : "Course not found");
    }
  },
);

export const saveCourse = createAsyncThunk(
  "courses/save",
  async (payload: { id?: string; data: Partial<Course> }, { rejectWithValue }) => {
    try {
      if (payload.id) {
        return await instructorCourseService.update(payload.id, payload.data);
      }
      return await instructorCourseService.create(payload.data);
    } catch (e) {
      return rejectWithValue(e instanceof Error ? e.message : "Save failed");
    }
  },
);

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<Partial<CoursesState["filters"]>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearSelected(state) {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourseList.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCourseList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchCourseList.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Error";
      })
      .addCase(fetchCourseById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selected = action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Error";
      })
      .addCase(saveCourse.fulfilled, (state, action) => {
        const saved = action.payload;
        const idx = state.items.findIndex((c) => c.id === saved.id);
        if (idx >= 0) state.items[idx] = saved;
        else state.items.unshift(saved);
        state.selected = saved;
      });
  },
});

export const { setFilters, clearSelected } = coursesSlice.actions;
export default coursesSlice.reducer;
