"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  ChevronDown,
  Star,
  SlidersHorizontal,
  Plus,
  X,
} from "lucide-react";
import { Button } from "@/components/common/Button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { createOffer, fetchMyOffers, fetchOffers, P2POffer } from "@/redux/thunk/p2pOffersThunk";

const COINS = ["USDT", "BTC", "ETH", "BNB", "USDC"];
const NETWORKS = ["TRC20", "ERC20", "BEP20"];
const PAYMENT_METHODS = ["All", "Bank Transfer", "PayPal", "Wise", "Revolut"];
const PRICE_TYPES = ["fixed"];
const FIAT_CURRENCIES = ["USD", "EUR", "GBP"];
const RATINGS = ["All", "5 Stars", "4+ Stars", "3+ Stars"];

const PAGE_SIZE = 9;

export default function P2PCryptoTable() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    offers,
    offersLoading,
    offersError,
    myOffers,
    loading,
    error,
    creating,
    createError,
    createSuccessMessage,
  } = useAppSelector((state) => state.p2pOffers);

  const [tab, setTab] = useState<"buy" | "sell">("buy");
  const [coin, setCoin] = useState("USDT");
  const [amount, setAmount] = useState("");
  const [rating, setRating] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [showCoinDropdown, setShowCoinDropdown] = useState(false);
  const [showRatingDropdown, setShowRatingDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [network, setNetwork] = useState("TRC20");
  const [minOrderLimit, setMinOrderLimit] = useState("100");
  const [maxOrderLimit, setMaxOrderLimit] = useState("2000");
  const [pricePerCoin, setPricePerCoin] = useState("1.01");
  const [priceType, setPriceType] = useState("fixed");
  const [fiatCurrency, setFiatCurrency] = useState("USD");
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [paymentWindow, setPaymentWindow] = useState("15");
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [instructions, setInstructions] = useState("Send exact amount. Include order number in reference.");

  useEffect(() => {
    dispatch(fetchOffers({ page: 1, per_page: 20 }));
    dispatch(fetchMyOffers());
  }, [dispatch]);

  const handleBuyOffer = (offer: P2POffer) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("selectedP2POffer", JSON.stringify(offer));
    }
    router.push(`/dashboard/p2p/order?selectedOfferId=${offer.id}`);
  };

  const filtered = offers.filter((offer) => {
    const numericRating = Math.round(Number(offer.rating) || 0);
    const matchRating =
      rating === "All"
        ? true
        : rating === "5 Stars"
        ? numericRating === 5
        : rating === "4+ Stars"
        ? numericRating >= 4
        : numericRating >= 3;

    const matchPayment =
      paymentFilter === "All" ? true : offer.payment_method === paymentFilter;

    const minLimit = Number(offer.min_order_limit);
    const maxLimit = Number(offer.max_order_limit);
    const matchAmount =
      amount === ""
        ? true
        : Number(amount) >= minLimit && Number(amount) <= maxLimit;

    return matchRating && matchPayment && matchAmount;
  });

  const currentRows = tab === "buy" ? filtered : myOffers;
  const totalPages = Math.ceil(currentRows.length / PAGE_SIZE);
  const paginatedBuyOffers = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const paginatedOffers = myOffers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = () => {
    setPage(1);
  };

  const handleCreateOffer = async () => {
    if (!amount || !minOrderLimit || !maxOrderLimit || !pricePerCoin || !bankName || !accountName || !accountNumber) {
      return;
    }

    try {
      await dispatch(
        createOffer({
          type: "sell",
          coin,
          network,
          amount,
          min_order_limit: minOrderLimit,
          max_order_limit: maxOrderLimit,
          price_per_coin: pricePerCoin,
          price_type: priceType,
          fiat_currency: fiatCurrency,
          payment_method: paymentMethod,
          payment_window: Number(paymentWindow),
          bank_name: bankName,
          account_name: accountName,
          account_number: accountNumber,
          instructions,
        })
      ).unwrap();
      setShowOfferModal(false);
      setAmount("");
      setMinOrderLimit("100");
      setMaxOrderLimit("2000");
      setPricePerCoin("1.01");
      setBankName("");
      setAccountName("");
      setAccountNumber("");
      setInstructions("Send exact amount. Include order number in reference.");
      dispatch(fetchMyOffers());
    } catch {
      // Error is set in Redux state.
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d14] text-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">

        {/* Buy / Sell Tabs */}
        <div className="flex gap-6 mb-6 border-b border-white/10 overflow-x-auto pb-1">
          {(["buy", "sell"] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                setPage(1);
              }}
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

        {tab === "sell" && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold">My P2P Sell Offers</h2>
              <p className="text-sm text-white/50 mt-1">
                Create and manage your sell offers with the form below.
              </p>
            </div>
            <Button onClick={() => setShowOfferModal(true)} className="flex items-center gap-2">
              <Plus size={16} /> Create Offer
            </Button>
          </div>
        )}

        {/* Table / Card Layout */}
        <div className="bg-[#13131c] rounded-2xl border border-white/8 overflow-hidden">
          {tab === "sell" ? (
            <>
              <div className="hidden md:grid grid-cols-[2fr_1.1fr_1.1fr_1.1fr_1.4fr_1.1fr] px-6 py-4 bg-[#16161f] border-b border-white/8 text-xs text-white/40 font-medium tracking-wider uppercase">
                <span>Offer</span>
                <span>Price</span>
                <span>Available</span>
                <span>Limits</span>
                <span>Payment Method</span>
                <span>Status</span>
              </div>

              {loading ? (
                <div className="py-20 text-center text-white/40 text-sm">Loading your offers…</div>
              ) : error ? (
                <div className="py-20 text-center text-red-400 text-sm">{error}</div>
              ) : (
                paginatedOffers.map((offer) => (
                  <div
                    key={offer.id}
                    className="border-b border-white/5 last:border-none hover:bg-white/[0.02] transition-all"
                  >
                    <div className="hidden md:grid grid-cols-[2fr_1.1fr_1.1fr_1.1fr_1.4fr_1.1fr] items-center px-6 py-5">
                      <div className="flex items-center gap-3">
                        {/* <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 border border-white/10 flex-shrink-0" /> */}
                        <div>
                          <p className="font-semibold text-white">{offer.coin} / {offer.network}</p>
                          <p className="text-white/60 text-sm">{offer.bank_name}</p>
                        </div>
                      </div>

                      <span className="font-mono font-semibold">
                        ${Number(offer.price_per_coin).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>

                      <span className="text-white/70">
                        {Number(offer.available_amount).toLocaleString()} {offer.coin}
                      </span>

                      <span className="text-white/70">
                        ${Number(offer.min_order_limit).toLocaleString()} – ${Number(offer.max_order_limit).toLocaleString()}
                      </span>

                      <span className="text-white/70">{offer.payment_method}</span>

                      <span className="capitalize text-white/70">{offer.status}</span>
                    </div>

                    <div className="md:hidden p-5 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 border border-white/10" />
                          <div>
                            <p className="font-semibold">{offer.coin} / {offer.network}</p>
                            <p className="text-white/50 text-sm">{offer.bank_name}</p>
                          </div>
                        </div>
                        <span className="text-sm text-white/50 capitalize">{offer.status}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-white/40 text-xs">Price</p>
                          <p className="font-medium">
                            ${Number(offer.price_per_coin).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div>
                          <p className="text-white/40 text-xs">Available</p>
                          <p className="font-medium">{Number(offer.available_amount).toLocaleString()} {offer.coin}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-white/40 text-xs mb-1">Limits</p>
                        <p className="font-medium">${Number(offer.min_order_limit).toLocaleString()} – ${Number(offer.max_order_limit).toLocaleString()}</p>
                      </div>

                      <div>
                        <p className="text-white/40 text-xs mb-1">Payment Method</p>
                        <p className="text-white/80">{offer.payment_method}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </>
          ) : (
            <>
              <div className="hidden md:grid grid-cols-[2fr_1.1fr_1.1fr_1.1fr_1.4fr_auto] px-6 py-4 bg-[#16161f] border-b border-white/8 text-xs text-white/40 font-medium tracking-wider uppercase">
                <span>Merchant</span>
                <span>Price</span>
                <span>Available</span>
                <span>Limits</span>
                <span>Payment Method</span>
                <span></span>
              </div>

              {offersLoading ? (
                <div className="py-20 text-center text-white/40 text-sm">Loading buy offers…</div>
              ) : offersError ? (
                <div className="py-20 text-center text-red-400 text-sm">{offersError}</div>
              ) : paginatedBuyOffers.length === 0 ? (
                <div className="py-20 text-center text-white/40 text-sm">
                  No merchants found for your criteria.
                </div>
              ) : (
                paginatedBuyOffers.map((offer) => {
                  const sellerName = offer.user?.full_name || offer.user?.username || "Merchant";
                  const sellerRating = Math.round(Number(offer.rating) || 0);

                  return (
                    <div
                      key={offer.id}
                      className="border-b border-white/5 last:border-none hover:bg-white/[0.02] transition-all"
                    >
                      {/* Desktop Row */}
                      <div className="hidden md:grid grid-cols-[2fr_1.1fr_1.1fr_1.1fr_1.4fr_auto] items-center px-6 py-5">
                        <div className="flex items-center gap-3">
                          {/* <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 border border-white/10 flex-shrink-0" /> */}
                          <div>
                            <p className="font-semibold text-white group-hover:text-violet-300 transition">{sellerName}</p>
                            <div className="flex gap-0.5 mt-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  size={12}
                                  className={i < sellerRating ? "fill-amber-400 text-amber-400" : "text-white/20"}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        <span className="font-mono font-semibold">
                          ${Number(offer.price_per_coin).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </span>

                        <span className="text-white/70">
                          {Number(offer.available_amount).toLocaleString()} {offer.coin}
                        </span>

                        <span className="text-white/70">
                          ${Number(offer.min_order_limit).toLocaleString()} – ${Number(offer.max_order_limit).toLocaleString()}
                        </span>

                        <span className="text-white/70">{offer.payment_method}</span>

                        <Button
                          onClick={() => handleBuyOffer(offer)}
                          className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-95 text-sm font-semibold shadow-lg shadow-violet-900/30"
                        >
                          Buy
                        </Button>
                      </div>

                      {/* Mobile Card */}
                      <div className="md:hidden p-5 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 border border-white/10" />
                            <div>
                              <p className="font-semibold">{sellerName}</p>
                              <div className="flex gap-0.5 mt-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    size={13}
                                    className={i < sellerRating ? "fill-amber-400 text-amber-400" : "text-white/20"}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="font-mono text-lg font-semibold text-emerald-400">
                              ${Number(offer.price_per_coin).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                            </p>
                            <p className="text-xs text-white/50">per {offer.coin}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-white/40 text-xs">Available</p>
                            <p className="font-medium">{Number(offer.available_amount).toLocaleString()} {offer.coin}</p>
                          </div>
                          <div>
                            <p className="text-white/40 text-xs">Limits</p>
                            <p className="font-medium">
                              ${Number(offer.min_order_limit).toLocaleString()} – ${Number(offer.max_order_limit).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-white/40 text-xs mb-1">Payment Method</p>
                          <p className="text-white/80">{offer.payment_method}</p>
                        </div>

                        <Button
                          onClick={() => handleBuyOffer(offer)}
                          className="w-full py-3.5 rounded-2xl bg-violet-600 hover:bg-violet-500 text-base font-semibold active:scale-[0.985]"
                        >
                          Buy Now
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 px-2">
            <span className="text-sm text-white/40 text-center sm:text-left">
              Showing {Math.min((page - 1) * PAGE_SIZE + 1, currentRows.length)}–
              {Math.min(page * PAGE_SIZE, currentRows.length)} of {currentRows.length} {tab === "sell" ? "offers" : "merchants"}
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

      {showOfferModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-xl sm:max-w-2xl bg-[#0f1220] border border-white/10 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div>
                <h2 className="text-xl font-semibold">Create Sell Offer</h2>
                <p className="text-sm text-white/50 mt-1">Fill in the offer details and submit to publish your sell offer.</p>
              </div>
              <button
                onClick={() => setShowOfferModal(false)}
                className="rounded-full p-2 text-white/70 hover:bg-white/5 hover:text-white transition"
              >
                <X size={18} />
              </button>
            </div>

            <form
              className="p-6 space-y-4 max-h-[62vh] overflow-y-auto"
              autoComplete="on"
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateOffer();
              }}
              style={{ scrollbarWidth: "thin" }}
            >
              {createError && <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-200">{createError}</div>}
              {createSuccessMessage && <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-sm text-emerald-200">{createSuccessMessage}</div>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="space-y-2 text-sm text-white/80">
                  Coin
                  <select
                    name="coin"
                    value={coin}
                    onChange={(e) => setCoin(e.target.value)}
                    autoComplete="off"
                    className="w-full rounded-2xl bg-[#161724] border border-white/10 px-4 py-3 text-sm text-white outline-none"
                  >
                    {COINS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2 text-sm text-white/80">
                  Network
                  <select
                    name="network"
                    value={network}
                    onChange={(e) => setNetwork(e.target.value)}
                    autoComplete="off"
                    className="w-full rounded-2xl bg-[#161724] border border-white/10 px-4 py-3 text-sm text-white outline-none"
                  >
                    {NETWORKS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="space-y-2 text-sm text-white/80">
                  Amount
                  <input
                    name="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="2500"
                    autoComplete="off"
                    className="w-full rounded-2xl bg-[#161724] border border-white/10 px-4 py-3 text-sm text-white outline-none"
                  />
                </label>

                <label className="space-y-2 text-sm text-white/80">
                  Price per coin
                  <input
                    name="pricePerCoin"
                    type="number"
                    step="0.01"
                    value={pricePerCoin}
                    onChange={(e) => setPricePerCoin(e.target.value)}
                    placeholder="1.01"
                    autoComplete="off"
                    className="w-full rounded-2xl bg-[#161724] border border-white/10 px-4 py-3 text-sm text-white outline-none"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="space-y-2 text-sm text-white/80">
                  Min order limit
                  <input
                    name="minOrderLimit"
                    type="number"
                    value={minOrderLimit}
                    onChange={(e) => setMinOrderLimit(e.target.value)}
                    autoComplete="off"
                    className="w-full rounded-2xl bg-[#161724] border border-white/10 px-4 py-3 text-sm text-white outline-none"
                  />
                </label>

                <label className="space-y-2 text-sm text-white/80">
                  Max order limit
                  <input
                    name="maxOrderLimit"
                    type="number"
                    value={maxOrderLimit}
                    onChange={(e) => setMaxOrderLimit(e.target.value)}
                    autoComplete="off"
                    className="w-full rounded-2xl bg-[#161724] border border-white/10 px-4 py-3 text-sm text-white outline-none"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="space-y-2 text-sm text-white/80">
                  Price type
                  <select
                    name="priceType"
                    value={priceType}
                    onChange={(e) => setPriceType(e.target.value)}
                    autoComplete="off"
                    className="w-full rounded-2xl bg-[#161724] border border-white/10 px-4 py-3 text-sm text-white outline-none"
                  >
                    {PRICE_TYPES.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2 text-sm text-white/80">
                  Fiat currency
                  <select
                    name="fiatCurrency"
                    value={fiatCurrency}
                    onChange={(e) => setFiatCurrency(e.target.value)}
                    autoComplete="off"
                    className="w-full rounded-2xl bg-[#161724] border border-white/10 px-4 py-3 text-sm text-white outline-none"
                  >
                    {FIAT_CURRENCIES.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="space-y-2 text-sm text-white/80">
                  Payment method
                  <select
                    name="paymentMethod"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    autoComplete="off"
                    className="w-full rounded-2xl bg-[#161724] border border-white/10 px-4 py-3 text-sm text-white outline-none"
                  >
                    {PAYMENT_METHODS.filter((m) => m !== "All").map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2 text-sm text-white/80">
                  Payment window
                  <input
                    name="paymentWindow"
                    type="number"
                    value={paymentWindow}
                    onChange={(e) => setPaymentWindow(e.target.value)}
                    autoComplete="off"
                    className="w-full rounded-2xl bg-[#161724] border border-white/10 px-4 py-3 text-sm text-white outline-none"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="space-y-2 text-sm text-white/80">
                  Bank name
                  <input
                    name="bankName"
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    autoComplete="organization"
                    className="w-full rounded-2xl bg-[#161724] border border-white/10 px-4 py-3 text-sm text-white outline-none"
                  />
                </label>
                <label className="space-y-2 text-sm text-white/80">
                  Account name
                  <input
                    name="accountName"
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    autoComplete="name"
                    className="w-full rounded-2xl bg-[#161724] border border-white/10 px-4 py-3 text-sm text-white outline-none"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="space-y-2 text-sm text-white/80">
                  Account number
                  <input
                    name="accountNumber"
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    autoComplete="account-number"
                    className="w-full rounded-2xl bg-[#161724] border border-white/10 px-4 py-3 text-sm text-white outline-none"
                  />
                </label>
                <label className="space-y-2 text-sm text-white/80">
                  Instructions
                  <textarea
                    name="instructions"
                    rows={3}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    autoComplete="off"
                    className="w-full rounded-2xl bg-[#161724] border border-white/10 px-4 py-3 text-sm text-white outline-none resize-none"
                  />
                </label>
              </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-white/10 bg-[#121428]">
              <div className="text-sm text-white/60">Create your sell offer with payment details and limits.</div>
              <Button
                type="submit"
                className="w-full sm:w-auto bg-violet-600 hover:bg-violet-500"
                disabled={creating}
              >
                {creating ? "Creating offer..." : "Submit Offer"}
              </Button>
            </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}