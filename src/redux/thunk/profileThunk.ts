import { createAsyncThunk } from "@reduxjs/toolkit";

export interface UserProfile {
  uuid: string;
  full_name: string;
  username: string;
  email: string;
  phone: string;
  avatar: string | null;
  country: string;
  status: string;
  kyc_level: number;
  email_verified: boolean;
  phone_verified: boolean;
  two_factor_enabled: boolean;
  created_at: string;
}

export interface UserProfileUpdatePayload {
  full_name?: string;
  username?: string;
  country?: string;
  email?: string;
  phone?: string;
}

export interface UserAvatarUploadResponse {
  success: boolean;
  message: string;
  data: {
    avatar_url: string;
  };
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

export interface UserProfileResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}

const parseJsonSafe = async (res: Response) => {
  const text = await res.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (parseError) {
    throw new Error(`Invalid JSON response from ${res.url} (status ${res.status}): ${text.slice(0, 200)}`);
  }
};

export const fetchUserProfile = createAsyncThunk<
  UserProfileResponse,
  void,
  { rejectValue: string }
>(
  "profile/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      if (!baseUrl) {
        return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL in environment");
      }

      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

      const res = await fetch(`${baseUrl}/user/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await parseJsonSafe(res);

      if (!res.ok || !data?.success) {
        return rejectWithValue(data?.message || `Failed to fetch user profile (${res.status})`);
      }

      return data as UserProfileResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while fetching user profile");
    }
  }
);

export const updateUserProfile = createAsyncThunk<
  UserProfileResponse,
  UserProfileUpdatePayload,
  { rejectValue: string }
>(
  "profile/updateUserProfile",
  async (payload, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      if (!baseUrl) {
        return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL in environment");
      }

      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

      const res = await fetch(`${baseUrl}/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await parseJsonSafe(res);

      if (!res.ok || !data?.success) {
        return rejectWithValue(data?.message || `Failed to update user profile (${res.status})`);
      }

      return data as UserProfileResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while updating user profile");
    }
  }
);

export const uploadUserAvatar = createAsyncThunk<
  UserAvatarUploadResponse,
  File,
  { rejectValue: string }
>(
  "profile/uploadUserAvatar",
  async (avatarFile, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      if (!baseUrl) {
        return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL in environment");
      }

      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

      const formData = new FormData();
      formData.append("avatar", avatarFile);

      const res = await fetch(`${baseUrl}/user/avatar`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const data = await parseJsonSafe(res);

      if (!res.ok || !data?.success) {
        return rejectWithValue(data?.message || `Failed to upload user avatar (${res.status})`);
      }

      return data as UserAvatarUploadResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while uploading user avatar");
    }
  }
);

export const changeUserPassword = createAsyncThunk<
  ChangePasswordResponse,
  ChangePasswordPayload,
  { rejectValue: string }
>(
  "profile/changeUserPassword",
  async (payload, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      if (!baseUrl) {
        return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL in environment");
      }
      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

      const res = await fetch(`${baseUrl}/user/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await parseJsonSafe(res);

      if (!res.ok || !data?.success) {
        return rejectWithValue(data?.message || `Failed to change password (${res.status})`);
      }

      return data as ChangePasswordResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while changing password");
    }
  }
);

export interface DeactivateAccountPayload {
  password: string;
}

export interface DeactivateAccountResponse {
  success: boolean;
  message: string;
}

export const deactivateUserAccount = createAsyncThunk<
  DeactivateAccountResponse,
  DeactivateAccountPayload,
  { rejectValue: string }
>(
  "profile/deactivateUserAccount",
  async (payload, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      if (!baseUrl) {
        return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL in environment");
      }
      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

      const res = await fetch(`${baseUrl}/user/account`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await parseJsonSafe(res);

      if (!res.ok || !data?.success) {
        return rejectWithValue(data?.message || `Failed to deactivate account (${res.status})`);
      }

      return data as DeactivateAccountResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while deactivating account");
    }
  }
);
