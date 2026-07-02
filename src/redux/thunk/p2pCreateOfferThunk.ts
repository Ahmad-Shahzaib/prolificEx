import { createAsyncThunk } from "@reduxjs/toolkit";
import { P2POffer } from "./p2pOffersThunk";

export interface P2PCreateOfferPayload {
  type: "buy" | "sell";
  coin: string;
  network: string;
  amount: string;
  price_per_coin: string;
  price_type: "fixed" | string;
  fiat_currency: "USD" | "NGN" | string;
  min_order_limit: string;
  max_order_limit: string;
  payment_method: string;
  payment_window: number;
  instructions: string;
  bank_name?: string;
  account_name?: string;
  account_number?: string;
  iban_number?: string;
}

const normalizePaymentMethods = (offer: any): string[] => {
  if (Array.isArray(offer?.payment_methods)) {
    return offer.payment_methods.map(String);
  }

  if (typeof offer?.payment_methods === "string") {
    try {
      const parsed = JSON.parse(offer.payment_methods);
      if (Array.isArray(parsed)) {
        return parsed.map(String);
      }
    } catch {
      return offer.payment_methods.split(",").map((method: string) => method.trim()).filter(Boolean);
    }
  }

  return offer?.payment_method ? [String(offer.payment_method)] : [];
};

const normalizeOffer = (offer: any): P2POffer => {
  const paymentMethods = normalizePaymentMethods(offer);
  const cryptoCurrency = String(offer?.crypto_currency ?? offer?.coin ?? "USDT");
  const price = String(offer?.price ?? offer?.price_per_coin ?? "");

  return {
    ...offer,
    coin: String(offer?.coin ?? cryptoCurrency),
    crypto_currency: cryptoCurrency,
    network: String(offer?.network ?? ""),
    amount: String(offer?.amount ?? offer?.available_amount ?? ""),
    available_amount: String(offer?.available_amount ?? offer?.amount ?? ""),
    price,
    price_per_coin: String(offer?.price_per_coin ?? price),
    payment_methods: paymentMethods,
    payment_method: String(offer?.payment_method ?? paymentMethods[0] ?? ""),
    price_type: String(offer?.price_type ?? "fixed"),
    payment_window: Number(offer?.payment_window ?? 15),
    bank_name: String(offer?.bank_name ?? ""),
    account_name: String(offer?.account_name ?? ""),
    account_number: String(offer?.account_number ?? ""),
    iban_number: String(offer?.iban_number ?? ""),
    instructions: String(offer?.instructions ?? ""),
  } as P2POffer;
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

export const createP2POffer = createAsyncThunk<
  P2POffer,
  P2PCreateOfferPayload,
  { rejectValue: string }
>(
  "p2pCreateOffer/create",
  async (payload, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      if (!baseUrl) {
        return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL in environment");
      }

      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      const response = await fetch(`${baseUrl}/p2p/offers`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      let data: any = null;
      try {
        data = responseText ? JSON.parse(responseText) : null;
      } catch {
        data = null;
      }

      if (!response.ok || data?.success === false) {
        return rejectWithValue(formatApiError(data, responseText || `Failed to create offer (${response.status})`));
      }

      return normalizeOffer(data?.data ?? data);
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while creating offer");
    }
  }
);
