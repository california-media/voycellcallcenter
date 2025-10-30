import { configureStore, combineReducers } from "@reduxjs/toolkit";
import appCommonReducer from "./slices/appCommonSlice";
import commonSlice from "./commonSlice";
import profileReducer from "./slices/ProfileSlice";
import toastReducer from "./slices/ToastSlice";

const combinedReducer = combineReducers({
  common: commonSlice,
  appCommon: appCommonReducer,
  profile: profileReducer,
  toast: toastReducer,
});

const rootReducer = (state, action) => {
  return combinedReducer(state, action);
};

const store = configureStore({
  reducer: rootReducer,
});

// console.log('AppCommon State:', store.getState().appCommon);

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

export default store;
