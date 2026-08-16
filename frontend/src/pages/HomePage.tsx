import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { FeatureCard } from "../components/FeatureCard";
import { LanguageSelector } from "../components/LanguageSelector";
import { TimeEstimate } from "../components/TimeEstimate";
import { useCopy } from "../hooks/useLanguage";

const FEATURE_ICONS: ReactNode[] = [
  (
    <svg
      key="market"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 17 9 11l4 4 8-8M14 7h7v7"
      />
    </svg>
  ),
  (
    <svg
      key="tech"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3 20 7.5v9L12 21 4 16.5v-9L12 3Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 12 20 7.5M12 12v9M12 12 4 7.5"
      />
    </svg>
  ),
  (
    <svg
      key="finance"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <path strokeLinecap="round" d="M4 19V9M10 19V5M16 19v-6M22 19H2" />
    </svg>
  ),
  (
    <svg
      key="ai"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m12 3 1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6L12 3Z"
      />
    </svg>
  ),
];

export default function HomePage() {
  const navigate = useNavigate();
  const copy = useCopy();

  function handleStart() {
    navigate("/interview", {
      state: { investmentIdea: copy.welcome.bootstrapIdea },
    });
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-6 pt-20 pb-16 sm:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[-12%] mx-auto h-[420px] w-[min(100%,44rem)] rounded-full bg-emerald-500/10 blur-3xl"
      />

      <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
        <LanguageSelector />
      </div>

      <div className="relative mx-auto w-full max-w-3xl">
        <header className="text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {copy.welcome.brand}
          </h1>
          <p className="mt-3 text-lg text-emerald-400/90">
            {copy.welcome.kicker}
          </p>
          {copy.welcome.headline ? (
            <p className="mt-5 text-xl text-slate-200">{copy.welcome.headline}</p>
          ) : null}
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-400">
            {copy.welcome.description}
          </p>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-500">
            {copy.welcome.prototypeNote}
          </p>
        </header>

        <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {copy.welcome.features.map((feature, index) => (
            <li key={feature.title}>
              <FeatureCard
                title={feature.title}
                description={feature.description}
                icon={FEATURE_ICONS[index]}
              />
            </li>
          ))}
        </ul>

        <dl className="mt-10 flex flex-col gap-3 border-y border-slate-800 py-5 sm:flex-row sm:justify-center sm:gap-10">
          <TimeEstimate
            label={copy.welcome.interviewTimeLabel}
            value={copy.welcome.interviewTimeValue}
          />
          <TimeEstimate
            label={copy.welcome.reportTimeLabel}
            value={copy.welcome.reportTimeValue}
          />
        </dl>

        <div className="mt-10">
          <Button className="w-full py-5 text-lg" onClick={handleStart}>
            {copy.welcome.start}
          </Button>
        </div>
      </div>
    </main>
  );
}
