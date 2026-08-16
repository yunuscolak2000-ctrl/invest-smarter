import type { Ref } from "react";
import { AssistantPrompt } from "../../components/wizard/AssistantPrompt";
import { SelectCardGroup } from "../../components/wizard/SelectCard";
import { useCopy } from "../../hooks/useLanguage";
import { labeledOptions } from "../../lib/i18n";
import { DECISION_NEEDED_OPTIONS } from "../../mocks/interview";
import type { DecisionNeeded } from "../../types/interview";

type DecisionNeededStepProps = {
  value: DecisionNeeded | null;
  onChange: (value: DecisionNeeded) => void;
  error: string | null;
  controlRef: Ref<HTMLFieldSetElement>;
};

export function DecisionNeededStep({
  value,
  onChange,
  error,
  controlRef,
}: DecisionNeededStepProps) {
  const copy = useCopy();

  return (
    <section className="space-y-6">
      <AssistantPrompt title={copy.q12.title} message={copy.q12.message} />
      <SelectCardGroup
        ref={controlRef}
        name="decision-needed"
        value={value}
        options={labeledOptions(
          DECISION_NEEDED_OPTIONS,
          copy.options.decisionNeeded
        )}
        onChange={(next) => onChange(next as DecisionNeeded)}
        error={error}
      />
      <p className="text-sm leading-relaxed text-slate-500">
        {copy.q12.stallHelper}
      </p>
    </section>
  );
}
