type RiskBadgeProps = {
  score: number;
};

const getBadge = (score: number) => {
  if (score >= 80) return { label: "Critical", className: "bg-rose-950 text-rose-300 border-rose-600 animate-pulse" };
  if (score >= 60) return { label: "High", className: "bg-rose-900/40 text-rose-400 border-rose-700" };
  if (score >= 30) return { label: "Medium", className: "bg-amber-900/40 text-amber-400 border-amber-700" };
  return { label: "Low", className: "bg-emerald-900/40 text-emerald-400 border-emerald-700" };
};

export default function RiskBadge({ score }: RiskBadgeProps) {
  const badge = getBadge(score);
  return (
    <span className={`inline-flex rounded-lg border px-3 py-1 text-sm font-semibold ${badge.className}`}>
      {badge.label}
    </span>
  );
}
