import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../store";

const KYC_STATUS_CACHE_MS = 60_000;
const KYC_DOCUMENTS_CACHE_MS = 5 * 60_000;

export interface KycFetchOptions {
  force?: boolean;
}

export type KycStatus =
  | "not_started"
  | "in_progress"
  | "in_review"
  | "approved"
  | "declined"
  | "expired"
  | "pending"
  | "rejected"
  | "not_submitted"
  | string;

export interface KycStartData {
  message: string;
  kyc_status: KycStatus;
  verification_url: string | null;
  session_id: string | null;
}

export interface KycStartResponse {
  success: boolean;
  message: string;
  data: KycStartData;
}

export interface KycStatusData {
  kyc_level: number | null;
  status: KycStatus;
  provider_status: string | null;
  provider: string | null;
  submitted_at: string | null;
  reviewed_at: string | null;
  review_notes: string | null;
  verification_url: string | null;
  session_id: string | null;
  kyc_verified_at: string | null;
}

export interface KycStatusResponse {
  success: boolean;
  message: string;
  data: KycStatusData;
}

export interface KycDocumentsData {
  provider: string | null;
  status: KycStatus;
  provider_status: string | null;
  verification_url: string | null;
  submitted_at: string | null;
}

export interface KycDocumentsResponse {
  success: boolean;
  message: string;
  data: KycDocumentsData;
}

const getBaseUrl = () => process.env.NEXT_PUBLIC_API_BASE_URL || "";

const parseJsonResponse = async (response: Response) => {
  const text = await response.text();
  try {
    return {
      data: text ? JSON.parse(text) : null,
      text,
    };
  } catch {
    return { data: null, text };
  }
};

const formatApiError = (data: any, fallback: string) => {
  const messages: string[] = [];

  if (typeof data?.message === "string" && data.message.trim()) {
    messages.push(data.message.trim());
  }

  const errors = data?.errors ?? data?.error;
  if (typeof errors === "string" && errors.trim()) {
    messages.push(errors.trim());
  } else if (Array.isArray(errors)) {
    errors.forEach((error) => {
      if (typeof error === "string" && error.trim()) {
        messages.push(error.trim());
      }
    });
  } else if (errors && typeof errors === "object") {
    Object.entries(errors).forEach(([field, value]) => {
      const addMessage = (message: unknown) => {
        const text = String(message ?? "").trim();
        if (text) messages.push(`${field}: ${text}`);
      };

      if (Array.isArray(value)) {
        value.forEach(addMessage);
      } else {
        addMessage(value);
      }
    });
  }

  return Array.from(new Set(messages)).join("\n") || fallback;
};

const normalizeKycStatus = (payload: any): KycStatusResponse => {
  const source = payload?.data && typeof payload.data === "object" ? payload.data : payload;
  const rawStatus = source?.kyc_status ?? source?.status ?? "not_started";
  const status = rawStatus === "pending" ? "in_progress" : rawStatus === "rejected" ? "declined" : String(rawStatus);

  return {
    success: payload?.success ?? true,
    message: payload?.message ?? "KYC status loaded",
    data: {
      kyc_level: source?.kyc_level ?? null,
      status,
      provider_status: source?.provider_status ?? source?.status ?? null,
      provider: source?.provider ?? null,
      submitted_at: source?.submitted_at ?? null,
      reviewed_at: source?.reviewed_at ?? null,
      review_notes: source?.review_notes ?? null,
      verification_url: source?.verification_url ?? null,
      session_id: source?.session_id ?? source?.didit_session_id ?? null,
      kyc_verified_at: source?.kyc_verified_at ?? null,
    },
  };
};

const normalizeKycStart = (payload: any): KycStartResponse => {
  const source = payload?.data && typeof payload.data === "object" ? payload.data : payload;

  return {
    success: payload?.success ?? true,
    message: payload?.message ?? source?.message ?? "KYC session created",
    data: {
      message: source?.message ?? payload?.message ?? "KYC session created",
      kyc_status: source?.kyc_status ?? "in_progress",
      verification_url: source?.verification_url ?? null,
      session_id: source?.session_id ?? source?.didit_session_id ?? null,
    },
  };
};

const normalizeKycDocuments = (payload: any): KycDocumentsResponse => {
  const source = payload?.data && typeof payload.data === "object" ? payload.data : payload;
  const rawStatus = source?.kyc_status ?? source?.status ?? "not_started";
  const status = rawStatus === "pending" ? "in_progress" : rawStatus === "rejected" ? "declined" : String(rawStatus);

  return {
    success: payload?.success ?? true,
    message: payload?.message ?? "KYC documents loaded",
    data: {
      provider: source?.provider ?? null,
      status,
      provider_status: source?.provider_status ?? source?.status ?? null,
      verification_url: source?.verification_url ?? null,
      submitted_at: source?.submitted_at ?? null,
    },
  };
};

export const startKyc = createAsyncThunk<KycStartResponse, void, { rejectValue: string }>(
  "kyc/start",
  async (_, { rejectWithValue }) => {
    try {
      const baseUrl = getBaseUrl();
      if (!baseUrl) {
        return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL in environment");
      }

      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      const response = await fetch(`${baseUrl}/kyc/start`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const { data, text } = await parseJsonResponse(response);
      if (!response.ok || data?.success === false) {
        return rejectWithValue(formatApiError(data, text || `Failed to start KYC (${response.status})`));
      }

      const normalized = normalizeKycStart(data);
      if (!normalized.data.verification_url) {
        return rejectWithValue("KYC verification URL was not returned by backend");
      }

      return normalized;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while starting KYC");
    }
  }
);

export const submitKyc = createAsyncThunk<KycStartResponse, void, { rejectValue: string }>(
  "kyc/submitKyc",
  async (_, { rejectWithValue }) => {
    try {
      const baseUrl = getBaseUrl();
      if (!baseUrl) {
        return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL in environment");
      }

      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      const response = await fetch(`${baseUrl}/kyc/submit`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({}),
      });

      const { data, text } = await parseJsonResponse(response);
      if (!response.ok || data?.success === false) {
        return rejectWithValue(formatApiError(data, text || `Failed to submit KYC (${response.status})`));
      }

      const normalized = normalizeKycStart(data);
      if (!normalized.data.verification_url) {
        return rejectWithValue("KYC verification URL was not returned by backend");
      }

      return normalized;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while submitting KYC");
    }
  }
);

export const fetchKycStatus = createAsyncThunk<KycStatusResponse, KycFetchOptions | void, { rejectValue: string; state: RootState }>(
  "kyc/fetchStatus",
  async (_, { rejectWithValue }) => {
    try {
      const baseUrl = getBaseUrl();
      if (!baseUrl) {
        return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL in environment");
      }

      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      const response = await fetch(`${baseUrl}/kyc/status`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const { data, text } = await parseJsonResponse(response);
      if (!response.ok || data?.success === false) {
        return rejectWithValue(formatApiError(data, text || `Failed to fetch KYC status (${response.status})`));
      }

      return normalizeKycStatus(data);
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while fetching KYC status");
    }
  },
  {
    condition: (options, { getState }) => {
      if (options?.force) return true;
      const { kyc } = getState();
      const hasCachedStatus = Boolean(kyc.status);
      const isFresh =
        kyc.statusLoadedAt !== null &&
        Date.now() - kyc.statusLoadedAt < KYC_STATUS_CACHE_MS;

      return !kyc.statusLoading && (!hasCachedStatus || !isFresh);
    },
  }
);

export const fetchKycDocuments = createAsyncThunk<KycDocumentsResponse, KycFetchOptions | void, { rejectValue: string; state: RootState }>(
  "kyc/fetchDocuments",
  async (_, { rejectWithValue }) => {
    try {
      const baseUrl = getBaseUrl();
      if (!baseUrl) {
        return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL in environment");
      }

      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      const response = await fetch(`${baseUrl}/kyc/documents`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const { data, text } = await parseJsonResponse(response);
      if (!response.ok || data?.success === false) {
        return rejectWithValue(formatApiError(data, text || `Failed to fetch KYC documents (${response.status})`));
      }

      return normalizeKycDocuments(data);
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while fetching KYC documents");
    }
  }
);
