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
import adminWithdrawalsReducer from "./slices/adminWithdrawalsSlice";
import adminDisputesReducer from "./slices/adminDisputesSlice";
import adminTradeMonitoringReducer from "./slices/adminTradeMonitoringSlice";
import adminSystemLogsReducer from "./slices/adminSystemLogsSlice";
import adminDepositMonitoringReducer from "./slices/adminDepositMonitoringSlice";
import adminUserActivityReducer from "./slices/adminUserActivitySlice";
import adminQuickAlertsReducer from "./slices/adminQuickAlertsSlice";
import profileReducer from "./slices/profileSlice";
import walletReducer from "./slices/walletSlice";
import walletPricesReducer from "./slices/walletPricesSlice";
import dashboardOverviewReducer from "./slices/dashboardOverviewSlice";
import depositReducer from "./slices/depositSlice";
import twoFactorReducer from "./slices/twoFactorSlice";
import kycReducer from "./slices/kycSlice";
import transactionsReducer from "./slices/transactionsSlice";

import exchangeRateReducer from "./slices/exchangeRateSlice";
import networkFeeReducer from "./slices/networkFeeSlice";
import p2pOffersReducer from "./slices/p2pOffersSlice";
import p2pCreateOfferReducer from "./slices/p2pCreateOfferSlice";
import p2pPaymentMethodsReducer from "./slices/p2pPaymentMethodsSlice";
import p2pOrderReducer from "./slices/p2pOrderSlice";
import p2pOrderMessagesReducer from "./slices/p2pOrderMessagesSlice";
import p2pOrdersReducer from "./slices/p2pOrdersSlice";
import p2pOrderRatingReducer from "./slices/p2pOrderRatingSlice";
import withdrawReducer from "./slices/withdrawSlice";
import sessionsReducer from "./slices/sessionsSlice";
import supportReducer from "./slices/supportSlice";
import notificationsReducer from "./slices/notificationsSlice";
import userActivityChartReducer from "./slices/userActivityChartSlice";

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
  adminWithdrawals: adminWithdrawalsReducer,
  adminDisputes: adminDisputesReducer,
  adminTradeMonitoring: adminTradeMonitoringReducer,
  adminSystemLogs: adminSystemLogsReducer,
  adminDepositMonitoring: adminDepositMonitoringReducer,
  adminUserActivity: adminUserActivityReducer,
  adminQuickAlerts: adminQuickAlertsReducer,
  profile: profileReducer,
  wallet: walletReducer,
  walletPrices: walletPricesReducer,
  dashboardOverview: dashboardOverviewReducer,
  deposit: depositReducer,
  twoFactor: twoFactorReducer,
  kyc: kycReducer,
  transactions: transactionsReducer,
  exchangeRate: exchangeRateReducer,
  networkFee: networkFeeReducer,
  p2pOffers: p2pOffersReducer,
  p2pCreateOffer: p2pCreateOfferReducer,
  p2pPaymentMethods: p2pPaymentMethodsReducer,
  p2pOrder: p2pOrderReducer,
  p2pOrderMessages: p2pOrderMessagesReducer,
  p2pOrderRating: p2pOrderRatingReducer,
  p2pOrders: p2pOrdersReducer,
  withdraw: withdrawReducer,
  sessions: sessionsReducer,
  support: supportReducer,
  notifications: notificationsReducer,
  userActivityChart: userActivityChartReducer,
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
