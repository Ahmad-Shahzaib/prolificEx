"use client";

import { useEffect, useMemo, useState } from "react";
import { RefreshCcw } from "lucide-react";
import { PageShell } from "@/components/dashboard/PageShell";
import { Card, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { CreateOfferModal } from "@/components/dashboard/create-offer/CreateOfferModal";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchMyOffers, P2POffer } from "@/redux/thunk/p2pOffersThunk";

type OfferTab = "buy" | "sell";

const statusClassName: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
  open: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
  draft: "bg-amber-500/10 text-amber-400 border-amber-500/25",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/25",
  paused: "bg-white/5 text-white/55 border-white/10",
  inactive: "bg-white/5 text-white/55 border-white/10",
  closed: "bg-red-500/10 text-red-400 border-red-500/25",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/25",
};

const formatLabel = (value?: string | null) => {
  if (!value) return "-";
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatAmount = (value?: string | number | null) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return value ? String(value) : "-";
  return numeric.toLocaleString("en-US", { maximumFractionDigits: 8 });
};

const getOfferCoin = (offer: P2POffer) => offer.crypto_currency || offer.coin || "USDT";
const getOfferPrice = (offer: P2POffer) => offer.price_per_coin || offer.price || "0";
const getOfferPaymentMethod = (offer: P2POffer) =>
  offer.payment_method || offer.payment_methods?.[0] || "-";

export default function CreateOfferPage() {
  const dispatch = useAppDispatch();
  const { myOffers, loading, error } = useAppSelector((state) => state.p2pOffers);
  const [activeTab, setActiveTab] = useState<OfferTab>("buy");
  const [modalType, setModalType] = useState<OfferTab>("buy");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchMyOffers());
  }, [dispatch]);

  const visibleOffers = useMemo(
    () => myOffers.filter((offer) => offer.type === activeTab),
    [myOffers, activeTab]
  );

  const openOfferModal = (type: OfferTab) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeOfferModal = () => {
    setIsModalOpen(false);
  };

  const refreshOffers = () => {
    dispatch(fetchMyOffers());
  };

  const renderTableBody = () => {
    if (loading) {
      return (
        <div className="space-y-3 p-5 animate-pulse">
          {[0, 1, 2, 3].map((row) => (
            <div key={row} className="grid gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4 lg:grid-cols-[1fr_0.8fr_0.8fr_0.9fr_1fr_1.2fr_1fr_0.8fr]">
              {Array.from({ length: 8 }).map((_, cell) => (
                <div key={cell} className="h-5 rounded bg-white/10" />
              ))}
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="px-5 py-14 text-center">
          <p className="text-sm font-medium text-red-400">{error}</p>
          <Button type="button" onClick={refreshOffers} className="mt-4 bg-violet-600 hover:bg-violet-500">
            Retry
          </Button>
        </div>
      );
    }

    if (visibleOffers.length === 0) {
      return (
        <div className="px-5 py-16 text-center">
          <p className="text-base font-semibold text-white">No {activeTab} offers found</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-white/45">
            Create a {activeTab} offer and it will appear here from the backend.
          </p>
          <Button
            type="button"
            onClick={() => openOfferModal(activeTab)}
            className="mt-5 bg-violet-600 hover:bg-violet-500"
          >
            Create {activeTab === "buy" ? "Buy" : "Sell"} Offer
          </Button>
        </div>
      );
    }

    return (
      <div className="divide-y divide-white/5">
        {visibleOffers.map((offer) => {
          const normalizedStatus = String(offer.status || "active").toLowerCase();
          const statusClass = statusClassName[normalizedStatus] ?? statusClassName.paused;
          const coin = getOfferCoin(offer);
          const price = getOfferPrice(offer);

          return (
            <div
              key={offer.id}
              className="grid gap-4 px-5 py-5 text-sm transition hover:bg-white/[0.025] lg:grid-cols-[1fr_0.8fr_0.8fr_0.9fr_1fr_1.2fr_1fr_0.8fr] lg:items-center"
            >
              <div>
                <p className="font-semibold text-white">#{offer.id}</p>
                <p className="mt-1 text-xs capitalize text-white/40">{offer.type} offer</p>
              </div>
              <div>
                <p className="text-xs text-white/40 lg:hidden">Coin</p>
                <p className="font-medium text-white">{coin}</p>
              </div>
              <div>
                <p className="text-xs text-white/40 lg:hidden">Fiat</p>
                <p className="text-white/75">{offer.fiat_currency || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-white/40 lg:hidden">Network</p>
                <p className="text-white/75">{offer.network || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-white/40 lg:hidden">Amount</p>
                <p className="font-medium text-white">
                  {formatAmount(offer.available_amount || offer.amount)} {coin}
                </p>
                <p className="mt-1 text-xs text-white/40">
                  {offer.fiat_currency || ""} {formatAmount(price)} / {coin}
                </p>
              </div>
              <div>
                <p className="text-xs text-white/40 lg:hidden">Limit</p>
                <p className="text-white/75">
                  {offer.fiat_currency || ""} {formatAmount(offer.min_order_limit)} - {formatAmount(offer.max_order_limit)}
                </p>
              </div>
              <div>
                <p className="text-xs text-white/40 lg:hidden">Payment</p>
                <p className="text-white/75">{formatLabel(getOfferPaymentMethod(offer))}</p>
              </div>
              <div>
                <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClass}`}>
                  {formatLabel(offer.status || "active")}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <PageShell
        title="Create Offer"
        description="Create and manage your live P2P buy and sell offers."
      >
        <Card className="bg-[#0f0f17] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <CardContent className="p-0">
            <div className="flex flex-col gap-4 border-b border-white/10 px-5 py-5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-lg font-semibold text-white">My offers</p>
                <p className="mt-1 text-sm text-white/45">
                  Showing backend offers only. No static preview data is used.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="inline-flex w-full rounded-2xl bg-white/[0.04] p-1 sm:w-auto">
                  {(["buy", "sell"] as OfferTab[]).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 rounded-xl px-5 py-2.5 text-sm font-semibold capitalize transition sm:flex-none ${
                        activeTab === tab
                          ? "bg-violet-600 text-white shadow-[0_2px_8px_rgba(124,58,237,0.25)]"
                          : "text-white/55 hover:text-white"
                      }`}
                    >
                      {tab} Offer
                    </button>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={refreshOffers}
                  disabled={loading}
                  className="border-white/10"
                >
                  <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
                  Refresh
                </Button>

                <Button onClick={() => openOfferModal(activeTab)} className="bg-violet-600 hover:bg-violet-500">
                  Create {activeTab === "buy" ? "Buy" : "Sell"} Offer
                </Button>
              </div>
            </div>

            <div className="hidden grid-cols-[1fr_0.8fr_0.8fr_0.9fr_1fr_1.2fr_1fr_0.8fr] gap-4 border-b border-white/10 bg-[#151722] px-5 py-4 text-xs font-semibold uppercase tracking-wide text-white/40 lg:grid">
              <span>Offer ID</span>
              <span>Coin</span>
              <span>Fiat</span>
              <span>Network</span>
              <span>Available</span>
              <span>Limit</span>
              <span>Payment</span>
              <span>Status</span>
            </div>

            {renderTableBody()}
          </CardContent>
        </Card>
      </PageShell>

      <CreateOfferModal
        isOpen={isModalOpen}
        offerType={modalType}
        onOfferTypeChange={setModalType}
        onClose={closeOfferModal}
        onCreated={refreshOffers}
      />
    </>
  );
}
