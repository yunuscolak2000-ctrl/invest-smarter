import type { Ref } from "react";
import { AssistantPrompt } from "../../components/wizard/AssistantPrompt";
import { SelectCardGroup } from "../../components/wizard/SelectCard";
import { useLanguage } from "../../hooks/useLanguage";
import {
  demandCertaintyOptions,
  q10Prompt,
} from "../../lib/contextAwareCopy";
import type {
  BuyerType,
  DemandCertainty,
  ProjectContext,
} from "../../types/interview";

type DemandCertaintyStepProps = {
  value: DemandCertainty | null;
  buyerType: BuyerType | null;
  projectContext: ProjectContext | null;
  onChange: (value: DemandCertainty) => void;
  error: string | null;
  controlRef: Ref<HTMLFieldSetElement>;
};

export function DemandCertaintyStep({
  value,
  buyerType,
  projectContext,
  onChange,
  error,
  controlRef,
}: DemandCertaintyStepProps) {
  const { language, copy } = useLanguage();
  const prompt = q10Prompt(projectContext, language);
  const showBuyerWarning =
    buyerType === "unknown" && (value === "binding" || value === "loi");

  return (
    <section className="space-y-6">
      <AssistantPrompt title={prompt.title} message={prompt.message} />
      <SelectCardGroup
        ref={controlRef}
        name="demand-certainty"
        value={value}
        options={demandCertaintyOptions(projectContext, language)}
        onChange={(next) => onChange(next as DemandCertainty)}
        error={error}
      />
      {value === "hypothesis" ? (
        <p className="text-sm leading-relaxed text-slate-400">
          {copy.q10.hypothesisConfirm}
        </p>
      ) : null}
      {showBuyerWarning ? (
        <p className="text-sm leading-relaxed text-slate-400">
          {copy.q10.buyerUndefinedWarning}
        </p>
      ) : null}
    </section>
  );
}
