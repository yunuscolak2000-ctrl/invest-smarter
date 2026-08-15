type TimeEstimateProps = {
  label: string;
  value: string;
};

export function TimeEstimate({ label, value }: TimeEstimateProps) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-2">
      <dt className="text-sm text-slate-400">{label}</dt>
      <dd className="text-sm font-semibold text-white">{value}</dd>
    </div>
  );
}
