"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Toaster } from "@/components/common/Toast";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { resetP2PCreateOfferState } from "@/redux/slices/p2pCreateOfferSlice";
import { createP2POffer } from "@/redux/thunk/p2pCreateOfferThunk";
import { fetchExchangeRate } from "@/redux/thunk/exchangeRateThunk";
import { fetchP2PPaymentMethods } from "@/redux/thunk/p2pPaymentMethodsThunk";

export type CreateOfferType = "buy" | "sell";

interface CreateOfferModalProps {
  isOpen: boolean;
  offerType: CreateOfferType;
  onOfferTypeChange: (type: CreateOfferType) => void;
  onClose: () => void;
  onCreated?: () => void;
}

interface OfferFormState {
  coin: string;
  network: string;
  amount: string;
  price_per_coin: string;
  price_type: string;
  fiat_currency: string;
  min_order_limit: string;
  max_order_limit: string;
  payment_method: string;
  payment_window: string;
  bank_name: string;
  account_name: string;
  account_number: string;
  iban_number: string;
  instructions: string;
}

const NETWORKS_BY_COIN: Record<string, string[]> = {
  USDT: ["TRC20", "ERC20", "BEP20"],
  USDC: ["ERC20", "BEP20"],
  BTC: ["BTC"],
  ETH: ["ERC20"],
};

const PAYMENT_METHODS_BY_FIAT: Record<string, { label: string; value: string }[]> = {
  USD: [
    { label: "Bank Transfer", value: "bank_transfer" },
    { label: "International Bank", value: "international_bank" },
  ],
  NGN: [
    { label: "Nigerian Bank", value: "nigerian_bank" },
    { label: "Opay", value: "opay" },
    { label: "PalmPay", value: "palmpay" },
    { label: "Moniepoint", value: "moniepoint" },
    { label: "Kuda Bank", value: "kuda_bank" },
  ],
};

const ACCOUNT_NAME_PATTERN = /^[a-zA-Z\s.'-]+$/;
const cleanAccountName = (value: string) => value.replace(/[^a-zA-Z\s.'-]/g, "");

const initialForm: OfferFormState = {
  coin: "USDT",
  network: "TRC20",
  amount: "",
  price_per_coin: "",
  price_type: "fixed",
  fiat_currency: "NGN",
  min_order_limit: "",
  max_order_limit: "",
  payment_method: "nigerian_bank",
  payment_window: "15",
  bank_name: "",
  account_name: "",
  account_number: "",
  iban_number: "",
  instructions: "",
};

const getDefaultForm = (offerType: CreateOfferType): OfferFormState => {
  const amount = offerType === "buy" ? "5000" : "2500";

  return {
    ...initialForm,
    amount,
    price_per_coin: offerType === "buy" ? "1.02" : "1.01",
    min_order_limit: "100",
    max_order_limit: amount,
    instructions:
      offerType === "buy"
        ? "I will pay after seller locks crypto in escrow."
        : "Please make payment within 15 minutes.",
  };
};

export function CreateOfferModal({
  isOpen,
  offerType,
  onOfferTypeChange,
  onClose,
  onCreated,
}: CreateOfferModalProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.p2pCreateOffer);
  const {
    methods: apiPaymentMethods,
    loading: paymentMethodsLoading,
  } = useAppSelector((state) => state.p2pPaymentMethods);
  const { toasts, toast, dismiss } = useToast();
  const [form, setForm] = useState<OfferFormState>(initialForm);

  const networks = useMemo(() => NETWORKS_BY_COIN[form.coin] ?? ["TRC20"], [form.coin]);
  const paymentMethods = useMemo(
    () =>
      apiPaymentMethods.length
        ? apiPaymentMethods.map((method) => ({
            label: method.name,
            value: method.slug,
          }))
        : PAYMENT_METHODS_BY_FIAT[form.fiat_currency] ?? PAYMENT_METHODS_BY_FIAT.NGN,
    [apiPaymentMethods, form.fiat_currency]
  );

  useEffect(() => {
    if (!isOpen) return;
    dispatch(resetP2PCreateOfferState());
    setForm(getDefaultForm(offerType));
  }, [dispatch, isOpen, offerType]);

  useEffect(() => {
    if (!networks.includes(form.network)) {
      setForm((current) => ({ ...current, network: networks[0] ?? "TRC20" }));
    }
  }, [form.network, networks]);

  useEffect(() => {
    if (!paymentMethods.some((method) => method.value === form.payment_method)) {
      const nextMethod = paymentMethods[0];
      setForm((current) => ({
        ...current,
        payment_method: nextMethod?.value ?? "",
        bank_name: nextMethod?.label ?? current.bank_name,
      }));
    }
  }, [form.payment_method, paymentMethods]);

  useEffect(() => {
    if (!isOpen || !form.fiat_currency) return;
    dispatch(fetchP2PPaymentMethods({ fiat_currency: form.fiat_currency }));
  }, [dispatch, form.fiat_currency, isOpen]);

  useEffect(() => {
    if (!isOpen || !form.fiat_currency) return;

    let isCurrent = true;
    dispatch(fetchExchangeRate({ base: "USD", target: form.fiat_currency }))
      .unwrap()
      .then((result) => {
        if (!isCurrent) return;
        setForm((current) => ({
          ...current,
          price_per_coin: String(result.rate),
        }));
      })
      .catch(() => {
        if (!isCurrent || form.fiat_currency !== "USD") return;
        setForm((current) => ({
          ...current,
          price_per_coin: "1",
        }));
      });

    return () => {
      isCurrent = false;
    };
  }, [dispatch, form.fiat_currency, isOpen]);

  if (!isOpen) {
    return null;
  }

  const updateField = (field: keyof OfferFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateAccountName = (value: string) => {
    updateField("account_name", cleanAccountName(value));
  };

  const maxOrderLimitError =
    form.amount &&
    form.max_order_limit &&
    Number(form.max_order_limit) > Number(form.amount)
      ? "Max order limit cannot be greater than offer amount."
      : form.min_order_limit &&
          form.max_order_limit &&
          Number(form.max_order_limit) < Number(form.min_order_limit)
        ? "Max order limit cannot be less than min order limit."
      : "";

  const validateForm = () => {
    if (!form.amount || Number(form.amount) <= 0) return "Enter a valid offer amount.";
    if (!form.price_per_coin || Number(form.price_per_coin) <= 0) return "Enter a valid price per coin.";
    if (!form.min_order_limit || Number(form.min_order_limit) <= 0) return "Enter a valid min order limit.";
    if (!form.max_order_limit || Number(form.max_order_limit) <= 0) return "Enter a valid max order limit.";
    if (maxOrderLimitError) return maxOrderLimitError;
    if (!form.payment_method) return "Choose a payment method.";
    if (!form.account_name.trim()) return "Account name is required.";
    if (!ACCOUNT_NAME_PATTERN.test(form.account_name.trim())) {
      return "Account name can contain letters, spaces, apostrophes, hyphens, and dots only.";
    }
    if (form.account_number && !/^\d+$/.test(form.account_number)) return "Account number must contain numbers only.";
    if (form.iban_number && !/^[a-zA-Z0-9]+$/.test(form.iban_number)) {
      return "IBAN number must contain letters and numbers only.";
    }
    if (!form.instructions.trim()) return "Instructions are required.";
    return "";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      toast({ title: "Invalid offer", description: validationError, type: "error" });
      return;
    }

    try {
      await dispatch(
        createP2POffer({
          type: offerType,
          coin: form.coin,
          network: form.network,
          amount: form.amount,
          price_per_coin: form.price_per_coin,
          price_type: form.price_type,
          fiat_currency: form.fiat_currency,
          min_order_limit: form.min_order_limit,
          max_order_limit: form.max_order_limit,
          payment_method: form.payment_method,
          payment_window: Number(form.payment_window || 15),
          bank_name: form.bank_name,
          account_name: form.account_name,
          account_number: form.account_number,
          iban_number: form.iban_number,
          instructions: form.instructions,
        })
      ).unwrap();

      toast({
        title: "Offer created successfully",
        description: `${offerType === "buy" ? "Buy" : "Sell"} offer has been created.`,
        type: "success",
      });
      setForm(getDefaultForm(offerType));
      onCreated?.();
      onClose();
    } catch (err: any) {
      const message = typeof err === "string" ? err : err?.message || error || "Failed to create offer";
      toast({ title: "Failed to create offer", description: message, type: "error" });
      if (message.toLowerCase().includes("kyc verification is required") || message.toLowerCase().includes("kyc required")) {
        router.push("/dashboard/kyc");
      }
    }
  };

  return (
    <>
      <Toaster toasts={toasts} onDismiss={dismiss} />
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
        <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#0f1220] shadow-2xl">
          <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5">
            <div>
              <h3 className="text-xl font-semibold capitalize text-white">Create {offerType} Offer</h3>
              <p className="mt-1 text-sm text-white/50">
                This will create a real P2P {offerType} offer using the backend API.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-white/70 transition hover:bg-white/5 hover:text-white"
              aria-label="Close create offer modal"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-white/80">
                Offer type
                <select
                  value={offerType}
                  onChange={(event) => onOfferTypeChange(event.target.value as CreateOfferType)}
                  className="w-full rounded-2xl border border-white/10 bg-[#161724] px-4 py-3 text-sm text-white outline-none"
                >
                  <option value="buy">Buy Offer</option>
                  <option value="sell">Sell Offer</option>
                </select>
              </label>
              <label className="space-y-2 text-sm text-white/80">
                Coin
                <select
                  value={form.coin}
                  onChange={(event) => updateField("coin", event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#161724] px-4 py-3 text-sm text-white outline-none"
                >
                  {Object.keys(NETWORKS_BY_COIN).map((coin) => (
                    <option key={coin} value={coin}>{coin}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm text-white/80">
                Fiat currency
                <select
                  value={form.fiat_currency}
                  onChange={(event) => updateField("fiat_currency", event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#161724] px-4 py-3 text-sm text-white outline-none"
                >
                  <option value="NGN">NGN</option>
                  <option value="USD">USD</option>
                </select>
              </label>
              <label className="space-y-2 text-sm text-white/80">
                Network
                <select
                  value={form.network}
                  onChange={(event) => updateField("network", event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#161724] px-4 py-3 text-sm text-white outline-none"
                >
                  {networks.map((network) => (
                    <option key={network} value={network}>{network}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm text-white/80">
                Amount
                <input
                  type="number"
                  value={form.amount}
                  onChange={(event) => updateField("amount", event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#161724] px-4 py-3 text-sm text-white outline-none"
                />
              </label>
              <label className="space-y-2 text-sm text-white/80">
                Price per coin
                <input
                  type="number"
                  step="0.01"
                  value={form.price_per_coin}
                  onChange={(event) => updateField("price_per_coin", event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#161724] px-4 py-3 text-sm text-white outline-none"
                />
              </label>
              <label className="space-y-2 text-sm text-white/80">
                Min order limit
                <input
                  type="number"
                  value={form.min_order_limit}
                  onChange={(event) => updateField("min_order_limit", event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#161724] px-4 py-3 text-sm text-white outline-none"
                />
              </label>
              <label className="space-y-2 text-sm text-white/80">
                Max order limit
                <input
                  type="number"
                  max={form.amount || undefined}
                  value={form.max_order_limit}
                  onChange={(event) => updateField("max_order_limit", event.target.value)}
                  aria-invalid={Boolean(maxOrderLimitError)}
                  className={`w-full rounded-2xl border bg-[#161724] px-4 py-3 text-sm text-white outline-none ${
                    maxOrderLimitError ? "border-red-500/60" : "border-white/10"
                  }`}
                />
                {maxOrderLimitError && (
                  <p className="text-xs font-medium text-red-400">{maxOrderLimitError}</p>
                )}
              </label>
              <label className="space-y-2 text-sm text-white/80">
                Payment method
                <select
                  value={form.payment_method}
                  onChange={(event) => {
                    const selectedMethod = paymentMethods.find((method) => method.value === event.target.value);
                    setForm((current) => ({
                      ...current,
                      payment_method: event.target.value,
                      bank_name: selectedMethod?.label ?? current.bank_name,
                    }));
                  }}
                  className="w-full rounded-2xl border border-white/10 bg-[#161724] px-4 py-3 text-sm text-white outline-none"
                >
                  {paymentMethodsLoading && <option value={form.payment_method}>Loading...</option>}
                  {paymentMethods.map((method) => (
                    <option key={method.value} value={method.value}>{method.label}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm text-white/80">
                Payment window
                <input
                  type="number"
                  value={form.payment_window}
                  onChange={(event) => updateField("payment_window", event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#161724] px-4 py-3 text-sm text-white outline-none"
                />
              </label>
              <label className="space-y-2 text-sm text-white/80">
                Bank name
                <input
                  type="text"
                  value={form.bank_name}
                  onChange={(event) => updateField("bank_name", event.target.value)}
                  placeholder="Access Bank"
                  className="w-full rounded-2xl border border-white/10 bg-[#161724] px-4 py-3 text-sm text-white outline-none"
                />
              </label>
              <label className="space-y-2 text-sm text-white/80">
                Account name
                <input
                  type="text"
                  value={form.account_name}
                  onChange={(event) => updateAccountName(event.target.value)}
                  placeholder="John Doe"
                  className="w-full rounded-2xl border border-white/10 bg-[#161724] px-4 py-3 text-sm text-white outline-none"
                />
              </label>
              <label className="space-y-2 text-sm text-white/80">
                Account number
                <input
                  type="number"
                  value={form.account_number}
                  onChange={(event) => updateField("account_number", event.target.value)}
                  placeholder="1234567890"
                  className="w-full rounded-2xl border border-white/10 bg-[#161724] px-4 py-3 text-sm text-white outline-none"
                />
              </label>
              <label className="space-y-2 text-sm text-white/80">
                IBAN number
                <input
                  type="text"
                  value={form.iban_number}
                  onChange={(event) => updateField("iban_number", event.target.value)}
                  placeholder="PK36SCBL0000001123456702"
                  className="w-full rounded-2xl border border-white/10 bg-[#161724] px-4 py-3 text-sm text-white outline-none"
                />
              </label>
            </div>

            <label className="mt-4 block space-y-2 text-sm text-white/80">
              Instructions
              <textarea
                rows={3}
                value={form.instructions}
                onChange={(event) => updateField("instructions", event.target.value)}
                className="w-full resize-none rounded-2xl border border-white/10 bg-[#161724] px-4 py-3 text-sm text-white outline-none"
              />
            </label>

            {error && <p className="mt-4 whitespace-pre-line text-sm text-red-400">{error}</p>}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-violet-600 hover:bg-violet-500">
                {loading ? "Creating..." : `Create ${offerType === "buy" ? "Buy" : "Sell"} Offer`}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
