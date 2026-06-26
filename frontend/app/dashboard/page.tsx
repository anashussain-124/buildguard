"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import Navbar from "@/components/Navbar";
import RiskBadge from "@/components/RiskBadge";
import { ContractListItem, getContracts, getProfile, revokeAllSessions } from "@/lib/api";

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatStatusLabel = (status: string) => status.charAt(0).toUpperCase() + status.slice(1);

export default function DashboardPage() {
  const router = useRouter();
  const [contracts, setContracts] = useState<ContractListItem[]>([]);
  const [credits, setCredits] = useState<number>(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState(false);

  const handleRevokeAll = async () => {
    if (!confirm("Sign out all devices? This will log you out everywhere.")) return;
    setRevoking(true);
    try {
      await revokeAllSessions();
      document.cookie = "__Host-bgai_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "__Host-bgai_refresh=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "__Host-csrf=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      router.replace("/auth/login");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setRevoking(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [profile, contractResponse] = await Promise.all([getProfile(), getContracts()]);
        setCredits(profile.credits_remaining);
        setContracts(contractResponse.items);
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

    load();
  }, [router]);

  const totalContracts = contracts.length;
  const completedContracts = contracts.filter((c) => c.status === "completed").length;
  const highRisk = contracts.filter(
    (c) => typeof c.overall_risk_score === "number" && c.overall_risk_score >= 67
  ).length;

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Header + Credits */}
        <div className="mb-8 flex flex-col gap-4 rounded-lg bg-slate-900 p-8 shadow-lg shadow-slate-950/50 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-50">Dashboard</h1>
            <p className="mt-2 text-slate-400">Track completed contract reviews, upload status, and remaining credits.</p>
          </div>
          <div className="rounded-lg bg-indigo-600 px-6 py-4 text-white shadow-lg">
            <p className="text-sm uppercase tracking-[0.24em] text-indigo-200">Credits remaining</p>
            <p className="mt-1 text-3xl font-semibold">{credits}</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mb-8 grid gap-6 sm:grid-cols-3">
          <div className="rounded-lg bg-slate-900 p-6 shadow-lg shadow-slate-950/50">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Total analyses</p>
            <p className="mt-2 text-3xl font-semibold text-slate-50">{totalContracts}</p>
          </div>
          <div className="rounded-lg bg-slate-900 p-6 shadow-lg shadow-slate-950/50">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Completed</p>
            <p className="mt-2 text-3xl font-semibold text-emerald-400">{completedContracts}</p>
          </div>
          <div className="rounded-lg bg-slate-900 p-6 shadow-lg shadow-slate-950/50">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">High risk</p>
            <p className="mt-2 text-3xl font-semibold text-rose-400">{highRisk}</p>
          </div>
        </div>

        {/* Actions Row */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-slate-50">Recent analyses</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRevokeAll}
              disabled={revoking}
              className="rounded-lg border border-rose-600 px-4 py-2 text-sm font-semibold text-rose-400 transition hover:bg-rose-950 disabled:opacity-50"
            >
              {revoking ? "Signing out..." : "Sign out all devices"}
            </button>
            <Link
              href="/upload"
              className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Upload New Contract
            </Link>
          </div>
        </div>

        {loading && (
          <div className="rounded-lg bg-slate-900 p-12 shadow-lg shadow-slate-950/50">
            <LoadingSpinner />
          </div>
        )}

        {!loading && error && (
          <div className="rounded-lg bg-rose-950 p-8 text-rose-400 shadow-lg shadow-slate-950/50">
            {error}
          </div>
        )}

        {!loading && !error && contracts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-700 bg-slate-900 p-12 text-center text-slate-400">
            <p className="text-lg font-semibold text-slate-300">No contracts yet.</p>
            <p className="mt-2">Upload a contract to generate your first risk report.</p>
            <Link
              href="/upload"
              className="mt-4 inline-block rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Upload contract
            </Link>
          </div>
        ) : null}

        {!loading && !error && contracts.length > 0 ? (
          <div className="rounded-lg border border-slate-700 bg-slate-900 shadow-lg shadow-slate-950/50">
            {/* Table Header */}
            <div className="hidden border-b border-slate-700 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 sm:grid sm:grid-cols-12 sm:gap-4">
              <div className="col-span-4">File</div>
              <div className="col-span-2">Size</div>
              <div className="col-span-3">Date</div>
              <div className="col-span-2">Risk</div>
              <div className="col-span-1"></div>
            </div>
            {contracts.map((contract) => {
              const hasAnalysis = typeof contract.overall_risk_score === "number";

              return (
                <div
                  key={contract.id}
                  className="flex flex-col gap-4 border-b border-slate-800 px-6 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="sm:col-span-4">
                    <p className="text-sm font-semibold text-slate-50">{contract.file_name}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {contract.page_count} {contract.page_count === 1 ? "page" : "pages"}
                    </p>
                  </div>
                  <div className="text-sm text-slate-400">
                    {formatFileSize(contract.file_size)}
                  </div>
                  <div className="text-sm text-slate-400">
                    {new Date(contract.upload_time).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-3">
                    {hasAnalysis ? (
                      <RiskBadge score={contract.overall_risk_score ?? 0} />
                    ) : (
                      <span className="inline-flex rounded-lg bg-slate-800 px-3 py-1 text-sm font-semibold text-slate-300">
                        {formatStatusLabel(contract.status)}
                      </span>
                    )}
                  </div>
                  <div>
                    <Link
                      href={hasAnalysis ? `/analysis/${contract.id}` : "/upload"}
                      className="rounded-lg border border-slate-700 px-5 py-2 text-sm font-semibold text-slate-300 transition hover:border-indigo-600 hover:text-indigo-400"
                    >
                      {hasAnalysis ? "View report" : "Continue"}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </main>
    </div>
  );
}
