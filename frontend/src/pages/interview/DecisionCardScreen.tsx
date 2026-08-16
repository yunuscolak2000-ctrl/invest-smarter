import { useEffect, useRef, useState } from "react";
import { FieldError } from "../../components/wizard/FieldError";
import { TextField } from "../../components/wizard/TextField";
import { WIZARD_COPY } from "../../mocks/interview";
import type { DecisionCardView } from "../../lib/presentDecisionCard";
import type { EvaluatorDecisionStatus } from "../../types/decision";

type RecordedStatus = Exclude<EvaluatorDecisionStatus, "not_accepted">;

type DecisionCardScreenProps = {
  view: DecisionCardView | null;
  evaluatorStatus: EvaluatorDecisionStatus;
  evaluatorName: string;
  evaluatorReason: string;
  onEvaluatorName: (value: string) => void;
  onEvaluatorReason: (value: string) => void;
  onRecordDecision: (status: RecordedStatus, reason: string) => string | null;
  onClearSaved: () => void;
};

const COPY = WIZARD_COPY.decision.evaluator;

const EVALUATOR_ACTIONS: {
  status: RecordedStatus;
  label: string;
  explanation: string;
}[] = [
  {
    status: "accepted",
    label: COPY.accept,
    explanation: COPY.accepted,
  },
  {
    status: "amended",
    label: COPY.amend,
    explanation: COPY.amended,
  },
  {
    status: "rejected",
    label: COPY.reject,
    explanation: COPY.rejected,
  },
];

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
      {children}
    </p>
  );
}

export function DecisionCardScreen({
  view,
  evaluatorStatus,
  evaluatorName,
  evaluatorReason,
  onEvaluatorName,
  onEvaluatorReason,
  onRecordDecision,
  onClearSaved,
}: DecisionCardScreenProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const reasonRef = useRef<HTMLTextAreaElement>(null);
  const [reasonError, setReasonError] = useState<string | null>(null);

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

  const explanation =
    EVALUATOR_ACTIONS.find((action) => action.status === evaluatorStatus)
      ?.explanation ?? null;
  const recordedName = evaluatorName.trim();
  const recordedReason = evaluatorReason.trim();
  const showReason =
    (evaluatorStatus === "amended" || evaluatorStatus === "rejected") &&
    recordedReason.length > 0;

  function handleReasonChange(value: string) {
    setReasonError(null);
    onEvaluatorReason(value);
  }

  function handleRecord(status: RecordedStatus) {
    const message = onRecordDecision(status, evaluatorReason);
    setReasonError(message);
    if (message) {
      requestAnimationFrame(() => reasonRef.current?.focus());
    }
  }

  const reasonHelperId = "evaluator-reason-helper";
  const reasonErrorId = "evaluator-reason-error";
  const reasonDescribedBy = [
    reasonHelperId,
    reasonError ? reasonErrorId : null,
  ]
    .filter(Boolean)
    .join(" ");

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
        <p className="text-xs leading-relaxed text-slate-600">
          {WIZARD_COPY.decision.snapshotNote}
        </p>
        <p className="text-xs leading-relaxed text-slate-600">
          {WIZARD_COPY.decision.snapshotPersisted}
        </p>
        <button
          type="button"
          onClick={onClearSaved}
          className="text-left text-xs text-slate-500 underline-offset-2 hover:text-slate-300 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/70"
        >
          {WIZARD_COPY.decision.clearSaved}
        </button>
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

      <section className="space-y-3" aria-label="Evaluator decision">
        <SectionLabel>{COPY.sectionLabel}</SectionLabel>
        <p className="text-sm leading-relaxed text-slate-400">{COPY.helper}</p>
        <TextField
          id="evaluator-name"
          label={COPY.nameLabel}
          value={evaluatorName}
          onChange={onEvaluatorName}
          placeholder={COPY.namePlaceholder}
          helper={COPY.nameHelper}
        />
        <div
          role="radiogroup"
          aria-label={COPY.sectionLabel}
          className="grid grid-cols-1 gap-3"
        >
          {EVALUATOR_ACTIONS.map((action) => {
            const selected = evaluatorStatus === action.status;
            return (
              <button
                key={action.status}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => handleRecord(action.status)}
                className={`min-h-11 rounded-2xl border px-4 py-3.5 text-left text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
                  selected
                    ? "border-slate-400 bg-slate-800 text-white"
                    : "border-slate-800 bg-slate-900 text-slate-200 hover:border-slate-600"
                }`}
              >
                {action.label}
              </button>
            );
          })}
        </div>
        <div className="space-y-2">
          <label
            htmlFor="evaluator-reason"
            className="block text-sm font-medium text-slate-300"
          >
            {COPY.reasonLabel}
          </label>
          <textarea
            ref={reasonRef}
            id="evaluator-reason"
            value={evaluatorReason}
            rows={4}
            onChange={(event) => handleReasonChange(event.target.value)}
            aria-invalid={reasonError ? true : undefined}
            aria-describedby={reasonDescribedBy}
            className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-base text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
          <p id={reasonHelperId} className="text-sm text-slate-500">
            {COPY.reasonHelper}
          </p>
          <FieldError id={reasonErrorId} message={reasonError} />
        </div>
        {explanation ? (
          <p className="text-sm leading-relaxed text-slate-400">{explanation}</p>
        ) : null}
        {showReason ? (
          <p className="rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm leading-relaxed text-slate-400">
            {COPY.reasonPrefix} {recordedReason}
          </p>
        ) : null}
        {explanation && recordedName ? (
          <p className="text-sm leading-relaxed text-slate-500">
            {COPY.recordedByPrefix} {recordedName}.
          </p>
        ) : null}
      </section>

      <footer className="space-y-2 border-t border-slate-800 pt-6">
        <p className="text-sm leading-relaxed text-slate-500">{view.disclaimer}</p>
        <p className="text-xs text-slate-600">{view.policyLabel}</p>
      </footer>
    </article>
  );
}
