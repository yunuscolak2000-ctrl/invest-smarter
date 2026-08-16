import type { Ref } from "react";
import { AssistantPrompt } from "../../components/wizard/AssistantPrompt";
import { SelectCardGroup } from "../../components/wizard/SelectCard";
import { useLanguage } from "../../hooks/useLanguage";
import { buyerTypeOptions, q9Prompt } from "../../lib/contextAwareCopy";
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
  const { language, copy } = useLanguage();
  const prompt = q9Prompt(projectContext, language);

  return (
    <section className="space-y-6">
      <AssistantPrompt title={prompt.title} message={prompt.message} />
      <SelectCardGroup
        ref={controlRef}
        name="buyer-type"
        value={value}
        options={buyerTypeOptions(projectContext, language)}
        onChange={(next) => onChange(next as BuyerType)}
        error={error}
      />
      {value === "unknown" ? (
        <p className="text-sm leading-relaxed text-slate-400">
          {copy.q9.unknownConfirm}
        </p>
      ) : null}
    </section>
  );
}
