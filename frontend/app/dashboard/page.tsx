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
  const [search, setSearch] = useState("");

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

  const filtered = contracts.filter((c) =>
    c.file_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* ===== PAGE HEADER + CREDITS ===== */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-50">Dashboard</h1>
            <p className="mt-1.5 text-slate-400">Track completed reviews, upload status, and remaining credits.</p>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-brand-600 px-5 py-3 text-white shadow-lg shadow-brand-600/20 shrink-0">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-200">Credits remaining</p>
              <p className="text-2xl font-bold">{credits}</p>
            </div>
          </div>
        </div>

        {/* ===== STATS ROW ===== */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Total analyses", value: totalContracts, color: "text-slate-50" },
            { label: "Completed", value: completedContracts, color: "text-emerald-400" },
            { label: "High risk", value: highRisk, color: "text-rose-400" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-slate-800 bg-surface p-5 transition hover:border-slate-700 hover:shadow-md"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{stat.label}</p>
              <p className={`mt-1 text-3xl font-extrabold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* ===== ACTIONS BAR ===== */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 flex-1">
            <h2 className="text-lg font-semibold text-slate-50 shrink-0">Recent analyses</h2>
            <div className="relative flex-1 max-w-xs">
              <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search contracts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-700 bg-elevated pl-10 pr-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRevokeAll}
              disabled={revoking}
              className="rounded-lg border border-rose-800 px-4 py-2 text-sm font-semibold text-rose-400 transition hover:bg-rose-950 hover:border-rose-700 disabled:opacity-50"
            >
              {revoking ? "Signing out..." : "Sign out all devices"}
            </button>
            <Link
              href="/upload"
              className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Upload New Contract
            </Link>
          </div>
        </div>

        {/* ===== LOADING ===== */}
        {loading && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-surface py-20">
            <LoadingSpinner />
            <p className="mt-4 text-sm text-slate-500">Loading contracts...</p>
          </div>
        )}

        {/* ===== ERROR ===== */}
        {!loading && error && (
          <div className="rounded-xl border border-rose-800 bg-rose-950/50 p-6 text-center">
            <p className="text-sm text-rose-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg border border-rose-800 px-4 py-2 text-sm font-semibold text-rose-400 transition hover:bg-rose-950"
            >
              Retry
            </button>
          </div>
        )}

        {/* ===== EMPTY ===== */}
        {!loading && !error && contracts.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-700 bg-surface py-16 text-center">
            <svg className="mx-auto h-12 w-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-4 text-lg font-semibold text-slate-300">No contracts yet</h3>
            <p className="mt-1 text-sm text-slate-500">Upload a contract to generate your first risk report.</p>
            <Link
              href="/upload"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Upload contract
            </Link>
          </div>
        )}

        {/* ===== CONTRACT TABLE ===== */}
        {!loading && !error && filtered.length > 0 && (
          <div className="rounded-xl border border-slate-800 bg-surface overflow-hidden">
            {/* Header (desktop only) */}
            <div className="hidden border-b border-slate-800 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:grid sm:grid-cols-12 sm:gap-4">
              <div className="col-span-4">File</div>
              <div className="col-span-2">Size</div>
              <div className="col-span-3">Date</div>
              <div className="col-span-2">Risk</div>
              <div className="col-span-1" />
            </div>

            {filtered.map((contract) => {
              const hasAnalysis = typeof contract.overall_risk_score === "number";
              return (
                <div
                  key={contract.id}
                  className="flex flex-col gap-3 border-b border-slate-800 px-6 py-4 last:border-b-0 transition hover:bg-brand-600/[0.015] sm:grid sm:grid-cols-12 sm:gap-4 sm:items-center"
                >
                  <div className="col-span-4">
                    <p className="text-sm font-semibold text-slate-100 truncate">{contract.file_name}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {contract.page_count} {contract.page_count === 1 ? "page" : "pages"} &middot; {formatStatusLabel(contract.status)}
                    </p>
                  </div>
                  <div className="text-sm text-slate-400">{formatFileSize(contract.file_size)}</div>
                  <div className="text-sm text-slate-400">
                    {new Date(contract.upload_time).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                    })}
                  </div>
                  <div>
                    {hasAnalysis ? (
                      <RiskBadge score={contract.overall_risk_score ?? 0} />
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-elevated px-3 py-1 text-xs font-semibold text-slate-400">
                        {formatStatusLabel(contract.status)}
                      </span>
                    )}
                  </div>
                  <div className="justify-self-end">
                    <Link
                      href={hasAnalysis ? `/analysis/${contract.id}` : "/upload"}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-brand-600 hover:text-brand-400"
                    >
                      {hasAnalysis ? "View report" : "Continue"}
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ===== SEARCH NO RESULTS ===== */}
        {!loading && !error && contracts.length > 0 && filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-700 bg-surface py-12 text-center">
            <p className="text-sm text-slate-500">No contracts match &ldquo;{search}&rdquo;</p>
          </div>
        )}

        {!loading && !error && contracts.length > 0 && (
          <p className="mt-4 text-center text-xs text-slate-600">
            Showing {filtered.length} of {contracts.length} contracts
          </p>
        )}
      </main>
    </div>
  );
}
