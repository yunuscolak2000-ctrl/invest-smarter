import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { FeatureCard } from "../components/FeatureCard";
import { TimeEstimate } from "../components/TimeEstimate";

/**
 * InterviewPage currently requires location.state.investmentIdea.
 * Welcome does not collect an idea yet — this keeps the existing interview
 * guard working without changing Interview or routing.
 */
const INTERVIEW_BOOTSTRAP_IDEA = "New investment opportunity";

const FEATURES: {
  title: string;
  description: string;
  icon: ReactNode;
}[] = [
  {
    title: "Market Intelligence",
    description: "Demand, competition, and regulatory context for the opportunity.",
    icon: (
      <svg
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
  },
  {
    title: "Technical Feasibility",
    description: "Site, operations, and execution risk before capital is committed.",
    icon: (
      <svg
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
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12 20 7.5M12 12v9M12 12 4 7.5" />
      </svg>
    ),
  },
  {
    title: "Financial Analysis",
    description: "Capital need, returns, and unit economics in one structured view.",
    icon: (
      <svg
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
  },
  {
    title: "AI Recommendation",
    description: "A clear proceed, defer, or do-not-pursue posture you can defend.",
    icon: (
      <svg
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
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  function handleStart() {
    navigate("/interview", {
      state: { investmentIdea: INTERVIEW_BOOTSTRAP_IDEA },
    });
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-6 py-16 sm:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[-12%] mx-auto h-[420px] w-[min(100%,44rem)] rounded-full bg-emerald-500/10 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-3xl">
        <header className="text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Invest Smarter
          </h1>
          <p className="mt-3 text-lg text-emerald-400/90">
            AI Investment Intelligence Platform
          </p>
          <p className="mt-5 text-xl text-slate-200">
            From idea to investment decision.
          </p>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-400">
            Evaluate your investment opportunity using institutional-grade AI
            analysis.
          </p>
        </header>

        <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {FEATURES.map((feature) => (
            <li key={feature.title}>
              <FeatureCard
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
              />
            </li>
          ))}
        </ul>

        <dl className="mt-10 flex flex-col gap-3 border-y border-slate-800 py-5 sm:flex-row sm:justify-center sm:gap-10">
          <TimeEstimate
            label="Estimated interview time:"
            value="8 minutes"
          />
          <TimeEstimate
            label="Estimated report generation:"
            value="2 minutes"
          />
        </dl>

        <div className="mt-10">
          <Button className="w-full py-5 text-lg" onClick={handleStart}>
            Start Investment Assessment
          </Button>
        </div>
      </div>
    </main>
  );
}
