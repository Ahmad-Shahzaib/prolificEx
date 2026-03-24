"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  ChevronDown,
  Star,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/common/Button";

const COINS = ["USDT", "BTC", "ETH", "BNB", "USDC"];
const PAYMENT_METHODS = ["All", "Bank Transfer", "PayPal", "Wise", "Revolut"];
const RATINGS = ["All", "5 Stars", "4+ Stars", "3+ Stars"];

const generateMerchants = () =>
  Array.from({ length: 78 }, (_, i) => ({
    id: i + 1,
    name: "TraderMax",
    rating: 5,
    price: 48032.32 + (Math.random() - 0.5) * 200,
    available: 2500,
    coin: "USDT",
    limitMin: 100,
    limitMax: 2000,
    paymentMethod: ["Bank Transfer", "PayPal", "Wise", "Revolut"][i % 4],
    completionRate: 98 + Math.floor(Math.random() * 2),
    orders: 1000 + Math.floor(Math.random() * 5000),
  }));

const ALL_MERCHANTS = generateMerchants();
const PAGE_SIZE = 9;

export default function P2PCryptoTable() {
  const router = useRouter();
  const [tab, setTab] = useState<"buy" | "sell">("buy");
  const [coin, setCoin] = useState("USDT");
  const [amount, setAmount] = useState("");
  const [rating, setRating] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [showCoinDropdown, setShowCoinDropdown] = useState(false);
  const [showRatingDropdown, setShowRatingDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const filtered = ALL_MERCHANTS.filter((m) => {
    const matchRating =
      rating === "All"
        ? true
        : rating === "5 Stars"
        ? m.rating === 5
        : rating === "4+ Stars"
        ? m.rating >= 4
        : m.rating >= 3;

    const matchPayment =
      paymentFilter === "All" ? true : m.paymentMethod === paymentFilter;

    const matchAmount =
      amount === ""
        ? true
        : parseFloat(amount) >= m.limitMin && parseFloat(amount) <= m.limitMax;

    return matchRating && matchPayment && matchAmount;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = () => {
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#0d0d14] text-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">

        {/* Buy / Sell Tabs */}
        <div className="flex gap-6 mb-6 border-b border-white/10 overflow-x-auto pb-1">
          {(["buy", "sell"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-3 text-base font-semibold capitalize tracking-wide whitespace-nowrap transition-colors ${
                tab === t
                  ? "text-white border-b-2 border-violet-500"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {t} Crypto
            </button>
          ))}
        </div>

        {/* Filters & Search Bar */}
        <div className="flex flex-col lg:flex-row gap-3 mb-6 bg-[#16161f] rounded-2xl border border-white/10 p-3">
          {/* Coin Picker */}
          <div className="relative w-full lg:w-auto">
            <Button
              onClick={() => {
                setShowCoinDropdown(!showCoinDropdown);
                setShowRatingDropdown(false);
                setShowFilterDropdown(false);
              }}
              className="w-full lg:w-auto flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-[#1e1e2e] hover:bg-[#25253a] text-sm font-medium"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center text-xs font-bold text-black">₿</span>
                <span>{coin}</span>
              </div>
              <ChevronDown size={16} className="text-white/50" />
            </Button>

            {showCoinDropdown && (
              <div className="absolute z-50 top-full mt-2 left-0 w-full lg:w-40 bg-[#1e1e2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                {COINS.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setCoin(c);
                      setShowCoinDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-violet-600/20 transition ${
                      coin === c ? "text-violet-400 bg-violet-600/10" : "text-white/80"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Amount Input */}
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter Amount (USD)"
            className="w-full lg:flex-1 bg-[#1e1e2e] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none placeholder:text-white/40"
          />

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="w-full lg:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 transition font-semibold text-sm active:scale-95"
          >
            <Search size={18} />
            Search
          </button>

          {/* Rating Filter */}
          <div className="relative w-full lg:w-auto">
            <button
              onClick={() => {
                setShowRatingDropdown(!showRatingDropdown);
                setShowCoinDropdown(false);
                setShowFilterDropdown(false);
              }}
              className="w-full lg:w-auto flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-[#1e1e2e] hover:bg-[#25253a] text-sm"
            >
              <div className="flex items-center gap-2">
                <Star size={18} className="text-amber-400" />
                <span>Rating</span>
              </div>
              <ChevronDown size={16} className="text-white/50" />
            </button>

            {showRatingDropdown && (
              <div className="absolute z-50 top-full mt-2 right-0 w-full lg:w-44 bg-[#1e1e2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                {RATINGS.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setRating(r);
                      setPage(1);
                      setShowRatingDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-violet-600/20 transition ${
                      rating === r ? "text-violet-400 bg-violet-600/10" : "text-white/80"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Payment Filter */}
          <div className="relative w-full lg:w-auto">
            <button
              onClick={() => {
                setShowFilterDropdown(!showFilterDropdown);
                setShowCoinDropdown(false);
                setShowRatingDropdown(false);
              }}
              className="w-full lg:w-auto flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-[#1e1e2e] hover:bg-[#25253a] text-sm"
            >
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-white/60" />
                <span>Filter</span>
              </div>
              <ChevronDown size={16} className="text-white/50" />
            </button>

            {showFilterDropdown && (
              <div className="absolute z-50 top-full mt-2 right-0 w-full lg:w-48 bg-[#1e1e2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                {PAYMENT_METHODS.map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setPaymentFilter(m);
                      setPage(1);
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-violet-600/20 transition ${
                      paymentFilter === m ? "text-violet-400 bg-violet-600/10" : "text-white/80"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Table / Card Layout */}
        <div className="bg-[#13131c] rounded-2xl border border-white/8 overflow-hidden">
          {/* Desktop Table Header */}
          <div className="hidden md:grid grid-cols-[2fr_1.1fr_1.1fr_1.1fr_1.4fr_auto] px-6 py-4 bg-[#16161f] border-b border-white/8 text-xs text-white/40 font-medium tracking-wider uppercase">
            <span>Merchant</span>
            <span>Price</span>
            <span>Available</span>
            <span>Limits</span>
            <span>Payment Method</span>
            <span></span>
          </div>

          {/* Mobile + Desktop Rows */}
          {paginated.length === 0 ? (
            <div className="py-20 text-center text-white/40 text-sm">
              No merchants found for your criteria.
            </div>
          ) : (
            paginated.map((m) => (
              <div
                key={m.id}
                className="border-b border-white/5 last:border-none hover:bg-white/[0.02] transition-all"
              >
                {/* Desktop Row */}
                <div className="hidden md:grid grid-cols-[2fr_1.1fr_1.1fr_1.1fr_1.4fr_auto] items-center px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 border border-white/10 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-white group-hover:text-violet-300 transition">{m.name}</p>
                      <div className="flex gap-0.5 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={i < m.rating ? "fill-amber-400 text-amber-400" : "text-white/20"}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <span className="font-mono font-semibold">
                    ${m.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>

                  <span className="text-white/70">
                    {m.available.toLocaleString()} {m.coin}
                  </span>

                  <span className="text-white/70">
                    ${m.limitMin.toLocaleString()} – ${m.limitMax.toLocaleString()}
                  </span>

                  <span className="text-white/70">{m.paymentMethod}</span>

                  <Button
                    onClick={() => tab === "buy" && router.push("/dashboard/p2p/order")}
                    className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-95 text-sm font-semibold shadow-lg shadow-violet-900/30"
                  >
                    {tab === "buy" ? "Buy" : "Sell"}
                  </Button>
                </div>

                {/* Mobile Card */}
                <div className="md:hidden p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 border border-white/10" />
                      <div>
                        <p className="font-semibold">{m.name}</p>
                        <div className="flex gap-0.5 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={13}
                              className={i < m.rating ? "fill-amber-400 text-amber-400" : "text-white/20"}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-mono text-lg font-semibold text-emerald-400">
                        ${m.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-white/50">per USDT</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-white/40 text-xs">Available</p>
                      <p className="font-medium">{m.available.toLocaleString()} {m.coin}</p>
                    </div>
                    <div>
                      <p className="text-white/40 text-xs">Limits</p>
                      <p className="font-medium">
                        ${m.limitMin} – ${m.limitMax}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-white/40 text-xs mb-1">Payment Methods</p>
                    <p className="text-white/80">{m.paymentMethod}</p>
                  </div>

                  <Button
                    onClick={() => tab === "buy" && router.push("/dashboard/p2p/order")}
                    className="w-full py-3.5 rounded-2xl bg-violet-600 hover:bg-violet-500 text-base font-semibold active:scale-[0.985]"
                  >
                    {tab === "buy" ? "Buy Now" : "Sell Now"}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 px-2">
            <span className="text-sm text-white/40 text-center sm:text-left">
              Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–
              {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} merchants
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#1e1e2e] border border-white/10 disabled:opacity-30 hover:bg-violet-600/20 transition"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#1e1e2e] border border-white/10 disabled:opacity-30 hover:bg-violet-600/20 transition"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}