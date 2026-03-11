import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0d0e14]">
      <Sidebar />
      <DashboardNavbar />
      <main className="ml-[200px] pt-[64px] min-h-[calc(100vh-64px)] overflow-y-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
