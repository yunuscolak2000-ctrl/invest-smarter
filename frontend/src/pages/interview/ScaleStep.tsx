import { useState, type Ref } from "react";
import { AssistantPrompt } from "../../components/wizard/AssistantPrompt";
import { Chip } from "../../components/wizard/Chip";
import { SelectCardGroup } from "../../components/wizard/SelectCard";
import { useCopy } from "../../hooks/useLanguage";
import { labeledOptions } from "../../lib/i18n";
import { getCountry } from "../../mocks/countries";
import {
  CAPEX_RANGE_BASE,
  otherCurrencies,
  visibleCurrencies,
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
  const copy = useCopy();
  const countryCurrency = getCountry(draft.countryCode)?.currency ?? "USD";
  const currency = draft.currency ?? countryCurrency;
  const visible = visibleCurrencies(countryCurrency);
  const extras = otherCurrencies(visible);
  const currencyInVisible = visible.includes(currency);
  const [otherOpen, setOtherOpen] = useState(!currencyInVisible);
  const rangeOptions = labeledOptions(
    CAPEX_RANGE_BASE,
    copy.options.capexRange
  ).map((option) =>
    option.value === "not_sure"
      ? option
      : { ...option, label: `${option.label} ${currency}` }
  );

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
      <AssistantPrompt title={copy.q7.title} message={copy.q7.message} />

      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-300">
          {copy.q7.currencyLabel}
        </p>
        <div
          role="radiogroup"
          aria-label={copy.q7.currencyLabel}
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
            label={copy.q7.otherLabel}
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
        options={rangeOptions}
        onChange={(next) => onRangeChange(next as CapexRange)}
        columns={2}
        error={error}
      />

      {draft.capexRange === "not_sure" ? (
        <p className="text-sm leading-relaxed text-slate-400">
          {copy.q7.notSureConfirm}
        </p>
      ) : null}
    </section>
  );
}
