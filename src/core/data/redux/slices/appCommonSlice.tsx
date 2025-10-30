import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  phone: "",
};

export const appCommonSlice = createSlice({
  name: "commonAppSlice",
  initialState,
  reducers: {
    setPhone: (state, action) => {
      state.phone = action.payload;
    },
  },
});

export const { setPhone } = appCommonSlice.actions;
export default appCommonSlice.reducer;
