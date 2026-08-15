import type { Ref } from "react";
import { AssistantPrompt } from "../../components/wizard/AssistantPrompt";
import { SelectCardGroup } from "../../components/wizard/SelectCard";
import { EVALUATION_CONTEXT_OPTIONS, WIZARD_COPY } from "../../mocks/interview";
import type { EvaluationContext } from "../../types/interview";

type EvaluationContextStepProps = {
  value: EvaluationContext | null;
  onChange: (value: EvaluationContext) => void;
  error: string | null;
  controlRef: Ref<HTMLFieldSetElement>;
};

export function EvaluationContextStep({
  value,
  onChange,
  error,
  controlRef,
}: EvaluationContextStepProps) {
  return (
    <section className="space-y-6">
      <AssistantPrompt title={WIZARD_COPY.q8.title} message={WIZARD_COPY.q8.message} />
      <SelectCardGroup
        ref={controlRef}
        name="evaluation-context"
        value={value}
        options={EVALUATION_CONTEXT_OPTIONS}
        onChange={(next) => onChange(next as EvaluationContext)}
        columns={2}
        error={error}
      />
    </section>
  );
}
