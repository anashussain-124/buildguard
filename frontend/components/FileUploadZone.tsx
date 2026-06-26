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
      className={`block cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition ${
        dragActive
          ? "border-indigo-500 bg-indigo-950/50"
          : "border-slate-700 bg-slate-900 hover:border-indigo-600 hover:bg-slate-800"
      }`}
      onDragOver={(event) => {
        event.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        setDragActive(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        setDragActive(false);
        handleFiles(event.dataTransfer.files);
      }}
    >
      <div className="flex flex-col items-center gap-3">
        <svg className="h-10 w-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p className="text-lg font-semibold text-slate-200">Drag and drop a file here</p>
        <p className="text-sm text-slate-400">PDF or DOCX only. Max 10MB.</p>
        <span className="mt-2 inline-flex rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700">
          Choose file
        </span>
      </div>
      <input
        id={inputId}
        type="file"
        accept={acceptedTypes}
        className="sr-only"
        onChange={(event) => handleFiles(event.target.files)}
      />
    </label>
  );
}
