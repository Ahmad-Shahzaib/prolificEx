'use client';
import { useEffect, useRef, useState } from "react";
import { PageShell } from "@/components/dashboard/PageShell";
import { Card, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Upload, Check, Camera, RotateCcw, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { submitKyc, fetchKycStatus } from "@/redux/thunk/kycThunk";
import { resetKycState } from "@/redux/slices/kycSlice";

export default function KYCPage() {
  const dispatch = useAppDispatch();
  const {
    loading,
    statusLoading,
    error,
    statusError,
    success,
    message,
    kycId,
    status,
    kycLevel,
    submittedAt,
    reviewedAt,
    reviewNotes,
  } = useAppSelector((state) => state.kyc);

  const [documentType, setDocumentType] = useState<"national_id" | "passport" | "driver_license" | string>("national_id");
  const [documentFront, setDocumentFront] = useState<File | null>(null);
  const [documentBack, setDocumentBack] = useState<File | null>(null);
  const [selfieWithId, setSelfieWithId] = useState<File | null>(null);

  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);

  const [cameraOpen, setCameraOpen] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);

  // Cleanup
  useEffect(() => {
    return () => {
      dispatch(resetKycState());
    };
  }, [dispatch]);

  // Load KYC status on mount
  useEffect(() => {
    dispatch(fetchKycStatus());
  }, [dispatch]);

  // Reset form after success
  useEffect(() => {
    if (success) {
      setDocumentType("national_id");
      setDocumentFront(null); setDocumentBack(null); setSelfieWithId(null);
      setFrontPreview(null); setBackPreview(null); setSelfiePreview(null);
      
      frontInputRef.current && (frontInputRef.current.value = "");
      backInputRef.current && (backInputRef.current.value = "");
      selfieInputRef.current && (selfieInputRef.current.value = "");
    }
  }, [success]);

  const handleFileChange = (
    setter: React.Dispatch<React.SetStateAction<File | null>>,
    previewSetter: React.Dispatch<React.SetStateAction<string | null>>
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setter(file);
    if (file) previewSetter(URL.createObjectURL(file));
    else previewSetter(null);
  };

  // Camera Functions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraOpen(true);
    } catch {
      alert("Camera access denied. Please upload a selfie instead.");
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    setCameraOpen(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], "selfie_with_id.jpg", { type: "image/jpeg" });
      setSelfieWithId(file);
      setSelfiePreview(URL.createObjectURL(file));
      stopCamera();
    }, "image/jpeg", 0.92);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentFront || !documentBack || !selfieWithId) {
      alert("Please upload all required documents and selfie.");
      return;
    }

    await dispatch(submitKyc({
      document_type: documentType,
      document_front: documentFront,
      document_back: documentBack,
      selfie_with_id: selfieWithId,
    })).unwrap();
  };

  return (
    <PageShell title="KYC Verification" description="Complete your verification to unlock full trading features.">
      <Card className="bg-[#0f0f17] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <CardContent className="p-6 sm:p-10">

        

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-semibold text-white">Level 2 – Identity Verification</h2>
                <p className="text-gray-400 mt-1">Upload your documents to increase limits</p>
              </div>
              <div className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap
                ${status === 'approved' ? 'bg-emerald-500 text-black' : 
                  status === 'pending' ? 'bg-amber-500 text-black' : 
                  'bg-red-500/10 text-red-500'}`}>
                {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Not Verified'}
              </div>
            </div>
            <div className="mb-6 text-sm text-gray-300">
              {statusLoading && <p>Fetching latest KYC status...</p>}
              {!statusLoading && statusError && <p className="text-red-400">{statusError}</p>}
              {!statusLoading && !statusError && status && (
                <p>
                  Level: <span className="text-white">{kycLevel ?? "-"}</span> · Submitted: <span className="text-white">{submittedAt ?? "-"}</span>
                  {reviewedAt && <> · Reviewed: <span className="text-white">{reviewedAt}</span></>}
                </p>
              )}
            </div>

            {/* Document Type */}
            <div className="mb-8">
              <label className="text-gray-300 text-sm mb-2 block">Document Type</label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full bg-[#16161f] border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-violet-500 transition-colors"
              >
                <option value="national_id">National ID</option>
                <option value="passport">Passport</option>
                <option value="driver_license">Driver's License</option>
              </select>
            </div>

            {/* Front & Back Uploads */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
              {/* Front Side */}
              <div className="group">
                <label className="block text-gray-300 text-sm mb-3">Front Side</label>
                <label className="border-2 border-dashed border-white/20 hover:border-violet-500/50 rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-white/5 min-h-[260px]">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Upload size={36} className="text-gray-400" />
                  </div>
                  <p className="text-white font-medium text-lg">Upload Front Side</p>
                  <p className="text-gray-500 text-sm mt-1">Clear photo of front</p>

                  <input
                    ref={frontInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange(setDocumentFront, setFrontPreview)}
                  />

                  {frontPreview && (
                    <img src={frontPreview} alt="Front" className="mt-6 w-full max-h-52 object-cover rounded-2xl border border-white/10" />
                  )}
                  {documentFront && (
                    <p className="text-xs text-emerald-400 mt-3 truncate max-w-[250px]">{documentFront.name}</p>
                  )}
                </label>
              </div>

              {/* Back Side */}
              <div className="group">
                <label className="block text-gray-300 text-sm mb-3">Back Side</label>
                <label className="border-2 border-dashed border-white/20 hover:border-violet-500/50 rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-white/5 min-h-[260px]">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Upload size={36} className="text-gray-400" />
                  </div>
                  <p className="text-white font-medium text-lg">Upload Back Side</p>
                  <p className="text-gray-500 text-sm mt-1">Clear photo of back</p>

                  <input
                    ref={backInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange(setDocumentBack, setBackPreview)}
                  />

                  {backPreview && (
                    <img src={backPreview} alt="Back" className="mt-6 w-full max-h-52 object-cover rounded-2xl border border-white/10" />
                  )}
                  {documentBack && (
                    <p className="text-xs text-emerald-400 mt-3 truncate max-w-[250px]">{documentBack.name}</p>
                  )}
                </label>
              </div>
            </div>

            {/* Selfie Section */}
            <div className="mb-10">
              <label className="block text-gray-300 text-sm mb-3">Selfie with ID</label>
              <div className="border-2 border-dashed border-white/20 rounded-3xl p-8 bg-[#0a0a0f]">
                <div className="text-center mb-6">
                  <p className="text-white text-xl font-medium">Hold your ID next to your face</p>
                  <p className="text-gray-500 text-sm mt-1">Make sure your face and document are clearly visible</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    onClick={startCamera}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 py-6 text-lg"
                  >
                    <Camera className="mr-3" /> Open Camera
                  </Button>

                  <label className="cursor-pointer">
                    <div className="bg-white/5 hover:bg-white/10 border border-white/10 py-6 text-lg rounded-2xl text-center transition-all">
                      ⬆ Upload Selfie
                    </div>
                    <input
                      ref={selfieInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange(setSelfieWithId, setSelfiePreview)}
                    />
                  </label>
                </div>

                {/* Camera View */}
                {cameraOpen && (
                  <div className="mt-6 flex flex-col items-center">
                    <div className="relative w-full max-w-md rounded-3xl overflow-hidden border border-white/10">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full aspect-video object-cover"
                      />
                      <canvas ref={canvasRef} className="hidden" />
                    </div>

                    <div className="flex gap-4 mt-6 w-full max-w-md">
                      <Button onClick={capturePhoto} className="flex-1 bg-violet-600 hover:bg-violet-700">
                        Capture Photo
                      </Button>
                      <Button onClick={stopCamera} variant="secondary" className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Selfie Preview */}
                {!cameraOpen && selfiePreview && (
                  <div className="mt-6 flex flex-col items-center">
                    <div className="relative w-full max-w-md">
                      <img 
                        src={selfiePreview} 
                        alt="Selfie" 
                        className="w-full rounded-3xl border border-white/10" 
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSelfieWithId(null);
                          setSelfiePreview(null);
                          if (selfieInputRef.current) selfieInputRef.current.value = "";
                        }}
                        className="absolute top-4 right-4 bg-black/70 hover:bg-red-500/80 text-white p-2 rounded-xl transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    {selfieWithId && <p className="text-emerald-400 text-sm mt-3">{selfieWithId.name}</p>}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={loading || !documentFront || !documentBack || !selfieWithId}
                className="px-12 py-4 text-lg font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 disabled:opacity-50"
              >
                {loading ? "Submitting for Review..." : "Submit for Verification"}
              </Button>
            </div>

            {/* Messages */}
            <div className="mt-6 text-center">
              {error && <p className="text-red-500">{error}</p>}
              {success && <p className="text-emerald-400 font-medium">{message || "KYC submitted successfully!"}</p>}
              {kycId && <p className="text-gray-400 text-sm mt-1">Reference ID: {kycId}</p>}
            </div>
          </form>

          {/* Pending Status Message */}
          {status === 'pending' && (
            <div className="mt-10 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 flex gap-4">
              <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0 text-black text-2xl">⏳</div>
              <div>
                <p className="text-amber-500 font-medium">Your documents are under review</p>
                <p className="text-gray-400 text-sm mt-1">This process usually takes 24-48 hours. We'll notify you once it's complete.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </PageShell>
  );
}