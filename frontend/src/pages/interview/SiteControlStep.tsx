import type { Ref } from "react";
import { AssistantPrompt } from "../../components/wizard/AssistantPrompt";
import { SelectCardGroup } from "../../components/wizard/SelectCard";
import { useCopy } from "../../hooks/useLanguage";
import { labeledOptions } from "../../lib/i18n";
import { SITE_CONTROL_OPTIONS } from "../../mocks/interview";
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
  const copy = useCopy();
  const message =
    opportunityType === "asset_light"
      ? copy.q11.assetLightMessage
      : copy.q11.message;

  return (
    <section className="space-y-6">
      <AssistantPrompt title={copy.q11.title} message={message} />
      <SelectCardGroup
        ref={controlRef}
        name="site-control"
        value={value}
        options={labeledOptions(SITE_CONTROL_OPTIONS, copy.options.siteControl)}
        onChange={(next) => onChange(next as SiteControl)}
        error={error}
      />
      {value === "searching" ? (
        <p className="text-sm leading-relaxed text-slate-400">
          {copy.q11.searchingConfirm}
        </p>
      ) : null}
    </section>
  );
}
