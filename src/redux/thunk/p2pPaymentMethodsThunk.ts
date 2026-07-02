import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../store";

const P2P_PAYMENT_METHODS_CACHE_MS = 5 * 60_000;

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

export const getP2PPaymentMethodsRequestKey = (params?: FetchP2PPaymentMethodsParams | void) =>
  params?.fiat_currency?.toUpperCase() ?? "all";

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
  { rejectValue: string; state: RootState }
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
  },
  {
    condition: (params, { getState }) => {
      const { p2pPaymentMethods } = getState();
      const requestKey = getP2PPaymentMethodsRequestKey(params);
      const isSameRequest = p2pPaymentMethods.lastRequestKey === requestKey;
      const isFresh =
        p2pPaymentMethods.loadedAt !== null &&
        Date.now() - p2pPaymentMethods.loadedAt < P2P_PAYMENT_METHODS_CACHE_MS;

      return !p2pPaymentMethods.loading && (!isSameRequest || !isFresh);
    },
  }
);
