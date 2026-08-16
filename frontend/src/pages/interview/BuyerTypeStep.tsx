import type { Ref } from "react";
import { AssistantPrompt } from "../../components/wizard/AssistantPrompt";
import { SelectCardGroup } from "../../components/wizard/SelectCard";
import { buyerTypeOptions, q9Prompt } from "../../lib/contextAwareCopy";
import { WIZARD_COPY } from "../../mocks/interview";
import type { BuyerType, ProjectContext } from "../../types/interview";

type BuyerTypeStepProps = {
  value: BuyerType | null;
  projectContext: ProjectContext | null;
  onChange: (value: BuyerType) => void;
  error: string | null;
  controlRef: Ref<HTMLFieldSetElement>;
};

export function BuyerTypeStep({
  value,
  projectContext,
  onChange,
  error,
  controlRef,
}: BuyerTypeStepProps) {
  const copy = q9Prompt(projectContext);

  return (
    <section className="space-y-6">
      <AssistantPrompt title={copy.title} message={copy.message} />
      <SelectCardGroup
        ref={controlRef}
        name="buyer-type"
        value={value}
        options={buyerTypeOptions(projectContext)}
        onChange={(next) => onChange(next as BuyerType)}
        error={error}
      />
      {value === "unknown" ? (
        <p className="text-sm leading-relaxed text-slate-400">
          {WIZARD_COPY.q9.unknownConfirm}
        </p>
      ) : null}
    </section>
  );
}
