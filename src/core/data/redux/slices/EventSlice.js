import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../axios/axiosInstance";

export const profileEvents = createAsyncThunk(
  "events/fetchEvents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/getProfileEvent");
      console.log(response.data,"response from profile events");

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const eventSlice = createSlice({
  name: "events",
  // initialState: {
  //   data: [],
  //   loading: false,
  // },
  initialState:[],
  reducers: {
     mergeGoogleEvents: (state, action) => {
        
    const nonGoogleEvents = state.data.filter(event => !event.googleEvent);
    state.data = [...nonGoogleEvents, ...action.payload];
  },
  clearGoogleEvents: (state) => {
    state.data = state.data.filter(event => !event.googleEvent);
  }
  },
  extraReducers: (builder) => {
    builder.addCase(profileEvents.pending, (state, action) => {
      
    })
    .addCase(profileEvents.fulfilled,(state,action)=>{
        
      return action.payload
    })
    .addCase(profileEvents.rejected, (state, action) =>{});
  },
});
export const { mergeGoogleEvents,clearGoogleEvents } = eventSlice.actions;
export default eventSlice.reducer;
