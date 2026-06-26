"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";

const features = [
  {
    title: "Clause-by-clause review",
    description: "Extract risk-heavy sections, surface issue severity, and keep the wording visible next to each recommendation.",
    icon: (
      <svg className="h-7 w-7 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: "Missing protection checks",
    description: "Flag absent terms like liability caps, termination rights, and dispute language before contracts move forward.",
    icon: (
      <svg className="h-7 w-7 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
  },
  {
    title: "Fast team handoff",
    description: "Give project managers and legal reviewers a clean summary with recommended action instead of a raw AI dump.",
    icon: (
      <svg className="h-7 w-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "Multi-format support",
    description: "Upload PDF or DOCX contracts. The backend extracts text and preserves structure for accurate analysis.",
    icon: (
      <svg className="h-7 w-7 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Secure & private",
    description: "Contracts are encrypted in transit and at rest. Analysis is ephemeral — no data reused for training.",
    icon: (
      <svg className="h-7 w-7 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  {
    title: "AI-powered analysis",
    description: "Powered by Llama 3.3 70B. Extracts clauses, detects missing protections, and generates action recommendations.",
    icon: (
      <svg className="h-7 w-7 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
];

const steps = [
  { step: "01", title: "Upload your contract", body: "Drag and drop a PDF or DOCX. Files are encrypted on upload." },
  { step: "02", title: "AI risk analysis", body: "Our backend extracts language, flags risky clauses, and identifies missing protections." },
  { step: "03", title: "Get your report", body: "A structured report with red flags, clause breakdown, and recommended next steps." },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "month",
    desc: "Try BuildGuard risk-free.",
    features: ["3 analyses per month", "PDF & DOCX support", "Risk scoring", "Basic clause extraction"],
    cta: "Get started",
    href: "/auth/register",
    featured: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "month",
    desc: "For legal teams and PMs who need full coverage.",
    features: ["Unlimited analyses", "Priority processing", "Full clause breakdown", "Missing protection checks", "Exportable reports"],
    cta: "Start free trial",
    href: "/auth/register",
    featured: true,
  },
  {
    name: "Team",
    price: "$99",
    period: "month",
    desc: "For teams managing high-volume contract review.",
    features: ["Everything in Pro", "5 team seats", "API access", "Shared workspace", "Dedicated support"],
    cta: "Contact sales",
    href: "/auth/register",
    featured: false,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main>
        {/* ===== HERO ===== */}
        <section className="relative overflow-hidden border-b border-slate-800">
          {/* Background glow */}
          <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-brand-600/10 blur-[120px]" />
          <div className="container-page relative py-24 lg:py-32">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-surface px-4 py-1.5 text-xs font-medium text-slate-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                AI-powered contract risk analysis
              </div>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-50 sm:text-5xl lg:text-6xl">
                Contract risk analysis for{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-600">
                  construction teams
                </span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-slate-400 sm:text-xl max-w-2xl mx-auto">
                Upload a contract, extract the important language, and get a structured risk report with red flags, clause insights, and recommended next steps — in minutes, not days.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link
                  href="/upload"
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700 hover:shadow-brand-600/35"
                >
                  Upload &amp; analyze
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="/analysis/demo"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-surface px-7 py-3.5 text-sm font-semibold text-slate-300 transition hover:border-slate-600 hover:text-slate-50"
                >
                  View sample report
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ===== WHAT YOU GET ===== */}
        <section className="container-page py-20 lg:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-slate-50 sm:text-4xl">What BuildGuard does</h2>
            <p className="mt-4 text-lg text-slate-400">
              Upload any construction contract. Get a clear, structured risk report — no legal degree required.
            </p>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-xl border border-slate-800 bg-surface p-6 transition hover:border-slate-700 hover:shadow-lg"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-elevated group-hover:bg-brand-600/10 transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-base font-semibold text-slate-100">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section className="border-y border-slate-800 bg-surface/50">
          <div className="container-page py-20 lg:py-28">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold text-slate-50 sm:text-4xl">Three steps to clarity</h2>
              <p className="mt-4 text-lg text-slate-400">
                From upload to actionable report in under a minute.
              </p>
            </div>
            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {steps.map((s, i) => (
                <div key={s.step} className="relative text-center">
                  {i < steps.length - 1 && (
                    <div className="absolute left-[60%] top-8 hidden h-px w-[80%] border-t border-dashed border-slate-700 md:block" />
                  )}
                  <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600/10 text-2xl font-extrabold text-brand-400">
                    {s.step}
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-slate-100">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== PRICING ===== */}
        <section className="container-page py-20 lg:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-slate-50 sm:text-4xl">Simple, transparent pricing</h2>
            <p className="mt-4 text-lg text-slate-400">
              Start free. Scale as your team grows.
            </p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-xl border p-6 transition ${
                  plan.featured
                    ? "border-brand-600 bg-surface shadow-lg shadow-brand-600/10"
                    : "border-slate-800 bg-surface hover:border-slate-700"
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-4 py-1 text-xs font-semibold text-white">
                    Most popular
                  </span>
                )}
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">{plan.name}</p>
                <p className="mt-3">
                  <span className="text-4xl font-extrabold text-slate-50">{plan.price}</span>
                  <span className="ml-1 text-sm text-slate-500">/{plan.period}</span>
                </p>
                <p className="mt-2 text-sm text-slate-400">{plan.desc}</p>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`mt-8 flex w-full items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                    plan.featured
                      ? "bg-brand-600 text-white hover:bg-brand-700"
                      : "border border-slate-700 text-slate-300 hover:border-slate-600 hover:text-slate-50"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="border-t border-slate-800">
          <div className="container-page py-20 text-center">
            <h2 className="text-3xl font-bold text-slate-50 sm:text-4xl">Ready to reduce contract risk?</h2>
            <p className="mt-4 text-lg text-slate-400">Get your first 3 analyses free. No credit card required.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-700"
              >
                Create free account
              </Link>
              <Link
                href="/analysis/demo"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-surface px-7 py-3.5 text-sm font-semibold text-slate-300 transition hover:border-slate-600 hover:text-slate-50"
              >
                View sample report
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-10 text-center text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} BuildGuard AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
