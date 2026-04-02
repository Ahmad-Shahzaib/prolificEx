import { configureStore } from "@reduxjs/toolkit";

import uiReducer from "./slices/uiSlice";
import registerReducer from "./slices/registerSlice";
import authReducer from "./slices/authSlice";
import dashboardReducer from "./slices/dashboardSlice";
import adminUsersReducer from "./slices/adminUsersSlice";
import adminUserDetailReducer from "./slices/adminUserDetailSlice";
import adminKycPendingReducer from "./slices/adminKycPendingSlice";
import profileReducer from "./slices/profileSlice";
import kycReducer from "./slices/kycSlice";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    register: registerReducer,
    auth: authReducer,
    dashboard: dashboardReducer,
    adminUsers: adminUsersReducer,
    adminUserDetail: adminUserDetailReducer,
    adminKycPending: adminKycPendingReducer,
    profile: profileReducer,
    kyc: kycReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
