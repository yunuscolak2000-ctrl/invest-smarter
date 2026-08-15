type ChipProps = {
  label: string;
  selected?: boolean;
  onClick: () => void;
};

export function Chip({ label, selected = false, onClick }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`min-h-11 rounded-full px-4 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
        selected
          ? "bg-emerald-600 text-white"
          : "border border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-500"
      }`}
    >
      {label}
    </button>
  );
}
