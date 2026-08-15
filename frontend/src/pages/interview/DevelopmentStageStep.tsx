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
  reachedEnd: boolean;
};

export function DevelopmentStageStep({
  value,
  onChange,
  error,
  controlRef,
  reachedEnd,
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
      {reachedEnd ? (
        <p className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-400">
          Development stage captured. Questions 7–12 are not in this sprint. You
          can go back and edit these answers.
        </p>
      ) : null}
    </section>
  );
}
