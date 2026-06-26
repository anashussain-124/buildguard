type LoadingSpinnerProps = {
  sizeClassName?: string;
};

export default function LoadingSpinner({ sizeClassName = "h-8 w-8" }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizeClassName} animate-spin-slow rounded-full border-2 border-slate-700 border-t-brand-500`} />
      <span className="text-xs font-medium text-slate-500">Loading...</span>
    </div>
  );
}
