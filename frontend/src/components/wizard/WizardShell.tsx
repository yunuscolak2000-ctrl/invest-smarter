import type { ReactNode } from "react";
import { LanguageSelector } from "../LanguageSelector";
import { WizardProgress } from "./WizardProgress";

type WizardShellProps = {
  children: ReactNode;
  footer: ReactNode;
  questionNumber?: number;
  questionTotal?: number;
  minutesLeft?: number;
  workingTitle?: string;
  questionLabel?: string;
  minutesLabel?: string;
};

export function WizardShell({
  children,
  footer,
  questionNumber,
  questionTotal,
  minutesLeft,
  workingTitle,
  questionLabel,
  minutesLabel,
}: WizardShellProps) {
  const showProgress =
    questionNumber !== undefined &&
    questionTotal !== undefined &&
    minutesLeft !== undefined;

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <header className="border-b border-slate-800 px-4 py-4 sm:px-6">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-4">
          <p className="text-sm font-medium uppercase tracking-widest text-emerald-400">
            Invest Smarter
          </p>
          <div className="flex min-w-0 items-center gap-3">
            <p className="hidden truncate text-sm text-slate-400 sm:block">
              {workingTitle}
            </p>
            <LanguageSelector />
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 pb-[max(10rem,calc(8.5rem+env(safe-area-inset-bottom)))] pt-6 sm:px-6 sm:pt-8">
        {showProgress ? (
          <div className="mb-8">
            <WizardProgress
              current={questionNumber}
              total={questionTotal}
              minutesLeft={minutesLeft}
              questionLabel={questionLabel}
              minutesLabel={minutesLabel}
            />
          </div>
        ) : null}
        {children}
      </main>

      {footer}
    </div>
  );
}
