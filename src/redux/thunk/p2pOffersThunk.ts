import { createAsyncThunk } from "@reduxjs/toolkit";

export interface P2POffer {
  id: number;
  user_id: number;
  type: "buy" | "sell";
  coin: string;
  crypto_currency: string;
  network: string;
  amount: string;
  available_amount: string;
  min_order_limit: string;
  max_order_limit: string;
  price_per_coin: string;
  price: string;
  price_type: string;
  fiat_currency: string;
  payment_method: string;
  payment_methods: string[];
  payment_window: number;
  bank_name: string;
  account_name: string;
  account_number: string;
  iban_number: string;
  instructions: string;
  status: string;
  rating: string;
  rating_count?: number;
  trader_rating?: string;
  trader_rating_count?: number;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    uuid: string;
    full_name: string;
    username: string | null;
    rating: string;
    rating_count: number;
  };
}

export interface CreateP2POfferPayload {
  type: "sell" | "buy";
  coin: string;
  network: string;
  amount: string;
  price_per_coin: string;
  fiat_currency: string;
  payment_method: string;
  min_order_limit: string;
  max_order_limit: string;
  price_type?: string;
  payment_window?: number;
  bank_name?: string;
  account_name?: string;
  account_number?: string;
  iban_number?: string;
  instructions?: string;
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

const extractOffers = (payload: any): any[] => {
  const candidates = [
    payload?.data,
    payload?.data?.data,
    payload?.data?.offers,
    payload?.data?.items,
    payload?.offers,
    payload?.items,
  ];

  const offers = candidates.find(Array.isArray);
  return offers ?? [];
};

const formatCreateOfferError = (data: any, fallback: string) => {
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
      const addFieldMessage = (message: unknown) => {
        const text = String(message ?? "").trim();
        if (text) {
          messages.push(`${field}: ${text}`);
        }
      };

      if (Array.isArray(value)) {
        value.forEach(addFieldMessage);
      } else {
        addFieldMessage(value);
      }
    });
  }

  return Array.from(new Set(messages)).join("\n") || fallback;
};

export const createOffer = createAsyncThunk<
  P2POffer,
  CreateP2POfferPayload,
  { rejectValue: string }
>(
  "p2pOffers/createOffer",
  async (payload, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      if (!baseUrl) {
        return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL in environment");
      }

      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      const requestBody = {
        type: payload.type,
        coin: payload.coin,
        network: payload.network,
        amount: payload.amount,
        price_per_coin: payload.price_per_coin,
        fiat_currency: payload.fiat_currency,
        payment_method: payload.payment_method,
        min_order_limit: payload.min_order_limit,
        max_order_limit: payload.max_order_limit,
        payment_window: payload.payment_window,
        bank_name: payload.bank_name,
        account_name: payload.account_name,
        account_number: payload.account_number,
        iban_number: payload.iban_number,
        instructions: payload.instructions,
      };

      const response = await fetch(`${baseUrl}/p2p/offers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(requestBody),
      });

      const responseText = await response.text();
      let data: any = null;
      try {
        data = responseText ? JSON.parse(responseText) : null;
      } catch {
        data = null;
      }

      if (!response.ok || !data?.success) {
        return rejectWithValue(
          formatCreateOfferError(data, responseText || `Failed to create offer (${response.status})`)
        );
      }

      return normalizeOffer(data.data);
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while creating offer");
    }
  }
);

export const fetchOffers = createAsyncThunk<
  P2POffer[],
  {
    page?: number;
    per_page?: number;
    type?: "buy" | "sell";
    coin?: string;
    crypto_currency?: string;
    fiat_currency?: string;
    network?: string;
    payment_method?: string;
    amount?: string;
  },
  { rejectValue: string }
>(
  "p2pOffers/fetchOffers",
  async (
    { page = 1, per_page = 20, type, coin, crypto_currency, fiat_currency, network, payment_method, amount },
    { rejectWithValue }
  ) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      if (!baseUrl) {
        return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL in environment");
      }

      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      const query = new URLSearchParams({
        page: page.toString(),
        per_page: per_page.toString(),
      });

      if (coin) {
        query.append("coin", coin);
      }
      if (crypto_currency) {
        query.append("crypto_currency", crypto_currency);
      }
      if (type) {
        query.append("type", type);
      }
      if (fiat_currency) {
        query.append("fiat_currency", fiat_currency);
      }
      if (network) {
        query.append("network", network);
      }
      if (payment_method) {
        query.append("payment_method", payment_method);
      }
      if (amount) {
        query.append("amount", amount);
      }

      const response = await fetch(`${baseUrl}/p2p/offers?${query.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await response.json();
      if (!response.ok || !data?.success) {
        return rejectWithValue(data?.message || `Failed to load offers (${response.status})`);
      }

      return extractOffers(data).map(normalizeOffer);
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while fetching offers");
    }
  }
);

export const fetchMyOffers = createAsyncThunk<
  P2POffer[],
  void,
  { rejectValue: string }
>(
  "p2pOffers/fetchMyOffers",
  async (_, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      if (!baseUrl) {
        return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL in environment");
      }

      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      const response = await fetch(`${baseUrl}/p2p/offers/my`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await response.json();
      if (!response.ok || !data?.success) {
        return rejectWithValue(data?.message || `Failed to load your offers (${response.status})`);
      }

      return extractOffers(data).map(normalizeOffer);
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while fetching offers");
    }
  }
);
