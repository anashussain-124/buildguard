type LoadingSpinnerProps = {
  sizeClassName?: string;
};

export default function LoadingSpinner({ sizeClassName = "h-8 w-8" }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizeClassName} animate-spin rounded-full border-4 border-slate-700 border-t-indigo-500`} />
      <span className="text-sm font-medium text-slate-400">Analyzing…</span>
    </div>
  );
}
