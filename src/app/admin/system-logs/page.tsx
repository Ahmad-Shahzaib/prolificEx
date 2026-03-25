"use client";

import { useState } from "react";

function CoinIcon({ letter, color, bg }: { letter: string; color: string; bg: string }) {
  return (
    <span
      className="inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold flex-shrink-0"
      style={{ background: bg, color, border: `1.5px solid ${color}44` }}
    >
      {letter}
    </span>
  );
}

function SelectDropdown({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-[#2a2d3f] border border-[#33374f] text-gray-300 text-xs rounded-lg pl-3 pr-7 py-2 outline-none cursor-pointer hover:bg-[#31354a] transition-colors"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <svg className="w-3 h-3 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}

function InputWithSuffix({
  value,
  onChange,
  suffix,
  suffixOptions,
  onSuffixChange,
}: {
  value: string;
  onChange: (v: string) => void;
  suffix: string;
  suffixOptions?: string[];
  onSuffixChange?: (v: string) => void;
}) {
  return (
    <div className="flex items-center bg-[#1e2133] border border-[#2a2d45] rounded-lg overflow-hidden w-full max-w-[220px]">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent text-sm text-gray-200 px-3 py-2.5 outline-none min-w-0"
      />
      <div className="border-l border-[#2a2d45] px-2.5 py-2 flex items-center">
        {suffixOptions && onSuffixChange ? (
          <SelectDropdown value={suffix} options={suffixOptions} onChange={onSuffixChange} />
        ) : (
          <span className="text-xs text-gray-400 font-medium">{suffix}</span>
        )}
      </div>
    </div>
  );
}

export default function AdminFeeSettingsPage() {
  // Trading fee
  const [tradingFee, setTradingFee] = useState("0.25");

  // Withdrawal fees
  const [ethFee, setEthFee] = useState("$5.00");
  const [ethUnit, setEthUnit] = useState("ETH");
  const [btcFee, setBtcFee] = useState("$5.00");
  const [btcUnit, setBtcUnit] = useState("USD");
  const [tetherFee, setTetherFee] = useState("0.25");

  // KYC Limits
  const [kyc1Daily, setKyc1Daily] = useState("$1,000 USD");
  const [kyc1DailyUnit, setKyc1DailyUnit] = useState("ETH");
  const [kyc1Monthly, setKyc1Monthly] = useState("$20,000 USD");
  const [kyc1MonthlyUnit, setKyc1MonthlyUnit] = useState("ETH");

  const [kyc2Daily, setKyc2Daily] = useState("$1,000 USD");
  const [kyc2DailyUnit, setKyc2DailyUnit] = useState("ETH");
  const [kyc2Monthly, setKyc2Monthly] = useState("$20,000 USD");
  const [kyc2MonthlyUnit, setKyc2MonthlyUnit] = useState("ETH");

  const unitOptions = ["ETH", "BTC", "USD", "USDT"];

  return (
    <div className="min-h-screen   text-white p-4 sm:p-6 lg:p-8 font-sans">
      <div className="  mx-auto">
        {/* Heading */}
        <h1 className="text-[22px] font-semibold tracking-tight mb-8">Fee & Limit Settings</h1>

        {/* Trading Fee Configuration */}
        <div className="bg-[#181a27] border border-[#22253a] rounded-2xl overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-[#22253a]">
            <h2 className="text-base font-semibold">Trading Fee Configuration</h2>
          </div>
          <div className="px-6 py-6 flex flex-col sm:flex-row sm:items-center gap-4">
            <span className="text-sm text-gray-400 sm:w-52 flex-shrink-0">Trading Fee (% per trade)</span>
            <InputWithSuffix
              value={tradingFee}
              onChange={setTradingFee}
              suffix="%"
            />
          </div>
        </div>

        {/* Withdrawal Fees */}
        <div className="bg-[#181a27] border border-[#22253a] rounded-2xl overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-[#22253a]">
            <h2 className="text-base font-semibold">Withdrawal Fees</h2>
          </div>
          <div className="px-6 py-2 divide-y divide-[#22253a]">
            {/* Ethereum */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 py-5">
              <div className="flex items-center gap-2.5 w-32 sm:w-40 flex-shrink-0">
                <CoinIcon letter="E" color="#627EEA" bg="#627EEA22" />
                <span className="text-sm font-medium">Ethereum</span>
              </div>
              <InputWithSuffix
                value={ethFee}
                onChange={setEthFee}
                suffix={ethUnit}
                suffixOptions={unitOptions}
                onSuffixChange={setEthUnit}
              />
            </div>

            {/* Bitcoin */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 py-5">
              <div className="flex items-center gap-2.5 w-32 sm:w-40 flex-shrink-0">
                <CoinIcon letter="B" color="#F7931A" bg="#F7931A22" />
                <span className="text-sm font-medium">Bitcoin</span>
              </div>
              <InputWithSuffix
                value={btcFee}
                onChange={setBtcFee}
                suffix={btcUnit}
                suffixOptions={unitOptions}
                onSuffixChange={setBtcUnit}
              />
            </div>

            {/* Tether */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 py-5">
              <div className="flex items-center gap-2.5 w-32 sm:w-40 flex-shrink-0">
                <CoinIcon letter="T" color="#26A17B" bg="#26A17B22" />
                <span className="text-sm font-medium">Tether</span>
              </div>
              <InputWithSuffix
                value={tetherFee}
                onChange={setTetherFee}
                suffix="%"
              />
            </div>
          </div>
        </div>

        {/* KYC Limits */}
        <div className="bg-[#181a27] border border-[#22253a] rounded-2xl overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-[#22253a]">
            <h2 className="text-base font-semibold">KYC Limits</h2>
          </div>

          <div className="px-6 py-6">
            {/* Column headers - hidden on mobile */}
            <div className="hidden md:grid grid-cols-[160px_1fr_1fr] gap-6 mb-4">
              <div />
              <span className="text-xs text-gray-500">Daily Limit</span>
              <span className="text-xs text-gray-500">Monthly Limit</span>
            </div>

            <div className="space-y-6">
              {/* KYC Level 1 */}
              <div className="grid grid-cols-1 md:grid-cols-[160px_1fr_1fr] gap-4 md:gap-6 items-start md:items-center">
                <span className="text-sm text-gray-300">KYC Level 1 Limits</span>
                <div className="flex flex-col sm:flex-row gap-4">
                  <InputWithSuffix
                    value={kyc1Daily}
                    onChange={setKyc1Daily}
                    suffix={kyc1DailyUnit}
                    suffixOptions={unitOptions}
                    onSuffixChange={setKyc1DailyUnit}
                  />
                  <InputWithSuffix
                    value={kyc1Monthly}
                    onChange={setKyc1Monthly}
                    suffix={kyc1MonthlyUnit}
                    suffixOptions={unitOptions}
                    onSuffixChange={setKyc1MonthlyUnit}
                  />
                </div>
              </div>

              {/* KYC Level 2 */}
              <div className="grid grid-cols-1 md:grid-cols-[160px_1fr_1fr] gap-4 md:gap-6 items-start md:items-center">
                <span className="text-sm text-gray-300">KYC Level 2 Limits</span>
                <div className="flex flex-col sm:flex-row gap-4">
                  <InputWithSuffix
                    value={kyc2Daily}
                    onChange={setKyc2Daily}
                    suffix={kyc2DailyUnit}
                    suffixOptions={unitOptions}
                    onSuffixChange={setKyc2DailyUnit}
                  />
                  <InputWithSuffix
                    value={kyc2Monthly}
                    onChange={setKyc2Monthly}
                    suffix={kyc2MonthlyUnit}
                    suffixOptions={unitOptions}
                    onSuffixChange={setKyc2MonthlyUnit}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button className="px-10 py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-xl transition-colors w-full sm:w-auto">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}