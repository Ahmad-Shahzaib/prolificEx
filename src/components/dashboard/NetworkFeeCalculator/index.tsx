"use client";

import { FormEvent, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchNetworkFee } from "@/redux/thunk/networkFeeThunk";
import { clearNetworkFeeState } from "@/redux/slices/networkFeeSlice";

const networkOptionsByCoin: Record<string, string[]> = {
  BTC: ["BTC"],
  ETH: ["ETH", "ERC20"],
  USDT: ["TRC20", "ERC20"],
  USDC: ["ERC20", "TRC20"],
  SOL: ["SOL"],
};

const COIN_NAMES: Record<string, string> = {
  BTC: "Bitcoin",
  ETH: "Ethereum",
  USDT: "Tether",
  USDC: "USD Coin",
  SOL: "Solana",
};

export function NetworkFeeCalculator() {
  const dispatch = useAppDispatch();
  const { loading, error, feeData } = useAppSelector((state) => state.networkFee);
  const [selectedCoin, setSelectedCoin] = useState("BTC");
  const [selectedNetwork, setSelectedNetwork] = useState("BTC");
  const [amount, setAmount] = useState("100");
  const [validationError, setValidationError] = useState<string | null>(null);

  const availableNetworks = networkOptionsByCoin[selectedCoin] ?? [selectedCoin];

  useEffect(() => {
    const networks = networkOptionsByCoin[selectedCoin] ?? [selectedCoin];
    if (!networks.includes(selectedNetwork)) {
      setSelectedNetwork(networks[0]);
    }
  }, [selectedCoin, selectedNetwork]);

  useEffect(() => {
    const numericAmount = parseFloat(amount);
    setValidationError(null);

    if (!numericAmount || numericAmount <= 0) {
      return;
    }

    const debounce = window.setTimeout(() => {
      dispatch(fetchNetworkFee({ coin: selectedCoin, network: selectedNetwork, amount: numericAmount }));
    }, 500);

    return () => {
      window.clearTimeout(debounce);
    };
  }, [dispatch, selectedCoin, selectedNetwork, amount]);

  useEffect(() => {
    return () => {
      dispatch(clearNetworkFeeState());
    };
  }, [dispatch]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError(null);

    const numericAmount = parseFloat(amount);
    if (!numericAmount || numericAmount <= 0) {
      setValidationError("Please enter a valid amount greater than zero.");
      return;
    }

    dispatch(fetchNetworkFee({ coin: selectedCoin, network: selectedNetwork, amount: numericAmount }));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-[#13141a] p-6 shadow-sm">
        <div className="mb-6">
          <p className="text-white text-lg font-semibold">Network Fee Calculator</p>
          <p className="text-sm text-[#9ca3af] mt-1">
            Enter the coin, network, and amount to estimate the network fee and receive amount.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-1">
              <label className="block text-sm text-white/70 mb-2">Coin</label>
              <div className="rounded-3xl border border-white/10 bg-[#0f1119] p-3">
                <div className="grid grid-cols-3 gap-2">
                  {Object.keys(networkOptionsByCoin).map((coin) => (
                    <button
                      key={coin}
                      type="button"
                      onClick={() => setSelectedCoin(coin)}
                      className={`rounded-2xl border px-3 py-2 text-sm font-medium transition ${
                        selectedCoin === coin
                          ? "border-violet-500 bg-violet-600 text-white"
                          : "border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10"
                      }`}
                    >
                      {coin}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="sm:col-span-1">
              <label className="block text-sm text-white/70 mb-2">Network</label>
              <div className="rounded-3xl border border-white/10 bg-[#0f1119] p-3">
                <div className="grid grid-cols-3 gap-2">
                  {(networkOptionsByCoin[selectedCoin] ?? [selectedCoin]).map((network) => (
                    <button
                      key={network}
                      type="button"
                      onClick={() => setSelectedNetwork(network)}
                      className={`rounded-2xl border px-3 py-2 text-sm font-medium transition ${
                        selectedNetwork === network
                          ? "border-violet-500 bg-violet-600 text-white"
                          : "border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10"
                      }`}
                    >
                      {network}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="sm:col-span-1">
              <label className="block text-sm text-white/70 mb-2">Amount</label>
              <input
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="100"
                type="number"
                min="0"
                step="any"
                className="w-full rounded-2xl border border-white/10 bg-[#0f1119] px-4 py-3 text-white outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>
          </div>

          {validationError ? (
            <div className="rounded-2xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-200">
              {validationError}
            </div>
          ) : null}

          {error ? (
            <div className="rounded-2xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
           
            <div className="text-sm text-white/60">
              {COIN_NAMES[selectedCoin]} · {selectedNetwork}
            </div>
          </div>
        </form>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#13141a] p-6 shadow-sm">
        <p className="text-white text-lg font-semibold mb-4">Fee estimate</p>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 animate-pulse" aria-label="Loading fee details">
            {[0, 1].map((item) => (
              <div key={item} className="h-36 rounded-3xl border border-white/10 bg-white/5" />
            ))}
          </div>
        ) : feeData ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-[#0f1119] p-5">
              <p className="text-sm text-white/50">Network fee</p>
              <p className="mt-3 text-3xl font-semibold text-white">{feeData.network_fee}</p>
              <p className="mt-2 text-sm text-white/60">{feeData.coin} on {feeData.network}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-[#0f1119] p-5">
              <p className="text-sm text-white/50">You receive</p>
              <p className="mt-3 text-3xl font-semibold text-white">{feeData.you_receive}</p>
              <p className="mt-2 text-sm text-white/60">After network fee deduction</p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-white/5 p-6 text-sm text-white/60">
            Enter a coin, network, and amount then click Get Fee to display the current estimate.
          </div>
        )}
      </div>
    </div>
  );
}
