import type { Course } from "@/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface EnrollmentState {
  cart: Course[];
}

const initialState: EnrollmentState = {
  cart: [],
};

const enrollmentSlice = createSlice({
  name: "enrollment",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Course>) {
      if (state.cart.some((c) => c.id === action.payload.id)) return;
      state.cart.push(action.payload);
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.cart = state.cart.filter((c) => c.id !== action.payload);
    },
    clearCart(state) {
      state.cart = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = enrollmentSlice.actions;
export default enrollmentSlice.reducer;
