import type { Ref } from "react";
import { AssistantPrompt } from "../../components/wizard/AssistantPrompt";
import { SelectCardGroup } from "../../components/wizard/SelectCard";
import { DEMAND_CERTAINTY_OPTIONS, WIZARD_COPY } from "../../mocks/interview";
import type { BuyerType, DemandCertainty } from "../../types/interview";

type DemandCertaintyStepProps = {
  value: DemandCertainty | null;
  buyerType: BuyerType | null;
  onChange: (value: DemandCertainty) => void;
  error: string | null;
  controlRef: Ref<HTMLFieldSetElement>;
};

export function DemandCertaintyStep({
  value,
  buyerType,
  onChange,
  error,
  controlRef,
}: DemandCertaintyStepProps) {
  const showBuyerWarning =
    buyerType === "unknown" && (value === "binding" || value === "loi");

  return (
    <section className="space-y-6">
      <AssistantPrompt title={WIZARD_COPY.q10.title} message={WIZARD_COPY.q10.message} />
      <SelectCardGroup
        ref={controlRef}
        name="demand-certainty"
        value={value}
        options={DEMAND_CERTAINTY_OPTIONS}
        onChange={(next) => onChange(next as DemandCertainty)}
        error={error}
      />
      {value === "hypothesis" ? (
        <p className="text-sm leading-relaxed text-slate-400">
          {WIZARD_COPY.q10.hypothesisConfirm}
        </p>
      ) : null}
      {showBuyerWarning ? (
        <p className="text-sm leading-relaxed text-slate-400">
          {WIZARD_COPY.q10.buyerUndefinedWarning}
        </p>
      ) : null}
    </section>
  );
}
