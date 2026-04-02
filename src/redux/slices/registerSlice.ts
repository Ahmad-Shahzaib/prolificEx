import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { registerUser, RegisterPayload, RegisterResponse } from '../thunk/registerThunk';

interface RegisterState {
  loading: boolean;
  error: string | null;
  success: boolean;
  message: string | null;
  userId: string | null;
}

const initialState: RegisterState = {
  loading: false,
  error: null,
  success: false,
  message: null,
  userId: null,
};

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    resetRegisterState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = null;
      state.userId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
        state.userId = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<RegisterResponse>) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        state.userId = action.payload.data?.user_id || null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Registration failed';
        state.success = false;
      });
  },
});

export const { resetRegisterState } = registerSlice.actions;
export default registerSlice.reducer;
