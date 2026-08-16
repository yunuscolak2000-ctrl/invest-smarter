import type { Ref } from "react";
import { AssistantPrompt } from "../../components/wizard/AssistantPrompt";
import { SelectCardGroup } from "../../components/wizard/SelectCard";
import { useCopy } from "../../hooks/useLanguage";
import { labeledOptions } from "../../lib/i18n";
import { OPPORTUNITY_TYPE_OPTIONS } from "../../mocks/interview";
import type { OpportunityType } from "../../types/interview";

type OpportunityTypeStepProps = {
  value: OpportunityType | null;
  onChange: (value: OpportunityType) => void;
  error: string | null;
  controlRef: Ref<HTMLFieldSetElement>;
};

export function OpportunityTypeStep({
  value,
  onChange,
  error,
  controlRef,
}: OpportunityTypeStepProps) {
  const copy = useCopy();

  return (
    <section className="space-y-6">
      <AssistantPrompt title={copy.q1.title} message={copy.q1.message} />
      <SelectCardGroup
        ref={controlRef}
        name="opportunity-type"
        value={value}
        options={labeledOptions(
          OPPORTUNITY_TYPE_OPTIONS,
          copy.options.opportunityType
        )}
        onChange={(next) => onChange(next as OpportunityType)}
        error={error}
      />
    </section>
  );
}
