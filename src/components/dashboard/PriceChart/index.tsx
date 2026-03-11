"use client";

import { Card, CardContent } from "@/components/common/Card";
import { useState } from "react";
import { cn } from "@/lib/utils";

const timeframes = ["1H", "1D", "1W", "1M", "1Y"];

const chartDataPoints = [
  { x: 0, y: 40 }, { x: 8, y: 35 }, { x: 16, y: 45 }, { x: 24, y: 38 },
  { x: 32, y: 52 }, { x: 40, y: 48 }, { x: 48, y: 55 }, { x: 56, y: 50 },
  { x: 64, y: 62 }, { x: 72, y: 58 }, { x: 80, y: 65 }, { x: 88, y: 60 },
  { x: 96, y: 70 }, { x: 104, y: 68 }, { x: 112, y: 75 }, { x: 120, y: 72 },
  { x: 128, y: 78 }, { x: 136, y: 74 }, { x: 144, y: 80 }, { x: 152, y: 85 },
  { x: 160, y: 78 }, { x: 168, y: 82 }, { x: 176, y: 88 }, { x: 184, y: 83 },
  { x: 192, y: 90 }, { x: 200, y: 87 },
];

function generatePath(points: { x: number; y: number }[]) {
  const maxY = 100;
  const svgHeight = 120;
  const svgWidth = 200;

  const scaledPoints = points.map((p) => ({
    x: (p.x / 200) * svgWidth,
    y: svgHeight - (p.y / maxY) * svgHeight,
  }));

  let d = `M ${scaledPoints[0].x} ${scaledPoints[0].y}`;
  for (let i = 1; i < scaledPoints.length; i++) {
    const prev = scaledPoints[i - 1];
    const curr = scaledPoints[i];
    const cpx1 = prev.x + (curr.x - prev.x) / 3;
    const cpx2 = prev.x + (2 * (curr.x - prev.x)) / 3;
    d += ` C ${cpx1} ${prev.y}, ${cpx2} ${curr.y}, ${curr.x} ${curr.y}`;
  }

  const fillD =
    d +
    ` L ${scaledPoints[scaledPoints.length - 1].x} ${svgHeight} L ${scaledPoints[0].x} ${svgHeight} Z`;

  return { line: d, fill: fillD };
}

export function PriceChart() {
  const [activeTimeframe, setActiveTimeframe] = useState("1W");
  const paths = generatePath(chartDataPoints);

  return (
    <Card className="bg-[#1a1b23] border border-white/5 rounded-2xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-white text-lg font-bold [font-family:'Inter',Helvetica]">
                BTC/USD
              </h3>
              <span className="text-[#1ecb4f] text-sm font-medium [font-family:'Inter',Helvetica]">
                +2.34%
              </span>
            </div>
            <p className="text-white text-2xl font-bold [font-family:'Inter',Helvetica]">
              $67,234.50
            </p>
          </div>

          <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setActiveTimeframe(tf)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium [font-family:'Inter',Helvetica] transition-all cursor-pointer border-none",
                  activeTimeframe === tf
                    ? "bg-violet-600 text-white"
                    : "bg-transparent text-[#898ca9] hover:text-white"
                )}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full h-[200px] lg:h-[280px]">
          <svg
            viewBox="0 0 200 120"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(124, 58, 237, 0.3)" />
                <stop offset="100%" stopColor="rgba(124, 58, 237, 0)" />
              </linearGradient>
            </defs>
            <path d={paths.fill} fill="url(#chartGradient)" />
            <path
              d={paths.line}
              fill="none"
              stroke="#7c3aed"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="flex items-center justify-between mt-4 text-xs text-[#898ca9] [font-family:'Inter',Helvetica]">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
      </CardContent>
    </Card>
  );
}
