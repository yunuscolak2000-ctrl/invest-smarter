type WizardProgressProps = {
  current: number;
  total: number;
  minutesLeft: number;
};

export function WizardProgress({
  current,
  total,
  minutesLeft,
}: WizardProgressProps) {
  const percent = Math.min(100, Math.round((current / total) * 100));

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-medium text-slate-300">
          Question {current} of {total}
        </p>
        <p className="hidden text-sm text-slate-500 min-[360px]:block">
          About {minutesLeft} minutes left
        </p>
      </div>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-slate-800"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-label={`Question ${current} of ${total}`}
      >
        <div
          className="h-full rounded-full bg-emerald-500 transition-[width] duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
