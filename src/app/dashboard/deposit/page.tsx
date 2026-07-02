"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchDepositInfo } from "@/redux/thunk/depositThunk";
import { fetchKycStatus } from "@/redux/thunk/kycThunk";
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
    USDC: { bg: "#2775ca", label: "$" },
    SOL: { bg: "#172852", label: "🌙" },
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

const COIN_NAMES: Record<string, string> = {
  BTC: "Bitcoin",
  ETH: "Ethereum",
  USDT: "Tether",
  USDC: "USD Coin",
  SOL: "Solana",
};

const networkOptionsByCoin: Record<string, string[]> = {
  BTC: ["BTC"],
  ETH: [ "ERC20"],
  USDT: ["TRC20", "ERC20"],
  USDC: ["ERC20"],
  SOL: ["SOL"],
};

const statusStyle: Record<string, string> = {
  Complete: "bg-emerald-500/20 text-emerald-400",
  Canceled: "bg-red-500/20 text-red-400",
  Finished: "bg-blue-500/20 text-blue-400",
  Pending: "bg-amber-500/20 text-amber-400",
};

const truncateHash = (hash: string) =>
  hash.length > 16 ? `${hash.slice(0, 8)}…${hash.slice(-8)}` : hash;

const TxHashCell = ({ hash }: { hash: string }) => {
  const [copiedHash, setCopiedHash] = useState(false);
  return (
    <div className="flex items-center gap-1.5">
      <span className="font-mono text-xs text-white/60">{truncateHash(hash)}</span>
      <button
        type="button"
        onClick={() => {
          navigator.clipboard?.writeText(hash);
          setCopiedHash(true);
          setTimeout(() => setCopiedHash(false), 1800);
        }}
        className="text-white/30 hover:text-violet-400 transition-colors"
        title="Copy transaction hash"
      >
        {copiedHash ? (
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#6ee7b7" strokeWidth={2.5}>
            <path d="M20 6L9 17l-5-5" />
          </svg>
        ) : (
          <CopyIcon />
        )}
      </button>
    </div>
  );
};

const QRCode = ({ qrData }: { qrData?: string }) => {
  if (!qrData) {
    return (
      <div className="w-[90px] h-[90px] bg-white/5 flex items-center justify-center rounded-sm shrink-0">
        <span className="text-white/50 text-[11px] text-center">No QR data</span>
      </div>
    );
  }

  const chartUrl = `https://quickchart.io/qr?text=${encodeURIComponent(qrData)}&size=200&margin=0&dark=3f46a6&light=ffffff`;

  return (
    <div className="w-[120px] h-[120px] bg-white rounded-sm overflow-hidden shrink-0">
      <img className="w-full h-full object-cover" src={chartUrl} alt="Deposit QR Code" />
    </div>
  );
};

function DepositContent() {
  const dispatch = useAppDispatch();
  const { loading: depositLoading, error: depositError, info: depositInfo } = useAppSelector(
    (state) => state.deposit
  );
  const kycStatus = useAppSelector((state) => state.kyc.status);

  const searchParams = useSearchParams();
  const coinParam = searchParams.get("coin")?.toUpperCase() ?? "BTC";
  const validCoins = Object.keys(networkOptionsByCoin);
  const initialCoin = validCoins.includes(coinParam) ? coinParam : "BTC";
  const [selectedCoin, setSelectedCoin] = useState(initialCoin);
  const [selectedNetwork, setSelectedNetwork] = useState(
    networkOptionsByCoin[initialCoin]?.[0] ?? "BTC"
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const networks = networkOptionsByCoin[selectedCoin] ?? [selectedCoin];
    if (!networks.includes(selectedNetwork)) {
      setSelectedNetwork(networks[0]);
    }
  }, [selectedCoin, selectedNetwork]);

  useEffect(() => {
    dispatch(fetchKycStatus());
  }, [dispatch]);

  useEffect(() => {
    const networks = networkOptionsByCoin[selectedCoin] ?? [selectedCoin];
    const network = networks.includes(selectedNetwork) ? selectedNetwork : networks[0];
    dispatch(fetchDepositInfo({ coin: selectedCoin, network }));
  }, [dispatch, selectedCoin, selectedNetwork, kycStatus]);

  const activeDepositInfo =
    depositInfo?.coin?.toUpperCase() === selectedCoin &&
    depositInfo?.network?.toUpperCase() === selectedNetwork
      ? depositInfo
      : null;
  const isPageLoading = depositLoading && kycStatus === 'approved' && !activeDepositInfo;
  const isRefreshingDeposit = depositLoading && Boolean(activeDepositInfo);
  const currentAddress = !depositError ? activeDepositInfo?.address ?? "" : "";
  const qrValue = !depositError ? activeDepositInfo?.qr_data ?? currentAddress : undefined;
  const minDepositLabel = activeDepositInfo?.min_deposit != null ? activeDepositInfo.min_deposit : "-";
  const confirmationLabel = activeDepositInfo?.confirmations != null ? activeDepositInfo.confirmations : "-";
  const recentDeposits = activeDepositInfo?.recent_deposits ?? [];
  const warningText = activeDepositInfo?.warning ?? `Only send ${selectedCoin} to this address. Sending other coins may result in permanent loss.`;

  const handleCopy = () => {
    if (!currentAddress) return;
    navigator.clipboard?.writeText(currentAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isPageLoading) {
    return (
      <PageShell title="Deposit" description="">
        <div className="space-y-6 px-4 sm:px-6 py-2 animate-pulse" aria-label="Loading deposit details">
          <div className="rounded-2xl border border-white/[0.07] bg-[#13141a] p-5 sm:p-6 space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className="h-5 w-28 rounded bg-white/10" />
              <div className="h-10 w-64 rounded-full bg-white/10" />
            </div>
            <div className="h-12 rounded-xl bg-white/10" />
            <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-5">
              <div className="h-28 rounded-xl bg-white/10" />
              <div className="space-y-4">
                <div className="h-4 w-48 rounded bg-white/10" />
                <div className="h-12 rounded-xl bg-white/10" />
                <div className="h-3 w-56 rounded bg-white/10" />
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-white/[0.07] bg-[#13141a] p-5 sm:p-6 space-y-4">
            <div className="h-5 w-36 rounded bg-white/10" />
            {[0, 1, 2].map((row) => (
              <div key={row} className="grid grid-cols-2 md:grid-cols-7 gap-3">
                {[0, 1, 2, 3, 4, 5, 6].map((cell) => <div key={cell} className="h-10 rounded-lg bg-white/10" />)}
              </div>
            ))}
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title="Deposit" description="">
      <div className="space-y-6 px-4 sm:px-6 py-2">
        {kycStatus !== 'approved' && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 flex gap-4">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <WarningIcon />
            </div>
            <div>
              <p className="text-amber-500 font-medium">KYC Verification Required</p>
              <p className="text-gray-400 text-sm mt-1">You must complete KYC verification before making deposits. Please visit the <a href="/dashboard/kyc" className="text-violet-400 hover:underline">KYC page</a> to verify your identity.</p>
            </div>
          </div>
        )}

        <div className="bg-[#13141a] border border-white/[0.07] rounded-2xl p-5 sm:p-6 space-y-5">
          {isRefreshingDeposit && (
            <div className="rounded-xl border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-xs font-medium text-violet-200">
              Refreshing deposit details in the background...
            </div>
          )}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-white/70 text-sm font-medium">Select Coin</p>
              <p className="text-white text-lg font-semibold mt-1">{COIN_NAMES[selectedCoin] ?? selectedCoin}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {Object.keys(networkOptionsByCoin).map((coin) => (
                <button
                  key={coin}
                  type="button"
                  onClick={() => setSelectedCoin(coin)}
                  className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                    selectedCoin === coin
                      ? "bg-violet-600 text-white"
                      : "bg-white/5 text-white/60 hover:bg-white/10"
                  }`}
                >
                  {coin}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <div className="flex items-center gap-2 bg-[#1c1d26] border border-white/10 rounded-xl px-4 py-3">
                <CoinIcon coin={selectedCoin} />
                <span className="text-white text-sm font-medium flex-1">{selectedCoin}</span>
               
              </div>
            </div>

            <div className="flex items-center bg-[#1c1d26] border border-white/10 rounded-xl overflow-hidden flex-shrink-0">
              {(networkOptionsByCoin[selectedCoin] ?? [selectedCoin]).map((net) => (
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

          {depositError ? (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-red-200 text-sm">
              {depositError}
            </div>
          ) : null}

          <div className="flex flex-col sm:flex-row items-start gap-5">
            <QRCode qrData={depositLoading || kycStatus !== 'approved' ? undefined : qrValue} />

            <div className="flex-1 space-y-4 w-full">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-white/80 text-sm font-medium">Wallet Deposit Address</p>
                  <p className="text-white text-sm mt-1 break-all sm:break-normal font-mono">
                    {kycStatus !== 'approved' ? "KYC verification required" : (depositLoading ? <span className="block h-4 w-64 max-w-full rounded bg-white/10 animate-pulse" /> : currentAddress || "Address unavailable")}
                  </p>
                </div>
                <button
                  onClick={handleCopy}
                  disabled={kycStatus !== 'approved'}
                  className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-5 py-3 rounded-xl transition-colors w-full sm:w-auto justify-center sm:justify-start disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CopyIcon />
                  {copied ? "Copied!" : "Copy Address"}
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircleIcon />
                  <span className="text-white/40 flex items-center gap-2">Minimum deposit: {depositLoading ? <span className="inline-block h-3 w-12 rounded bg-white/10 animate-pulse" /> : minDepositLabel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircleIcon />
                  <span className="text-white/40 flex items-center gap-2">Network confirmations: {depositLoading ? <span className="inline-block h-3 w-12 rounded bg-white/10 animate-pulse" /> : confirmationLabel} required</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
            <WarningIcon />
            <span className="text-amber-400 text-xs leading-relaxed">{warningText}</span>
          </div>
        </div>

        <div className="bg-[#13141a] border border-white/[0.07] rounded-2xl p-5 sm:p-6">
          <p className="text-white font-semibold text-base mb-5">Recent Deposits</p>

          {depositLoading && recentDeposits.length === 0 ? (
            <div className="space-y-3 py-2 animate-pulse" aria-label="Loading recent deposits">
              {[0, 1, 2, 3].map((row) => (
                <div key={row} className="grid grid-cols-2 md:grid-cols-7 gap-3">
                  {[0, 1, 2, 3, 4, 5, 6].map((cell) => (
                    <div key={cell} className="h-10 rounded-xl bg-white/5" />
                  ))}
                </div>
              ))}
            </div>
          ) : recentDeposits.length === 0 ? (
            <div className="px-6 py-8 text-gray-400 text-sm">No recent deposits available.</div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm min-w-[700px]">
                  <thead>
                    <tr className="text-white/30 text-xs">
                      <th className="text-left font-normal pb-4 pr-6">Coin</th>
                      <th className="text-left font-normal pb-4 pr-6">Fee</th>
                      <th className="text-left font-normal pb-4 pr-6">Amount</th>
                      <th className="text-left font-normal pb-4 pr-6">Date</th>
                      <th className="text-left font-normal pb-4 pr-6">Types</th>
                      <th className="text-left font-normal pb-4 pr-6">Tx Hash</th>
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
                        <td className="py-4 pr-6">
                          {d.tx_hash ? (
                            <TxHashCell hash={d.tx_hash} />
                          ) : (
                            <span className="text-white/20 text-xs">—</span>
                          )}
                        </td>
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
                      <div className="col-span-2">
                        <p className="text-white/40 text-xs mb-1">Tx Hash</p>
                        {d.tx_hash ? (
                          <TxHashCell hash={d.tx_hash} />
                        ) : (
                          <p className="text-white/20 text-xs">—</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </PageShell>
  );
}

export default function DepositPage() {
  return (
    <Suspense>
      <DepositContent />
    </Suspense>
  );
}
