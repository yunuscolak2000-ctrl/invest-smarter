import type { Ref } from "react";
import { AssistantPrompt } from "../../components/wizard/AssistantPrompt";
import { SelectCardGroup } from "../../components/wizard/SelectCard";
import { SITE_CONTROL_OPTIONS, WIZARD_COPY } from "../../mocks/interview";
import type { OpportunityType, SiteControl } from "../../types/interview";

type SiteControlStepProps = {
  value: SiteControl | null;
  opportunityType: OpportunityType | null;
  onChange: (value: SiteControl) => void;
  error: string | null;
  controlRef: Ref<HTMLFieldSetElement>;
};

export function SiteControlStep({
  value,
  opportunityType,
  onChange,
  error,
  controlRef,
}: SiteControlStepProps) {
  const message =
    opportunityType === "asset_light"
      ? WIZARD_COPY.q11.assetLightMessage
      : WIZARD_COPY.q11.message;

  return (
    <section className="space-y-6">
      <AssistantPrompt title={WIZARD_COPY.q11.title} message={message} />
      <SelectCardGroup
        ref={controlRef}
        name="site-control"
        value={value}
        options={SITE_CONTROL_OPTIONS}
        onChange={(next) => onChange(next as SiteControl)}
        error={error}
      />
      {value === "searching" ? (
        <p className="text-sm leading-relaxed text-slate-400">
          {WIZARD_COPY.q11.searchingConfirm}
        </p>
      ) : null}
    </section>
  );
}
