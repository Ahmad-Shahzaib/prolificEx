import { createAsyncThunk } from "@reduxjs/toolkit";

export interface P2PPaymentMethod {
  id: number;
  fiat_currency: string;
  name: string;
  code: string;
  slug: string;
  category: string;
}

export interface FetchP2PPaymentMethodsParams {
  fiat_currency?: string;
}

const extractPaymentMethods = (payload: any): P2PPaymentMethod[] => {
  const methods =
    payload?.data?.payment_methods ??
    payload?.data?.data?.payment_methods ??
    payload?.payment_methods ??
    [];

  if (!Array.isArray(methods)) {
    return [];
  }

  return methods.map((method) => ({
    id: Number(method?.id ?? 0),
    fiat_currency: String(method?.fiat_currency ?? ""),
    name: String(method?.name ?? ""),
    code: String(method?.code ?? ""),
    slug: String(method?.slug ?? method?.code ?? method?.name ?? ""),
    category: String(method?.category ?? ""),
  }));
};

export const fetchP2PPaymentMethods = createAsyncThunk<
  P2PPaymentMethod[],
  FetchP2PPaymentMethodsParams | void,
  { rejectValue: string }
>(
  "p2pPaymentMethods/fetch",
  async (params, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      if (!baseUrl) {
        return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL in environment");
      }

      const query = new URLSearchParams();
      if (params?.fiat_currency) {
        query.set("fiat_currency", params.fiat_currency);
      }

      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      const response = await fetch(
        `${baseUrl}/p2p/payment-methods${query.toString() ? `?${query.toString()}` : ""}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      const data = await response.json();
      if (!response.ok || data?.success === false) {
        return rejectWithValue(data?.message || `Failed to load payment methods (${response.status})`);
      }

      return extractPaymentMethods(data);
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while loading payment methods");
    }
  }
);
