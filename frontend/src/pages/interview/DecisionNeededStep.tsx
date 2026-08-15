import type { Ref } from "react";
import { AssistantPrompt } from "../../components/wizard/AssistantPrompt";
import { SelectCardGroup } from "../../components/wizard/SelectCard";
import { DECISION_NEEDED_OPTIONS, WIZARD_COPY } from "../../mocks/interview";
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
  return (
    <section className="space-y-6">
      <AssistantPrompt title={WIZARD_COPY.q12.title} message={WIZARD_COPY.q12.message} />
      <SelectCardGroup
        ref={controlRef}
        name="decision-needed"
        value={value}
        options={DECISION_NEEDED_OPTIONS}
        onChange={(next) => onChange(next as DecisionNeeded)}
        error={error}
      />
      <p className="text-sm leading-relaxed text-slate-500">
        {WIZARD_COPY.q12.stallHelper}
      </p>
    </section>
  );
}
