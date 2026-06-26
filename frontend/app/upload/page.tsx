"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import FileUploadZone from "@/components/FileUploadZone";
import LoadingSpinner from "@/components/LoadingSpinner";
import Navbar from "@/components/Navbar";
import { analyzeContract, uploadContract } from "@/lib/api";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const ACCEPTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const getFileValidationError = (file: File) => {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return "Only PDF and DOCX files are supported.";
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return "The selected file is larger than 10MB.";
  }
  return "";
};

const steps = [
  { label: "Upload", desc: "Select your file" },
  { label: "Extract", desc: "Reading clauses" },
  { label: "Analyze", desc: "Generating report" },
];

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const router = useRouter();

  const handleFileSelected = (file: File) => {
    const validationError = getFileValidationError(file);
    if (validationError) {
      setSelectedFile(null);
      setError(validationError);
      return;
    }
    setSelectedFile(file);
    setError("");
    setActiveStep(1);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) {
      setError("Please choose a PDF or DOCX file to upload.");
      return;
    }
    const validationError = getFileValidationError(selectedFile);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setStatusMessage("");
    setLoading(true);
    try {
      setStatusMessage("Uploading contract...");
      setActiveStep(2);
      const uploadResponse = await uploadContract(selectedFile);
      setStatusMessage("Extracting clauses...");
      setActiveStep(3);
      await analyzeContract(uploadResponse.contract_id);
      router.push(`/analysis/${uploadResponse.contract_id}`);
    } catch (err) {
      const message = (err as Error).message;
      if (message === "Unauthorized") {
        router.replace("/auth/login");
        return;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="mx-auto max-w-2xl px-6 py-12">

        <div className="rounded-xl border border-slate-800 bg-surface p-8 shadow-lg shadow-slate-950/40">
          {/* Heading */}
          <h1 className="text-2xl font-bold text-slate-50">Upload contract</h1>
          <p className="mt-1.5 text-sm text-slate-400">
            Upload a PDF or DOCX. We'll extract language and generate a structured risk report.
          </p>

          {/* ===== STEPPER ===== */}
          <div className="mt-8 flex items-start justify-between">
            {steps.map((step, i) => (
              <div key={step.label} className="flex flex-1 flex-col items-center">
                <div className="relative flex items-center justify-center">
                  {/* Circle */}
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${
                      activeStep > i + 1
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                        : activeStep === i + 1
                        ? "bg-brand-600 text-white shadow-lg shadow-brand-600/25 animate-pulse-ring"
                        : "bg-elevated text-slate-500"
                    }`}
                  >
                    {activeStep > i + 1 ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  {/* Connector line */}
                  {i < steps.length - 1 && (
                    <div
                      className={`absolute left-[calc(50%+28px)] top-1/2 h-0.5 w-[calc(100%-56px)] rounded ${
                        activeStep > i + 1 ? "bg-emerald-500" : "bg-slate-700"
                      }`}
                    />
                  )}
                </div>
                <p
                  className={`mt-2.5 text-xs font-semibold ${
                    activeStep >= i + 1 ? "text-slate-100" : "text-slate-500"
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-[11px] text-slate-600">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* ===== UPLOAD FORM ===== */}
          <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
            <div>
              <p className="mb-2 text-sm font-semibold text-slate-300">Contract file</p>
              <FileUploadZone
                acceptedTypes={ACCEPTED_TYPES.join(",")}
                onFileSelected={handleFileSelected}
              />
              <p className="mt-2 text-xs text-slate-500">PDF or DOCX, up to 10 MB</p>
            </div>

            {/* Selected file card */}
            {selectedFile && (
              <div className="flex items-center gap-3 rounded-lg border border-brand-800 bg-brand-950/40 p-4 transition animate-fade-in">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-600/20">
                  <svg className="h-5 w-5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-brand-200">{selectedFile.name}</p>
                  <p className="text-xs text-brand-400">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                {!loading && (
                  <button
                    type="button"
                    onClick={() => { setSelectedFile(null); setActiveStep(0); setError(""); }}
                    className="shrink-0 rounded-lg p-1.5 text-slate-500 hover:bg-elevated hover:text-slate-300 transition"
                    aria-label="Remove file"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="rounded-lg border border-rose-800 bg-rose-950/50 p-3 text-sm text-rose-400 animate-fade-in">
                {error}
              </div>
            )}

            {/* Status message */}
            {statusMessage && (
              <div className="flex items-center gap-2 rounded-lg border border-brand-800 bg-brand-950/40 p-3 text-sm text-brand-300 animate-fade-in">
                <LoadingSpinner sizeClassName="h-4 w-4" />
                {statusMessage}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-brand-600/20"
            >
              {loading ? (
                <>
                  <LoadingSpinner sizeClassName="h-4 w-4" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Upload and analyze
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
