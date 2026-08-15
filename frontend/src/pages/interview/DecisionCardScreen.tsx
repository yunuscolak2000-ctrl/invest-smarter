import { useEffect, useRef } from "react";
import { WIZARD_COPY } from "../../mocks/interview";
import type { DecisionCardView } from "../../lib/presentDecisionCard";

type DecisionCardScreenProps = {
  view: DecisionCardView | null;
};

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
      {children}
    </p>
  );
}

export function DecisionCardScreen({ view }: DecisionCardScreenProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [view?.postureTitle]);

  if (!view || view.defect) {
    return (
      <section className="space-y-4">
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="text-2xl font-semibold tracking-tight text-white focus:outline-none"
        >
          {WIZARD_COPY.decision.defect}
        </h1>
      </section>
    );
  }

  return (
    <article className="space-y-10 pb-40">
      <header className="space-y-2" aria-label="Opportunity">
        <p className="text-base font-medium leading-snug text-white">
          {view.title}
        </p>
        <p className="text-sm leading-relaxed text-slate-300">
          {view.productSummary}
        </p>
        <p className="text-sm leading-relaxed text-slate-400">{view.meta}</p>
        <p className="text-sm leading-relaxed text-slate-500">{view.status}</p>
      </header>

      <section className="space-y-3" aria-label="Decision">
        <SectionLabel>Decision</SectionLabel>
        <h1
          id="decision-heading"
          ref={headingRef}
          tabIndex={-1}
          className="text-3xl font-semibold tracking-tight text-white focus:outline-none sm:text-4xl"
        >
          {view.postureTitle}
        </h1>
        <p className="text-base leading-relaxed text-slate-300">
          {view.postureSentence}
        </p>
        {view.bankDisclaimer ? (
          <p className="text-sm leading-relaxed text-slate-400">
            {view.bankDisclaimer}
          </p>
        ) : null}
      </section>

      <section className="space-y-3" aria-label="Confidence">
        <SectionLabel>Confidence</SectionLabel>
        <p className="text-base font-medium text-white">{view.confidenceLine}</p>
        <p className="text-sm leading-relaxed text-slate-400">
          {view.confidenceDrivers[0]}
        </p>
        <p className="text-sm leading-relaxed text-slate-400">
          {view.confidenceDrivers[1]}
        </p>
      </section>

      <section className="space-y-3" aria-label="Conditions">
        <SectionLabel>Conditions</SectionLabel>
        <p className="text-sm leading-relaxed text-slate-400">
          {view.conditionsIntro}
        </p>
        <ol className="list-decimal space-y-3 pl-5 text-sm leading-relaxed text-slate-200">
          {view.conditions.map((condition) => (
            <li key={condition}>{condition}</li>
          ))}
        </ol>
      </section>

      <section className="space-y-3" aria-label="Why this decision">
        <SectionLabel>Why this decision</SectionLabel>
        <ul className="list-disc space-y-3 pl-5 text-sm leading-relaxed text-slate-300">
          {view.why.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-3" aria-label="What should happen next">
        <SectionLabel>What should happen next</SectionLabel>
        <ul className="list-disc space-y-3 pl-5 text-sm leading-relaxed text-slate-300">
          {view.next.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <footer className="space-y-2 border-t border-slate-800 pt-6">
        <p className="text-sm leading-relaxed text-slate-500">{view.disclaimer}</p>
        <p className="text-xs text-slate-600">{view.policyLabel}</p>
      </footer>
    </article>
  );
}
