"use client";

import { useState, useRef, useEffect } from "react";
import { Star, Send } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "merchant" | "user";
  time: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    text: "Thank you. Please enter the amount and date of the transaction (eg 100, December 21th).",
    sender: "merchant",
    time: "13:34",
  },
  {
    id: 2,
    text: "Rs50, November 30th",
    sender: "user",
    time: "13:34",
  },
  {
    id: 3,
    text: "Thank you. It seems there might be a delay in processing the transaction. What would you like to do next ?",
    sender: "merchant",
    time: "13:34",
  },
];

export default function P2POrderPage() {
  const [amount, setAmount] = useState("500");
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputMsg, setInputMsg] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const receiveAmount =
    amount && !isNaN(parseFloat(amount))
      ? (parseFloat(amount) * 0.99).toFixed(2)
      : "0.00";

  const getTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  const sendMessage = () => {
    if (!inputMsg.trim()) return;
    const newMsg: Message = {
      id: messages.length + 1,
      text: inputMsg.trim(),
      sender: "user",
      time: getTime(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputMsg("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen bg-[#0d0d14] text-white font-sans px-4 sm:px-6 py-6 md:py-8">
      {/* Page Title */}
      <h1 className="text-xl font-semibold text-white mb-6">
        P2P Order{" "}
        <span className="text-white font-bold">#847362</span>
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT PANEL - Order Details */}
        <div className="flex-1 flex flex-col gap-5">
          {/* Merchant Card */}
          <div className="bg-[#13131c] rounded-2xl border border-[#1f1f2e] p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-500 to-slate-700 border border-[#1f1f2e] flex-shrink-0" />
                <div>
                  <p className="font-bold text-white text-base">TraderMax</p>
                  <div className="flex gap-0.5 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className="fill-amber-400 text-amber-400"
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
                { label: "Price", value: "$1.01", highlight: false },
                { label: "Payment Method", value: "Bank Transfer", highlight: false },
                { label: "Available", value: "2,500 USDT", highlight: false },
                { label: "Limits", value: "$100 – $2000", highlight: false },
              ].map(({ label, value }) => (
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
              Enter Amount <span className="text-white/30">(USD)</span>
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
                USD
              </span>
            </div>
            <div className="mt-3 flex justify-between text-sm">
              <span className="text-white/40">You will receive</span>
              <span className="text-amber-400 font-semibold">
                {receiveAmount} USDT
              </span>
            </div>
          </div>

          {/* Send Payment Card */}
          <div className="bg-[#13131c] rounded-2xl border border-[#1f1f2e] p-5">
            <p className="text-sm font-semibold text-white/80 mb-4">
              Send payment to:
            </p>
            <div className="space-y-3">
              {[
                { label: "Bank", value: "First National Bank" },
                { label: "Account Name", value: "TraderMax" },
                { label: "Account Number", value: "123456789" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-white/40">{label}</span>
                  <span className="text-white/90 font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex-1 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-[0.98] transition font-semibold text-sm shadow-lg shadow-violet-900/30">
              I Have Paid
            </button>
            <button className="flex-1 py-3.5 rounded-xl bg-[#FD625E] hover:bg-rose-500/30 active:scale-[0.98] transition font-semibold text-sm text-white border border-rose-500/25">
              Cancel Order
            </button>
          </div>
        </div>

        {/* RIGHT PANEL - Chat */}
        <div className="w-full lg:w-[340px] flex-shrink-0 bg-[#13131c] rounded-2xl border border-[#1f1f2e] flex flex-col overflow-hidden h-[580px] lg:h-[620px]">
          {/* Chat Header */}
          <div className="px-5 py-4 border-b border-[#1f1f2e]">
            <p className="text-sm font-semibold text-white/80 mb-3">Trade Chat</p>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-700 flex-shrink-0" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#13131c]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Cora Goyette</p>
                <p className="text-xs text-emerald-400">Online</p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "merchant" && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-700 flex-shrink-0 mb-1" />
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-[#1e1e2e] text-white/80 rounded-br-sm"
                      : "bg-[#1e1e2e] text-white/80 rounded-bl-sm"
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className="text-white/30 text-[10px] mt-1 text-right">
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="px-4 py-4 border-t border-[#1f1f2e] flex items-center gap-2">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="write a message"
              className="flex-1 bg-[#1a1a27] border border-[#1f1f2e] rounded-xl px-4 py-3 text-sm text-white/70 placeholder-white/40 outline-none"
            />
            <button
              onClick={sendMessage}
              className="flex items-center gap-1.5 px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-95 transition text-sm font-semibold"
            >
              Send
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}