import type { Ref } from "react";
import { AssistantPrompt } from "../../components/wizard/AssistantPrompt";
import { SelectCardGroup } from "../../components/wizard/SelectCard";
import { OPPORTUNITY_TYPE_OPTIONS, WIZARD_COPY } from "../../mocks/interview";
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
  return (
    <section className="space-y-6">
      <AssistantPrompt title={WIZARD_COPY.q1.title} message={WIZARD_COPY.q1.message} />
      <SelectCardGroup
        ref={controlRef}
        name="opportunity-type"
        value={value}
        options={OPPORTUNITY_TYPE_OPTIONS}
        onChange={(next) => onChange(next as OpportunityType)}
        columns={2}
        error={error}
      />
    </section>
  );
}
