type RiskBadgeProps = {
  score: number;
};

const getBadge = (score: number) => {
  if (score >= 80) return { label: "Critical", className: "bg-risk-critical-bg text-risk-critical-text border-risk-critical-border animate-pulse" };
  if (score >= 60) return { label: "High", className: "bg-risk-high-bg text-risk-high-text border-risk-high-border" };
  if (score >= 30) return { label: "Medium", className: "bg-risk-medium-bg text-risk-medium-text border-risk-medium-border" };
  return { label: "Low", className: "bg-risk-low-bg text-risk-low-text border-risk-low-border" };
};

export default function RiskBadge({ score }: RiskBadgeProps) {
  const badge = getBadge(score);
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${badge.className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${
        score >= 80 ? "bg-risk-critical-text" :
        score >= 60 ? "bg-risk-high-text" :
        score >= 30 ? "bg-risk-medium-text" :
        "bg-risk-low-text"
      }`} />
      {badge.label} · {score}
    </span>
  );
}
