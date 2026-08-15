import type { Ref } from "react";
import { AssistantPrompt } from "../../components/wizard/AssistantPrompt";
import { Chip } from "../../components/wizard/Chip";
import { FieldError } from "../../components/wizard/FieldError";
import { SearchSelect } from "../../components/wizard/SearchSelect";
import {
  COUNTRY_SEARCH_OPTIONS,
  PINNED_COUNTRIES,
  getCountry,
  isRestrictedCountry,
} from "../../mocks/countries";
import { OPPORTUNITY_TYPE_ACK, WIZARD_COPY } from "../../mocks/interview";
import type {
  CountryOption,
  InterviewDraft,
  LabeledOption,
} from "../../types/interview";

type CountryStepProps = {
  draft: InterviewDraft;
  onSelect: (country: CountryOption) => void;
  onAckChange: (acknowledged: boolean) => void;
  error: string | null;
  searchRef: Ref<HTMLInputElement>;
  ackRef: Ref<HTMLInputElement>;
};

function countryMessage(draft: InterviewDraft): string {
  if (!draft.opportunityType) return WIZARD_COPY.q4.message;
  const phrase = OPPORTUNITY_TYPE_ACK[draft.opportunityType];
  return `For this ${phrase}, where is the investment located? Country is required for market and regulatory analysis.`;
}

export function CountryStep({
  draft,
  onSelect,
  onAckChange,
  error,
  searchRef,
  ackRef,
}: CountryStepProps) {
  const selected = getCountry(draft.countryCode);
  const restricted = isRestrictedCountry(draft.countryCode);
  const countryError = selected ? null : error;
  const ackError = restricted ? error : null;

  function handleSearchSelect(option: LabeledOption) {
    const country = getCountry(option.code);
    if (country) onSelect(country);
  }

  return (
    <section className="space-y-6">
      <AssistantPrompt
        title={WIZARD_COPY.q4.title}
        message={countryMessage(draft)}
      />

      <div className="flex flex-wrap gap-2">
        {PINNED_COUNTRIES.map((country) => (
          <Chip
            key={country.code}
            label={country.name}
            selected={draft.countryCode === country.code}
            onClick={() => onSelect(country)}
          />
        ))}
      </div>

      <SearchSelect
        ref={searchRef}
        id="country-search"
        label="All countries"
        options={COUNTRY_SEARCH_OPTIONS}
        value={draft.countryCode}
        onChange={handleSearchSelect}
        error={countryError}
        placeholder="Search by name or ISO code"
        helper={WIZARD_COPY.q4.helper}
        emptyMessage="No matching countries"
        minQueryLength={2}
        minQueryMessage="Type at least 2 letters to search"
      />

      {selected ? (
        <p className="text-sm text-slate-400">
          Selected:{" "}
          <span className="font-medium text-slate-200">
            {selected.name} ({selected.code})
          </span>
        </p>
      ) : null}

      {restricted ? (
        <div className="space-y-3 rounded-2xl border border-amber-500/40 bg-amber-950/25 px-4 py-4">
          <p className="text-sm leading-relaxed text-amber-200">
            {WIZARD_COPY.q4.restrictedWarning}
          </p>
          <label className="flex min-h-11 cursor-pointer items-start gap-3">
            <input
              ref={ackRef}
              id="restricted-geo-ack"
              type="checkbox"
              checked={draft.restrictedGeoAck}
              onChange={(event) => onAckChange(event.target.checked)}
              aria-invalid={ackError ? true : undefined}
              aria-describedby={ackError ? "restricted-geo-ack-error" : undefined}
              className="mt-1 h-4 w-4 shrink-0 accent-emerald-500 focus:ring-emerald-500/40"
            />
            <span className="text-sm leading-relaxed text-slate-200">
              {WIZARD_COPY.q4.restrictedAck}
            </span>
          </label>
          <FieldError id="restricted-geo-ack-error" message={ackError} />
        </div>
      ) : null}
    </section>
  );
}
