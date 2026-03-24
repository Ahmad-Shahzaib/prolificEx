"use client";
import { useState } from "react";
import { PageShell } from "@/components/dashboard/PageShell";

// --- Icons ---
const WarningIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#f59e0b" strokeWidth={2}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

// Coin icon
const CoinIcon = ({ coin }: { coin: string }) => {
  const map: Record<string, { bg: string; label: string }> = {
    BTC:  { bg: "#f7931a", label: "₿" },
    ETH:  { bg: "#627eea", label: "Ξ" },
    USDT: { bg: "#26a17b", label: "$" },
    LUNA: { bg: "#172852", label: "L" },
    BNB:  { bg: "#f0b90b", label: "B" },
  };
  const c = map[coin] ?? { bg: "#6b7280", label: coin[0] };
  return (
    <span
      style={{ background: c.bg }}
      className="inline-flex items-center justify-center w-6 h-6 rounded-full text-white text-[10px] font-bold shrink-0"
    >
      {c.label}
    </span>
  );
};

// --- Types ---
type Withdrawal = {
  coin: string;
  fee: string;
  amount: string;
  date: string;
  type: string;
  status: "Complete" | "Canceled" | "Finished" | "Pending";
};

const statusStyle: Record<string, string> = {
  Complete: "bg-emerald-500/20 text-emerald-400",
  Canceled: "bg-red-500/20 text-red-400",
  Finished: "bg-blue-500/20 text-blue-400",
  Pending:  "bg-amber-500/20 text-amber-400",
};

const withdrawalHistory: Withdrawal[] = [
  { coin: "ETH",  fee: "1USDT", amount: "$220",   date: "Aug 02, 2022", type: "Statement",     status: "Complete"  },
  { coin: "BTC",  fee: "1USDT", amount: "$70",    date: "Aug 02, 2022", type: "Invoice",       status: "Canceled"  },
  { coin: "LUNA", fee: "1USDT", amount: "$250",   date: "Aug 02, 2022", type: "Sales Receipt", status: "Finished"  },
  { coin: "USDT", fee: "1USDT", amount: "$1,200", date: "Aug 02, 2022", type: "Estimate",      status: "Pending"   },
  { coin: "BNB",  fee: "1USDT", amount: "$220",   date: "Aug 02, 2022", type: "Statement",     status: "Complete"  },
];

const COIN_NAMES: Record<string, string> = {
  ETH:  "Ethereum",
  BTC:  "Bitcoin",
  LUNA: "LUNA",
  USDT: "Tether",
  BNB:  "Binance Coin",
};

const networkOptions = ["Tether", "USDT-TRC20", "USDT-ERC20"];

export default function WithdrawPage() {
  const coinOptions = [
    { key: "USDT", label: "Tether" },
    { key: "BTC", label: "Bitcoin" },
    { key: "ETH", label: "Ethereum" },
    { key: "LUNA", label: "LUNA" },
    { key: "BNB", label: "Binance Coin" },
  ];
  const [selectedCoin, setSelectedCoin] = useState("Tether");
  const [selectedCoinKey, setSelectedCoinKey] = useState("USDT");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState("Tether");
  const [walletAddress, setWalletAddress]     = useState("");
  const [amount, setAmount]                   = useState("100 USDT");
  const [authCode, setAuthCode]               = useState("");

  return (
    <PageShell title="Withdraw" description="">
      <div className="space-y-6 px-4 sm:px-6 py-2">

        {/* Withdraw Form Card */}
        <div className="bg-[#13141a] border border-white/[0.07] rounded-2xl p-5 sm:p-6 space-y-6">

          {/* Select Coin */}
          <p className="text-white/70 text-sm font-medium">Select Coin</p>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Coin Dropdown */}
            <div className="flex-1 relative">
              <div
                className="flex items-center gap-3 bg-[#1c1d26] border border-white/10 rounded-xl px-4 py-3 cursor-pointer select-none"
                onClick={() => setDropdownOpen((v) => !v)}
                tabIndex={0}
                onBlur={() => setTimeout(() => setDropdownOpen(false), 100)}
              >
                <CoinIcon coin={selectedCoinKey} />
                <span className="text-white text-sm font-medium flex-1">{selectedCoin}</span>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#6b7280" strokeWidth={2}>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>

              {dropdownOpen && (
                <div className="absolute left-0 right-0 mt-2 z-10 bg-[#23243a] border border-white/10 rounded-xl shadow-lg overflow-hidden">
                  {coinOptions.map((coin) => (
                    <div
                      key={coin.key}
                      className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#2a2b38] transition-colors ${selectedCoinKey === coin.key ? "bg-[#1c1d26]" : ""}`}
                      onClick={() => {
                        setSelectedCoin(coin.label);
                        setSelectedCoinKey(coin.key);
                        setDropdownOpen(false);
                      }}
                    >
                      <CoinIcon coin={coin.key} />
                      <span className="text-white text-sm font-medium flex-1">{coin.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Network Tabs */}
            <div className="flex items-center bg-[#1c1d26] border border-white/10 rounded-xl overflow-hidden flex-shrink-0">
              {networkOptions.map((net) => (
                <button
                  key={net}
                  onClick={() => setSelectedNetwork(net)}
                  className={`px-4 py-3 text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    selectedNetwork === net
                      ? "text-white bg-[#2a2b38]"
                      : "text-white/40 hover:text-white/70"
                  }`}
                >
                  {net === "Tether" && <CoinIcon coin="USDT" />}
                  {net}
                </button>
              ))}
            </div>
          </div>

          {/* Recipient + Amount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-white/70 text-sm font-medium block">Recipient Wallet Address</label>
              <input
                type="text"
                placeholder="Enter wallet address"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="w-full bg-[#1c1d26] border border-white/10 rounded-xl px-4 py-3 text-white/70 text-sm placeholder:text-white/20 focus:outline-none focus:border-violet-500/50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-white/70 text-sm font-medium block">Amount</label>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-[#1c1d26] border border-white/10 rounded-xl px-4 py-3 text-white/70 text-sm focus:outline-none focus:border-violet-500/50"
              />
            </div>
          </div>

          {/* Balance + Fee Info */}
          <div className="space-y-2">
            <p className="text-white/40 text-xs">Available balance: 12,300 USDT</p>
            <div className="bg-[#1c1d26] rounded-lg px-4 py-2.5 inline-block">
              <span className="text-white/50 text-xs">Network fee: 1 USDT  You will receive: 99 USDT</span>
            </div>
          </div>

          {/* 2FA Verification */}
          <div className="space-y-3">
            <p className="text-white/70 text-sm font-medium">2FA verification</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Enter your Google Authenticator code"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
                className="flex-1 bg-[#1c1d26] border border-white/10 rounded-xl px-4 py-3 text-white/70 text-sm placeholder:text-white/20 focus:outline-none focus:border-violet-500/50"
              />
              <button className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-6 py-3 rounded-xl transition-colors whitespace-nowrap w-full sm:w-auto">
                Confirm Withdrawal
              </button>
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
            <WarningIcon />
            <span className="text-amber-400 text-xs leading-relaxed">
              Double-check the address. Withdrawals cannot be reversed.
            </span>
          </div>
        </div>

        {/* Withdrawal History Card */}
        <div className="bg-[#13141a] border border-white/[0.07] rounded-2xl p-5 sm:p-6">
          <p className="text-white font-semibold text-base mb-5">Withdrawal History</p>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="text-white/30 text-xs">
                  <th className="text-left font-normal pb-4 pr-6">Coin</th>
                  <th className="text-left font-normal pb-4 pr-6">Fee</th>
                  <th className="text-left font-normal pb-4 pr-6">Amount</th>
                  <th className="text-left font-normal pb-4 pr-6">Date</th>
                  <th className="text-left font-normal pb-4 pr-6">Types</th>
                  <th className="text-left font-normal pb-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {withdrawalHistory.map((d, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 pr-6">
                      <div className="flex items-center gap-3">
                        <CoinIcon coin={d.coin} />
                        <span className="text-white/80">{COIN_NAMES[d.coin] ?? d.coin}</span>
                      </div>
                    </td>
                    <td className="py-4 pr-6 text-white/50">{d.fee}</td>
                    <td className="py-4 pr-6 text-white font-medium">{d.amount}</td>
                    <td className="py-4 pr-6 text-white/50">{d.date}</td>
                    <td className="py-4 pr-6 text-white/50">{d.type}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-md text-xs font-medium ${statusStyle[d.status]}`}>
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Layout */}
          <div className="md:hidden space-y-4">
            {withdrawalHistory.map((d, i) => (
              <div key={i} className="bg-[#1c1d26] rounded-xl p-4 border border-white/[0.05]">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <CoinIcon coin={d.coin} />
                    <div>
                      <p className="text-white font-medium">{COIN_NAMES[d.coin] ?? d.coin}</p>
                      <p className="text-white/50 text-xs">{d.date}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-md text-xs font-medium ${statusStyle[d.status]}`}>
                    {d.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <div>
                    <p className="text-white/40 text-xs">Amount</p>
                    <p className="text-white font-medium">{d.amount}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs">Fee</p>
                    <p className="text-white/50">{d.fee}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-white/40 text-xs">Type</p>
                    <p className="text-white/70">{d.type}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </PageShell>
  );
}