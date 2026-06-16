"use client";

import { Card, CardContent } from "@/components/common/Card";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchUserActivityChart,
  UserActivityChartRange,
} from "@/redux/thunk/userActivityChartThunk";
import { cn } from "@/lib/utils";

const timeframes: UserActivityChartRange[] = ["1h", "3h", "1d", "1w", "1m"];

const chartWidth = 700;
const chartHeight = 240;
const chartPadding = 24;

function toNumber(value: unknown) {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value) || 0;
  return 0;
}

function formatAmount(amount?: string | number | null) {
  const num = Number(amount ?? 0);
  if (!Number.isFinite(num)) return "0";
  return num.toLocaleString(undefined, {
    maximumFractionDigits: 8,
  });
}

function formatStatus(status?: string) {
  return status?.replace(/_/g, " ") ?? "-";
}

function buildChart(points: number[]) {
  if (!points.length) {
    return {
      line: "",
      area: "",
      coords: [],
      max: 0,
      min: 0,
    };
  }

  const max = Math.max(...points, 1);
  const min = Math.min(...points, 0);
  const range = max - min || 1;

  const innerWidth = chartWidth - chartPadding * 2;
  const innerHeight = chartHeight - chartPadding * 2;
  const step = points.length > 1 ? innerWidth / (points.length - 1) : innerWidth;

  const coords = points.map((value, index) => ({
    x: chartPadding + index * step,
    y: chartPadding + innerHeight - ((value - min) / range) * innerHeight,
    value,
  }));

  if (coords.length === 1) {
    const y = coords[0].y;
    return {
      line: `M ${chartPadding} ${y} L ${chartWidth - chartPadding} ${y}`,
      area: `M ${chartPadding} ${chartHeight - chartPadding} L ${chartPadding} ${y} L ${
        chartWidth - chartPadding
      } ${y} L ${chartWidth - chartPadding} ${chartHeight - chartPadding} Z`,
      coords,
      max,
      min,
    };
  }

  let line = `M ${coords[0].x} ${coords[0].y}`;

  for (let i = 1; i < coords.length; i++) {
    const prev = coords[i - 1];
    const current = coords[i];
    const controlX = (current.x - prev.x) / 2;

    line += ` C ${prev.x + controlX} ${prev.y}, ${current.x - controlX} ${current.y}, ${current.x} ${current.y}`;
  }

  const area = `${line} L ${coords[coords.length - 1].x} ${
    chartHeight - chartPadding
  } L ${coords[0].x} ${chartHeight - chartPadding} Z`;

  return { line, area, coords, max, min };
}

export function PriceChart() {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector(
    (state) => state.userActivityChart
  );

  const [activeTimeframe, setActiveTimeframe] =
    useState<UserActivityChartRange>("1w");

  useEffect(() => {
    dispatch(fetchUserActivityChart({ range: activeTimeframe }));
  }, [activeTimeframe, dispatch]);

  const chartData = data?.series;

  const lineKey = chartData?.line_key ?? "cumulative_activity";
  const barKey = chartData?.bar_key ?? "value";

  const points = useMemo(() => {
    return (
      chartData?.points?.map((point) => toNumber(point[lineKey])) ?? []
    );
  }, [chartData?.points, lineKey]);

  const bars = useMemo(() => {
    return (
      chartData?.bars?.map((bar) => toNumber(bar[barKey] ?? bar.value)) ?? []
    );
  }, [chartData?.bars, barKey]);

  const labels = useMemo(() => {
    return (
      chartData?.points?.map((point) => point.label ?? "") ??
      []
    );
  }, [chartData?.points]);

  const chart = useMemo(() => buildChart(points), [points]);

  const maxBar = Math.max(...bars, 1);

  const summary = data?.summary ?? {
    transactions: 0,
    p2p_orders: 0,
    completed_transactions: 0,
    completed_orders: 0,
  };

  const recentTransactions = (data?.recent_transactions ?? []) as Array<{
    id: number;
    type: string;
    coin: string;
    amount: string;
    status: string;
    created_at: string;
  }>;
  const recentOrders = (data?.recent_orders ?? []) as Array<{
    id: number;
    status: string;
    crypto_amount: string;
    coin: string;
    created_at: string;
  }>;

  return (
    <Card className="overflow-hidden rounded-3xl border border-white/10 bg-[#14151d] shadow-2xl shadow-black/20">
      <CardContent className="p-0">
        <div className="border-b border-white/10 bg-gradient-to-br from-[#1d1f2b] via-[#171923] to-[#12131a] p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-violet-400">
                Analytics
              </p>
              <h3 className="mt-2 text-xl font-bold text-white sm:text-2xl">
                {data?.title ?? "User Activity"}
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                {data?.subtitle ?? "Wallet transactions & P2P orders"}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-white/5 p-1">
              {timeframes.map((tf) => (
                <button
                  key={tf}
                  type="button"
                  onClick={() => setActiveTimeframe(tf)}
                  className={cn(
                    "rounded-xl px-3 py-1.5 text-xs font-semibold transition-all",
                    activeTimeframe === tf
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 lg:col-span-1">
              <p className="text-xs text-slate-400">Total Activity</p>
              <p className="mt-2 text-3xl font-bold text-white">
                {loading ? "..." : data?.value ?? 0}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Range: {data?.range ?? activeTimeframe}
              </p>
            </div>

            <MetricCard title="Transactions" value={summary.transactions} />
            <MetricCard title="P2P Orders" value={summary.p2p_orders} />
            <MetricCard
              title="Completed Tx"
              value={summary.completed_transactions}
            />
            <MetricCard
              title="Completed Orders"
              value={summary.completed_orders}
            />
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {error && (
            <div className="mb-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
              {error}
            </div>
          )}

          <div className="rounded-3xl border border-white/10 bg-[#191b25] p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-white">
                  Activity Trend
                </h4>
                <p className="text-xs text-slate-500">
                  Line shows cumulative activity, bars show daily activity
                </p>
              </div>

              <div className="hidden items-center gap-4 text-xs sm:flex">
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="h-2 w-2 rounded-full bg-violet-500" />
                  Cumulative
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="h-2 w-2 rounded-full bg-violet-500/30" />
                  Total
                </div>
              </div>
            </div>

            <div className="relative h-[320px] w-full overflow-hidden rounded-2xl bg-[#12131a] p-3">
              <div className="absolute inset-x-4 top-6 bottom-16 flex flex-col justify-between">
                {[100, 75, 50, 25, 0].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="w-8 text-right text-[10px] text-slate-600">
                      {item}%
                    </span>
                    <div className="h-px flex-1 bg-white/5" />
                  </div>
                ))}
              </div>

              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                preserveAspectRatio="none"
                className="absolute left-12 right-4 top-6 h-[210px] w-[calc(100%-4rem)]"
              >
                <defs>
                  <linearGradient id="activityArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(124,58,237,0.35)" />
                    <stop offset="100%" stopColor="rgba(124,58,237,0)" />
                  </linearGradient>
                </defs>

                {chart.area && <path d={chart.area} fill="url(#activityArea)" />}
                {chart.line && (
                  <path
                    d={chart.line}
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                )}

                {chart.coords.map((point, index) => (
                  <circle
                    key={`${point.x}-${index}`}
                    cx={point.x}
                    cy={point.y}
                    r="5"
                    fill="#8b5cf6"
                    stroke="#12131a"
                    strokeWidth="3"
                  />
                ))}
              </svg>

              <div className="absolute bottom-16 left-12 right-4 flex h-20 items-end gap-2">
                {bars.length ? (
                  bars.map((bar, index) => (
                    <div
                      key={`${bar}-${index}`}
                      className="group relative flex flex-1 items-end"
                    >
                      <div
                        className="w-full rounded-t-lg bg-violet-500/25 transition-all duration-300 group-hover:bg-violet-500/50"
                        style={{
                          height: `${Math.max((bar / maxBar) * 76, bar > 0 ? 8 : 3)}px`,
                        }}
                      />
                      <div className="pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 rounded-lg bg-black px-2 py-1 text-[10px] text-white group-hover:block">
                        {bar}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
                    No chart data available
                  </div>
                )}
              </div>

              <div className="absolute bottom-5 left-12 right-4 flex items-center justify-between gap-2">
                {labels.map((label, index) => (
                  <span
                    key={`${label}-${index}`}
                    className="max-w-[52px] truncate text-center text-[10px] text-slate-500"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-2">
            <RecentTransactions items={recentTransactions} />
            <RecentOrders items={recentOrders} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MetricCard({
  title,
  value,
}: {
  title: string;
  value: number | string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-xs text-slate-400">{title}</p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

function RecentTransactions({
  items,
}: {
  items: Array<{
    id: number;
    type: string;
    coin: string;
    amount: string;
    status: string;
    created_at: string;
  }>;
}) {
  return (
  <></>
  );
}

function RecentOrders({
  items,
}: {
  items: Array<{
    id: number;
    status: string;
    crypto_amount: string;
    coin: string;
    created_at: string;
  }>;
}) {
  return (
    <></>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex min-h-[120px] items-center justify-center rounded-2xl border border-dashed border-white/10 text-sm text-slate-500">
      {text}
    </div>
  );
}