import { PageShell } from "@/components/dashboard/PageShell";
import { Card, CardContent } from "@/components/common/Card";

const transactions = [
  { id: "TXN001", type: "Buy", coin: "BTC", amount: "0.0523 BTC", total: "$3,516.36", date: "Mar 14, 2021", status: "Completed" },
  { id: "TXN002", type: "Sell", coin: "USDT", amount: "1,200.00 USDT", total: "$1,200.00", date: "Mar 15, 2021", status: "Completed" },
  { id: "TXN003", type: "Buy", coin: "USDC", amount: "850.00 USDC", total: "$850.00", date: "Mar 16, 2021", status: "Pending" },
  { id: "TXN004", type: "Buy", coin: "BTC", amount: "0.0150 BTC", total: "$1,003.35", date: "Mar 17, 2021", status: "Completed" },
  { id: "TXN005", type: "Sell", coin: "ETH", amount: "0.56 ETH", total: "$1,823.47", date: "Mar 18, 2021", status: "Completed" },
  { id: "TXN006", type: "Buy", coin: "LTC", amount: "1.88 LTC", total: "$94.22", date: "Mar 19, 2021", status: "Failed" },
  { id: "TXN007", type: "Deposit", coin: "USDT", amount: "5,000.00 USDT", total: "$5,000.00", date: "Mar 20, 2021", status: "Completed" },
  { id: "TXN008", type: "Withdraw", coin: "BTC", amount: "0.10 BTC", total: "$6,700.00", date: "Mar 21, 2021", status: "Completed" },
];

const statusColor: Record<string, string> = {
  Completed: "text-[#1ecb4f]",
  Pending: "text-[#f0b90b]",
  Failed: "text-[#ef4444]",
};

export default function HistoryPage() {
  return (
    <PageShell title="Transaction History" description="View all your past transactions.">
      <Card className="bg-[#1a1b23] border border-white/5 rounded-2xl">
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-[#6b7280] text-xs font-medium [font-family:'Inter',Helvetica] pb-3">ID</th>
                  <th className="text-left text-[#6b7280] text-xs font-medium [font-family:'Inter',Helvetica] pb-3">Type</th>
                  <th className="text-left text-[#6b7280] text-xs font-medium [font-family:'Inter',Helvetica] pb-3 hidden sm:table-cell">Amount</th>
                  <th className="text-left text-[#6b7280] text-xs font-medium [font-family:'Inter',Helvetica] pb-3 hidden md:table-cell">Total</th>
                  <th className="text-left text-[#6b7280] text-xs font-medium [font-family:'Inter',Helvetica] pb-3 hidden lg:table-cell">Date</th>
                  <th className="text-left text-[#6b7280] text-xs font-medium [font-family:'Inter',Helvetica] pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-white/5 last:border-none">
                    <td className="py-3.5 text-[#6b7280] text-xs [font-family:'Inter',Helvetica]">{tx.id}</td>
                    <td className="py-3.5">
                      <span className={`text-sm font-medium [font-family:'Inter',Helvetica] ${tx.type === "Buy" || tx.type === "Deposit" ? "text-[#1ecb4f]" : "text-[#ef4444]"}`}>
                        {tx.type} {tx.coin}
                      </span>
                    </td>
                    <td className="py-3.5 text-white text-sm [font-family:'Inter',Helvetica] hidden sm:table-cell">{tx.amount}</td>
                    <td className="py-3.5 text-white text-sm font-medium [font-family:'Inter',Helvetica] hidden md:table-cell">{tx.total}</td>
                    <td className="py-3.5 text-[#6b7280] text-sm [font-family:'Inter',Helvetica] hidden lg:table-cell">{tx.date}</td>
                    <td className="py-3.5">
                      <span className={`text-xs font-medium [font-family:'Inter',Helvetica] ${statusColor[tx.status]}`}>{tx.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}
