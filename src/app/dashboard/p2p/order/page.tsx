"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { P2POffer } from "@/redux/thunk/p2pOffersThunk";
import P2POrderPage from "./P2POrderPage";

export default function OrderPage() {
  const searchParams = useSearchParams();
  const offers = useAppSelector((state) => state.p2pOffers.offers);
  const myOffers = useAppSelector((state) => state.p2pOffers.myOffers);
  const [selectedOffer, setSelectedOffer] = useState<P2POffer | null>(null);

  useEffect(() => {
    const offerId = searchParams.get("selectedOfferId");
    const storedOffer = typeof window !== "undefined" ? sessionStorage.getItem("selectedP2POffer") : null;
    const parsedId = offerId ? Number(offerId) : NaN;

    let matchedOffer: P2POffer | null = null;

    if (!Number.isNaN(parsedId)) {
      matchedOffer = [...offers, ...myOffers].find((offer) => offer.id === parsedId) ?? null;
    }

    if (matchedOffer) {
      setSelectedOffer(matchedOffer);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("selectedP2POffer", JSON.stringify(matchedOffer));
      }
      return;
    }

    if (storedOffer) {
      try {
        setSelectedOffer(JSON.parse(storedOffer));
      } catch {
        setSelectedOffer(null);
      }
    }
  }, [searchParams, offers, myOffers]);

  return <P2POrderPage selectedOffer={selectedOffer} />;
}
