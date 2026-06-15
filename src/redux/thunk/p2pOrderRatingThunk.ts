import { createAsyncThunk } from "@reduxjs/toolkit";

export interface CreateP2POrderRatingPayload {
  order_id: number;
  rating: number;
  comment: string;
}

export interface P2POrderRatingUser {
  id: number;
  uuid: string;
  full_name: string;
  username: string;
  rating: string;
  rating_count: number;
}

export interface P2POrderRatingResponse {
  id: number;
  order_id: number;
  offer_id: number;
  rater_id: number;
  rated_user_id: number;
  rating: number;
  comment: string;
  rater: P2POrderRatingUser;
  rated_user: P2POrderRatingUser;
}

export const submitP2POrderRating = createAsyncThunk<
  P2POrderRatingResponse,
  CreateP2POrderRatingPayload,
  { rejectValue: string }
>(
  "p2pOrderRating/submitP2POrderRating",
  async (payload, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      if (!baseUrl) {
        return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL in environment");
      }

      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      const response = await fetch(`${baseUrl}/p2p/orders/${payload.order_id}/ratings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ rating: payload.rating, comment: payload.comment }),
      });

      const data = await response.json();
      if (!response.ok || !data?.success) {
        return rejectWithValue(data?.message || `Failed to submit rating (${response.status})`);
      }

      return data.data as P2POrderRatingResponse;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while submitting rating");
    }
  }
);
