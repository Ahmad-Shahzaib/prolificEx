"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchP2POrderMessages, sendP2POrderMessage } from "@/redux/thunk/p2pOrderMessagesThunk";
import { clearP2POrderMessages } from "@/redux/slices/p2pOrderMessagesSlice";

export default function SellerOrderChatPage() {
  const params = useParams();
  const orderId = Number(params.orderId);
  const dispatch = useAppDispatch();

  const { messages, loading: messagesLoading, sending: messageSending, error: messagesError } = useAppSelector(
    (state) => state.p2pOrderMessages
  );

  const order = useAppSelector((state) => state.p2pOrders.orders.find((item) => item.id === orderId));
  const currentUserUuid = useAppSelector((state) => state.auth.user?.uuid);

  const [inputMsg, setInputMsg] = useState("");
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!orderId) return;
    dispatch(fetchP2POrderMessages(orderId));

    return () => {
      dispatch(clearP2POrderMessages());
    };
  }, [dispatch, orderId]);

  const formattedMessages = useMemo(() => {
    const safeMessages = Array.isArray(messages) ? messages : [];
    return safeMessages.map((message) => ({
      id: message.id,
      text: message.message,
      sender: message.sender?.uuid === currentUserUuid ? "user" : "merchant",
      time: new Date(message.created_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      attachment: message.attachment ?? null,
    }));
  }, [messages, currentUserUuid]);

  const handleAttachmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setAttachmentFile(file);
  };

  const sendMessage = () => {
    if ((!inputMsg.trim() && !attachmentFile) || !orderId) return;

    dispatch(
      sendP2POrderMessage({
        order_id: orderId,
        message: inputMsg.trim() || "Sent attachment",
        attachment: attachmentFile,
      })
    );

    setInputMsg("");
    setAttachmentFile(null);
  };

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [formattedMessages]);

  const getAttachmentUrl = (attachment: string) =>
    attachment.startsWith("http")
      ? attachment
      : `https://api.prolificex.softsuitetech.com/public/storage/${attachment.replace(/^\/+/, "")}`;

  const formattedStatus = order?.status
    ? order.status
        .replace(/_/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ")
    : "";

  return (
    <div className="min-h-screen bg-[#0d0d14] text-white font-sans px-4 ">
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="space-y-2">
            <Link
              href="/dashboard/my-orders"
              className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition"
            >
              <ArrowLeft size={16} /> Back to Orders
            </Link>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-1">Order Chat</p>
              <h1 className="text-2xl font-semibold">Order #{order?.order_number || orderId}</h1>
              {formattedStatus && (
                <p className="text-sm text-white/60 mt-1">Status: {formattedStatus}</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* Order Details Sidebar */}
          <div className="bg-[#13131c] rounded-3xl border border-[#1f1f2e] p-5 h-fit">
            <h2 className="text-sm font-semibold text-white/80 mb-4">Order details</h2>
            <div className="space-y-3 text-sm text-white/80">
              <div className="flex justify-between">
                <span className="text-white/40">Order #</span>
                <span className="font-medium">{order?.order_number || orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Coin</span>
                <span className="font-medium">{order?.coin || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Amount</span>
                <span className="font-medium">
                  {order?.fiat_amount || "-"} {order?.fiat_currency || ""}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Payment</span>
                <span className="font-medium">{order?.payment_method || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Buyer</span>
                <span className="font-medium">{order?.buyer.full_name || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Seller</span>
                <span className="font-medium">{order?.seller.full_name || "-"}</span>
              </div>
            </div>
          </div>

          {/* Chat Section - Fixed Height with Scroll */}
          <div className="flex flex-col bg-[#13131c] rounded-3xl border border-[#1f1f2e] overflow-hidden h-[640px] lg:h-[700px]">
            {/* Chat Header */}
            <div className="px-5 py-4 border-b border-[#1f1f2e]">
              <p className="text-sm font-semibold text-white/80">Chat</p>
              <p className="text-xs text-white/50 mt-1">
                Send messages and view attachments for this specific order.
              </p>
            </div>

            {/* Messages Area - Scrollable with fixed height */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto px-4 py-5 space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30"
            >
              {messagesLoading ? (
                <div className="text-sm text-white/50 text-center py-10">Loading chat...</div>
              ) : messagesError ? (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200">
                  {messagesError}
                </div>
              ) : formattedMessages.length === 0 ? (
                <div className="text-sm text-white/50 text-center py-10">
                  No messages yet. Send the first message to start the conversation.
                </div>
              ) : (
                formattedMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.sender === "merchant" && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-700 flex-shrink-0" />
                    )}

                    <div
                      className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-[#1e1e2e] text-white/80 rounded-br-sm"
                          : "bg-[#1e1e2e] text-white/80 rounded-bl-sm"
                      }`}
                    >
                      {msg.text && <p>{msg.text}</p>}

                      {msg.attachment && (
                        <div className="mt-3 rounded-2xl border border-white/10 bg-[#12121d] p-3 text-xs text-white/80">
                          <a
                            href={getAttachmentUrl(msg.attachment)}
                            target="_blank"
                            rel="noreferrer"
                            className="underline hover:text-white"
                          >
                            View attachment
                          </a>
                        </div>
                      )}

                      <p className="text-[10px] text-white/30 mt-2 text-right">{msg.time}</p>
                    </div>
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="px-4 py-4 border-t border-[#1f1f2e] space-y-4 bg-[#11121b]">
              <div className="flex flex-col gap-3">
                <textarea
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  rows={3}
                  placeholder="Write a message..."
                  className="w-full resize-none rounded-2xl border border-[#1f1f2e] bg-[#1a1a27] px-4 py-3 text-sm text-white/80 placeholder-white/40 outline-none focus:border-violet-500 transition"
                />

                <div className="flex items-center gap-3">
                  <label className="flex-1 rounded-2xl border border-[#1f1f2e] bg-[#13131c] px-4 py-3 text-sm text-white/70 cursor-pointer hover:border-violet-500 transition">
                    {attachmentFile ? attachmentFile.name : "Attach image or PDF"}
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleAttachmentChange}
                      className="hidden"
                    />
                  </label>

                  <button
                    onClick={sendMessage}
                    disabled={(!inputMsg.trim() && !attachmentFile) || messageSending}
                    className="inline-flex items-center gap-2 rounded-2xl bg-violet-600 px-6 py-3 text-sm font-semibold transition hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {messageSending ? "Sending..." : "Send"}
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}