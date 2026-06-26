import Navbar from "@/components/Navbar";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-[2rem] bg-white p-12 shadow-xl shadow-slate-200">
          <h1 className="text-4xl font-semibold text-slate-950">Pricing</h1>
          <p className="mt-4 text-slate-600">Choose the right plan for construction and legal teams.</p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-[2rem] border border-slate-200 p-8 text-center shadow-sm">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Starter</p>
              <p className="mt-4 text-5xl font-semibold text-slate-950">Free</p>
              <p className="mt-4 text-slate-600">2 contract analyses per month</p>
              <ul className="mt-6 space-y-3 text-left text-slate-600">
                <li>Automated risk scoring</li>
                <li>Clause and red-flag reporting</li>
                <li>Basic contract history</li>
              </ul>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-slate-900 p-8 text-center text-white shadow-lg">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Growth</p>
              <p className="mt-4 text-5xl font-semibold">$29</p>
              <p className="mt-4 text-slate-300">Unlimited contract analyses</p>
              <ul className="mt-6 space-y-3 text-left text-slate-300">
                <li>Priority model throughput</li>
                <li>Saved analysis reports</li>
                <li>Email support</li>
              </ul>
            </div>
            <div className="rounded-[2rem] border border-slate-200 p-8 text-center shadow-sm">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Enterprise</p>
              <p className="mt-4 text-5xl font-semibold">Contact</p>
              <p className="mt-4 text-slate-600">Custom compliance workflows</p>
              <ul className="mt-6 space-y-3 text-left text-slate-600">
                <li>Team seats</li>
                <li>Advanced integrations</li>
                <li>Dedicated onboarding</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
