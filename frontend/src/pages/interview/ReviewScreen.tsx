import { AssistantPrompt } from "../../components/wizard/AssistantPrompt";
import { FieldError } from "../../components/wizard/FieldError";
import {
  reviewConfidencePreview,
  reviewGroups,
} from "../../lib/interviewLabels";
import { WIZARD_COPY } from "../../mocks/interview";
import { getCountry } from "../../mocks/countries";
import type { InterviewDraft, WizardStepId } from "../../types/interview";

type ReviewScreenProps = {
  draft: InterviewDraft;
  error: string | null;
  onEdit: (step: WizardStepId) => void;
};

export function ReviewScreen({ draft, error, onEdit }: ReviewScreenProps) {
  const groups = reviewGroups(draft);
  const preview = reviewConfidencePreview(draft);
  const restricted = getCountry(draft.countryCode)?.risk_tier === "restricted";

  return (
    <section className="space-y-8">
      <AssistantPrompt
        title={WIZARD_COPY.review.title}
        message={WIZARD_COPY.review.message}
      />

      <FieldError id="review-error" message={error} />

      {groups.map((group) => (
        <div key={group.title} className="space-y-3">
          <h3 className="text-xs font-medium uppercase tracking-widest text-slate-500">
            {group.title}
          </h3>
          <ul className="space-y-2">
            {group.rows.map((row) => (
              <li key={`${row.step}-${row.label}`}>
                <button
                  type="button"
                  onClick={() => onEdit(row.step)}
                  className="flex w-full items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3.5 text-left transition-colors hover:border-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
                  aria-label={`Edit ${row.label}`}
                >
                  <span className="min-w-0">
                    <span className="block text-xs font-medium uppercase tracking-wide text-slate-500">
                      {row.label}
                    </span>
                    <span className="mt-1 block text-sm font-medium text-white">
                      {row.value}
                    </span>
                  </span>
                  <span className="shrink-0 text-sm text-slate-500">Edit</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-4">
          <h3 className="text-xs font-medium uppercase tracking-widest text-slate-500">
          Confidence preview · {preview.band}
        </h3>
        <p className="text-sm leading-relaxed text-slate-300">{preview.message}</p>
        {restricted ? (
          <p className="text-sm leading-relaxed text-slate-400">
            This geography requires review before any recommendation is published.
          </p>
        ) : null}
      </div>
    </section>
  );
}
