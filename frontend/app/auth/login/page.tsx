"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { login } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email, password });
      router.push("/dashboard");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="mx-auto max-w-md px-6 py-16">
        <div className="mt-20 rounded-lg bg-slate-800 p-10 shadow-xl shadow-slate-950/50">
          <h1 className="text-3xl font-semibold text-slate-50">Login</h1>
          <p className="mt-3 text-slate-400">Access your contract risk dashboard with email and password.</p>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-semibold text-slate-300">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-slate-50 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-300">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={8}
                autoComplete="current-password"
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-slate-50 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </label>
            {error && (
              <div className="rounded-lg bg-rose-900/20 p-3">
                <p className="text-sm text-rose-400">{error}</p>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-70"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
            <p className="text-center text-sm text-slate-400">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="font-semibold text-indigo-400 hover:text-indigo-300">
                Register
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
