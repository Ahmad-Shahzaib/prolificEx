"use client";

import { Card, CardContent } from "@/components/common/Card";

interface Alert {
  id: string;
  name: string;
  email: string;
  risk: string;
}

const alerts: Alert[] = [
  { id: "1", name: "dave.king1", email: "daveking@email.com", risk: "High Risk Account" },
  { id: "2", name: "dave.king1", email: "daveking@email.com", risk: "High Risk Account" },
  { id: "3", name: "dave.king1", email: "daveking@email.com", risk: "High Risk Account" },
  { id: "4", name: "dave.king1", email: "daveking@email.com", risk: "High Risk Account" },
  { id: "5", name: "dave.king1", email: "daveking@email.com", risk: "High Risk Account" },
  { id: "6", name: "dave.king1", email: "daveking@email.com", risk: "High Risk Account" },
];

export function Transactions() {
  return (
    <Card className="bg-[#1a1b23] border border-white/5 rounded-2xl h-full">
      <CardContent className="p-4 sm:p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white text-base font-bold [font-family:'Inter',Helvetica]">
            Quick Alerts
          </h3>
        </div>

        {/* Alerts List */}
        <div className="space-y-0">
          {alerts.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between py-3 border-b border-white/5 last:border-none"
            >
              {/* Left Content */}
              <div>
                <p className="text-white text-sm font-medium [font-family:'Inter',Helvetica] leading-4">
                  {user.name}
                  <span className="text-[#9ca3af] font-normal ml-2">
                    {user.email}
                  </span>
                </p>
                <p className="text-[#6b7280] text-[11px] [font-family:'Inter',Helvetica] mt-0.5">
                  {user.risk}
                </p>
              </div>

              {/* Right Button */}
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-1.5 rounded-md">
                Review
              </button>
            </div>
          ))}
        </div>

      </CardContent>
    </Card>
  );
}