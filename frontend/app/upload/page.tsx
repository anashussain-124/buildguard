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
  { label: "Upload", icon: "1" },
  { label: "Extract", icon: "2" },
  { label: "Analyze", icon: "3" },
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
      <main className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-lg bg-slate-900 p-10 shadow-lg shadow-slate-950/50">
          <h1 className="text-3xl font-semibold text-slate-50">Upload contract</h1>
          <p className="mt-3 text-slate-400">
            Upload a PDF or DOCX contract and get a structured risk review with next-step guidance.
          </p>

          {/* 3-Step Stepper */}
          <div className="mt-8 flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.label} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition ${
                      activeStep > index
                        ? "bg-emerald-500 text-white"
                        : activeStep === index && loading
                        ? "bg-indigo-600 text-white animate-pulse"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {activeStep > index ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      step.icon
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs font-semibold ${
                      activeStep >= index ? "text-slate-50" : "text-slate-500"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`mx-2 h-0.5 flex-1 rounded ${
                      activeStep > index ? "bg-emerald-500" : "bg-slate-700"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
            <div>
              <p className="mb-3 text-sm font-semibold text-slate-300">Contract file</p>
              <FileUploadZone
                acceptedTypes={ACCEPTED_TYPES.join(",")}
                onFileSelected={handleFileSelected}
              />
            </div>

            {selectedFile && (
              <div className="flex items-center gap-3 rounded-lg border border-indigo-700 bg-indigo-950/50 p-4 text-sm text-indigo-300">
                <svg className="h-5 w-5 shrink-0 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="font-semibold">{selectedFile.name}</span>
                <span className="text-indigo-400">
                  ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                </span>
              </div>
            )}

            {error && <p className="rounded-lg bg-rose-950 p-3 text-sm text-rose-400">{error}</p>}
            {statusMessage && <p className="text-sm text-indigo-400">{statusMessage}</p>}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <LoadingSpinner sizeClassName="h-5 w-5" />
                  <span>Processing...</span>
                </>
              ) : (
                "Upload and analyze"
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
