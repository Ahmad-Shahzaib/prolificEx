"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Plus, RefreshCw, Save, Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  KycLimitSetting,
  SystemLogSettings,
  WithdrawalFeeSetting,
  fetchAdminSystemLogs,
  updateAdminSystemLogs,
} from "@/redux/thunk/adminSystemLogsThunk";
import { resetAdminSystemLogsMessages } from "@/redux/slices/adminSystemLogsSlice";

const unitOptions = ["USD", "%", "ETH", "BTC", "USDT", "BNB", "SOL"];
const coinOptions = ["ETH", "BTC", "USDT", "BNB", "SOL", "USDC"];

const coinMeta: Record<string, { name: string; color: string; bg: string; letter: string }> = {
  ETH: { name: "Ethereum", color: "#627EEA", bg: "#627EEA22", letter: "E" },
  BTC: { name: "Bitcoin", color: "#F7931A", bg: "#F7931A22", letter: "B" },
  USDT: { name: "Tether", color: "#26A17B", bg: "#26A17B22", letter: "T" },
  BNB: { name: "Binance Coin", color: "#F3BA2F", bg: "#F3BA2F22", letter: "B" },
  SOL: { name: "Solana", color: "#14F195", bg: "#14F19522", letter: "S" },
  USDC: { name: "USD Coin", color: "#2775CA", bg: "#2775CA22", letter: "U" },
};

const emptySettings: SystemLogSettings = {
  trading_fee_percent: "",
  withdrawal_fees: [],
  kyc_limits: [],
};

function CoinIcon({ coin }: { coin: string }) {
  const meta = coinMeta[coin.toUpperCase()] ?? {
    name: coin,
    color: "#9ca3af",
    bg: "#37415122",
    letter: coin.charAt(0).toUpperCase() || "C",
  };

  return (
    <span
      className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold"
      style={{ background: meta.bg, color: meta.color, border: `1.5px solid ${meta.color}44` }}
    >
      {meta.letter}
    </span>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className={`h-11 w-full rounded-xl border border-[#2a2d45] bg-[#0f1017] px-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-500/60 ${className}`}
    />
  );
}

function SelectInput({
  value,
  options,
  onChange,
  className = "",
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full appearance-none rounded-xl border border-[#2a2d45] bg-[#202337] px-3 pr-9 text-sm text-slate-200 outline-none focus:border-violet-500/60"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
}

const formatDateTime = (value: string | null) => {
  if (!value) return "Not updated yet";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
};

const withCurrentOption = (options: string[], current: string) => {
  if (!current || options.includes(current)) return options;
  return [current, ...options];
};

export default function AdminFeeSettingsPage() {
  const dispatch = useAppDispatch();
  const { settings, loading, error, saving, saveError, message, updatedAt, updatedBy } = useAppSelector(
    (state) => state.adminSystemLogs
  );

  const [form, setForm] = useState<SystemLogSettings>(emptySettings);

  useEffect(() => {
    dispatch(fetchAdminSystemLogs());
  }, [dispatch]);

  useEffect(() => {
    if (settings) {
      setForm({
        trading_fee_percent: settings.trading_fee_percent ?? "",
        withdrawal_fees: settings.withdrawal_fees?.length ? settings.withdrawal_fees : [],
        kyc_limits: settings.kyc_limits?.length ? settings.kyc_limits : [],
      });
    }
  }, [settings]);

  useEffect(() => {
    if (!error && !saveError && !message) return undefined;

    const timer = window.setTimeout(() => {
      dispatch(resetAdminSystemLogsMessages());
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [dispatch, error, saveError, message]);

  const summary = useMemo(
    () => [
      { label: "Trading Fee", value: form.trading_fee_percent ? `${form.trading_fee_percent}%` : "-" },
      { label: "Withdrawal Fees", value: String(form.withdrawal_fees.length) },
      { label: "KYC Levels", value: String(form.kyc_limits.length) },
      { label: "Updated By", value: updatedBy ? String(updatedBy) : "-" },
    ],
    [form.kyc_limits.length, form.trading_fee_percent, form.withdrawal_fees.length, updatedBy]
  );

  const updateWithdrawalFee = (index: number, patch: Partial<WithdrawalFeeSetting>) => {
    setForm((current) => ({
      ...current,
      withdrawal_fees: current.withdrawal_fees.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item
      ),
    }));
  };

  const updateKycLimit = (index: number, patch: Partial<KycLimitSetting>) => {
    setForm((current) => ({
      ...current,
      kyc_limits: current.kyc_limits.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item
      ),
    }));
  };

  const addWithdrawalFee = () => {
    setForm((current) => ({
      ...current,
      withdrawal_fees: [...current.withdrawal_fees, { coin: "USDT", amount: "", unit: "USD" }],
    }));
  };

  const removeWithdrawalFee = (index: number) => {
    setForm((current) => ({
      ...current,
      withdrawal_fees: current.withdrawal_fees.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const addKycLimit = () => {
    setForm((current) => ({
      ...current,
      kyc_limits: [
        ...current.kyc_limits,
        {
          level: `KYC Level ${current.kyc_limits.length + 1}`,
          daily_limit: "",
          daily_unit: "USD",
          monthly_limit: "",
          monthly_unit: "USD",
        },
      ],
    }));
  };

  const removeKycLimit = (index: number) => {
    setForm((current) => ({
      ...current,
      kyc_limits: current.kyc_limits.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleSave = async () => {
    await dispatch(
      updateAdminSystemLogs({
        trading_fee_percent: form.trading_fee_percent.trim(),
        withdrawal_fees: form.withdrawal_fees.map((fee) => ({
          coin: fee.coin.trim().toUpperCase(),
          amount: fee.amount.trim(),
          unit: fee.unit.trim(),
        })),
        kyc_limits: form.kyc_limits.map((limit) => ({
          level: limit.level.trim(),
          daily_limit: limit.daily_limit.trim(),
          daily_unit: limit.daily_unit.trim(),
          monthly_limit: limit.monthly_limit.trim(),
          monthly_unit: limit.monthly_unit.trim(),
        })),
      })
    );
  };

  return (
    <div className="min-h-screen p-4 font-sans text-white sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight">Fee & Limit Settings</h1>
            <p className="mt-1 text-sm text-slate-400">Manage trading fees, withdrawal fees, and KYC limits.</p>
          </div>
          <button
            type="button"
            onClick={() => dispatch(fetchAdminSystemLogs())}
            disabled={loading || saving}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#2a2d45] bg-[#202337] px-4 text-sm font-semibold text-slate-200 transition hover:border-[#3b3f60] hover:bg-[#252941] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {summary.map((item) => (
            <div key={item.label} className="rounded-2xl border border-[#272a40] bg-[#181a27] px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
            </div>
          ))}
        </div>

        {(error || saveError || message) && (
          <div
            className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
              error || saveError
                ? "border-rose-400/20 bg-rose-400/10 text-rose-200"
                : "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
            }`}
          >
            {error || saveError || message}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-[#272a40] bg-[#181a27] p-10 text-center text-slate-300">
            Loading system settings...
          </div>
        ) : (
          <>
            <section className="mb-6 overflow-hidden rounded-2xl border border-[#272a40] bg-[#181a27]">
              <div className="border-b border-[#272a40] px-6 py-4">
                <h2 className="text-base font-semibold">Trading Fee Configuration</h2>
              </div>
              <div className="grid grid-cols-1 gap-4 px-6 py-6 sm:grid-cols-[220px_minmax(180px,260px)] sm:items-center">
                <span className="text-sm text-slate-400">Trading Fee per trade</span>
                <div className="flex overflow-hidden rounded-xl border border-[#2a2d45] bg-[#0f1017] focus-within:border-violet-500/60">
                  <input
                    type="text"
                    value={form.trading_fee_percent}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, trading_fee_percent: event.target.value }))
                    }
                    placeholder="0.25"
                    className="h-11 min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-slate-600"
                  />
                  <span className="flex h-11 items-center border-l border-[#2a2d45] px-3 text-sm font-semibold text-slate-400">
                    %
                  </span>
                </div>
              </div>
            </section>

            <section className="mb-6 overflow-hidden rounded-2xl border border-[#272a40] bg-[#181a27]">
              <div className="flex flex-col justify-between gap-3 border-b border-[#272a40] px-6 py-4 sm:flex-row sm:items-center">
                <h2 className="text-base font-semibold">Withdrawal Fees</h2>
                <button
                  type="button"
                  onClick={addWithdrawalFee}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white transition hover:bg-violet-500"
                >
                  <Plus className="h-4 w-4" />
                  Add Fee
                </button>
              </div>

              <div className="divide-y divide-[#272a40]">
                {form.withdrawal_fees.length === 0 ? (
                  <div className="px-6 py-8 text-center text-sm text-slate-400">No withdrawal fees configured.</div>
                ) : (
                  form.withdrawal_fees.map((fee, index) => {
                    const meta = coinMeta[fee.coin.toUpperCase()];

                    return (
                      <div key={`${fee.coin}-${index}`} className="grid grid-cols-1 gap-4 px-6 py-5 lg:grid-cols-[220px_1fr_150px_44px] lg:items-center">
                        <div className="flex items-center gap-3">
                          <CoinIcon coin={fee.coin} />
                          <div>
                            <p className="text-sm font-semibold text-white">{meta?.name ?? fee.coin}</p>
                            <p className="text-xs text-slate-500">{fee.coin || "Coin"}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[160px_1fr]">
                          <SelectInput
                            value={fee.coin}
                            options={withCurrentOption(coinOptions, fee.coin)}
                            onChange={(value) => updateWithdrawalFee(index, { coin: value })}
                          />
                          <TextInput
                            value={fee.amount}
                            onChange={(value) => updateWithdrawalFee(index, { amount: value })}
                            placeholder="5.00"
                          />
                        </div>

                        <SelectInput
                          value={fee.unit}
                          options={withCurrentOption(unitOptions, fee.unit)}
                          onChange={(value) => updateWithdrawalFee(index, { unit: value })}
                        />

                        <button
                          type="button"
                          onClick={() => removeWithdrawalFee(index)}
                          className="flex h-11 w-full items-center justify-center rounded-xl border border-rose-400/20 bg-rose-400/10 text-rose-300 transition hover:bg-rose-400/20 lg:w-11"
                          aria-label={`Remove ${fee.coin} withdrawal fee`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </section>

            <section className="mb-8 overflow-hidden rounded-2xl border border-[#272a40] bg-[#181a27]">
              <div className="flex flex-col justify-between gap-3 border-b border-[#272a40] px-6 py-4 sm:flex-row sm:items-center">
                <h2 className="text-base font-semibold">KYC Limits</h2>
                <button
                  type="button"
                  onClick={addKycLimit}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white transition hover:bg-violet-500"
                >
                  <Plus className="h-4 w-4" />
                  Add Level
                </button>
              </div>

              <div className="hidden grid-cols-[180px_1fr_120px_1fr_120px_44px] gap-3 border-b border-[#272a40] bg-[#151724] px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 xl:grid">
                <span>Level</span>
                <span>Daily Limit</span>
                <span>Daily Unit</span>
                <span>Monthly Limit</span>
                <span>Monthly Unit</span>
                <span />
              </div>

              <div className="divide-y divide-[#272a40]">
                {form.kyc_limits.length === 0 ? (
                  <div className="px-6 py-8 text-center text-sm text-slate-400">No KYC limits configured.</div>
                ) : (
                  form.kyc_limits.map((limit, index) => (
                    <div key={`${limit.level}-${index}`} className="grid grid-cols-1 gap-3 px-6 py-5 xl:grid-cols-[180px_1fr_120px_1fr_120px_44px] xl:items-center">
                      <div>
                        <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500 xl:hidden">Level</span>
                        <TextInput
                          value={limit.level}
                          onChange={(value) => updateKycLimit(index, { level: value })}
                          placeholder="KYC Level 1"
                        />
                      </div>
                      <div>
                        <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500 xl:hidden">Daily Limit</span>
                        <TextInput
                          value={limit.daily_limit}
                          onChange={(value) => updateKycLimit(index, { daily_limit: value })}
                          placeholder="1000"
                        />
                      </div>
                      <div>
                        <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500 xl:hidden">Daily Unit</span>
                        <SelectInput
                          value={limit.daily_unit}
                          options={withCurrentOption(unitOptions, limit.daily_unit)}
                          onChange={(value) => updateKycLimit(index, { daily_unit: value })}
                        />
                      </div>
                      <div>
                        <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500 xl:hidden">Monthly Limit</span>
                        <TextInput
                          value={limit.monthly_limit}
                          onChange={(value) => updateKycLimit(index, { monthly_limit: value })}
                          placeholder="20000"
                        />
                      </div>
                      <div>
                        <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500 xl:hidden">Monthly Unit</span>
                        <SelectInput
                          value={limit.monthly_unit}
                          options={withCurrentOption(unitOptions, limit.monthly_unit)}
                          onChange={(value) => updateKycLimit(index, { monthly_unit: value })}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeKycLimit(index)}
                        className="flex h-11 w-full items-center justify-center rounded-xl border border-rose-400/20 bg-rose-400/10 text-rose-300 transition hover:bg-rose-400/20 xl:w-11"
                        aria-label={`Remove ${limit.level}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </section>

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <p className="text-sm text-slate-500">
                Last updated: {formatDateTime(updatedAt)}
              </p>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 text-sm font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
