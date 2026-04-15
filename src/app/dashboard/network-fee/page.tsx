"use client";

import { PageShell } from "@/components/dashboard/PageShell";
import { NetworkFeeCalculator } from "@/components/dashboard/NetworkFeeCalculator";

export default function NetworkFeePage() {
  return (
    <PageShell
      title="Network Fee Calculator"
      description="Enter coin, network, and amount to estimate the fee and receive amount."
    >
      <NetworkFeeCalculator />
    </PageShell>
  );
}
