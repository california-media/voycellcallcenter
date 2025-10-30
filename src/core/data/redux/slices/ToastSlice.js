import { createSlice, nanoid } from "@reduxjs/toolkit";

const toastSlice = createSlice({
  name: "toast",
  initialState: {
    toasts: [],
  },
  reducers: {
    showToast: {
      reducer: (state, action) => {
        state.toasts.push(action.payload);
      },
      prepare: ({ message, variant = "primary", heading, delay = 4000 }) => {
        return {
          payload: {
            id: nanoid(),
            message,
            variant,
            heading,
            delay,
          },
        };
      },
    },
    hideToast: (state, action) => {
      state.toasts = state.toasts.filter(
        (toast) => toast.id !== action.payload
      );
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;
export default toastSlice.reducer;
