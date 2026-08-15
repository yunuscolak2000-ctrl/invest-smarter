import type { ReactNode } from "react";

type FeatureCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
};

export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <article className="h-full rounded-2xl border border-slate-800 bg-slate-900 p-5 transition-colors hover:border-slate-700">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
        {icon}
      </div>
      <h2 className="text-base font-semibold text-white">{title}</h2>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
        {description}
      </p>
    </article>
  );
}
