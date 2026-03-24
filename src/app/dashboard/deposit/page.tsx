"use client";
import { useState } from "react";
import { PageShell } from "@/components/dashboard/PageShell";

// --- Icons ---
const CopyIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#6b7280" strokeWidth={2}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const WarningIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#f59e0b" strokeWidth={2}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

// Coin icons
const CoinIcon = ({ coin }: { coin: string }) => {
  const map: Record<string, { bg: string; label: string }> = {
    BTC: { bg: "#f7931a", label: "₿" },
    ETH: { bg: "#627eea", label: "Ξ" },
    USDT: { bg: "#26a17b", label: "$" },
    LUNA: { bg: "#172852", label: "L" },
    BNB: { bg: "#f0b90b", label: "B" },
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
type Deposit = {
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
  Pending: "bg-amber-500/20 text-amber-400",
};

const recentDeposits: Deposit[] = [
  { coin: "ETH",  fee: "1USDT", amount: "$220",    date: "Aug 02, 2022", type: "Statement",    status: "Complete"  },
  { coin: "BTC",  fee: "1USDT", amount: "$70",     date: "Aug 02, 2022", type: "Invoice",      status: "Canceled"  },
  { coin: "LUNA", fee: "1USDT", amount: "$250",    date: "Aug 02, 2022", type: "Sales Receipt",status: "Finished"  },
  { coin: "USDT", fee: "1USDT", amount: "$1,200",  date: "Aug 02, 2022", type: "Estimate",     status: "Pending"   },
  { coin: "BNB",  fee: "1USDT", amount: "$220",    date: "Aug 02, 2022", type: "Statement",    status: "Complete"  },
];

const COIN_NAMES: Record<string, string> = {
  ETH: "Ethereum",
  BTC: "Bitcoin",
  LUNA: "LUNA",
  USDT: "Tether",
  BNB: "Binance Coin",
};

const networkOptions = ["BTC", "USDT-TRC20", "USDT-ERC20"];

const QRCode = () => (
  <div className="w-[90px] h-[90px] bg-white flex items-center justify-center rounded-sm overflow-hidden shrink-0">
    <svg viewBox="0 0 29 29" width="82" height="82" xmlns="http://www.w3.org/2000/svg">
      <rect width="29" height="29" fill="white"/>
      {[0,1,2,3,4,5,6].map(r => [0,1,2,3,4,5,6].map(c => (
        (r<2||r>4||c<2||c>4) && <rect key={`tl-${r}-${c}`} x={r} y={c} width={1} height={1} fill="black"/>
      )))}
      {[0,1,2,3,4,5,6].map(r => [22,23,24,25,26,27,28].map((c,ci) => (
        (r<2||r>4||ci<2||ci>4) && <rect key={`tr-${r}-${c}`} x={r} y={c} width={1} height={1} fill="black"/>
      )))}
      {[22,23,24,25,26,27,28].map((r,ri) => [0,1,2,3,4,5,6].map(c => (
        (ri<2||ri>4||c<2||c>4) && <rect key={`bl-${r}-${c}`} x={r} y={c} width={1} height={1} fill="black"/>
      )))}
      {[2,3,4].map(r=>[2,3,4].map(c=><rect key={`i1-${r}-${c}`} x={r} y={c} width={1} height={1} fill="black"/>))}
      {[2,3,4].map(r=>[24,25,26].map(c=><rect key={`i2-${r}-${c}`} x={r} y={c} width={1} height={1} fill="black"/>))}
      {[24,25,26].map(r=>[2,3,4].map(c=><rect key={`i3-${r}-${c}`} x={r} y={c} width={1} height={1} fill="black"/>))}
      {[[9,2],[10,2],[11,2],[13,2],[15,2],[16,2],[9,4],[12,4],[14,4],[16,4],[10,6],[11,6],[13,6],
        [9,8],[13,8],[15,8],[10,10],[11,10],[14,10],[9,12],[12,12],[16,12],[10,14],[13,14],[15,14],
        [9,16],[11,16],[14,16],[12,18],[15,18],[10,20],[13,20],[16,20],[9,22],[11,22],[14,22],
        [19,9],[21,9],[23,9],[25,9],[20,11],[22,11],[24,11],[19,13],[23,13],[25,13],
        [20,15],[22,15],[19,17],[21,17],[24,17],[20,19],[23,19],[21,21],[24,21],
      ].map(([x,y],i)=><rect key={`d-${i}`} x={x} y={y} width={1} height={1} fill="black"/>)}
    </svg>
  </div>
);

export default function DepositPage() {
  const [selectedCoin, setSelectedCoin] = useState("BTC");
  const [selectedNetwork, setSelectedNetwork] = useState("BTC");
  const [copied, setCopied] = useState(false);
  const walletAddress = "34XtNMRf2dMjXjqY5toCH9TC3DpWGUFtNfY";

  const handleCopy = () => {
    navigator.clipboard?.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageShell title="Deposit" description="">
      <div className="space-y-6 px-4 sm:px-6 py-2">

        {/* Select Coin Card */}
        <div className="bg-[#13141a] border border-white/[0.07] rounded-2xl p-5 sm:p-6 space-y-5">
          <p className="text-white/70 text-sm font-medium">Select Coin</p>

          {/* Coin + Network */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Coin Dropdown */}
            <div className="flex-1 relative">
              <div className="flex items-center gap-2 bg-[#1c1d26] border border-white/10 rounded-xl px-4 py-3 cursor-pointer">
                <CoinIcon coin={selectedCoin} />
                <span className="text-white text-sm font-medium flex-1">{selectedCoin}</span>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#6b7280" strokeWidth={2}>
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </div>
            </div>

            {/* Network Tabs */}
            <div className="flex items-center bg-[#1c1d26] border border-white/10 rounded-xl overflow-hidden flex-shrink-0">
              {networkOptions.map((net) => (
                <button
                  key={net}
                  onClick={() => setSelectedNetwork(net)}
                  className={`px-4 py-3 text-xs font-medium transition-colors whitespace-nowrap ${
                    selectedNetwork === net
                      ? "text-white bg-[#2a2b38]"
                      : "text-white/40 hover:text-white/70"
                  }`}
                >
                  {net}
                </button>
              ))}
            </div>
          </div>

          {/* QR + Address */}
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <QRCode />

            <div className="flex-1 space-y-4 w-full">
              <p className="text-white/80 text-sm font-medium">Wallet Deposit Address</p>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="flex-1 bg-[#1c1d26] border border-white/10 rounded-xl px-4 py-3 w-full">
                  <span className="text-white/70 text-sm font-mono break-all sm:break-normal">
                    {walletAddress}
                  </span>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-5 py-3 rounded-xl transition-colors w-full sm:w-auto justify-center sm:justify-start"
                >
                  <CopyIcon />
                  {copied ? "Copied!" : "Copy Address"}
                </button>
              </div>

              {/* Info */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircleIcon />
                  <span className="text-white/40">Minimum deposit: 0.001 BTC</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircleIcon />
                  <span className="text-white/40">Network confirmations: 3 confirmations required</span>
                </div>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
            <WarningIcon />
            <span className="text-amber-400 text-xs leading-relaxed">
              Only send BTC to this address. Sending other coins may result in permanent loss.
            </span>
          </div>
        </div>

        {/* Recent Deposits Card */}
        <div className="bg-[#13141a] border border-white/[0.07] rounded-2xl p-5 sm:p-6">
          <p className="text-white font-semibold text-base mb-5">Recent Deposits</p>

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
                {recentDeposits.map((d, i) => (
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
            {recentDeposits.map((d, i) => (
              <div key={i} className="bg-[#1c1d26] rounded-xl p-4 border border-white/[0.05]">
                <div className="flex items-center justify-between mb-3">
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

                <div className="grid grid-cols-2 gap-y-3 text-sm">
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