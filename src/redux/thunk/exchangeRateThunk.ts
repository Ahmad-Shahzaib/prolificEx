import { createAsyncThunk } from "@reduxjs/toolkit";

export interface FetchExchangeRateParams {
  base?: string;
  target: string;
}

export interface ExchangeRateResult {
  base: string;
  target: string;
  rate: number;
}

export const fetchExchangeRate = createAsyncThunk<
  ExchangeRateResult,
  FetchExchangeRateParams,
  { rejectValue: string }
>(
  "exchangeRate/fetch",
  async ({ base = "USD", target }, { rejectWithValue }) => {
    try {
      const normalizedBase = base.toUpperCase();
      const normalizedTarget = target.toUpperCase();

      if (normalizedBase === normalizedTarget) {
        return {
          base: normalizedBase,
          target: normalizedTarget,
          rate: 1,
        };
      }

      const response = await fetch(
        `https://api.frankfurter.dev/v2/rate/${normalizedBase}/${normalizedTarget}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data?.message || `Failed to load exchange rate (${response.status})`);
      }

      const rate = Number(data?.rate ?? data?.rates?.[normalizedTarget]);
      if (!Number.isFinite(rate) || rate <= 0) {
        return rejectWithValue("Invalid exchange rate response");
      }

      return {
        base: normalizedBase,
        target: normalizedTarget,
        rate,
      };
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error while loading exchange rate");
    }
  }
);
