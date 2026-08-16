import type { Ref } from "react";
import { AssistantPrompt } from "../../components/wizard/AssistantPrompt";
import { SelectCardGroup } from "../../components/wizard/SelectCard";
import { useCopy } from "../../hooks/useLanguage";
import { labeledOptions } from "../../lib/i18n";
import { EVALUATION_CONTEXT_OPTIONS } from "../../mocks/interview";
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
  const copy = useCopy();

  return (
    <section className="space-y-6">
      <AssistantPrompt title={copy.q8.title} message={copy.q8.message} />
      <SelectCardGroup
        ref={controlRef}
        name="evaluation-context"
        value={value}
        options={labeledOptions(
          EVALUATION_CONTEXT_OPTIONS,
          copy.options.evaluationContext
        )}
        onChange={(next) => onChange(next as EvaluationContext)}
        columns={2}
        error={error}
      />
    </section>
  );
}
