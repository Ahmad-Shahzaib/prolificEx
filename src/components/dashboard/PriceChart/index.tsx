"use client";

import { Card, CardContent } from "@/components/common/Card";
import { useState } from "react";
import { cn } from "@/lib/utils";

const timeframes = ["1h", "3h", "1d", "1w", "1m"];

const chartPoints = [
  10, 12, 11, 14, 13, 16, 15, 18, 20, 19, 22, 21, 24, 23, 26, 28, 27,
  30, 29, 32, 34, 33, 36, 35, 38, 37, 40, 42, 41, 44, 43, 46, 48, 47,
  50, 49, 52, 54, 53, 56, 55, 58, 57, 60, 59, 62, 64, 63, 66, 65, 68,
  56, 54, 52, 50, 48, 46, 44, 42, 40, 38, 36, 34, 32, 30, 28, 26, 28,
  30, 32, 34, 36, 38, 40, 42, 38, 36, 34, 32, 30, 32, 34, 36, 38, 40,
  42, 44, 46, 48, 50, 48, 46, 44, 42, 40, 38, 40, 42, 44, 46,
];

function buildSvgPath(points: number[], width: number, height: number) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const step = width / (points.length - 1);

  let line = "";
  const scaled = points.map((p, i) => ({
    x: i * step,
    y: height - ((p - min) / range) * (height - 20) - 10,
  }));

  line = `M ${scaled[0].x} ${scaled[0].y}`;
  for (let i = 1; i < scaled.length; i++) {
    const prev = scaled[i - 1];
    const curr = scaled[i];
    const cpx1 = prev.x + step * 0.4;
    const cpx2 = curr.x - step * 0.4;
    line += ` C ${cpx1} ${prev.y}, ${cpx2} ${curr.y}, ${curr.x} ${curr.y}`;
  }

  const fill = line + ` L ${scaled[scaled.length - 1].x} ${height} L ${scaled[0].x} ${height} Z`;
  return { line, fill };
}

const volumeBars = Array.from({ length: 50 }, () => Math.random() * 20 + 2);

export function PriceChart() {
  const [activeTimeframe, setActiveTimeframe] = useState("1w");
  const paths = buildSvgPath(chartPoints, 600, 200);

  return (
    <Card className="bg-[#1a1b23] border border-white/5 rounded-2xl">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-white text-base font-bold [font-family:'Inter',Helvetica]">
            Market Prices
          </h3>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center bg-[#252630] rounded-lg text-[#6b7280] hover:text-white transition-colors cursor-pointer border-none">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 10L5 5L8 7L12 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="flex items-center gap-1.5 bg-[#252630] rounded-lg px-2 py-1.5">
              <div className="w-5 h-5 rounded-full bg-[#1ecb4f] flex items-center justify-center">
                <span className="text-white text-[8px] font-bold">$</span>
              </div>
              <span className="text-white text-xs [font-family:'Inter',Helvetica] font-medium">USD</span>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-[#6b7280]">
                <path d="M2.5 4L5 6.5L7.5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-[#6b7280] text-xs [font-family:'Inter',Helvetica]">Bitcoin/BTC</span>
          </div>
          <div className="flex items-center gap-1">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setActiveTimeframe(tf)}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-medium [font-family:'Inter',Helvetica] transition-all cursor-pointer border-none",
                  activeTimeframe === tf
                    ? "bg-violet-600 text-white"
                    : "bg-transparent text-[#6b7280] hover:text-white"
                )}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        <p className="text-white text-2xl font-bold [font-family:'Inter',Helvetica] mb-4">
          $35,352.02
        </p>

        <div className="relative w-full">
          <div className="flex flex-col gap-0">
            <div className="flex items-center gap-2 text-[10px] text-[#6b7280] [font-family:'Inter',Helvetica]">
              <span className="w-10 text-right">50,000</span>
              <div className="flex-1 border-b border-white/5"></div>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-[#6b7280] [font-family:'Inter',Helvetica] mt-6">
              <span className="w-10 text-right">40,000</span>
              <div className="flex-1 border-b border-white/5"></div>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-[#6b7280] [font-family:'Inter',Helvetica] mt-6">
              <span className="w-10 text-right">30,000</span>
              <div className="flex-1 border-b border-white/5"></div>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-[#6b7280] [font-family:'Inter',Helvetica] mt-6">
              <span className="w-10 text-right">20,000</span>
              <div className="flex-1 border-b border-white/5"></div>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-[#6b7280] [font-family:'Inter',Helvetica] mt-6">
              <span className="w-10 text-right">10,000</span>
              <div className="flex-1 border-b border-white/5"></div>
            </div>
          </div>

          <div className="absolute top-0 left-12 right-0 h-[180px]">
            <svg viewBox="0 0 600 200" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(99, 102, 241, 0.15)" />
                  <stop offset="100%" stopColor="rgba(99, 102, 241, 0)" />
                </linearGradient>
              </defs>
              <path d={paths.fill} fill="url(#chartGradient)" />
              <path d={paths.line} fill="none" stroke="#6366f1" strokeWidth="2" />
            </svg>
          </div>

          <div className="ml-12 mt-2 flex items-end gap-[2px] h-[30px]">
            {volumeBars.map((height, i) => (
              <div
                key={i}
                className="flex-1 bg-[#6366f1]/20 rounded-t-sm"
                style={{ height: `${height}px` }}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 ml-12 text-[10px] text-[#6b7280] [font-family:'Inter',Helvetica]">
          <span>19:00</span>
          <span>19:10</span>
          <span>19:20</span>
          <span>19:30</span>
          <span>19:40</span>
          <span>19:50</span>
        </div>
      </CardContent>
    </Card>
  );
}
