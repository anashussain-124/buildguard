"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import Navbar from "@/components/Navbar";
import RiskBadge from "@/components/RiskBadge";
import { AnalysisRecord, getAnalysis } from "@/lib/api";

const RiskGauge = ({ score }: { score: number }) => {
  const angle = (score / 100) * 180;
  const radians = (angle * Math.PI) / 180;
  const cx = 100, cy = 100, r = 80;
  const needleX = cx + r * Math.cos(Math.PI - radians);
  const needleY = cy - r * Math.sin(Math.PI - radians);

  const getColor = () => {
    if (score <= 33) return "#10B981";
    if (score <= 66) return "#F59E0B";
    return "#F43F5E";
  };

  const getLabel = () => {
    if (score <= 33) return "Low Risk";
    if (score <= 66) return "Medium Risk";
    return "High Risk";
  };

  const startAngle = Math.PI;
  const largeArc = angle > 180 ? 1 : 0;
  const arcEndX = cx + r * Math.cos(Math.PI - radians);
  const arcEndY = cy - r * Math.sin(Math.PI - radians);

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 120" className="w-64 h-32">
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke="#1E293B" strokeWidth="16" strokeLinecap="round" />
        {score > 0 && (
          <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 ${largeArc} 1 ${arcEndX} ${arcEndY}`} fill="none" stroke={getColor()} strokeWidth="16" strokeLinecap="round" className="transition-all duration-1000 ease-out" />
        )}
        <line x1={cx} y1={cy} x2={needleX} y2={needleY} stroke={getColor()} strokeWidth="3" strokeLinecap="round" className="transition-all duration-1000 ease-out" />
        <circle cx={cx} cy={cy} r="6" fill={getColor()} />
        <circle cx={cx} cy={cy} r="3" fill="#0F172A" />
        <text x={cx} y={cy + 24} textAnchor="middle" className="fill-slate-50 text-2xl font-bold" fontSize="24" fontWeight="bold">{score}</text>
        <text x={cx} y={cy + 40} textAnchor="middle" className="fill-slate-400" fontSize="12">{getLabel()}</text>
      </svg>
    </div>
  );
};

export default function AnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const [analysis, setAnalysis] = useState<AnalysisRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedClauses, setExpandedClauses] = useState<Set<number>>(new Set());

  useEffect(() => {
    const contractId = Array.isArray(params?.id) ? params.id[0] : params?.id;
    const loadAnalysis = async () => {
      if (!contractId) { setError("Missing contract ID."); setLoading(false); return; }
      try {
        const analysisData = await getAnalysis(contractId);
        setAnalysis(analysisData);
      } catch (err) {
        const message = (err as Error).message;
        if (message === "Unauthorized") { router.replace("/auth/login"); return; }
        setError(message);
      } finally { setLoading(false); }
    };
    loadAnalysis();
  }, [params, router]);

  const toggleClause = (index: number) => {
    setExpandedClauses((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-10">

        {/* ===== HEADER ===== */}
        <div className="mb-8 flex flex-col gap-4 rounded-xl border border-slate-800 bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-50">Analysis report</h1>
            <p className="mt-1 text-sm text-slate-400">Contract risk breakdown, clause insights, and recommended next steps.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:text-slate-50"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
          </div>
        </div>

        {/* ===== LOADING ===== */}
        {loading && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-surface py-24">
            <LoadingSpinner />
            <p className="mt-4 text-sm text-slate-500">Loading analysis...</p>
          </div>
        )}

        {/* ===== ERROR ===== */}
        {!loading && error && (
          <div className="rounded-xl border border-rose-800 bg-rose-950/50 p-8 text-center">
            <p className="text-sm text-rose-400">{error}</p>
            <button onClick={() => router.push("/dashboard")} className="mt-4 rounded-lg border border-rose-800 px-4 py-2 text-sm font-semibold text-rose-400 transition hover:bg-rose-950">
              Back to dashboard
            </button>
          </div>
        )}

        {/* ===== ANALYSIS CONTENT ===== */}
        {!loading && analysis && (
          <div className="space-y-6 animate-fade-in">

            {/* Language Warning */}
            {analysis.language_warning && (
              <section className="rounded-xl border border-amber-700 bg-amber-950/30 p-5">
                <div className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-amber-300">Language Warning</p>
                    <p className="mt-1 text-sm text-amber-200/80">{analysis.language_warning}</p>
                  </div>
                </div>
              </section>
            )}

            {/* ===== OVERVIEW + GAUGE ===== */}
            <section className="rounded-xl border border-slate-800 bg-surface p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-slate-50">Overview</h2>
                    <span className="rounded-full bg-elevated px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      {analysis.model_used}
                    </span>
                  </div>
                  <div className="mt-6 flex justify-center sm:justify-start">
                    <RiskGauge score={analysis.overall_risk_score ?? 0} />
                  </div>
                </div>

                {/* Export */}
                <div className="shrink-0">
                  <button
                    onClick={() => {
                      import("@react-pdf/renderer").then(async ({ pdf, Document, Page, Text, View, StyleSheet }) => {
                        const styles = StyleSheet.create({
                          page: { padding: 40, fontSize: 11, fontFamily: 'Helvetica', backgroundColor: '#0F172A', color: '#F8FAFC' },
                          header: { fontSize: 20, marginBottom: 20, fontFamily: 'Helvetica-Bold', color: '#F8FAFC' },
                          section: { marginBottom: 14 },
                          label: { fontFamily: 'Helvetica-Bold', marginBottom: 4, color: '#94A3B8' },
                          badge: { backgroundColor: '#4F46E5', color: 'white', padding: 6, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 10 },
                        });
                        const doc = (
                          <Document>
                            <Page size="A4" style={styles.page}>
                              <Text style={styles.header}>BuildGuard AI — Risk Report</Text>
                              <View style={styles.section}><Text>Contract: (see attached file)</Text><Text>Date: {new Date(analysis.created_at).toLocaleDateString()}</Text></View>
                              <View style={styles.badge}><Text>Risk Score: {analysis.overall_risk_score} ({analysis.risk_level})</Text></View>
                              <View style={styles.section}><Text style={styles.label}>Summary</Text><Text>{analysis.summary}</Text></View>
                              <View style={styles.section}><Text style={styles.label}>Overall Recommendation</Text><Text>{analysis.overall_recommendation}</Text></View>
                            </Page>
                          </Document>
                        );
                        const blob = await pdf(doc).toBlob();
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `risk_report_${analysis.contract_id.slice(0, 8)}.pdf`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }).catch(() => alert("PDF export failed. Please try again."));
                    }}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:text-slate-50"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export PDF
                  </button>
                </div>
              </div>

              {/* Stats Row */}
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Risk level", value: analysis.risk_level },
                  { label: "Model", value: analysis.model_used },
                  { label: "Generated", value: new Date(analysis.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg bg-elevated p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{s.label}</p>
                    <p className="mt-1 text-base font-semibold text-slate-100">{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="mt-6 rounded-lg border border-slate-700 bg-elevated p-5">
                <h3 className="text-base font-semibold text-slate-100">Summary</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{analysis.summary}</p>
                <div className="mt-4 rounded-lg bg-brand-950/40 border border-brand-800 p-4">
                  <p className="text-sm text-brand-200">
                    <span className="font-semibold text-brand-300">Recommended next step: </span>
                    {analysis.overall_recommendation}
                  </p>
                </div>
              </div>
            </section>

            {/* ===== RED FLAGS ===== */}
            <section className="rounded-xl border border-slate-800 bg-surface p-6 sm:p-8">
              <h2 className="text-xl font-bold text-slate-50">Red flags</h2>
              <p className="mt-1 text-sm text-slate-400">Critical issues identified in the contract text.</p>
              <div className="mt-5 space-y-3">
                {(analysis.red_flags?.length ?? 0) > 0 ? (
                  analysis.red_flags!.map((flag, i) => (
                    <div key={`${flag.title}-${i}`} className="rounded-lg border border-rose-800 bg-rose-950/20 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-semibold text-rose-300">{flag.title}</p>
                        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
                          flag.severity === "critical" ? "bg-rose-950 text-rose-400 border border-rose-800" :
                          flag.severity === "high" ? "bg-orange-950 text-orange-400 border border-orange-800" :
                          "bg-amber-950 text-amber-400 border border-amber-800"
                        }`}>{flag.severity}</span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-slate-300">{flag.description}</p>
                      <p className="mt-2 text-xs text-slate-500">Location: {flag.location}</p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg border border-dashed border-slate-700 bg-elevated p-6 text-center text-sm text-slate-500">
                    No major red flags were identified.
                  </div>
                )}
              </div>
            </section>

            {/* ===== KEY CLAUSES ACCORDION ===== */}
            <section className="rounded-xl border border-slate-800 bg-surface p-6 sm:p-8">
              <h2 className="text-xl font-bold text-slate-50">Key clauses</h2>
              <p className="mt-1 text-sm text-slate-400">Expand each clause to see extracted text, explanation, and recommendation.</p>
              <div className="mt-5 space-y-2">
                {(analysis.clauses?.length ?? 0) > 0 ? (
                  analysis.clauses!.map((clause, i) => (
                    <div key={`${clause.clause_type}-${i}`} className="rounded-lg border border-slate-700 bg-elevated overflow-hidden">
                      <button
                        onClick={() => toggleClause(i)}
                        className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-white/[0.02]"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-sm font-medium text-slate-300">{clause.clause_type}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                            clause.risk_score >= 67 ? "bg-rose-950 text-rose-400" :
                            clause.risk_score >= 34 ? "bg-amber-950 text-amber-400" :
                            "bg-emerald-950 text-emerald-400"
                          }`}>{clause.risk_score}</span>
                          <svg className={`h-4 w-4 text-slate-500 transition-transform ${expandedClauses.has(i) ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>
                      {expandedClauses.has(i) && (
                        <div className="border-t border-slate-700 px-5 py-4 animate-fade-in">
                          <div className="rounded-lg bg-slate-900 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Extracted text</p>
                            <p className="whitespace-pre-wrap text-sm text-slate-300">{clause.extracted_text}</p>
                          </div>
                          <div className="mt-3 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-lg bg-slate-900 p-4">
                              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Why it matters</p>
                              <p className="text-sm text-slate-300">{clause.explanation}</p>
                            </div>
                            <div className="rounded-lg bg-slate-900 p-4">
                              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Recommendation</p>
                              <p className="text-sm text-slate-300">{clause.recommendation}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg border border-dashed border-slate-700 bg-elevated p-6 text-center text-sm text-slate-500">
                    No clause-level analysis was returned for this document.
                  </div>
                )}
              </div>
            </section>

            {/* ===== RECOMMENDATIONS ===== */}
            {(analysis.recommendations?.length ?? 0) > 0 && (
              <section className="rounded-xl border border-slate-800 bg-surface p-6 sm:p-8">
                <h2 className="text-xl font-bold text-slate-50">Recommendations</h2>
                <p className="mt-1 text-sm text-slate-400">Actions to take based on this analysis.</p>
                <div className="mt-5 space-y-2">
                  {analysis.recommendations!.map((item, i) => (
                    <div key={`rec-${i}`} className="flex items-start gap-3 rounded-lg border border-brand-800 bg-brand-950/20 p-4">
                      <svg className="mt-0.5 h-5 w-5 shrink-0 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm text-brand-200">{item}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ===== MISSING PROTECTIONS ===== */}
            <section className="rounded-xl border border-slate-800 bg-surface p-6 sm:p-8">
              <h2 className="text-xl font-bold text-slate-50">Missing protections</h2>
              <p className="mt-1 text-sm text-slate-400">Standard clauses that were not found in this contract.</p>
              <div className="mt-5 space-y-2">
                {(analysis.missing_protections?.length ?? 0) > 0 ? (
                  analysis.missing_protections!.map((item, i) => (
                    <div key={`mp-${i}`} className="flex items-start gap-3 rounded-lg border border-amber-800 bg-amber-950/20 p-4">
                      <svg className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <p className="text-sm text-amber-200">{item}</p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg border border-dashed border-slate-700 bg-elevated p-6 text-center text-sm text-slate-500">
                    No missing protections were identified.
                  </div>
                )}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
