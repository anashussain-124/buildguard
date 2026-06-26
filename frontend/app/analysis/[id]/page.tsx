"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import Navbar from "@/components/Navbar";
import RiskBadge from "@/components/RiskBadge";
import { AnalysisRecord, getAnalysis } from "@/lib/api";

const RiskGauge = ({ score }: { score: number }) => {
  // Score 0-100, maps to 0-180 degrees
  const angle = (score / 100) * 180;
  const radians = (angle * Math.PI) / 180;
  const cx = 100;
  const cy = 100;
  const r = 80;
  const needleX = cx + r * Math.cos(Math.PI - radians);
  const needleY = cy - r * Math.sin(Math.PI - radians);

  const getColor = () => {
    if (score <= 33) return "#10B981"; // emerald-500
    if (score <= 66) return "#F59E0B"; // amber-500
    return "#F43F5E"; // rose-500
  };

  const getLabel = () => {
    if (score <= 33) return "Low Risk";
    if (score <= 66) return "Medium Risk";
    return "High Risk";
  };

  // Arc path for the gauge background
  const startAngle = Math.PI;
  const endAngle = 0;
  const largeArc = angle > 180 ? 1 : 0;

  const arcStartX = cx + r * Math.cos(startAngle);
  const arcStartY = cy - r * Math.sin(startAngle);
  const arcEndX = cx + r * Math.cos(Math.PI - radians);
  const arcEndY = cy - r * Math.sin(Math.PI - radians);

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 120" className="w-64 h-32">
        {/* Background arc */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke="#1E293B"
          strokeWidth="16"
          strokeLinecap="round"
        />
        {/* Colored arc */}
        {score > 0 && (
          <path
            d={`M ${arcStartX} ${arcStartY} A ${r} ${r} 0 ${largeArc} 1 ${arcEndX} ${arcEndY}`}
            fill="none"
            stroke={getColor()}
            strokeWidth="16"
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        )}
        {/* Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={needleX}
          y2={needleY}
          stroke={getColor()}
          strokeWidth="3"
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
        <circle cx={cx} cy={cy} r="6" fill={getColor()} />
        <circle cx={cx} cy={cy} r="3" fill="#0F172A" />
        {/* Score text */}
        <text
          x={cx}
          y={cy + 24}
          textAnchor="middle"
          className="fill-slate-50 text-2xl font-bold"
          fontSize="24"
          fontWeight="bold"
        >
          {score}
        </text>
        <text
          x={cx}
          y={cy + 40}
          textAnchor="middle"
          className="fill-slate-400"
          fontSize="12"
        >
          {getLabel()}
        </text>
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
      if (!contractId) {
        setError("Missing contract ID.");
        setLoading(false);
        return;
      }

      try {
        const analysisData = await getAnalysis(contractId);
        setAnalysis(analysisData);
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

    loadAnalysis();
  }, [params, router]);

  const toggleClause = (index: number) => {
    setExpandedClauses((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 rounded-lg bg-slate-900 p-8 shadow-lg shadow-slate-950/50 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-50">Analysis report</h1>
            <p className="mt-2 text-slate-400">
              Review the contract summary, key clauses, missing protections, and recommended next step.
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="rounded-lg border border-slate-700 px-5 py-2 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-slate-50"
          >
            Back to dashboard
          </button>
        </div>

        {loading && (
          <div className="rounded-lg bg-slate-900 p-10 shadow-lg shadow-slate-950/50">
            <LoadingSpinner />
          </div>
        )}

        {!loading && error && (
          <div className="rounded-lg bg-rose-950 p-10 text-rose-400 shadow-lg shadow-slate-950/50">
            {error}
          </div>
        )}

        {!loading && analysis && (
          <div className="space-y-8">
            {/* Language Warning Banner */}
            {analysis.language_warning && (
              <section className="rounded-lg border border-amber-700 bg-amber-900/20 p-5 text-amber-300">
                <div className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <p className="font-semibold">Language Warning</p>
                    <p className="mt-1 text-sm text-amber-200">{analysis.language_warning}</p>
                  </div>
                </div>
              </section>
            )}

            {/* Export PDF Button */}
            <div className="flex justify-end">
              <button
                onClick={() => {
                  import("@react-pdf/renderer").then(async ({ pdf, Document, Page, Text, View, StyleSheet, Font }) => {
                    const styles = StyleSheet.create({
                      page: { padding: 40, fontSize: 11, fontFamily: 'Helvetica', backgroundColor: '#0F172A', color: '#F8FAFC' },
                      header: { fontSize: 20, marginBottom: 20, fontFamily: 'Helvetica-Bold', color: '#F8FAFC' },
                      section: { marginBottom: 14 },
                      label: { fontFamily: 'Helvetica-Bold', marginBottom: 4, color: '#94A3B8' },
                      row: { flexDirection: 'row', marginBottom: 4 },
                      badge: { backgroundColor: '#4F46E5', color: 'white', padding: 6, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 10 },
                    });

                    const doc = (
                      <Document>
                        <Page size="A4" style={styles.page}>
                          <Text style={styles.header}>BuildGuard AI — Risk Report</Text>
                          <View style={styles.section}>
                            <Text>Contract: (see attached file)</Text>
                            <Text>Date: {new Date(analysis.created_at).toLocaleDateString()}</Text>
                          </View>
                          <View style={styles.badge}>
                            <Text>Risk Score: {analysis.overall_risk_score} ({analysis.risk_level})</Text>
                          </View>
                          <View style={styles.section}>
                            <Text style={styles.label}>Summary</Text>
                            <Text>{analysis.summary}</Text>
                          </View>
                          <View style={styles.section}>
                            <Text style={styles.label}>Overall Recommendation</Text>
                            <Text>{analysis.overall_recommendation}</Text>
                          </View>
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
                  }).catch(() => {
                    alert("PDF export failed. Please try again.");
                  });
                }}
                className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Export PDF
              </button>
            </div>

            {/* Overview Section with Risk Gauge */}
            <section className="rounded-lg bg-slate-900 p-10 shadow-lg shadow-slate-950/50">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-semibold text-slate-50">Overview</h2>
                    <span className="rounded-lg bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">
                      {analysis.model_used}
                    </span>
                  </div>
                  <p className="mt-2 text-slate-400">Risk score, recommendation, and analysis metadata.</p>
                </div>
                <div className="flex items-center gap-4">
                  <RiskBadge score={analysis.overall_risk_score ?? 0} />
                </div>
              </div>

              {/* Risk Gauge */}
              <div className="mt-8 flex justify-center">
                <RiskGauge score={analysis.overall_risk_score ?? 0} />
              </div>

              {/* Stats Row */}
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-slate-800 p-6">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Risk level</p>
                  <p className="mt-2 text-xl font-semibold text-slate-50">{analysis.risk_level}</p>
                </div>
                <div className="rounded-lg bg-slate-800 p-6">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Model</p>
                  <p className="mt-2 text-xl font-semibold text-slate-50">{analysis.model_used}</p>
                </div>
                <div className="rounded-lg bg-slate-800 p-6">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Generated</p>
                  <p className="mt-2 text-xl font-semibold text-slate-50">
                    {new Date(analysis.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Summary Card */}
              <div className="mt-6 rounded-lg bg-slate-800 p-6">
                <h3 className="text-lg font-semibold text-slate-50">Summary</h3>
                <p className="mt-3 leading-7 text-slate-300">{analysis.summary}</p>
                <p className="mt-5 rounded-lg bg-indigo-900/20 p-4 text-sm leading-6 text-indigo-200">
                  Recommended next step: <span className="font-semibold text-indigo-300">{analysis.overall_recommendation}</span>
                </p>
              </div>
            </section>

            {/* Red Flags */}
            <section className="rounded-lg bg-slate-900 p-10 shadow-lg shadow-slate-950/50">
              <h2 className="text-2xl font-semibold text-slate-50">Red flags</h2>
              <div className="mt-6 space-y-4">
                {(analysis.red_flags?.length ?? 0) > 0 ? (
                  (analysis.red_flags ?? []).map((flag, index) => (
                    <div
                      key={`${flag.title}-${index}`}
                      className="rounded-lg border border-rose-700 bg-rose-900/20 p-6"
                    >
                      <p className="text-sm font-semibold text-rose-300">{flag.title}</p>
                      <p className="mt-2 text-slate-300">{flag.description}</p>
                      <p className="mt-2 text-sm text-slate-400">
                        Severity: <span className="text-rose-400">{flag.severity}</span> | Location: {flag.location}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg border border-slate-700 bg-slate-800 p-6 text-slate-400">
                    No major red flags were identified in the uploaded document.
                  </div>
                )}
              </div>
            </section>

            {/* Key Clauses Accordion */}
            <section className="rounded-lg bg-slate-900 p-10 shadow-lg shadow-slate-950/50">
              <h2 className="text-2xl font-semibold text-slate-50">Key clauses</h2>
              <div className="mt-6 space-y-4">
                {(analysis.clauses?.length ?? 0) > 0 ? (
                  (analysis.clauses ?? []).map((clause, index) => (
                    <div
                      key={`${clause.clause_type}-${index}`}
                      className="rounded-lg border border-slate-700 bg-slate-800"
                    >
                      <button
                        className="flex w-full items-center justify-between p-6 text-left"
                        onClick={() => toggleClause(index)}
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-sm uppercase tracking-[0.24em] text-slate-400">
                            {clause.clause_type}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="inline-flex rounded-lg bg-slate-700 px-3 py-1 text-sm font-semibold text-slate-200">
                            Risk: {clause.risk_score}
                          </span>
                          <svg
                            className={`h-5 w-5 text-slate-400 transition-transform ${
                              expandedClauses.has(index) ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>
                      {expandedClauses.has(index) && (
                        <div className="border-t border-slate-700 p-6">
                          <p className="whitespace-pre-wrap text-slate-300">{clause.extracted_text}</p>
                          <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-lg bg-slate-900 p-4">
                              <p className="text-sm font-semibold text-slate-200">Why it matters</p>
                              <p className="mt-2 text-sm leading-6 text-slate-400">{clause.explanation}</p>
                            </div>
                            <div className="rounded-lg bg-slate-900 p-4">
                              <p className="text-sm font-semibold text-slate-200">Recommendation</p>
                              <p className="mt-2 text-sm leading-6 text-slate-400">{clause.recommendation}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg border border-slate-700 bg-slate-800 p-6 text-slate-400">
                    No clause-level analysis was returned for this document.
                  </div>
                )}
              </div>
            </section>

            {/* Recommendations */}
            <section className="rounded-lg bg-slate-900 p-10 shadow-lg shadow-slate-950/50">
              <h2 className="text-2xl font-semibold text-slate-50">Recommendations</h2>
              <div className="mt-6 space-y-3">
                {(analysis.recommendations ?? []).map((item, index) => (
                  <div key={`${item}-${index}`} className="flex gap-3 rounded-lg bg-indigo-900/20 p-4">
                    <svg className="mt-0.5 h-5 w-5 shrink-0 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-indigo-200">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Missing Protections */}
            <section className="rounded-lg bg-slate-900 p-10 shadow-lg shadow-slate-950/50">
              <h2 className="text-2xl font-semibold text-slate-50">Missing protections</h2>
              <div className="mt-6 space-y-3">
                {(analysis.missing_protections?.length ?? 0) > 0 ? (
                  (analysis.missing_protections ?? []).map((item, index) => (
                    <div key={`${item}-${index}`} className="flex gap-3 rounded-lg bg-amber-900/20 p-4">
                      <svg className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <p className="text-sm text-amber-200">{item}</p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg bg-slate-800 p-4 text-slate-400">
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
