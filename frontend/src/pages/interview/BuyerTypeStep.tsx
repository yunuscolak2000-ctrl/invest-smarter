import type { Ref } from "react";
import { AssistantPrompt } from "../../components/wizard/AssistantPrompt";
import { SelectCardGroup } from "../../components/wizard/SelectCard";
import { BUYER_TYPE_OPTIONS, WIZARD_COPY } from "../../mocks/interview";
import type { BuyerType } from "../../types/interview";

type BuyerTypeStepProps = {
  value: BuyerType | null;
  onChange: (value: BuyerType) => void;
  error: string | null;
  controlRef: Ref<HTMLFieldSetElement>;
};

export function BuyerTypeStep({
  value,
  onChange,
  error,
  controlRef,
}: BuyerTypeStepProps) {
  return (
    <section className="space-y-6">
      <AssistantPrompt title={WIZARD_COPY.q9.title} message={WIZARD_COPY.q9.message} />
      <SelectCardGroup
        ref={controlRef}
        name="buyer-type"
        value={value}
        options={BUYER_TYPE_OPTIONS}
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
