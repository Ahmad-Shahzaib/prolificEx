"use client";
import { FormEvent, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { withdrawThunk, WithdrawPayload } from "@/redux/thunk/withdrawThunk";
import { resetWithdrawState } from "@/redux/slices/withdrawSlice";
import { fetchKycStatus } from "@/redux/thunk/kycThunk";
import { fetchWallets } from "@/redux/thunk/walletThunk";
import { PageShell } from "@/components/dashboard/PageShell";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/common/Toast/Toast";

const WarningIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#f59e0b" strokeWidth={2}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const CoinIcon = ({ coin }: { coin: string }) => {
  const map: Record<string, { bg: string; label: string }> = {
    BTC: { bg: "#f7931a", label: "₿" },
    ETH: { bg: "#627eea", label: "Ξ" },
    USDT: { bg: "#26a17b", label: "$" },
    LUNA: { bg: "#172852", label: "L" },
    BNB: { bg: "#f0b90b", label: "B" },
    SOL: { bg: "#00a3b5", label: "S" },
    USDC: { bg: "#2775c9", label: "U" },
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

const statusStyle: Record<string, string> = {
  pending: "bg-amber-500/20 text-amber-400",
  complete: "bg-emerald-500/20 text-emerald-400",
  failed: "bg-red-500/20 text-red-400",
};

const COIN_NAMES: Record<string, string> = {
  ETH: "Ethereum",
  BTC: "Bitcoin",
  LUNA: "Solana",
  USDT: "Tether",
  USDC: "USD Coin",
  BNB: "Binance Coin",
};

const withdrawOptions = [
  { coin: "BTC", network: "BTC", label: "Bitcoin — BTC" },
  { coin: "ETH", network: "ERC20", label: "Ethereum — ERC20" },
  { coin: "SOL", network: "SOL", label: "Solana — SOL" },
  { coin: "USDC", network: "ERC20", label: "USDC — ERC20" },
  { coin: "USDT", network: "ERC20", label: "USDT — ERC20" },
  { coin: "USDT", network: "TRC20", label: "USDT — TRC20" },
];

function WithdrawContent() {
  const dispatch = useAppDispatch();
  const withdrawState = useAppSelector((state) => state.withdraw);
  const kycStatus = useAppSelector((state) => state.kyc.status);
  const wallets = useAppSelector((state) => state.wallet.wallets);
  const { toast, toasts, dismiss } = useToast();
  const searchParams = useSearchParams();
  const coinParam = searchParams.get("coin")?.toUpperCase() ?? "USDT";
  const validCoinKeys = Array.from(new Set(withdrawOptions.map((o) => o.coin)));
  const initialCoinKey = validCoinKeys.includes(coinParam) ? coinParam : "USDT";
  const initialNetwork = withdrawOptions.find((o) => o.coin === initialCoinKey)?.network ?? "TRC20";
  const [selectedCoinKey, setSelectedCoinKey] = useState(initialCoinKey);
  const [selectedNetwork, setSelectedNetwork] = useState(initialNetwork);
  const [walletAddress, setWalletAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [authCode, setAuthCode] = useState("");

  const feeAmount = 1;
  const receiveAmount = amount ? Math.max(0, Number(amount) - feeAmount) : 0;

  // Find matching wallet for selected coin + network
  const matchedWallet = wallets.find(
    (w) =>
      w.coin.toUpperCase() === selectedCoinKey.toUpperCase() &&
      w.network.toUpperCase() === selectedNetwork.toUpperCase()
  );
  const availableBalance = matchedWallet ? parseFloat(matchedWallet.available_balance) : 0;
  const availableBalanceDisplay = matchedWallet
    ? `${parseFloat(matchedWallet.available_balance).toFixed(6)} ${selectedCoinKey}`
    : `0.000000 ${selectedCoinKey}`;

  useEffect(() => {
    dispatch(fetchKycStatus());
    dispatch(fetchWallets());
  }, [dispatch]);

  useEffect(() => {
    if (withdrawState.success && withdrawState.message) {
      toast({
        title: "Withdrawal Successful",
        description: withdrawState.message,
        type: "success",
      });
      dispatch(resetWithdrawState());
    }
  }, [withdrawState.success, withdrawState.message, toast, dispatch]);

  useEffect(() => {
    if (withdrawState.error) {
      toast({
        title: "Withdrawal Failed",
        description: withdrawState.error,
        type: "error",
      });
      dispatch(resetWithdrawState());
    }
  }, [withdrawState.error, toast, dispatch]);

  const handleWithdraw = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (kycStatus !== "approved") {
      toast({
        title: "KYC Verification Required",
        description:
          "Please complete KYC verification before making withdrawals. Visit the KYC page to get started.",
        type: "error",
      });
      return;
    }

    if (!walletAddress.trim()) {
      toast({
        title: "Missing Wallet Address",
        description: "Please enter a recipient wallet address.",
        type: "error",
      });
      return;
    }

    const numericAmount = parseFloat(amount);
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid withdrawal amount greater than zero.",
        type: "error",
      });
      return;
    }

    if (numericAmount > availableBalance) {
      toast({
        title: "Insufficient Balance",
        description: `You only have ${availableBalanceDisplay} available. Please enter a smaller amount.`,
        type: "error",
      });
      return;
    }

    if (numericAmount <= feeAmount) {
      toast({
        title: "Amount Too Low",
        description: `Withdrawal amount must be greater than the network fee of ${feeAmount} ${selectedCoinKey}.`,
        type: "error",
      });
      return;
    }

    dispatch(
      withdrawThunk({
        coin: selectedCoinKey,
        network: selectedNetwork,
        address: walletAddress,
        amount,
        two_fa_code: authCode,
      } as WithdrawPayload)
    );
    setWalletAddress("");
    setAmount("");
    setAuthCode("");
  };

  return (
    <PageShell title="Withdraw" description="Initiate a withdrawal to your wallet address.">
      <div className="space-y-6 px-4 sm:px-6 py-2">
        {kycStatus !== 'approved' && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 flex gap-4">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <WarningIcon />
            </div>
            <div>
              <p className="text-amber-500 font-medium">KYC Verification Required</p>
              <p className="text-gray-400 text-sm mt-1">You must complete KYC verification before making withdrawals. Please visit the <a href="/dashboard/kyc" className="text-violet-400 hover:underline">KYC page</a> to verify your identity.</p>
            </div>
          </div>
        )}
        <div className="bg-[#13141a] border border-white/[0.07] rounded-2xl p-5 sm:p-6 space-y-6">
          <p className="text-white/70 text-sm font-medium">Select Coin</p>

          <div className="space-y-3">
            <label className="text-white/70 text-sm font-medium block">Select coin and network</label>
            <div className="relative">
              <select
                value={`${selectedCoinKey}|${selectedNetwork}`}
                onChange={(e) => {
                  const [coin, network] = e.target.value.split("|");
                  setSelectedCoinKey(coin);
                  setSelectedNetwork(network);
                }}
                className="w-full bg-[#1c1d26] border border-white/10 rounded-xl px-4 py-3 pr-10 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-violet-500/50 appearance-none"
              >
                {withdrawOptions.map((option) => (
                  <option
                    key={`${option.coin}-${option.network}`}
                    value={`${option.coin}|${option.network}`}
                    className="bg-[#1c1d26] text-white"
                  >
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-white/50">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </div>
          </div>

          <form onSubmit={handleWithdraw} className="space-y-6">
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

            <div className="space-y-2">
              <p className="text-white/40 text-xs">Available balance: {availableBalanceDisplay}</p>
              {amount && parseFloat(amount) > availableBalance && (
                <p className="text-red-400 text-xs flex items-center gap-1">
                  <WarningIcon />
                  Insufficient balance. Max withdrawable: {availableBalanceDisplay}
                </p>
              )}
              <div className="bg-[#1c1d26] rounded-lg px-4 py-2.5 inline-block">
                <span className="text-white/50 text-xs">Network fee: {feeAmount} {selectedCoinKey} &nbsp;|&nbsp; You will receive: {receiveAmount} {selectedCoinKey}</span>
              </div>
            </div>

            <div className="space-y-3 justify-end flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {/* <p className="text-white/70 text-sm font-medium">2FA verification</p> */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* <input
                  type="text"
                  placeholder="Enter your Google Authenticator code"
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value)}
                  className="flex-1 bg-[#1c1d26] border border-white/10 rounded-xl px-4 py-3 text-white/70 text-sm placeholder:text-white/20 focus:outline-none focus:border-violet-500/50"
                /> */}
                <button
                  type="submit"
                  disabled={withdrawState.loading || kycStatus !== 'approved'}
                  className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-6 py-3 rounded-xl transition-colors whitespace-nowrap w-full sm:w-auto disabled:opacity-50"
                >
                  {withdrawState.loading ? "Processing..." : "Confirm Withdrawal"}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
              <WarningIcon />
              <span className="text-amber-400 text-xs leading-relaxed">
                Double-check the address. Withdrawals cannot be reversed.
              </span>
            </div>
          </form>
        </div>

        {/* <div className="bg-[#13141a] border border-white/[0.07] rounded-2xl p-5 sm:p-6">
          <p className="text-white font-semibold text-base mb-5">Latest Withdrawal</p>
          {withdrawState.data ? (
            <div className="bg-[#1c1d26] rounded-xl p-4 border border-white/[0.05] space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <CoinIcon coin={withdrawState.data.coin} />
                  <div>
                    <p className="text-white font-medium">{COIN_NAMES[withdrawState.data.coin] ?? withdrawState.data.coin}</p>
                    <p className="text-white/50 text-xs">Transaction ID: {withdrawState.data.transaction_id}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-md text-xs font-medium ${statusStyle[withdrawState.data.status.toLowerCase()] || statusStyle.pending}`}>
                  {withdrawState.data.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-white/40 text-xs">Amount</p>
                  <p className="text-white font-medium">{withdrawState.data.amount} {withdrawState.data.coin}</p>
                </div>
                <div>
                  <p className="text-white/40 text-xs">Fee</p>
                  <p className="text-white/50">{withdrawState.data.fee} {withdrawState.data.coin}</p>
                </div>
                <div>
                  <p className="text-white/40 text-xs">Network</p>
                  <p className="text-white/70">{withdrawState.data.network}</p>
                </div>
                <div>
                  <p className="text-white/40 text-xs">Address</p>
                  <p className="text-white/70 break-all">{withdrawState.data.address}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-white/40">No withdrawal history yet.</p>
          )}
        </div> */}
      </div>
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </PageShell>
  );
}

export default function WithdrawPage() {
  return (
    <Suspense>
      <WithdrawContent />
    </Suspense>
  );
}
