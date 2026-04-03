import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchUserProfile, updateUserProfile, uploadUserAvatar, changeUserPassword, deactivateUserAccount, UserProfileResponse, UserProfile } from "../thunk/profileThunk";
import { logout } from "./authSlice";
import { logoutUser } from "../thunk/logoutThunk";

interface ProfileState {
  loading: boolean;
  error: string | null;
  profile: UserProfile | null;
  message: string | null;
  avatarUploadError: string | null;
  avatarUploadMessage: string | null;
  passwordChangeLoading: boolean;
  passwordChangeError: string | null;
  passwordChangeMessage: string | null;
  deactivateLoading: boolean;
  deactivateError: string | null;
  deactivateMessage: string | null;
}

const initialState: ProfileState = {
  loading: false,
  error: null,
  profile: null,
  message: null,
  avatarUploadError: null,
  avatarUploadMessage: null,
  passwordChangeLoading: false,
  passwordChangeError: null,
  passwordChangeMessage: null,
  deactivateLoading: false,
  deactivateError: null,
  deactivateMessage: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    resetProfileError(state) {
      state.error = null;
    },
    clearProfile(state) {
      state.profile = null;
      state.message = null;
      state.error = null;
      state.loading = false;
    },
    clearProfileMessages(state) {
      state.error = null;
      state.message = null;
      state.avatarUploadError = null;
      state.avatarUploadMessage = null;
      state.passwordChangeError = null;
      state.passwordChangeMessage = null;
      state.deactivateError = null;
      state.deactivateMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(
        fetchUserProfile.fulfilled,
        (state, action: PayloadAction<UserProfileResponse>) => {
          state.loading = false;
          state.error = null;
          state.profile = action.payload.data;
          state.message = action.payload.message;
        }
      )
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch user profile";
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(
        updateUserProfile.fulfilled,
        (state, action: PayloadAction<UserProfileResponse>) => {
          state.loading = false;
          state.error = null;
          state.profile = action.payload.data;
          state.message = action.payload.message;
        }
      )
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update user profile";
      })
      .addCase(changeUserPassword.pending, (state) => {
        state.passwordChangeLoading = true;
        state.passwordChangeError = null;
        state.passwordChangeMessage = null;
      })
      .addCase(changeUserPassword.fulfilled, (state, action: PayloadAction<{ success: boolean; message: string }>) => {
        state.passwordChangeLoading = false;
        state.passwordChangeError = null;
        state.passwordChangeMessage = action.payload.message;
      })
      .addCase(changeUserPassword.rejected, (state, action) => {
        state.passwordChangeLoading = false;
        state.passwordChangeError = action.payload || "Failed to change password";
      })
      .addCase(uploadUserAvatar.pending, (state) => {
        state.loading = true;
        state.avatarUploadError = null;
        state.avatarUploadMessage = null;
      })
      .addCase(uploadUserAvatar.fulfilled, (state, action: PayloadAction<{ success: boolean; message: string; data: { avatar_url: string } }>) => {
        state.loading = false;
        state.avatarUploadError = null;
        state.avatarUploadMessage = action.payload.message;

        if (state.profile) {
          state.profile.avatar = action.payload.data.avatar_url;
        }
      })
      .addCase(uploadUserAvatar.rejected, (state, action) => {
        state.loading = false;
        state.avatarUploadError = action.payload || "Failed to upload user avatar";
      })
      .addCase(deactivateUserAccount.pending, (state) => {
        state.deactivateLoading = true;
        state.deactivateError = null;
        state.deactivateMessage = null;
      })
      .addCase(deactivateUserAccount.fulfilled, (state, action: PayloadAction<{ success: boolean; message: string }>) => {
        state.deactivateLoading = false;
        state.deactivateError = null;
        state.deactivateMessage = action.payload.message;
      })
      .addCase(deactivateUserAccount.rejected, (state, action) => {
        state.deactivateLoading = false;
        state.deactivateError = action.payload || "Failed to deactivate account";
      })
      .addCase(logout, () => initialState)
      .addCase(logoutUser.fulfilled, () => initialState);
  },
});

export const { resetProfileError, clearProfile, clearProfileMessages } = profileSlice.actions;
export default profileSlice.reducer;
