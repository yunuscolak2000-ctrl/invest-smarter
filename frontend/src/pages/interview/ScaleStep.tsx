import { useState, type Ref } from "react";
import { AssistantPrompt } from "../../components/wizard/AssistantPrompt";
import { Chip } from "../../components/wizard/Chip";
import { SelectCardGroup } from "../../components/wizard/SelectCard";
import { getCountry } from "../../mocks/countries";
import {
  capexRangeOptions,
  otherCurrencies,
  visibleCurrencies,
  WIZARD_COPY,
} from "../../mocks/interview";
import type { CapexRange, InterviewDraft } from "../../types/interview";

type ScaleStepProps = {
  draft: InterviewDraft;
  onCurrencyChange: (currency: string) => void;
  onRangeChange: (value: CapexRange) => void;
  error: string | null;
  controlRef: Ref<HTMLFieldSetElement>;
};

export function ScaleStep({
  draft,
  onCurrencyChange,
  onRangeChange,
  error,
  controlRef,
}: ScaleStepProps) {
  const countryCurrency = getCountry(draft.countryCode)?.currency ?? "USD";
  const currency = draft.currency ?? countryCurrency;
  const visible = visibleCurrencies(countryCurrency);
  const extras = otherCurrencies(visible);
  const currencyInVisible = visible.includes(currency);
  const [otherOpen, setOtherOpen] = useState(!currencyInVisible);

  function selectVisibleCurrency(code: string) {
    setOtherOpen(false);
    onCurrencyChange(code);
  }

  function selectOtherCurrency(code: string) {
    setOtherOpen(true);
    onCurrencyChange(code);
  }

  return (
    <section className="space-y-6">
      <AssistantPrompt title={WIZARD_COPY.q7.title} message={WIZARD_COPY.q7.message} />

      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-300">
          {WIZARD_COPY.q7.currencyLabel}
        </p>
        <div
          role="radiogroup"
          aria-label={WIZARD_COPY.q7.currencyLabel}
          className="flex flex-wrap gap-2"
        >
          {visible.map((code) => (
            <Chip
              key={code}
              label={code}
              selected={currency === code}
              onClick={() => selectVisibleCurrency(code)}
            />
          ))}
          <Chip
            label={WIZARD_COPY.q7.otherLabel}
            selected={!currencyInVisible}
            onClick={() => setOtherOpen(true)}
          />
        </div>
      </div>

      {otherOpen ? (
        <div className="flex flex-wrap gap-2">
          {extras.map((code) => (
            <Chip
              key={code}
              label={code}
              selected={currency === code}
              onClick={() => selectOtherCurrency(code)}
            />
          ))}
        </div>
      ) : null}

      <SelectCardGroup
        ref={controlRef}
        name="capex-range"
        value={draft.capexRange}
        options={capexRangeOptions(currency)}
        onChange={(next) => onRangeChange(next as CapexRange)}
        columns={2}
        error={error}
      />

      {draft.capexRange === "not_sure" ? (
        <p className="text-sm leading-relaxed text-slate-400">
          {WIZARD_COPY.q7.notSureConfirm}
        </p>
      ) : null}
    </section>
  );
}
