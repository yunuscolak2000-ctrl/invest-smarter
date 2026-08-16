import type { Ref } from "react";
import { AssistantPrompt } from "../../components/wizard/AssistantPrompt";
import { SelectCardGroup } from "../../components/wizard/SelectCard";
import { useCopy } from "../../hooks/useLanguage";
import { labeledOptions } from "../../lib/i18n";
import { DEVELOPMENT_STAGE_OPTIONS } from "../../mocks/interview";
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
  const copy = useCopy();

  return (
    <section className="space-y-6">
      <AssistantPrompt title={copy.q6.title} message={copy.q6.message} />
      <SelectCardGroup
        ref={controlRef}
        name="development-stage"
        value={value}
        options={labeledOptions(
          DEVELOPMENT_STAGE_OPTIONS,
          copy.options.developmentStage
        )}
        onChange={(next) => onChange(next as DevelopmentStage)}
        error={error}
      />
    </section>
  );
}
