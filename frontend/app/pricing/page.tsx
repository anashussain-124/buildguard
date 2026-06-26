"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "@/components/Navbar";

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
    features: ["5 team seats", "Everything in Pro", "API access", "Shared workspace", "Dedicated support"],
    cta: "Contact sales",
    href: "/auth/register",
    featured: false,
  },
];

const faqs = [
  { q: "Can I switch plans later?", a: "Yes. You can upgrade or downgrade at any time. Changes take effect on the next billing cycle." },
  { q: "What file types are supported?", a: "We currently support PDF and DOCX files up to 10 MB per upload." },
  { q: "Is my contract data private?", a: "Absolutely. All files are encrypted in transit and at rest. Analysis data is never used for training." },
  { q: "Do you offer custom enterprise plans?", a: "Yes — contact our sales team for custom compliance workflows, SSO, dedicated onboarding, and volume pricing." },
];

const compareFeatures = [
  { name: "Monthly analyses", free: "3", pro: "Unlimited", team: "Unlimited" },
  { name: "File formats", free: "PDF, DOCX", pro: "PDF, DOCX", team: "PDF, DOCX" },
  { name: "Risk scoring", free: true, pro: true, team: true },
  { name: "Clause extraction", free: "Basic", pro: "Full", team: "Full" },
  { name: "Missing protection checks", free: false, pro: true, team: true },
  { name: "Exportable reports", free: false, pro: true, team: true },
  { name: "Priority processing", free: false, pro: true, team: true },
  { name: "Team seats", free: "1", pro: "1", team: "5 + API" },
  { name: "API access", free: false, pro: false, team: true },
  { name: "Dedicated support", free: false, pro: false, team: true },
];

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main>
        {/* Heading */}
        <section className="container-page py-20 text-center">
          <h1 className="text-4xl font-extrabold text-slate-50 sm:text-5xl">Simple, transparent pricing</h1>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            Start free. Scale as your team grows. No hidden fees, no surprise charges.
          </p>
        </section>

        {/* Pricing Cards */}
        <section className="container-page pb-16">
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-xl border p-6 transition hover:shadow-lg ${
                  plan.featured
                    ? "border-brand-600 bg-surface shadow-lg shadow-brand-600/10 scale-105 md:scale-110"
                    : "border-slate-800 bg-surface hover:border-slate-700"
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-4 py-1 text-xs font-semibold text-white shadow">
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

        {/* Feature Comparison Table */}
        <section className="border-y border-slate-800 bg-surface/50">
          <div className="container-page py-16">
            <h2 className="text-2xl font-bold text-slate-50 text-center">Compare plans</h2>
            <div className="mt-10 overflow-x-auto">
              <table className="w-full min-w-[500px] text-sm">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="py-3 pr-6 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Feature</th>
                    <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Free</th>
                    <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider text-brand-400">Pro</th>
                    <th className="py-3 pl-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Team</th>
                  </tr>
                </thead>
                <tbody>
                  {compareFeatures.map((row) => (
                    <tr key={row.name} className="border-b border-slate-800/50">
                      <td className="py-3 pr-6 text-slate-300">{row.name}</td>
                      {(["free", "pro", "team"] as const).map((tier) => (
                        <td key={tier} className={`py-3 px-4 text-center ${tier === "pro" ? "text-brand-300" : "text-slate-400"}`}>
                          {typeof row[tier] === "boolean" ? (
                            row[tier] ? (
                              <svg className="mx-auto h-4 w-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="mx-auto h-4 w-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )
                          ) : (
                            row[tier]
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="container-page py-16">
          <h2 className="text-2xl font-bold text-slate-50 text-center">Frequently asked questions</h2>
          <div className="mt-10 max-w-2xl mx-auto space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-lg border border-slate-800 bg-surface overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-slate-200 transition hover:bg-white/[0.02]"
                >
                  {faq.q}
                  <svg className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${openFaq === i ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="border-t border-slate-800 px-5 py-4 text-sm text-slate-400 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-slate-800">
          <div className="container-page py-16 text-center">
            <h2 className="text-2xl font-bold text-slate-50">Ready to reduce contract risk?</h2>
            <p className="mt-2 text-sm text-slate-400">Get your first 3 analyses free. No credit card required.</p>
            <Link
              href="/auth/register"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-7 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-700"
            >
              Create free account
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800 py-10 text-center text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} BuildGuard AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
