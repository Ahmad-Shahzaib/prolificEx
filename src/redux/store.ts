import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { logout } from "./slices/authSlice";

import uiReducer from "./slices/uiSlice";
import registerReducer from "./slices/registerSlice";
import verifyEmailReducer from "./slices/verifyEmailSlice";
import authReducer from "./slices/authSlice";
import forgotPasswordReducer from "./slices/forgotPasswordSlice";
import resetPasswordReducer from "./slices/resetPasswordSlice";
import dashboardReducer from "./slices/dashboardSlice";
import adminUsersReducer from "./slices/adminUsersSlice";
import adminUserDetailReducer from "./slices/adminUserDetailSlice";
import adminKycPendingReducer from "./slices/adminKycPendingSlice";
import profileReducer from "./slices/profileSlice";
import kycReducer from "./slices/kycSlice";

const appReducer = combineReducers({
  ui: uiReducer,
  register: registerReducer,
  verifyEmail: verifyEmailReducer,
  auth: authReducer,
  forgotPassword: forgotPasswordReducer,
  resetPassword: resetPasswordReducer,
  dashboard: dashboardReducer,
  adminUsers: adminUsersReducer,
  adminUserDetail: adminUserDetailReducer,
  adminKycPending: adminKycPendingReducer,
  profile: profileReducer,
  kyc: kycReducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === logout.type || action.type === "auth/logoutUser/fulfilled") {
    if (typeof window !== "undefined") {
      localStorage.clear();
      sessionStorage.clear();
    }
    state = undefined;
  }

  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
