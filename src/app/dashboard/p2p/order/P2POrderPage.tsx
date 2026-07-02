"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, CheckCircle2, MessageCircle, Paperclip, Send, ShieldCheck, Star, Upload } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { initiateP2POrder, submitP2PPaymentProof, disputeP2POrder } from "@/redux/thunk/p2pOrderThunk";
import { fetchP2POrderMessages, sendP2POrderMessage } from "@/redux/thunk/p2pOrderMessagesThunk";
import { fetchP2POrder } from "@/redux/thunk/p2pOrdersThunk";
import { P2POffer } from "@/redux/thunk/p2pOffersThunk";
import { clearP2POrderMessages } from "@/redux/slices/p2pOrderMessagesSlice";
import { clearP2POrderState, restoreP2POrderState } from "@/redux/slices/p2pOrderSlice";
import { clearP2POrderRatingState } from "@/redux/slices/p2pOrderRatingSlice";
import { submitP2POrderRating } from "@/redux/thunk/p2pOrderRatingThunk";
import { createEcho } from "@/lib/echo";

interface Message {
  id: number;
  text: string;
  sender: "merchant" | "user";
  time: string;
  attachment?: string | null;
}

interface P2POrderPageProps {
  selectedOffer?: P2POffer | null;
}

const formatPaymentMethod = (method: string) =>
  method
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const getOfferCrypto = (offer: P2POffer) => offer.crypto_currency || offer.coin || "USDT";
const getOfferPrice = (offer: P2POffer) => Number(offer.price || offer.price_per_coin || 0);
const getOfferPaymentMethods = (offer: P2POffer) =>
  offer.payment_methods?.length ? offer.payment_methods : offer.payment_method ? [offer.payment_method] : [];

const formatFiatAmount = (amount: string | number, fiatCurrency: string) =>
  `${fiatCurrency} ${Number(amount).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

export default function P2POrderPage({ selectedOffer }: P2POrderPageProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    loading: orderLoading,
    error: orderError,
    order: orderResult,
    successMessage: orderSuccessMessage,
    paymentProofLoading,
    paymentProofError,
    paymentProofSuccessMessage,
    disputeLoading,
    disputeError,
    disputeSuccessMessage,
  } = useAppSelector((state) => state.p2pOrder);
  const {
    messages: chatMessages,
    loading: messagesLoading,
    sending: messageSending,
    error: messagesError,
  } = useAppSelector((state) => state.p2pOrderMessages) ?? {
    messages: [],
    loading: false,
    sending: false,
    error: null,
  };
  const {
    loading: ratingLoading,
    error: ratingError,
    successMessage: ratingSuccessMessage,
    data: ratingData,
  } = useAppSelector((state) => state.p2pOrderRating);
  const currentUserUuid = useAppSelector((state) => state.auth.user?.uuid);
  const syncedOrder = useAppSelector((state) =>
    orderResult?.order?.id
      ? state.p2pOrders.orders.find((item) => item.id === orderResult.order.id)
      : undefined
  );
  const [amount, setAmount] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [inputMsg, setInputMsg] = useState("");
  const [chatAttachmentFile, setChatAttachmentFile] = useState<File | null>(null);
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [disputeReason, setDisputeReason] = useState("");
  const [rating, setRating] = useState(0);
  const [ratingComment, setRatingComment] = useState("");
  const [ratedOrderIds, setRatedOrderIds] = useState<number[]>([]);
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ibanNumber, setIbanNumber] = useState("");
  const [instructions, setInstructions] = useState("Send exact amount. Include order number in reference.");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const fiatAmount =
    amount && !isNaN(parseFloat(amount)) && selectedOffer
      ? (parseFloat(amount) * getOfferPrice(selectedOffer)).toFixed(2)
      : "0.00";

  const currentOrder = syncedOrder ?? orderResult?.order;
  // Blocked only when there's an existing order with the same seller from a DIFFERENT offer
  // (same offer_id means it's the user's own active order — not a block)
  const hasBlockedOrder =
    Boolean(currentOrder) &&
    Boolean(selectedOffer?.user?.id) &&
    selectedOffer?.user?.id === currentOrder?.seller_id &&
    currentOrder?.offer_id !== selectedOffer?.id &&
    currentOrder?.status !== "active";

  // Client-side validation for amount
  const amountNum = parseFloat(amount);
  const availableCryptoAmount = selectedOffer ? Number(selectedOffer.available_amount) : 0;
  const pricePerCoin = selectedOffer ? getOfferPrice(selectedOffer) : 1;
  const fiatAmountNum = amountNum * pricePerCoin;
  const minLimit = selectedOffer ? Number(selectedOffer.min_order_limit) : 0;
  const maxLimit = selectedOffer ? Number(selectedOffer.max_order_limit) : Infinity;

  const amountValidationError = amount.trim() && selectedOffer
    ? isNaN(amountNum) || amountNum <= 0
      ? "Please enter a valid amount"
      : amountNum > availableCryptoAmount
        ? `Cannot create order because only ${availableCryptoAmount.toLocaleString()} ${getOfferCrypto(selectedOffer)} is available on this offer.`
        : fiatAmountNum < minLimit
          ? `Minimum order amount is ${formatFiatAmount(minLimit, selectedOffer.fiat_currency)}`
          : fiatAmountNum > maxLimit
            ? `Maximum order amount is ${formatFiatAmount(maxLimit, selectedOffer.fiat_currency)}`
            : ""
    : "";

  // Clear Redux order+messages/rating when the user switches to a different offer
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!selectedOffer) return;
    const orderOfferId = orderResult?.order?.offer_id;
    if (orderOfferId !== undefined && orderOfferId !== selectedOffer.id) {
      dispatch(clearP2POrderState());
      dispatch(clearP2POrderMessages());
      dispatch(clearP2POrderRatingState());
    }
  }, [dispatch, selectedOffer, orderResult]);

  // Restore order from per-offer sessionStorage key when Redux is empty
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!selectedOffer || orderResult) return;
    const stored = sessionStorage.getItem(`p2pOrder_${selectedOffer.id}`);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      if (parsed?.order) {
        dispatch(restoreP2POrderState(parsed));
      }
    } catch {
      sessionStorage.removeItem(`p2pOrder_${selectedOffer.id}`);
    }
  }, [dispatch, orderResult, selectedOffer]);

  useEffect(() => {
    if (!selectedOffer) return;
    const methods = getOfferPaymentMethods(selectedOffer);
    if (!methods.length) return;
    if (!selectedPaymentMethod || !methods.includes(selectedPaymentMethod)) {
      setSelectedPaymentMethod(methods[0]);
    }
  }, [selectedOffer, selectedPaymentMethod]);

  // Persist order to per-offer sessionStorage key whenever it changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!selectedOffer || !orderResult) return;
    if (orderResult.order.offer_id !== selectedOffer.id) return;
    sessionStorage.setItem(
      `p2pOrder_${selectedOffer.id}`,
      JSON.stringify({
        loading: false,
        error: orderError,
        order: orderResult,
        successMessage: orderSuccessMessage,
      })
    );
  }, [orderResult, orderError, orderSuccessMessage, selectedOffer]);

  const canInitiateOrder =
    Boolean(selectedOffer) &&
    Boolean(amount.trim()) &&
    !isNaN(parseFloat(amount)) &&
    Number(amount) > 0 &&
    Boolean(selectedPaymentMethod || (selectedOffer && getOfferPaymentMethods(selectedOffer)[0])) &&
    !hasBlockedOrder &&
    !amountValidationError &&
    (selectedOffer?.type !== "buy" || (Boolean(accountName.trim()) && Boolean(accountNumber.trim())));

  const initiateOrder = () => {
    if (!selectedOffer || !canInitiateOrder) return;
    dispatch(
      initiateP2POrder({
        offer_id: selectedOffer.id,
        crypto_amount: amount,
        payment_method: selectedPaymentMethod || getOfferPaymentMethods(selectedOffer)[0] || "",
        bank_name: bankName,
        account_name: accountName,
        account_number: accountNumber,
        iban_number: ibanNumber,
        instructions: instructions,
      })
    );
    setAmount("");
  };

  const orderTitle = selectedOffer ? `#${selectedOffer.id}` : "#847362";
  const merchantName =
    selectedOffer?.user?.full_name || selectedOffer?.user?.username || "TraderMax";
  const merchantRating = selectedOffer ? Math.round(Number(selectedOffer.rating) || 0) : 5;
  const orderPrice = selectedOffer ? getOfferPrice(selectedOffer) : 1.01;
  const paymentMethods = selectedOffer ? getOfferPaymentMethods(selectedOffer) : ["bank_transfer"];
  const paymentMethod = selectedPaymentMethod || paymentMethods[0] || "bank_transfer";
  const availableAmount = selectedOffer
    ? `${Number(selectedOffer.available_amount).toLocaleString()} ${getOfferCrypto(selectedOffer)}`
    : "2,500 USDT";
  const orderLimits = selectedOffer
    ? `$${Number(selectedOffer.min_order_limit).toLocaleString()} – $${Number(selectedOffer.max_order_limit).toLocaleString()}`
    : "$100 – $2000";
  const selectedBankName = selectedOffer?.bank_name ?? "First National Bank";
  const selectedAccountName = selectedOffer?.account_name ?? "TraderMax";
  const selectedAccountNumber = selectedOffer?.account_number ?? "123456789";
  const selectedCurrency = selectedOffer ? getOfferCrypto(selectedOffer) : "USDT";
  const orderLimitsDisplay = selectedOffer
    ? `${formatFiatAmount(selectedOffer.min_order_limit, selectedOffer.fiat_currency)} - ${formatFiatAmount(selectedOffer.max_order_limit, selectedOffer.fiat_currency)}`
    : "USD 100 - USD 2,000";
  const orderId = orderResult?.order?.id;
  const isOrderInitiated = Boolean(orderId);
  const hasRatedCurrentOrder = orderId ? ratedOrderIds.includes(orderId) : false;

  const formattedOrderStatus = currentOrder?.status
    ? currentOrder.status
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
    : "";

  const formattedMessages: Message[] = useMemo(() => {
    const safeMessages = Array.isArray(chatMessages) ? chatMessages : [];
    const sortedMessages = [...safeMessages].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    return sortedMessages.map((message) => ({
      id: message.id,
      text: message.message,
      sender: message.sender?.uuid === currentUserUuid ? "user" : "merchant",
      time: new Date(message.created_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      attachment: message.attachment ?? null,
    }));
  }, [chatMessages, currentUserUuid]);

  useEffect(() => {
    if (!orderId) {
      dispatch(clearP2POrderMessages());
      return;
    }

    dispatch(fetchP2POrderMessages(orderId));
    dispatch(fetchP2POrder(orderId));
  }, [dispatch, orderId]);

  useEffect(() => {
    if (typeof window === "undefined" || !orderId) return;
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (!token) return;

    const echo = createEcho(token);
    if (!echo) return;

    const channel = echo.private(`p2p.order.${orderId}`);
    const connector = echo.connector as any;

    if (connector?.pusher?.connection?.bind) {
      connector.pusher.connection.bind("connected", () => {
        console.log("Reverb connected", echo.socketId());
      });
      connector.pusher.connection.bind("error", (error: any) => {
        console.error("Reverb connection error", error);
      });
    }

    channel.subscribed(() => {
      console.log("Subscribed to", `p2p.order.${orderId}`);
    });

    channel.error((error: any) => {
      console.error("Channel subscription failed", error);
    });

    channel.listen(".trade.message.sent", ({ message }: { message: any }) => {
      console.log("Live message event received", message);
      dispatch(fetchP2POrderMessages(orderId));
    });

    return () => {
      echo.leave(`p2p.order.${orderId}`);
      echo.disconnect();
    };
  }, [dispatch, orderId]);

  const getTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  const handleAttachmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setAttachmentFile(file);
  };

  const handleChatAttachmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setChatAttachmentFile(file);
  };

  const sendMessage = () => {
    if (!orderId || (!inputMsg.trim() && !chatAttachmentFile)) return;
    dispatch(
      sendP2POrderMessage({
        order_id: orderId,
        message: inputMsg.trim(),
        attachment: chatAttachmentFile,
      })
    );
    setInputMsg("");
    setChatAttachmentFile(null);
  };

  const sendPaymentProof = () => {
    if (!attachmentFile || !orderId) return;
    dispatch(
      submitP2PPaymentProof({
        order_id: orderId,
        payment_proof: attachmentFile,
      })
    );
    setInputMsg("");
    setAttachmentFile(null);
  };

  const openDispute = () => {
    if (!orderId || !disputeReason.trim()) return;
    dispatch(
      disputeP2POrder({
        order_id: orderId,
        reason: disputeReason.trim(),
      })
    );
  };

  const canSubmitDispute = Boolean(orderId) && disputeReason.trim().length > 0 && !disputeLoading;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const canSubmitRating =
    Boolean(orderId) &&
    currentOrder?.status?.toLowerCase().replace(/\s+/g, "_") === "completed" &&
    !hasRatedCurrentOrder &&
    rating > 0 &&
    ratingComment.trim().length > 0 &&
    !ratingLoading;

  const submitRating = () => {
    if (!canSubmitRating || !orderId) return;
    dispatch(
      submitP2POrderRating({
        order_id: orderId,
        rating,
        comment: ratingComment.trim(),
      })
    );
  };

  const showRatingSection =
    Boolean(orderId) &&
    currentOrder?.status?.toLowerCase().replace(/\s+/g, "_") === "completed" &&
    !hasRatedCurrentOrder;

  const markOrderRated = (ratedOrderId: number) => {
    setRatedOrderIds((currentIds) => {
      if (currentIds.includes(ratedOrderId)) {
        return currentIds;
      }

      const nextIds = [...currentIds, ratedOrderId];
      if (typeof window !== "undefined") {
        localStorage.setItem("p2pRatedOrderIds", JSON.stringify(nextIds));
      }

      return nextIds;
    });
    setRating(0);
    setRatingComment("");
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem("p2pRatedOrderIds");
      const parsed = stored ? JSON.parse(stored) : [];
      if (Array.isArray(parsed)) {
        setRatedOrderIds(parsed.filter((id) => Number.isInteger(id)));
      }
    } catch {
      localStorage.removeItem("p2pRatedOrderIds");
    }
  }, []);

  useEffect(() => {
    if (!orderId) return;

    if (ratingData?.order_id === orderId || ratingSuccessMessage) {
      markOrderRated(orderId);
    }
  }, [orderId, ratingData?.order_id, ratingSuccessMessage]);

  useEffect(() => {
    if (!orderId || !ratingError?.toLowerCase().includes("already rated")) return;
    markOrderRated(orderId);
  }, [orderId, ratingError]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = 0;
    }
  }, [orderId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [formattedMessages]);

  if (!selectedOffer) {
    return (
      <div className="min-h-screen bg-[#0d0d14] text-white font-sans px-4 ">
        <div className="max-w-3xl mx-auto bg-[#13131c] rounded-3xl border border-white/10 p-8 text-center">
          <h1 className="text-2xl font-semibold text-white mb-4">No selected P2P offer</h1>
          <p className="text-sm text-white/60 mb-6">
            Please choose a merchant offer from the P2P marketplace to view order details.
          </p>
          <button
            onClick={() => router.push("/dashboard/p2p")}
            className="inline-flex items-center justify-center rounded-2xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-500 transition"
          >
            Return to P2P Marketplace
          </button>
        </div>
      </div>
    );
  }

  if (isOrderInitiated) {
    return (
      <div className="min-h-screen bg-[#0d0d14] px-4 py-5 text-white font-sans">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.push("/dashboard/p2p")}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#121521] text-white/65 transition hover:border-violet-400/40 hover:bg-violet-500/10 hover:text-white"
                aria-label="Back to marketplace"
              >
                <ArrowLeft size={17} />
              </button>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-300/70">P2P Trade</p>
                <h1 className="mt-0.5 text-xl font-bold text-white">
                  {orderResult?.order.order_number || orderTitle}
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                <ShieldCheck size={14} />
                Protected Trade
              </span>
              {formattedOrderStatus && (
                <span className="w-fit rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-300">
                  {formattedOrderStatus}
                </span>
              )}
            </div>
          </div>

          <div className="mb-4 grid gap-2.5 rounded-2xl border border-white/10 bg-[#0f111b] p-2.5 shadow-[0_18px_55px_rgba(0,0,0,0.2)] sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl bg-[#151925] px-3.5 py-2.5">
              <p className="text-xs text-white/40">Trader</p>
              <p className="mt-0.5 truncate text-sm font-semibold text-white">{merchantName}</p>
            </div>
            <div className="rounded-xl bg-[#151925] px-3.5 py-2.5">
              <p className="text-xs text-white/40">Price</p>
              <p className="mt-0.5 text-sm font-semibold text-white">
                {Number(orderPrice).toLocaleString("en-US", { maximumFractionDigits: 8 })} {selectedOffer.fiat_currency}
              </p>
            </div>
            <div className="rounded-xl bg-[#151925] px-3.5 py-2.5">
              <p className="text-xs text-white/40">Available</p>
              <p className="mt-0.5 text-sm font-semibold text-white">{availableAmount}</p>
            </div>
            <div className="rounded-xl bg-[#151925] px-3.5 py-2.5">
              <p className="text-xs text-white/40">Limits</p>
              <p className="mt-0.5 truncate text-sm font-semibold text-white">{orderLimitsDisplay}</p>
            </div>
          </div>

          <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,760px)_320px] xl:justify-center">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0f111b] shadow-[0_20px_58px_rgba(0,0,0,0.2)]">
              <div className="border-b border-white/10 bg-[#131622] px-3.5 py-2.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div className="relative shrink-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-[#0b0d15] text-xs font-bold text-white">
                        {merchantName.charAt(0).toUpperCase()}
                      </div>
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#131622] bg-emerald-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <MessageCircle size={14} className="shrink-0 text-violet-300" />
                        <p className="truncate text-sm font-semibold text-white">{merchantName}</p>
                      </div>
                      <div className="mt-0.5 flex min-w-0 items-center gap-1.5">
                        <span className="text-[11px] text-emerald-400">Online</span>
                        <span className="h-1 w-1 rounded-full bg-white/20" />
                        <span className="truncate text-[11px] text-white/45">{formatPaymentMethod(paymentMethod)}</span>
                      </div>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-white/55">
                    #{orderId}
                  </span>
                </div>
              </div>

              <div ref={chatContainerRef} className="h-[330px] overflow-y-auto px-3.5 py-3.5 space-y-2.5 hide-scrollbar xl:h-[350px]">
                {messagesLoading ? (
                  <div className="text-center text-sm text-white/50">Loading chat...</div>
                ) : messagesError ? (
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200">
                    {messagesError}
                  </div>
                ) : formattedMessages.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-center text-sm text-white/50">
                    No chat messages yet. Send the first message to start the conversation.
                  </div>
                ) : (
                  formattedMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex items-end gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {msg.sender === "merchant" && (
                        <div className="mb-1 h-6 w-6 shrink-0 rounded-full bg-violet-600" />
                      )}
                      <div
                        className={`max-w-[68%] rounded-xl px-3 py-2 text-xs leading-relaxed sm:text-sm ${
                          msg.sender === "user"
                            ? "rounded-br-md bg-violet-600 text-white shadow-[0_10px_24px_rgba(124,58,237,0.2)]"
                            : "rounded-bl-sm border border-white/8 bg-[#171b29] text-white/80"
                        }`}
                      >
                        {msg.text ? <p>{msg.text}</p> : null}
                        {msg.attachment && (
                          <a
                            href={
                              msg.attachment.startsWith("http")
                                ? msg.attachment
                                : `https://api.prolificex.softsuitetech.com/public/storage/${msg.attachment.replace(/^\/+/, "")}`
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 block text-xs underline hover:text-white"
                          >
                            View attached proof
                          </a>
                        )}
                        <p className="mt-1 text-right text-[10px] text-white/35">{msg.time}</p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="border-t border-white/10 bg-[#131622] p-2.5">
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    type="text"
                    value={inputMsg}
                    onChange={(e) => setInputMsg(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Write a message"
                    className="h-10 min-w-0 flex-1 rounded-xl border border-white/10 bg-[#0f111b] px-3 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-violet-400/60"
                  />
                  <div className="flex gap-2">
                    <label className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-[#0f111b] text-white/70 transition hover:border-violet-400/50 hover:text-white">
                      <Paperclip size={16} />
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleChatAttachmentChange}
                        className="hidden"
                      />
                    </label>
                    <button
                      onClick={sendMessage}
                      disabled={(!inputMsg.trim() && !chatAttachmentFile) || messageSending}
                      className="flex h-10 items-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {messageSending ? "Sending..." : "Send"}
                      <Send size={14} />
                    </button>
                  </div>
                </div>
                {chatAttachmentFile && (
                  <div className="mt-2 flex items-center gap-3 text-sm text-white/70">
                    <span className="truncate">{chatAttachmentFile.name}</span>
                    <button type="button" onClick={() => setChatAttachmentFile(null)} className="text-xs text-white/60 hover:text-white">
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="rounded-2xl border border-white/10 bg-[#0f111b] p-3 shadow-[0_18px_50px_rgba(0,0,0,0.14)]">
                <div className="mb-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Upload size={16} className="text-emerald-300" />
                    <p className="text-sm font-semibold text-white">Payment Proof</p>
                  </div>
                  <span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-white/45">
                    Image/PDF
                  </span>
                </div>
                <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-white/15 bg-[#151925] px-3 py-2.5 text-xs text-white/70 transition hover:border-violet-400/60 hover:bg-[#191d2b] sm:text-sm">
                  <span className="min-w-0 truncate">{attachmentFile ? attachmentFile.name : "Upload payment receipt"}</span>
                  <Paperclip size={17} className="shrink-0 text-white/45" />
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleAttachmentChange}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={sendPaymentProof}
                  disabled={!attachmentFile || paymentProofLoading}
                  className="mt-2.5 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <CheckCircle2 size={16} />
                  {paymentProofLoading ? "Submitting..." : "Mark as Paid"}
                </button>
                {paymentProofError && <p className="mt-2 text-xs text-red-300">{paymentProofError}</p>}
                {paymentProofSuccessMessage && <p className="mt-2 text-xs text-emerald-300">{paymentProofSuccessMessage}</p>}
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0f111b] p-3 shadow-[0_18px_50px_rgba(0,0,0,0.13)]">
                <div className="mb-2.5 flex items-center gap-2">
                  <AlertTriangle size={16} className="text-amber-300" />
                  <p className="text-sm font-semibold text-white">Dispute</p>
                </div>
                <textarea
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  placeholder="Describe why you're opening a dispute"
                  className="min-h-[70px] w-full resize-none rounded-xl border border-white/10 bg-[#151925] px-3 py-2.5 text-sm text-white/80 outline-none transition placeholder:text-white/35 focus:border-amber-400/50"
                />
                <button
                  type="button"
                  onClick={openDispute}
                  disabled={!canSubmitDispute}
                  className="mt-2.5 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 text-sm font-semibold text-black transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <AlertTriangle size={16} />
                  {disputeLoading ? "Submitting dispute..." : "Report Dispute"}
                </button>
                {disputeError && <p className="mt-2 text-xs text-red-300">{disputeError}</p>}
                {disputeSuccessMessage && <p className="mt-2 text-xs text-emerald-300">{disputeSuccessMessage}</p>}
              </div>

              {showRatingSection && (
                <div className="rounded-2xl border border-white/10 bg-[#0f111b] p-3 shadow-[0_18px_50px_rgba(0,0,0,0.13)]">
                  <p className="mb-2 text-sm font-semibold text-white">Rate your merchant</p>
                  <div className="mb-2 flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setRating(index + 1)}
                        className="text-white/30 transition hover:text-amber-400"
                      >
                        <Star
                          size={18}
                          className={index < rating ? "fill-amber-400 text-amber-400" : "text-white/20"}
                        />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={ratingComment}
                    onChange={(e) => setRatingComment(e.target.value)}
                    className="min-h-[62px] w-full resize-none rounded-xl border border-white/10 bg-[#151925] px-3 py-2.5 text-sm text-white/80 outline-none transition placeholder:text-white/35 focus:border-violet-400/60"
                    placeholder="Share your feedback"
                  />
                  <button
                    onClick={submitRating}
                    disabled={!canSubmitRating}
                    className="mt-2.5 h-10 w-full rounded-xl bg-violet-600 px-4 text-sm font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {ratingLoading ? "Submitting rating..." : "Submit Rating"}
                  </button>
                  {ratingError && <p className="mt-2 text-xs text-red-300">{ratingError}</p>}
                  {ratingSuccessMessage && <p className="mt-2 text-xs text-emerald-300">{ratingSuccessMessage}</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d14] text-white font-sans px-4 ">
      {/* Page Title */}
      <h1 className="text-xl font-semibold text-white mb-6">
        P2P Order {" "}
        <span className="text-white font-bold">{orderTitle}</span>
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT PANEL - Order Details */}
        <div className="flex-1 flex flex-col gap-5">
          {/* Merchant Card */}
          <div className="bg-[#13131c] rounded-2xl border border-[#1f1f2e] p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-500 to-slate-700 border border-[#1f1f2e] flex-shrink-0" /> */}
                <div>
                  <p className="font-bold text-white text-base">{merchantName}</p>
                  <div className="flex gap-0.5 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={i < merchantRating ? "fill-amber-400 text-amber-400" : "text-white/20"}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <span className="text-xs font-semibold px-3 py-1.5 rounded-md bg-amber-500/15 text-amber-400 border border-amber-500/20 tracking-wide">
                Awaiting Payment
              </span>
            </div>

            {/* Order Details */}
            <div className="mt-5 space-y-3 border-t border-[#1f1f2e] pt-4">
              {[
                { label: "Price", value: formatFiatAmount(orderPrice, selectedOffer.fiat_currency) },
                { label: "Payment Method", value: formatPaymentMethod(paymentMethod) },
                { label: "Available", value: availableAmount },
                { label: "Limits", value: orderLimitsDisplay },
                { label: "Bank Name", value: selectedOffer.bank_name, show: !!selectedOffer.bank_name },
                { label: "Account Name", value: selectedOffer.account_name, show: !!selectedOffer.account_name },
                { label: "Account Number", value: selectedOffer.account_number, show: !!selectedOffer.account_number },
                { label: "IBAN Number", value: selectedOffer.iban_number, show: !!selectedOffer.iban_number },
              ].filter(item => item.show !== false).map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-white/40">{label}</span>
                  <span className="text-white/90 font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Enter Amount Card */}
          <div className="bg-[#13131c] rounded-2xl border border-[#1f1f2e] p-5">
            <p className="text-sm text-white/60 mb-3">
              Enter Crypto Amount <span className="text-white/30">({selectedCurrency})</span>
            </p>
            <div className="flex items-center bg-[#1a1a27] rounded-xl border border-[#1f1f2e] overflow-hidden">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 bg-transparent px-4 py-3.5 text-white text-sm outline-none placeholder-white/30"
                placeholder="0"
              />
              <span className="px-4 py-3.5 text-sm text-white/40 border-l border-[#1f1f2e] bg-[#1e1e2e]">
                {selectedCurrency}
              </span>
            </div>
            <div className="mt-3 flex justify-between text-sm">
              <span className="text-white/40">Fiat amount</span>
              <span className="text-amber-400 font-semibold">
                {formatFiatAmount(fiatAmount, selectedOffer.fiat_currency)}
              </span>
            </div>
            <label className="mt-4 block text-sm text-white/60">
              Payment Method
              <select
                value={paymentMethod}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                className="mt-2 w-full rounded-xl border border-[#1f1f2e] bg-[#1a1a27] px-4 py-3 text-sm text-white outline-none"
              >
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {formatPaymentMethod(method)}
                  </option>
                ))}
              </select>
            </label>
            {amountValidationError && (
              <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-xs text-red-200">
                {amountValidationError}
              </div>
            )}
          </div>

          {/* Send Payment / Receive Payment Card */}
          <div className="bg-[#13131c] rounded-2xl border border-[#1f1f2e] p-5">
            <p className="text-sm font-semibold text-white/80 mb-4">
              {selectedOffer?.type === "buy" ? "Your payment details" : "Send payment to:"}
            </p>
            {selectedOffer?.type === "buy" ? (
              <div className="space-y-4">
                <label className="block text-sm text-white/60">
                  Bank Name
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="Enter bank name"
                    className="mt-2 w-full rounded-xl border border-[#1f1f2e] bg-[#1a1a27] px-4 py-3 text-sm text-white outline-none"
                  />
                </label>
                <label className="block text-sm text-white/60">
                  Account Name
                  <input
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="Enter account holder name"
                    className="mt-2 w-full rounded-xl border border-[#1f1f2e] bg-[#1a1a27] px-4 py-3 text-sm text-white outline-none"
                  />
                </label>
                <label className="block text-sm text-white/60">
                  Account Number
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="Enter account number"
                    className="mt-2 w-full rounded-xl border border-[#1f1f2e] bg-[#1a1a27] px-4 py-3 text-sm text-white outline-none"
                  />
                </label>
                <label className="block text-sm text-white/60">
                  IBAN Number (optional)
                  <input
                    type="text"
                    value={ibanNumber}
                    onChange={(e) => setIbanNumber(e.target.value)}
                    placeholder="Enter IBAN number"
                    className="mt-2 w-full rounded-xl border border-[#1f1f2e] bg-[#1a1a27] px-4 py-3 text-sm text-white outline-none"
                  />
                </label>
                <label className="block text-sm text-white/60">
                  Payment Instructions (optional)
                  <textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Enter special instructions"
                    className="mt-2 w-full min-h-[80px] rounded-xl border border-[#1f1f2e] bg-[#1a1a27] px-4 py-3 text-sm text-white outline-none resize-none"
                  />
                </label>
              </div>
            ) : (
              <div className="space-y-3">
                {[
                  { label: "Bank", value: selectedOffer?.bank_name || "" },
                  { label: "Account Name", value: selectedOffer?.account_name || "" },
                  { label: "Account Number", value: selectedOffer?.account_number || "" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-white/40">{label}</span>
                    <span className="text-white/90 font-medium">{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {orderError && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
              {orderError}
            </div>
          )}

          {showRatingSection && (
            <div className="rounded-2xl border border-[#1f1f2e] bg-[#13131c] p-5">
              <p className="text-sm font-semibold text-white/80 mb-3">Rate your merchant</p>
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setRating(index + 1)}
                    className="text-white/30 hover:text-amber-400 transition"
                  >
                    <Star
                      size={18}
                      className={index < rating ? "fill-amber-400 text-amber-400" : "text-white/20"}
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                className="w-full min-h-[100px] resize-none rounded-2xl border border-[#1f1f2e] bg-[#1a1a27] px-4 py-3 text-sm text-white/80 outline-none"
                placeholder="Share your feedback"
              />
              {ratingError && (
                <p className="mt-2 text-xs text-red-300">{ratingError}</p>
              )}
              {ratingSuccessMessage && (
                <p className="mt-2 text-xs text-emerald-300">{ratingSuccessMessage}</p>
              )}
              <button
                onClick={submitRating}
                disabled={!canSubmitRating}
                className="mt-4 w-full px-4 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-95 transition text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
              >
                {ratingLoading ? "Submitting rating..." : "Submit Rating"}
              </button>
            </div>
          )}

          {hasBlockedOrder && (
            <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-sm text-yellow-100">
              You already have an existing order with this merchant and its status is not active.
              You cannot create another order with the same user until the current order becomes active.
              {orderResult?.order.status && (
                <span className="block mt-2 text-white/80">
                  Current order status: {formattedOrderStatus}
                </span>
              )}
            </div>
          )}

          {orderSuccessMessage && (
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
              {orderSuccessMessage}
              {orderResult?.order.order_number && (
                <span className="block mt-2 text-white/80">
                  Order number: {orderResult.order.order_number}
                </span>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={initiateOrder}
              disabled={!canInitiateOrder || orderLoading}
              className="flex-1 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-[0.98] transition font-semibold text-sm shadow-lg shadow-violet-900/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {orderLoading
                ? "Initiating Order..."
                : hasBlockedOrder
                  ? "Order Blocked"
                  : "Initiate Order"}
            </button>

          </div>
        </div>

        {/* RIGHT PANEL - Chat */}
        <div className="w-full lg:w-[340px] flex-shrink-0 bg-[#13131c] rounded-2xl border border-[#1f1f2e] flex flex-col overflow-hidden h-[580px] lg:h-[620px]">
          {isOrderInitiated ? (
            <>
              {/* Chat Header */}
              <div className="px-5 py-4 border-b border-[#1f1f2e]">
                <p className="text-sm font-semibold text-white/80 mb-3">Trade Chat</p>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-700 flex-shrink-0" />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#13131c]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{merchantName}</p>
                    <p className="text-xs text-emerald-400">Online</p>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-4 hide-scrollbar">
                {messagesLoading ? (
                  <div className="text-sm text-white/50 text-center">Loading chat...</div>
                ) : messagesError ? (
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200">
                    {messagesError}
                  </div>
                ) : formattedMessages.length === 0 ? (
                  <div className="text-sm text-white/50 text-center">
                    No chat messages yet. Send the first message to start the conversation.
                  </div>
                ) : (
                  formattedMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex items-end gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"
                        }`}
                    >
                      {msg.sender === "merchant" && (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-700 flex-shrink-0 mb-1" />
                      )}

                      <div
                        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.sender === "user"
                          ? "bg-[#1e1e2e] text-white/80 rounded-br-sm"
                          : "bg-[#1e1e2e] text-white/80 rounded-bl-sm"
                          }`}
                      >
                        {msg.text ? <p>{msg.text}</p> : null}
                        {msg.attachment && (
                          <div className="mt-2 rounded-xl border border-white/10 bg-[#12121d] p-3 text-xs text-white/80">
                            <a
                              href={
                                msg.attachment.startsWith("http")
                                  ? msg.attachment
                                  : `https://api.prolificex.softsuitetech.com/public/storage/${msg.attachment.replace(/^\/+/, "")}`
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="underline hover:text-white"
                            >
                              View attached proof
                            </a>
                          </div>
                        )}
                        <p className="text-white/30 text-[10px] mt-1 text-right">
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <div className="px-4 py-4 border-t border-[#1f1f2e] space-y-3">
                <div className="flex items-center gap-2">


                  <input
                    type="text"
                    value={inputMsg}
                    onChange={(e) => setInputMsg(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Write a message"
                    className="flex-1 bg-[#1a1a27] border border-[#1f1f2e] rounded-2xl px-4 py-3 text-sm text-white/70 placeholder-white/40 outline-none"
                  />
                  <label className="flex h-12 w-12 items-center justify-center rounded-2xl   bg-[#13131c] text-white/70 cursor-pointer hover:border-violet-500 transition">
                    <Paperclip size={18} />
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleChatAttachmentChange}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={sendMessage}
                    disabled={(!inputMsg.trim() && !chatAttachmentFile) || messageSending}
                    className="flex items-center gap-2 rounded-2xl bg-violet-600 px-5 py-3 text-sm font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {messageSending ? "Sending..." : "Send"}
                    <Send size={14} />
                  </button>


                </div>
                {chatAttachmentFile && (
                  <div className="flex items-center gap-3 text-sm text-white/70">
                    <span className="truncate">{chatAttachmentFile.name}</span>
                    <button
                      type="button"
                      onClick={() => setChatAttachmentFile(null)}
                      className="text-xs text-white/60 hover:text-white"
                    >
                      Remove
                    </button>
                  </div>
                )}

              </div>

              <div className="rounded-2xl border border-[#1f1f2e] bg-[#1a1a27] p-4">
                <p className="text-sm font-semibold text-white/80 mb-3">Proof of Payment</p>
                <div className="space-y-3">
                  <label className="flex items-center justify-between gap-3 rounded-2xl border border-[#1f1f2e] bg-[#13131c] px-4 py-3 text-sm text-white/70 cursor-pointer hover:border-violet-500">
                    <span>{attachmentFile ? attachmentFile.name : "Select image or PDF proof"}</span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleAttachmentChange}
                      className="hidden"
                    />
                  </label>
                  
                  <button
                    onClick={sendPaymentProof}
                    disabled={!attachmentFile || paymentProofLoading}
                    className="w-full px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {paymentProofLoading ? "Submitting..." : "Mark as Paid"}
                  </button>
                  <button
                    type="button"
                    onClick={openDispute}
                    disabled={!canSubmitDispute}
                    className="w-full px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 transition text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {disputeLoading ? "Submitting dispute..." : "Report Dispute"}
                  </button>
                  <textarea
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    placeholder="Describe why you're opening a dispute"
                    className="w-full min-h-[100px] resize-none rounded-2xl border border-[#1f1f2e] bg-[#1a1a27] px-4 py-3 text-sm text-white/80 outline-none"
                  />
                  {paymentProofError && (
                    <p className="text-xs text-red-300">{paymentProofError}</p>
                  )}
                  {paymentProofSuccessMessage && (
                    <p className="text-xs text-emerald-300">{paymentProofSuccessMessage}</p>
                  )}
                  {disputeError && (
                    <p className="text-xs text-red-300">{disputeError}</p>
                  )}
                  {disputeSuccessMessage && (
                    <p className="text-xs text-emerald-300">{disputeSuccessMessage}</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 px-6 text-center">
              <div className="mb-4 rounded-full bg-violet-600/10 p-4 text-violet-400">
                <Send size={24} />
              </div>
              <p className="text-sm font-semibold text-white/90 mb-2">Chat will appear after order initiation</p>
              <p className="text-sm text-white/50">
                Initiate the P2P order first to enable trade chat and coordinate payment details with the merchant.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
