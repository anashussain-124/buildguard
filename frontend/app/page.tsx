"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";

const featureCards = [
  {
    title: "Clause-by-clause review",
    description: "Extract risk-heavy sections, surface issue severity, and keep the wording visible next to each recommendation.",
    icon: (
      <svg className="h-8 w-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: "Missing protection checks",
    description: "Flag absent terms like liability caps, termination rights, and dispute language before contracts move forward.",
    icon: (
      <svg className="h-8 w-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
  },
  {
    title: "Fast team handoff",
    description: "Give project managers and legal reviewers a clean summary with recommended action instead of a raw AI dump.",
    icon: (
      <svg className="h-8 w-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-16">
        {/* Hero Section */}
        <section className="rounded-lg bg-slate-900 p-12 shadow-lg shadow-slate-950/50">
          <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-400">
                BuildGuard AI
              </p>
              <h1 className="mt-6 text-5xl font-bold leading-tight text-slate-50">
                Contract risk analysis for construction teams.
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-400">
                Upload a contract, extract the important language, and get a structured risk report with red flags, clause insights, and recommended next steps.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/upload"
                  className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  Upload &amp; analyze
                </Link>
                <Link
                  href="/analysis/demo"
                  className="rounded-lg border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-slate-50"
                >
                  View sample report
                </Link>
              </div>
            </div>

            <div className="rounded-lg bg-slate-950 p-8 text-slate-50 shadow-lg">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">What you get</p>
              <ul className="mt-6 space-y-4 text-sm leading-6 text-slate-200">
                <li className="flex gap-3">
                  <svg className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Risk score with low-to-critical severity guidance
                </li>
                <li className="flex gap-3">
                  <svg className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Red flag breakdown with approximate clause locations
                </li>
                <li className="flex gap-3">
                  <svg className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Missing protections and negotiation recommendations
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="mt-10 grid gap-6 md:grid-cols-3">
          {featureCards.map((card) => (
            <div key={card.title} className="rounded-lg bg-slate-900 p-8 shadow-lg shadow-slate-950/50">
              {card.icon}
              <h2 className="mt-4 text-xl font-semibold text-slate-50">{card.title}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-400">{card.description}</p>
            </div>
          ))}
        </section>

        {/* Pricing Teaser */}
        <section className="mt-16 rounded-lg border border-slate-700 bg-slate-900 p-10 text-center shadow-lg shadow-slate-950/50">
          <h2 className="text-2xl font-semibold text-slate-50">Simple, transparent pricing</h2>
          <p className="mt-3 text-slate-400">
            Start free with 3 analyses per month. Scale as your team grows.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">Free</p>
              <p className="mt-2 text-3xl font-bold text-slate-50">$0<span className="text-sm font-normal text-slate-400">/mo</span></p>
              <p className="mt-2 text-sm text-slate-400">3 analyses/month</p>
            </div>
            <div className="rounded-lg border border-indigo-600 bg-slate-800 p-6">
              <p className="text-sm font-semibold uppercase tracking-wider text-indigo-400">Pro</p>
              <p className="mt-2 text-3xl font-bold text-slate-50">$29<span className="text-sm font-normal text-slate-400">/mo</span></p>
              <p className="mt-2 text-sm text-slate-400">Unlimited analyses</p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">Team</p>
              <p className="mt-2 text-3xl font-bold text-slate-50">$99<span className="text-sm font-normal text-slate-400">/mo</span></p>
              <p className="mt-2 text-sm text-slate-400">5 users + API access</p>
            </div>
          </div>
          <Link
            href="/auth/register"
            className="mt-8 inline-block rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Get started free
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-sm text-slate-500">
        &copy; {new Date().getFullYear()} BuildGuard AI. All rights reserved.
      </footer>
    </div>
  );
}
