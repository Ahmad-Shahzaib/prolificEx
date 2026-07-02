"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle2, ExternalLink, RefreshCcw, ShieldCheck, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchKycStatus, startKyc } from "@/redux/thunk/kycThunk";

const terminalStatuses = new Set(["approved", "declined", "expired"]);

const formatStatus = (status?: string | null) => {
  if (!status) return "Checking";
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const getResultConfig = (status?: string | null) => {
  switch (status) {
    case "approved":
      return {
        icon: CheckCircle2,
        title: "KYC verified successfully",
        description: "Your identity verification is approved. P2P trading is now unlocked.",
        tone: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
        action: "Go to P2P",
      };
    case "declined":
      return {
        icon: XCircle,
        title: "KYC verification was declined",
        description: "Please review the notes below and retry verification.",
        tone: "text-red-400 border-red-500/30 bg-red-500/10",
        action: "Retry Verification",
      };
    case "expired":
      return {
        icon: AlertTriangle,
        title: "KYC verification expired",
        description: "Your verification session expired. Start a new session to continue.",
        tone: "text-amber-400 border-amber-500/30 bg-amber-500/10",
        action: "Start New Verification",
      };
    case "in_progress":
      return {
        icon: ShieldCheck,
        title: "Verification in progress / under review",
        description: "We are checking your latest KYC status with the backend. This page will refresh automatically.",
        tone: "text-blue-400 border-blue-500/30 bg-blue-500/10",
        action: "Continue Verification",
      };
    default:
      return {
        icon: ShieldCheck,
        title: "KYC status check",
        description: "Start verification if you have not completed the Didit flow yet.",
        tone: "text-violet-300 border-violet-500/30 bg-violet-500/10",
        action: "Start Verification",
      };
  }
};

export default function KycResultPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    loading,
    statusLoading,
    error,
    statusError,
    status,
    providerStatus,
    verificationUrl,
    sessionId,
    reviewedAt,
    reviewNotes,
    submittedAt,
    verifiedAt,
  } = useAppSelector((state) => state.kyc);
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});

  const currentStatus = status || "not_started";
  const config = getResultConfig(statusLoading && !status ? null : currentStatus);
  const Icon = config.icon;
  const isAuthError = `${error || ""} ${statusError || ""}`.toLowerCase();

  const callbackMessage = useMemo(() => {
    return queryParams.message || queryParams.error || "";
  }, [queryParams]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQueryParams({
      status: params.get("status") || "",
      kyc_status: params.get("kyc_status") || "",
      verificationSessionId: params.get("verificationSessionId") || "",
      message: params.get("message") || "",
      error: params.get("error") || "",
    });

    dispatch(fetchKycStatus());
  }, [dispatch]);

  useEffect(() => {
    if (
      isAuthError.includes("401") ||
      isAuthError.includes("unauthorized") ||
      isAuthError.includes("unauthenticated")
    ) {
      router.push("/login");
    }
  }, [isAuthError, router]);

  useEffect(() => {
    if (currentStatus !== "in_progress") return;

    const intervalId = window.setInterval(() => {
      dispatch(fetchKycStatus());
    }, 7000);

    return () => window.clearInterval(intervalId);
  }, [currentStatus, dispatch]);

  const handlePrimaryAction = async () => {
    if (currentStatus === "approved") {
      router.push("/dashboard/p2p");
      return;
    }

    if (currentStatus === "in_progress" && verificationUrl) {
      window.location.href = verificationUrl;
      return;
    }

    try {
      const result = await dispatch(startKyc()).unwrap();
      if (result.data.verification_url) {
        window.location.href = result.data.verification_url;
      }
    } catch {
      // Redux error is rendered below.
    }
  };

  return (
    <main className="min-h-screen bg-[#0d0d14] px-4 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <Card className="bg-[#0f0f17] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <CardContent className="p-6 sm:p-10">
            <div className={`rounded-2xl border p-5 ${config.tone}`}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <Icon size={24} />
                </div>
                <div>
                  <div className="mb-2 inline-flex rounded-full border border-current/30 px-3 py-1 text-xs font-semibold">
                    {statusLoading && !status ? "Checking..." : formatStatus(currentStatus)}
                  </div>
                  <h1 className="text-2xl font-semibold text-white">{config.title}</h1>
                  <p className="mt-2 text-sm text-white/65">{config.description}</p>
                </div>
              </div>
            </div>

            {callbackMessage && (
              <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/70">
                Callback message: {callbackMessage}
              </div>
            )}

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-wide text-white/40">Backend status</p>
                <p className="mt-2 text-lg font-semibold text-white">{formatStatus(currentStatus)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-wide text-white/40">Provider status</p>
                <p className="mt-2 text-lg font-semibold text-white">{providerStatus || "-"}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-wide text-white/40">Session ID</p>
                <p className="mt-2 truncate text-lg font-semibold text-white">
                  {sessionId || queryParams.verificationSessionId || "-"}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-wide text-white/40">Submitted at</p>
                <p className="mt-2 text-lg font-semibold text-white">{submittedAt || "-"}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-wide text-white/40">Reviewed / verified at</p>
                <p className="mt-2 text-lg font-semibold text-white">{verifiedAt || reviewedAt || "-"}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-wide text-white/40">Polling</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {currentStatus === "in_progress" && !terminalStatuses.has(currentStatus) ? "Active" : "Stopped"}
                </p>
              </div>
            </div>

            {reviewNotes && (
              <div className="mt-5 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">
                {reviewNotes}
              </div>
            )}

            {(error || statusError) && (
              <div className="mt-5 flex gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                <AlertTriangle className="mt-0.5 shrink-0" size={18} />
                <span>{error || statusError}</span>
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={handlePrimaryAction}
                disabled={loading || statusLoading || currentStatus === "approved" && loading}
                className="bg-violet-600 hover:bg-violet-500"
              >
                {loading ? "Please wait..." : config.action}
                {currentStatus !== "approved" && <ExternalLink className="ml-2" size={16} />}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => dispatch(fetchKycStatus())}
                disabled={statusLoading}
              >
                <RefreshCcw className="mr-2" size={16} />
                {statusLoading ? "Refreshing..." : "Refresh Status"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
