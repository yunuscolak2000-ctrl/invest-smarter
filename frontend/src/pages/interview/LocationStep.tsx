import type { Ref } from "react";
import { AssistantPrompt } from "../../components/wizard/AssistantPrompt";
import { SelectCardGroup } from "../../components/wizard/SelectCard";
import { TextField } from "../../components/wizard/TextField";
import { useCopy } from "../../hooks/useLanguage";
import { labeledOptions } from "../../lib/i18n";
import { getCountry } from "../../mocks/countries";
import { LOCATION_SPECIFICITY_OPTIONS } from "../../mocks/interview";
import type { InterviewDraft, LocationSpecificity } from "../../types/interview";

type LocationStepProps = {
  draft: InterviewDraft;
  onSpecificityChange: (value: LocationSpecificity) => void;
  onLocationTextChange: (value: string) => void;
  error: string | null;
  fieldsetRef: Ref<HTMLFieldSetElement>;
  inputRef: Ref<HTMLInputElement>;
};

export function LocationStep({
  draft,
  onSpecificityChange,
  onLocationTextChange,
  error,
  fieldsetRef,
  inputRef,
}: LocationStepProps) {
  const copy = useCopy();
  const countryName =
    getCountry(draft.countryCode)?.name ?? copy.q5.countryFallback;
  const showTextField =
    draft.locationSpecificity === "city_known" ||
    draft.locationSpecificity === "region_known";
  const selectionError = showTextField ? null : error;
  const textError = showTextField ? error : null;
  const isCity = draft.locationSpecificity === "city_known";

  return (
    <section className="space-y-6">
      <AssistantPrompt
        title={copy.q5.title}
        message={copy.q5.message(countryName)}
      />

      <SelectCardGroup
        ref={fieldsetRef}
        name="location-specificity"
        value={draft.locationSpecificity}
        options={labeledOptions(
          LOCATION_SPECIFICITY_OPTIONS,
          copy.options.locationSpecificity
        )}
        onChange={(next) => onSpecificityChange(next as LocationSpecificity)}
        error={selectionError}
      />

      {showTextField ? (
        <TextField
          ref={inputRef}
          id="location-text"
          label={isCity ? copy.q5.cityLabel : copy.q5.regionLabel}
          value={draft.locationText}
          onChange={onLocationTextChange}
          placeholder={
            isCity ? copy.q5.cityPlaceholder : copy.q5.regionPlaceholder
          }
          maxLength={60}
          helper={copy.q5.helper}
          error={textError}
        />
      ) : null}
    </section>
  );
}
