import { Suspense } from "react";
import OrderPageClient from "./OrderPageClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <OrderPageClient />
    </Suspense>
  );
}
