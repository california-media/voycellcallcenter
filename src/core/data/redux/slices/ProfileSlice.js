import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../axios/axiosInstance";
import { showToast } from "./ToastSlice";

const initialState = {
  id: "",
  firstname: "",
  lastname: "",
  email: "",
  phonenumbers: [],
  profileImageURL: "",
  contactCount: 0,
  favouriteCount: 0,
  tagCount: 0,
  isLoading: true,
  role: "user",
  yeastarExtensionId: null,
  extensionNumber: null,
  sipSecret: null,
  yeastarSignature: null,
  pbxURL: null,
  isLinkusDialerActive: false, // Track if full dialer page is open
};

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (paginationData, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("/getUser", paginationData);
      localStorage.setItem("userId", response.data.data.id);

      return response.data;
    } catch (error) {
      dispatch(
        showToast({ message: error.response.data.message, variant: "danger" })
      );
      return rejectWithValue(error.response.data);
    }
  }
);

export const editProfile = createAsyncThunk(
  "profile/editProfile",
  async (profileData, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.put("/editProfile", profileData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Edit profile response:", response.data);

      dispatch(
        showToast({ message: response.data.message, variant: "success" })
      );
      return response.data;
    } catch (error) {
      dispatch(
        showToast({ message: error.response.data.message, variant: "danger" })
      );
      return rejectWithValue(error.response.data);
    }
  }
);

export const changePassword = createAsyncThunk(
  "profile/changePassword",
  async (passwordData, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("/changePassword", passwordData);
      dispatch(
        showToast({ message: response.data.message, variant: "success" })
      );
      return response.data;
    } catch (error) {
      dispatch(
        showToast({ message: error.response.data.message, variant: "danger" })
      );
      return rejectWithValue(error.response.data);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    resetProfile: (state) => {
      Object.assign(state, initialState);
    },
    setYeastarSignature: (state, action) => {
      state.yeastarSignature = action.payload.signature;
      state.pbxURL = action.payload.pbxURL;
    },
    setLinkusDialerActive: (state, action) => {
      state.isLinkusDialerActive = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log("Fetched profile data:", action.payload);
        Object.assign(state, action.payload.data);
        state.error = undefined;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      .addCase(editProfile.fulfilled, (state, action) => {
        // Handle profile updates if needed
      })
      .addCase(editProfile.rejected, (state, action) => {
        console.error("Edit profile failed", action.payload);
      })
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        console.error("Change password failed", action.payload);
      });
  },
});

export default profileSlice.reducer;
export const { resetProfile, setYeastarSignature, setLinkusDialerActive } =
  profileSlice.actions;
