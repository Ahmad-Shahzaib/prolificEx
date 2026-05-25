"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import { SidebarProvider } from "@/components/providers/SidebarContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!isAuthenticated && !token) {
      router.replace("/login");
      return;
    }

    setIsCheckingAuth(false);
  }, [isAuthenticated, router]);

  if (isCheckingAuth) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-[#0d0e14]">
        <Sidebar />
        <DashboardNavbar />
        <main className="lg:ml-[200px] pt-[64px] h-[calc(100vh-64px)] ">
          <div className="p-4 sm:p-6">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
