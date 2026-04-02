import { createAsyncThunk } from "@reduxjs/toolkit";
import { AdminUser } from "./adminUsersThunk";

export interface KycPendingEntry {
  id: number;
  user_id: number;
  level: number;
  document_type: string;
  document_front: string | null;
  document_back: string | null;
  selfie_with_id: string | null;
  status: string;
  reviewed_by: string | null;
  review_notes: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
  user: AdminUser;
}

export interface KycPendingData {
  current_page: number;
  data: KycPendingEntry[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{ url: string | null; label: string; page: number | null; active: boolean }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface KycPendingResponse {
  success: boolean;
  message: string;
  data: KycPendingData;
}

export interface FetchKycPendingParams {
  per_page?: number;
  page?: number;
}

export const fetchKycPending = createAsyncThunk<
  KycPendingResponse,
  FetchKycPendingParams | undefined,
  { rejectValue: string }
>(
  "kycPending/fetchPending",
  async (params, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.prolificex.softsuitetech.com/api/v1";
      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

      const query = new URLSearchParams();
      if (params?.per_page) query.append("per_page", String(params.per_page));
      if (params?.page) query.append("page", String(params.page));

      const url = `${baseUrl}/admin/kyc/pending${query.toString() ? `?${query.toString()}` : ""}`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return rejectWithValue(data.message || "Failed to fetch pending KYC submissions");
      }

      return data as KycPendingResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while fetching pending KYC submissions");
    }
  }
);
