"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Check, ExternalLink, RefreshCcw, ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/dashboard/PageShell";
import { Card, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchKycDocuments, fetchKycStatus, startKyc } from "@/redux/thunk/kycThunk";

const formatStatus = (status?: string | null) => {
  if (!status) return "Not Started";
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const getStatusConfig = (status: string) => {
  switch (status) {
    case "approved":
      return {
        title: "KYC verified successfully.",
        description: "Your identity is verified. You can now access P2P trading.",
        button: "Go to P2P",
        tone: "emerald",
      };
    case "in_progress":
      return {
        title: "Your KYC verification is in progress / under review.",
        description: "Continue your Didit session if it is still open, or refresh status after review completes.",
        button: "Continue Verification",
        tone: "blue",
      };
    case "in_review":
      return {
        title: "Your KYC verification is under review.",
        description: "Please check again later. We will unlock P2P once your status is approved.",
        button: "Refresh Status",
        tone: "amber",
      };
    case "declined":
      return {
        title: "Your KYC verification was declined.",
        description: "Please try again or contact support if you believe this is a mistake.",
        button: "Restart KYC Verification",
        tone: "red",
      };
    case "expired":
      return {
        title: "Your KYC verification session has expired.",
        description: "Start a new Didit verification session to continue.",
        button: "Start New Verification",
        tone: "red",
      };
    default:
      return {
        title: "KYC verification is required to access P2P trading.",
        description: "Start your Didit verification session and complete the checks securely.",
        button: "Start KYC Verification",
        tone: "violet",
      };
  }
};

const getToneClasses = (tone: string) => {
  switch (tone) {
    case "emerald":
      return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
    case "blue":
      return "bg-blue-500/10 border-blue-500/30 text-blue-400";
    case "amber":
      return "bg-amber-500/10 border-amber-500/30 text-amber-400";
    case "red":
      return "bg-red-500/10 border-red-500/30 text-red-400";
    default:
      return "bg-violet-500/10 border-violet-500/30 text-violet-300";
  }
};

export default function KYCPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    loading,
    statusLoading,
    error,
    statusError,
    message,
    status,
    submittedAt,
    reviewedAt,
    reviewNotes,
    verificationUrl,
    sessionId,
    verifiedAt,
    provider,
    providerStatus,
  } = useAppSelector((state) => state.kyc);

  const currentStatus = status || "not_started";
  const statusConfig = getStatusConfig(currentStatus);
  const toneClasses = getToneClasses(statusConfig.tone);
  const isAuthError = `${error || ""} ${statusError || ""}`.toLowerCase();

  useEffect(() => {
    dispatch(fetchKycStatus());
    dispatch(fetchKycDocuments());
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

  const redirectToVerification = (url: string) => {
    window.location.href = url;
  };

  const handleStartOrContinue = async () => {
    if (currentStatus === "approved") {
      router.push("/dashboard/p2p");
      return;
    }

    if (currentStatus === "in_review" || (currentStatus === "in_progress" && !verificationUrl)) {
      dispatch(fetchKycStatus());
      return;
    }

    if (currentStatus === "in_progress" && verificationUrl) {
      redirectToVerification(verificationUrl);
      return;
    }

    try {
      const result = await dispatch(startKyc()).unwrap();
      if (result.data.verification_url) {
        redirectToVerification(result.data.verification_url);
      }
    } catch {
      // Error is shown from Redux state below.
    }
  };

  return (
    <PageShell title="KYC Verification" description="Complete Didit verification to unlock P2P trading.">
      <div className="max-w-3xl">
        <Card className="bg-[#0f0f17] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <CardContent className="p-6 sm:p-10">
            <div className={`mb-8 rounded-2xl border p-5 ${toneClasses}`}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  {currentStatus === "approved" ? <Check size={22} /> : <ShieldCheck size={22} />}
                </div>
                <div>
                  <div className="mb-2 inline-flex rounded-full border border-current/30 px-3 py-1 text-xs font-semibold">
                    {formatStatus(currentStatus)}
                  </div>
                  <h2 className="text-xl font-semibold text-white">{statusConfig.title}</h2>
                  <p className="mt-2 text-sm text-white/65">{statusConfig.description}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-wide text-white/40">Current status</p>
                <p className="mt-2 text-lg font-semibold text-white">{formatStatus(currentStatus)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-wide text-white/40">Verified at</p>
                <p className="mt-2 text-lg font-semibold text-white">{verifiedAt || reviewedAt || "-"}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-wide text-white/40">Provider</p>
                <p className="mt-2 text-lg font-semibold text-white">{provider || "didit"}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-wide text-white/40">Provider status</p>
                <p className="mt-2 text-lg font-semibold text-white">{providerStatus || "-"}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-wide text-white/40">Submitted at</p>
                <p className="mt-2 text-lg font-semibold text-white">{submittedAt || "-"}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-wide text-white/40">Session ID</p>
                <p className="mt-2 truncate text-lg font-semibold text-white">{sessionId || "-"}</p>
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

            {message && !error && !statusError && (
              <p className="mt-5 text-sm text-white/50">{message}</p>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={handleStartOrContinue}
                disabled={loading || statusLoading}
                className="bg-violet-600 hover:bg-violet-500"
              >
                {loading || (statusLoading && currentStatus === "in_review")
                  ? "Please wait..."
                  : statusConfig.button}
                {currentStatus !== "approved" && currentStatus !== "in_review" && <ExternalLink className="ml-2" size={16} />}
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

            {currentStatus !== "approved" && (
              <p className="mt-6 text-sm text-white/45">
                P2P buying, selling, and offer creation remain locked until your KYC status is approved.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
