import type { Ref } from "react";
import { AssistantPrompt } from "../../components/wizard/AssistantPrompt";
import { SelectCardGroup } from "../../components/wizard/SelectCard";
import { TextField } from "../../components/wizard/TextField";
import { getCountry } from "../../mocks/countries";
import { LOCATION_SPECIFICITY_OPTIONS, WIZARD_COPY } from "../../mocks/interview";
import type { InterviewDraft, LocationSpecificity } from "../../types/interview";

type LocationStepProps = {
  draft: InterviewDraft;
  onSpecificityChange: (value: LocationSpecificity) => void;
  onLocationTextChange: (value: string) => void;
  error: string | null;
  fieldsetRef: Ref<HTMLFieldSetElement>;
  inputRef: Ref<HTMLInputElement>;
};

function locationMessage(countryName: string): string {
  return `How specific is the location in ${countryName}? City or region helps; ‘not decided’ is fine at this stage.`;
}

export function LocationStep({
  draft,
  onSpecificityChange,
  onLocationTextChange,
  error,
  fieldsetRef,
  inputRef,
}: LocationStepProps) {
  const countryName = getCountry(draft.countryCode)?.name ?? "the selected country";
  const showTextField =
    draft.locationSpecificity === "city_known" ||
    draft.locationSpecificity === "region_known";
  const selectionError = showTextField ? null : error;
  const textError = showTextField ? error : null;
  const isCity = draft.locationSpecificity === "city_known";

  return (
    <section className="space-y-6">
      <AssistantPrompt
        title={WIZARD_COPY.q5.title}
        message={locationMessage(countryName)}
      />

      <SelectCardGroup
        ref={fieldsetRef}
        name="location-specificity"
        value={draft.locationSpecificity}
        options={LOCATION_SPECIFICITY_OPTIONS}
        onChange={(next) => onSpecificityChange(next as LocationSpecificity)}
        error={selectionError}
      />

      {showTextField ? (
        <TextField
          ref={inputRef}
          id="location-text"
          label={isCity ? WIZARD_COPY.q5.cityLabel : WIZARD_COPY.q5.regionLabel}
          value={draft.locationText}
          onChange={onLocationTextChange}
          placeholder={
            isCity
              ? WIZARD_COPY.q5.cityPlaceholder
              : WIZARD_COPY.q5.regionPlaceholder
          }
          maxLength={60}
          helper="2–60 characters."
          error={textError}
        />
      ) : null}
    </section>
  );
}
