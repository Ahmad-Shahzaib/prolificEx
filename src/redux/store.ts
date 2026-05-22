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
import adminP2PStatsReducer from "./slices/adminP2PStatsSlice";
import profileReducer from "./slices/profileSlice";
import walletReducer from "./slices/walletSlice";
import walletPricesReducer from "./slices/walletPricesSlice";
import dashboardOverviewReducer from "./slices/dashboardOverviewSlice";
import depositReducer from "./slices/depositSlice";
import twoFactorReducer from "./slices/twoFactorSlice";
import kycReducer from "./slices/kycSlice";
import transactionsReducer from "./slices/transactionsSlice";

import networkFeeReducer from "./slices/networkFeeSlice";
import p2pOffersReducer from "./slices/p2pOffersSlice";
import p2pOrderReducer from "./slices/p2pOrderSlice";
import p2pOrderMessagesReducer from "./slices/p2pOrderMessagesSlice";
import p2pOrdersReducer from "./slices/p2pOrdersSlice";
import withdrawReducer from "./slices/withdrawSlice";
import sessionsReducer from "./slices/sessionsSlice";
import supportReducer from "./slices/supportSlice";
import notificationsReducer from "./slices/notificationsSlice";

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
  adminP2PStats: adminP2PStatsReducer,
  profile: profileReducer,
  wallet: walletReducer,
  walletPrices: walletPricesReducer,
  dashboardOverview: dashboardOverviewReducer,
  deposit: depositReducer,
  twoFactor: twoFactorReducer,
  kyc: kycReducer,
  transactions: transactionsReducer,
  networkFee: networkFeeReducer,
  p2pOffers: p2pOffersReducer,
  p2pOrder: p2pOrderReducer,
  p2pOrderMessages: p2pOrderMessagesReducer,
  p2pOrders: p2pOrdersReducer,
  withdraw: withdrawReducer,
  sessions: sessionsReducer,
  support: supportReducer,
  notifications: notificationsReducer,
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
