import type { Ref } from "react";
import { AssistantPrompt } from "../../components/wizard/AssistantPrompt";
import { SelectCardGroup } from "../../components/wizard/SelectCard";
import { DEVELOPMENT_STAGE_OPTIONS, WIZARD_COPY } from "../../mocks/interview";
import type { DevelopmentStage } from "../../types/interview";

type DevelopmentStageStepProps = {
  value: DevelopmentStage | null;
  onChange: (value: DevelopmentStage) => void;
  error: string | null;
  controlRef: Ref<HTMLFieldSetElement>;
};

export function DevelopmentStageStep({
  value,
  onChange,
  error,
  controlRef,
}: DevelopmentStageStepProps) {
  return (
    <section className="space-y-6">
      <AssistantPrompt title={WIZARD_COPY.q6.title} message={WIZARD_COPY.q6.message} />
      <SelectCardGroup
        ref={controlRef}
        name="development-stage"
        value={value}
        options={DEVELOPMENT_STAGE_OPTIONS}
        onChange={(next) => onChange(next as DevelopmentStage)}
        error={error}
      />
    </section>
  );
}
