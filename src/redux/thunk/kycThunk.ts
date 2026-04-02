import { createAsyncThunk } from "@reduxjs/toolkit";

export interface KycSubmitPayload {
  document_type: "national_id" | "passport" | "driver_license" | string;
  document_front: File;
  document_back: File;
  selfie_with_id: File;
}

export interface KycSubmitData {
  kyc_id: number;
  status: string;
}

export interface KycSubmitResponse {
  success: boolean;
  message: string;
  data: KycSubmitData;
}

export interface KycStatusData {
  kyc_level: number;
  status: string;
  submitted_at: string;
  reviewed_at: string | null;
  review_notes: string | null;
}

export interface KycStatusResponse {
  success: boolean;
  message: string;
  data: KycStatusData;
}

export const submitKyc = createAsyncThunk<
  KycSubmitResponse,
  KycSubmitPayload,
  { rejectValue: string }
>(
  "kyc/submitKyc",
  async (payload, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

      const formData = new FormData();
      formData.append("document_type", payload.document_type);
      formData.append("document_front", payload.document_front);
      formData.append("document_back", payload.document_back);
      formData.append("selfie_with_id", payload.selfie_with_id);

      const response = await fetch(`${baseUrl}/kyc/submit`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        return rejectWithValue(data?.message || "KYC submission failed");
      }

      return data as KycSubmitResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while submitting KYC");
    }
  }
);

export const fetchKycStatus = createAsyncThunk<
  KycStatusResponse,
  void,
  { rejectValue: string }
>(
  "kyc/fetchStatus",
  async (_, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

      const response = await fetch(`${baseUrl}/kyc/status`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        return rejectWithValue(data?.message || "Failed to fetch KYC status");
      }

      return data as KycStatusResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while fetching KYC status");
    }
  }
);
