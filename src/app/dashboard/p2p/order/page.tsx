"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import P2POrderPage from "./P2POrderPage";

export default function OrderPage() {
  // Optionally, you can use router or params for order id, etc.
  // const router = useRouter();
  // const { id } = useParams();
  // ...
  return <P2POrderPage />;
}
