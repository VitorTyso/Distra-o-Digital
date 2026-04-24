type ProgressBarProps = {
  value: number;
};

export function ProgressBar({ value }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between text-[11px] uppercase tracking-[0.24em] text-slate/80">
        <span>Diagnóstico</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-black/8">
        <div
          className="h-full rounded-full bg-ink transition-all duration-500 ease-out"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
