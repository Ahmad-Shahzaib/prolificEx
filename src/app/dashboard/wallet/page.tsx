"use client";
import { useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { convertWallet, fetchWallets } from "@/redux/thunk/walletThunk";
import { Button } from "@/components/common/Button";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/common/Toast/Toast";

// ─── Coin metadata ────────────────────────────────────────────────────────────
const walletCoinMeta: Record<
  string,
  { name: string; iconBg: string; iconLetter: string; action: "deposit" | "withdraw" }
> = {
  BTC:  { name: "Bitcoin",   iconBg: "bg-[#f7931a]", iconLetter: "₿", action: "deposit"  },
  ETH:  { name: "Ethereum",  iconBg: "bg-[#627eea]", iconLetter: "Ξ", action: "deposit"  },
  USDT: { name: "Tether",    iconBg: "bg-[#26a17b]", iconLetter: "₮", action: "withdraw" },
  USDC: { name: "USD Coin",  iconBg: "bg-[#2775ca]", iconLetter: "$", action: "withdraw" },
  SOL:  { name: "Solana",    iconBg: "bg-[#9945ff]", iconLetter: "◎", action: "deposit"  },
};

// ─── Converter coin list ──────────────────────────────────────────────────────
const CONVERTER_COINS = [
  { id: "BTC",  name: "Bitcoin",   icon: "₿", bg: "#f7931a", cgId: "bitcoin"       },
  { id: "ETH",  name: "Ethereum",  icon: "Ξ", bg: "#627eea", cgId: "ethereum"      },
  { id: "USDT", name: "Tether",    icon: "₮", bg: "#26a17b", cgId: "tether"        },
  { id: "USDC", name: "USD Coin",  icon: "$", bg: "#2775ca", cgId: "usd-coin"      },
  { id: "SOL",  name: "Solana",    icon: "◎", bg: "#9945ff", cgId: "solana"        },
  
];

// ─── CoinSelect dropdown ──────────────────────────────────────────────────────
interface CoinSelectProps {
  value: string;
  onChange: (id: string) => void;
  exclude?: string;
}

function CoinSelect({ value, onChange, exclude }: CoinSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = CONVERTER_COINS.find((c) => c.id === value)!;
  const options   = CONVERTER_COINS.filter((c) => c.id !== exclude);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px 10px",
          borderRadius: "10px",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.10)",
          cursor: "pointer",
          minWidth: "90px",
          justifyContent: "space-between",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: selected.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
            }}
          >
            {selected.icon}
          </span>
          <span style={{ color: "#e5e7eb", fontSize: 13, fontWeight: 500 }}>{selected.id}</span>
        </span>
        <span
          style={{
            color: "#888",
            fontSize: 9,
            transition: "transform .2s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            display: "inline-block",
          }}
        >
          ▼
        </span>
      </button>

      {/* Dropdown list */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            background: "#1e1f2e",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 12,
            padding: 6,
            zIndex: 100,
            minWidth: 170,
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
          }}
        >
          {options.map((coin) => (
            <button
              key={coin.id}
              type="button"
              onClick={() => { onChange(coin.id); setOpen(false); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "8px 10px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                background: coin.id === value ? "rgba(124,58,237,0.25)" : "transparent",
                textAlign: "left",
                transition: "background .15s",
              }}
              onMouseEnter={(e) => {
                if (coin.id !== value)
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.07)";
              }}
              onMouseLeave={(e) => {
                if (coin.id !== value)
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: coin.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#fff",
                  flexShrink: 0,
                }}
              >
                {coin.icon}
              </span>
              <span>
                <span style={{ display: "block", color: "#e5e7eb", fontSize: 13, fontWeight: 500 }}>
                  {coin.name}
                </span>
                <span style={{ display: "block", color: "#666", fontSize: 11 }}>{coin.id}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const DEFAULT_RATES: Record<string, number> = {
  USD: 1,
  BTC: 60000,
  ETH: 2500,
  USDT: 1,
  USDC: 1,
  SOL: 140,
  BNB: 580,
};

const WALLET_UI_STATE_KEY = "dashboard.wallet.ui";
const WALLET_SCROLL_KEY = "dashboard.wallet.scrollY";
const WALLET_RATE_CACHE_KEY = "dashboard.wallet.rates";
const WALLET_RATES_CACHE_MS = 5 * 60_000;

interface WalletUiState {
  selectedAction?: "deposit" | "withdraw";
  fromAmount?: string;
  fromCurrency?: string;
  toCurrency?: string;
}

const readWalletUiState = (): WalletUiState => {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem(WALLET_UI_STATE_KEY) || "{}") as WalletUiState;
  } catch {
    return {};
  }
};

const readCachedRates = () => {
  if (typeof window === "undefined") return null;
  try {
    const cached = JSON.parse(localStorage.getItem(WALLET_RATE_CACHE_KEY) || "null") as
      | { rates: Record<string, number>; cachedAt: number }
      | null;

    if (!cached?.rates || Date.now() - cached.cachedAt > WALLET_RATES_CACHE_MS) {
      return null;
    }

    return cached.rates;
  } catch {
    return null;
  }
};
// ─── Main page ────────────────────────────────────────────────────────────────
export default function WalletPage() {
  const router   = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error, wallets, totalPortfolioUsd, convertLoading, loadedAt } = useAppSelector((s) => s.wallet);
  const { toast, toasts, dismiss } = useToast();

  // Converter state
  const walletUiState = useMemo(readWalletUiState, []);
  const [fromAmount,   setFromAmount]   = useState(walletUiState.fromAmount ?? "1");
  const [toAmount,     setToAmount]     = useState("");
  const [fromCurrency, setFromCurrency] = useState(walletUiState.fromCurrency ?? "ETH");
  const [toCurrency,   setToCurrency]   = useState(walletUiState.toCurrency ?? "USDT");
  const cachedRates = useMemo(readCachedRates, []);
  const [rates,        setRates]        = useState<Record<string, number>>(cachedRates ?? DEFAULT_RATES);
  const [ratesLoading, setRatesLoading] = useState(!cachedRates);
  const [ratesError,   setRatesError]   = useState(false);

  // Filter state
  const [selectedAction, setSelectedAction] = useState<"deposit" | "withdraw">(walletUiState.selectedAction ?? "deposit");

  // ── Live exchange-rate fetch ──────────────────────────────────────────────
  const fetchRates = async (force = false) => {
    const cached = readCachedRates();
    if (!force && cached) {
      setRates(cached);
      setRatesLoading(false);
      return;
    }

    try {
      const ids = "bitcoin,ethereum,tether,usd-coin,solana,binancecoin";
      const res  = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`,
        { cache: "no-store" }
      );
      if (!res.ok) throw new Error("bad response");
      const data = await res.json();
      const freshRates = {
        USD:  1,
        BTC:  data.bitcoin?.usd        ?? DEFAULT_RATES.BTC,
        ETH:  data.ethereum?.usd       ?? DEFAULT_RATES.ETH,
        USDT: data.tether?.usd         ?? DEFAULT_RATES.USDT,
        USDC: data["usd-coin"]?.usd    ?? DEFAULT_RATES.USDC,
        SOL:  data.solana?.usd         ?? DEFAULT_RATES.SOL,
        BNB:  data.binancecoin?.usd    ?? DEFAULT_RATES.BNB,
      };
      setRates(freshRates);
      localStorage.setItem(
        WALLET_RATE_CACHE_KEY,
        JSON.stringify({ rates: freshRates, cachedAt: Date.now() })
      );
      setRatesError(false);
    } catch {
      setRatesError(true);
    } finally {
      setRatesLoading(false);
    }
  };
  useEffect(() => {
    fetchRates();
    const timer = setInterval(() => fetchRates(), 60_000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    sessionStorage.setItem(
      WALLET_UI_STATE_KEY,
      JSON.stringify({ selectedAction, fromAmount, fromCurrency, toCurrency })
    );
  }, [selectedAction, fromAmount, fromCurrency, toCurrency]);

  useEffect(() => {
    const savedScroll = Number(sessionStorage.getItem(WALLET_SCROLL_KEY) || 0);
    if (savedScroll > 0) window.requestAnimationFrame(() => window.scrollTo(0, savedScroll));

    const saveScroll = () => sessionStorage.setItem(WALLET_SCROLL_KEY, String(window.scrollY));
    window.addEventListener("beforeunload", saveScroll);
    return () => {
      saveScroll();
      window.removeEventListener("beforeunload", saveScroll);
    };
  }, []);

  // ── Wallet data ───────────────────────────────────────────────────────────
  useEffect(() => { dispatch(fetchWallets()); }, [dispatch]);

  // ── Conversion helpers ────────────────────────────────────────────────────
  const convert = (amount: number, from: string, to: string) => {
    const fromRate = rates[from] ?? 1;
    const toRate   = rates[to]   ?? 1;
    return amount * (fromRate / toRate);
  };

  const formatAmount = (value: number) => {
    const dec = value < 0.01 ? 6 : value < 1 ? 4 : 2;
    return value.toLocaleString("en-US", {
      minimumFractionDigits: dec,
      maximumFractionDigits: dec,
    });
  };

  const conversionRateLabel = useMemo(() => {
    const rate = convert(1, fromCurrency, toCurrency);
    return `1 ${fromCurrency} = ${formatAmount(rate)} ${toCurrency}`;
  }, [fromCurrency, toCurrency, rates]);

  useEffect(() => {
    if (!fromAmount.trim()) { setToAmount(""); return; }
    const amt = parseFloat(fromAmount.replace(/[^0-9.-]/g, "")) || 0;
    const result = convert(amt, fromCurrency, toCurrency);
    setToAmount(amt === 0 ? "" : formatAmount(result));
  }, [fromAmount, fromCurrency, toCurrency, rates]);

  // Swap currencies
  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount || "1");
  };

  const handleConvert = async () => {
    const payloadAmount = fromAmount.trim().replace(/[^0-9.-]/g, "");
    const numericAmount = parseFloat(payloadAmount);

    if (!payloadAmount || isNaN(numericAmount) || numericAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount greater than zero.",
        type: "error",
      });
      return;
    }

    if (fromCurrency === toCurrency) {
      toast({
        title: "Invalid conversion",
        description: "Please choose two different currencies to convert.",
        type: "error",
      });
      return;
    }

    try {
      const result = await dispatch(
        convertWallet({
          from_coin: fromCurrency,
          to_coin: toCurrency,
          amount: numericAmount.toFixed(8),
        })
      ).unwrap();

      toast({
        title: "Conversion successful",
        description: result.message || "Wallet balance converted successfully.",
        type: "success",
      });

      if (result.data?.converted_amount) {
        setToAmount(result.data.converted_amount);
      }

      dispatch(fetchWallets({ force: true }));
    } catch (error: any) {
      toast({
        title: "Conversion failed",
        description: error || "Unable to convert wallet balance.",
        type: "error",
      });
    }
  };

  // ── Asset list ────────────────────────────────────────────────────────────
  const showWalletSkeleton = loading && loadedAt === null && wallets.length === 0;
  const isRefreshingWallets = loading && !showWalletSkeleton;

  const walletAssets = useMemo(
    () =>
      wallets.map((asset) => {
        const meta = walletCoinMeta[asset.coin] ?? {
          name:        asset.coin,
          iconBg:      "bg-slate-600",
          iconLetter:  asset.coin.charAt(0),
          action:      "deposit" as const,
        };
        return {
          ...asset,
          name:      meta.name,
          ticker:    asset.coin,
          iconBg:    meta.iconBg,
          iconLetter:meta.iconLetter,
          available: asset.available_balance,
          inTrade:   asset.locked_balance,
          total:     asset.balance,
          action:    meta.action,
        };
      }),
    [wallets]
  );

  const depositAssets = useMemo(
    () => walletAssets.filter((asset) => asset.action === "deposit"),
    [walletAssets]
  );

  const withdrawAssets = useMemo(
    () => walletAssets.filter((asset) => asset.action === "withdraw"),
    [walletAssets]
  );

  const formattedTotalPortfolio = totalPortfolioUsd.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen w-full px-2 py-3 sm:px-3 sm:py-4 lg:px-4"
      style={{ background: "#0d0e17", fontFamily: "'Inter', sans-serif" }}
    >
      <h1 className="text-white text-xl font-semibold mb-3">Wallets</h1>

      <div className="flex flex-col xl:flex-row gap-4">
        {/* ── Left Column ── */}
        <div className="flex-1 flex flex-col gap-4">

          {/* Portfolio Card */}
          <div
            className="rounded-xl p-4"
            style={{ background: "#14151f", border: "1px solid rgba(255,255,255,0.055)" }}
          >
            <p className="text-gray-400 text-xs mb-1">Total Portfolio Value</p>
            <p className="text-white text-2xl font-bold mb-2">
              {showWalletSkeleton ? <span className="block h-8 w-40 rounded-lg bg-white/10 animate-pulse" /> : formattedTotalPortfolio}
            </p>
            {isRefreshingWallets && (
              <p className="text-xs text-violet-300 mb-2">Refreshing balances...</p>
            )}
            {error && wallets.length === 0 && (
              <p className="text-sm text-red-400 mb-4">
                Unable to load wallet balances: {error}
              </p>
            )}
            <div className="flex flex-wrap gap-2.5">
              {(["deposit", "withdraw"] as const).map((action) => (
                <Button
                  key={action}
                  onClick={() => setSelectedAction(action)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
                  style={{
                    background: selectedAction === action ? "#7c3aed" : "transparent",
                    border:
                      selectedAction === action
                        ? "1px solid transparent"
                        : "1px solid rgba(255,255,255,0.15)",
                    color: "#ffffff",
                  }}
                >
                  {action === "deposit" ? (
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  )}
                  {action.charAt(0).toUpperCase() + action.slice(1)}
                </Button>
              ))}
              <Button
                onClick={() => router.push("/dashboard/p2p")}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#ffffff",
                }}
              >
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                P2P Trade
              </Button>
            </div>
          </div>

          {/* Assets Table */}
          <div
            className="rounded-xl overflow-hidden"
            style={{ background: "#14151f", border: "1px solid rgba(255,255,255,0.055)" }}
          >
            {/* Desktop header */}
            <div
              className="hidden md:grid px-4 py-2.5 text-[11px] text-gray-500 uppercase tracking-wide"
              style={{
                gridTemplateColumns: "2fr 1.2fr 1.2fr 1.2fr 1fr",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <span>Coin</span>
              <span>Available</span>
              <span>In Trade</span>
              <span>Total</span>
              <span>Actions</span>
            </div>

            {showWalletSkeleton ? (
              <div className="space-y-2.5 px-4 py-4 animate-pulse" aria-label="Loading wallets">
                {[0, 1, 2, 3].map((row) => (
                  <div key={row} className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {[0, 1, 2, 3, 4].map((cell) => (
                      <div key={cell} className="h-8 rounded-lg bg-white/5" />
                    ))}
                  </div>
                ))}
              </div>
            ) : error && wallets.length === 0 ? (
              <div className="px-4 py-6 text-red-400 text-sm">{error}</div>
            ) : depositAssets.length === 0 && withdrawAssets.length === 0 ? (
              <div className="px-4 py-6 text-gray-400 text-sm">No wallet records found.</div>
            ) : (
              <>
                {/* ── Deposit Section ── */}
                {selectedAction === "deposit" && depositAssets.length > 0 && (
                  <>
                    <div
                      className="flex items-center gap-2 px-4 py-2"
                      style={{ background: "rgba(124,58,237,0.08)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#7c3aed" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                      <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7c3aed" }}>
                        Deposit Networks
                      </span>
                      <span className="ml-auto text-xs text-gray-500">{depositAssets.length} asset{depositAssets.length !== 1 ? "s" : ""}</span>
                    </div>
                    {depositAssets.map((asset) => (
                      <div
                        key={asset.id}
                        className="border-b border-white/[0.04] last:border-none hover:bg-white/[0.025] transition-colors px-4 py-4 md:py-3"
                      >
                        {/* Mobile layout */}
                        <div className="md:hidden flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-7 h-7 rounded-full ${asset.iconBg} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                                {asset.iconLetter}
                              </div>
                              <div>
                                <p className="text-white text-sm font-medium">{asset.name}</p>
                                <p className="text-xs text-gray-500">{asset.ticker}</p>
                              </div>
                            </div>
                            <span className="text-right text-sm font-medium text-white">{asset.total}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-400 text-xs">Available</p>
                              <p className="text-gray-300">{asset.available}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-xs">In Trade</p>
                              <p className="text-gray-300">{asset.inTrade}</p>
                            </div>
                          </div>
                          <div className="pt-2">
                            <Button
                              onClick={() => router.push(`/dashboard/deposit?coin=${asset.ticker}`)}
                              className="w-full px-4 py-2 rounded-lg text-white text-xs font-semibold transition-all hover:opacity-90"
                              style={{ background: "#7c3aed" }}
                            >
                              Deposit
                            </Button>
                          </div>
                        </div>
                        {/* Desktop row */}
                        <div className="hidden md:grid items-center" style={{ gridTemplateColumns: "2fr 1.2fr 1.2fr 1.2fr 1fr" }}>
                          <div className="flex items-center gap-2.5">
                            <div className={`w-7 h-7 rounded-full ${asset.iconBg} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                              {asset.iconLetter}
                            </div>
                            <span className="text-white text-sm font-medium">{asset.name}</span>
                          </div>
                          <span className="text-gray-300 text-sm">{asset.available}</span>
                          <span className="text-gray-300 text-sm">{asset.inTrade}</span>
                          <span className="text-gray-300 text-sm">{asset.total}</span>
                          <Button
                            onClick={() => router.push(`/dashboard/deposit?coin=${asset.ticker}`)}
                            className="px-4 py-1.5 rounded-lg text-white text-xs font-semibold transition-all hover:opacity-90 justify-self-end"
                            style={{ background: "#7c3aed" }}
                          >
                            Deposit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {/* ── Withdraw Section ── */}
                {selectedAction === "withdraw" && withdrawAssets.length > 0 && (
                  <>
                    <div
                      className="flex items-center gap-2 px-4 py-2"
                      style={{
                        background: "rgba(16,185,129,0.07)",
                        borderTop: undefined,
                        borderBottom: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#10b981" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#10b981" }}>
                        Withdraw Networks
                      </span>
                      <span className="ml-auto text-xs text-gray-500">{withdrawAssets.length} asset{withdrawAssets.length !== 1 ? "s" : ""}</span>
                    </div>
                    {withdrawAssets.map((asset) => (
                      <div
                        key={asset.id}
                        className="border-b border-white/[0.04] last:border-none hover:bg-white/[0.025] transition-colors px-4 py-4 md:py-3"
                      >
                        {/* Mobile layout */}
                        <div className="md:hidden flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-7 h-7 rounded-full ${asset.iconBg} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                                {asset.iconLetter}
                              </div>
                              <div>
                                <p className="text-white text-sm font-medium">{asset.name}</p>
                                <p className="text-xs text-gray-500">{asset.ticker}</p>
                              </div>
                            </div>
                            <span className="text-right text-sm font-medium text-white">{asset.total}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-400 text-xs">Available</p>
                              <p className="text-gray-300">{asset.available}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-xs">In Trade</p>
                              <p className="text-gray-300">{asset.inTrade}</p>
                            </div>
                          </div>
                          <div className="pt-2">
                            <Button
                              onClick={() => router.push(`/dashboard/withdraw?coin=${asset.ticker}`)}
                              className="w-full px-4 py-2 rounded-lg text-xs font-semibold transition-all hover:bg-white/10"
                              style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#d1d5db" }}
                            >
                              Withdraw
                            </Button>
                          </div>
                        </div>
                        {/* Desktop row */}
                        <div className="hidden md:grid items-center" style={{ gridTemplateColumns: "2fr 1.2fr 1.2fr 1.2fr 1fr" }}>
                          <div className="flex items-center gap-2.5">
                            <div className={`w-7 h-7 rounded-full ${asset.iconBg} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                              {asset.iconLetter}
                            </div>
                            <span className="text-white text-sm font-medium">{asset.name}</span>
                          </div>
                          <span className="text-gray-300 text-sm">{asset.available}</span>
                          <span className="text-gray-300 text-sm">{asset.inTrade}</span>
                          <span className="text-gray-300 text-sm">{asset.total}</span>
                          <Button
                            onClick={() => router.push(`/dashboard/withdraw?coin=${asset.ticker}`)}
                            className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all hover:bg-white/10 justify-self-end"
                            style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#d1d5db" }}
                          >
                            Withdraw
                          </Button>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── Right Column — Convert Panel ── */}
        <div
          className="w-full xl:w-[17rem] rounded-xl p-4 flex-shrink-0"
          style={{ background: "#14151f", border: "1px solid rgba(255,255,255,0.055)" }}
        >
          <h2 className="text-white text-sm font-semibold text-center mb-4">Convert</h2>

          {/* From field */}
          <div
            className="flex items-center px-3 py-3 rounded-lg mb-2 gap-2"
            style={{ background: "#0d0e17", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <input
              type="text"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="bg-transparent text-white text-base font-semibold flex-1 w-0 outline-none"
              placeholder="0"
            />
            <CoinSelect
              value={fromCurrency}
              onChange={setFromCurrency}
              exclude={toCurrency}
            />
          </div>

          {/* Swap button */}
          <div className="flex justify-center my-2.5">
            <button
              type="button"
              onClick={handleSwap}
              className="w-7 h-7 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
              style={{ background: "#7c3aed", border: "none", cursor: "pointer" }}
            >
              <svg width="14" height="14" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>

          {/* To field */}
          <div
            className="flex items-center px-3 py-3 rounded-lg mb-2 gap-2"
            style={{ background: "#0d0e17", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <input
              type="text"
              value={toAmount}
              readOnly
              className="bg-transparent text-base font-semibold flex-1 w-0 outline-none"
              style={{ color: "#aaa" }}
              placeholder="0"
            />
            <CoinSelect
              value={toCurrency}
              onChange={setToCurrency}
              exclude={fromCurrency}
            />
          </div>

          {/* Rate row */}
          <div className="flex items-center justify-between mb-4 mt-2 px-1">
            {ratesLoading ? (
              <div className="h-3 w-36 rounded bg-white/10 animate-pulse" aria-label="Loading conversion rate" />
            ) : (
              <p className="text-gray-500 text-xs">{conversionRateLabel}</p>
            )}
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 10,
                fontWeight: 600,
                color: ratesError ? "#f87171" : "#10b981",
                background: ratesError ? "rgba(248,113,113,0.12)" : "rgba(16,185,129,0.12)",
                padding: "3px 7px",
                borderRadius: 20,
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: ratesError ? "#f87171" : "#10b981",
                  display: "inline-block",
                  animation: ratesError ? "none" : "pulse 2s infinite",
                }}
              />
              {ratesError ? "Cached" : "Live"}
            </span>
          </div>

          {/* Convert button */}
          <button
            type="button"
            onClick={handleConvert}
            disabled={convertLoading}
            className="w-full py-2.5 rounded-lg text-white text-sm font-semibold transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            style={{ background: "#7c3aed", border: "none", cursor: convertLoading ? "not-allowed" : "pointer" }}
          >
            {convertLoading ? "Converting…" : "Convert"}
          </button>
        </div>
      </div>

      {/* Keyframe for live dot pulse */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
      `}</style>
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
