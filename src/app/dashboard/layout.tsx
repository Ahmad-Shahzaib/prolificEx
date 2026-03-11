import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0d0d1a]">
      <Sidebar />
      <div className="lg:ml-[240px] md:ml-[72px] ml-[72px]">
        <DashboardNavbar />
        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
