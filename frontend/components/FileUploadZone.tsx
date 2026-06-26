"use client";

import { useId, useState } from "react";

type FileUploadZoneProps = {
  onFileSelected: (file: File) => void;
  acceptedTypes: string;
};

export default function FileUploadZone({ onFileSelected, acceptedTypes }: FileUploadZoneProps) {
  const inputId = useId();
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return;
    onFileSelected(files[0]);
  };

  return (
    <label
      htmlFor={inputId}
      className={`relative block cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition-all duration-200 ${
        dragActive
          ? "border-brand-400 bg-brand-600/10 scale-[1.01]"
          : "border-slate-700 bg-elevated hover:border-brand-600/50 hover:bg-surface"
      }`}
      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
      onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
      onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFiles(e.dataTransfer.files); }}
    >
      <div className="flex flex-col items-center gap-3">
        {/* Upload icon */}
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
          dragActive ? "bg-brand-600/20 text-brand-400" : "bg-elevated text-slate-500"
        }`}>
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <p className={`text-base font-semibold ${dragActive ? "text-brand-300" : "text-slate-200"}`}>
          {dragActive ? "Drop your file here" : "Drag and drop a file here"}
        </p>
        <p className="text-sm text-slate-500">PDF or DOCX only. Max 10MB.</p>
        <span className="mt-1 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 shadow-sm">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Choose file
        </span>
      </div>
      <input
        id={inputId}
        type="file"
        accept={acceptedTypes}
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </label>
  );
}
