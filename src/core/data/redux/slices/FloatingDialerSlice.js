import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  phoneNumber: "",
  isCalling: false,
  lastCalledNumber: null,
};

const floatingDialerSlice = createSlice({
  name: "dialer",
  initialState,
  reducers: {
    openDialer: (state) => {
      state.isOpen = true;
    },
    closeDialer: (state) => {
      state.isOpen = false;
      state.phoneNumber = "";
      state.isCalling = false;
    },
    setPhoneNumber: (state, action) => {
      state.phoneNumber = action.payload;
    },
    appendDigit: (state, action) => {
      state.phoneNumber += action.payload;
    },
    deleteLastDigit: (state) => {
      state.phoneNumber = state.phoneNumber.slice(0, -1);
    },
    startCall: (state) => {
      if (state.phoneNumber.trim()) {
        state.isCalling = true;
        state.lastCalledNumber = state.phoneNumber;
      }
    },
    endCall: (state) => {
      state.isCalling = false;
    },
    clearNumber: (state) => {
      state.phoneNumber = "";
    },
  },
});

export const {
  openDialer,
  closeDialer,
  setPhoneNumber,
  appendDigit,
  deleteLastDigit,
  startCall,
  endCall,
  clearNumber,
} = floatingDialerSlice.actions;

export default floatingDialerSlice.reducer;
