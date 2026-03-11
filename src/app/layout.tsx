import type { Metadata } from "next";
import "./globals.css";
import { ReduxProvider } from "@/components/providers/ReduxProvider";

export const metadata: Metadata = {
  title: "ProlificEx — Buy & Sell Crypto with Ease",
  description:
    "Trade BTC, USDT and USDC securely using trusted P2P merchants across Africa.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
