import { getCountry } from "../mocks/countries";
import { SECTOR_TAXONOMY } from "../mocks/interview";
import type { InterviewDraft } from "../types/interview";

const SECTOR_OTHER_PATTERN = /^[A-Za-z0-9][A-Za-z0-9 \-]{1,38}[A-Za-z0-9]$/;
const EMAIL_PATTERN = /\S+@\S+\.\S+/;
const URL_PATTERN = /https?:\/\/|www\./i;

export const VALIDATION_COPY = {
  selectOption: "Select an option to continue",
  sectorOther:
    "Enter a sector of 3–40 characters using letters, numbers, spaces, or hyphens",
  productLength: "Describe the output in 8–80 characters",
  productContact: "Remove any URL or email — this should be a product, not a link",
  country: "Choose a country from the list",
  restrictedAck: "Confirm you understand analysis may be held for review",
  locationText: "Enter a city or region of 2–60 characters",
} as const;

export function isOtherSector(code: string | null): boolean {
  return code === "other";
}

export function validateOpportunityType(
  draft: InterviewDraft
): string | null {
  return draft.opportunityType ? null : VALIDATION_COPY.selectOption;
}

export function validateSector(draft: InterviewDraft): string | null {
  if (isOtherSector(draft.sectorCode)) {
    const other = draft.sectorOther.trim();
    if (other.length < 3 || other.length > 40 || !SECTOR_OTHER_PATTERN.test(other)) {
      return VALIDATION_COPY.sectorOther;
    }
    return null;
  }

  const known = SECTOR_TAXONOMY.some((sector) => sector.code === draft.sectorCode);
  return known ? null : VALIDATION_COPY.selectOption;
}

export function validateProduct(draft: InterviewDraft): string | null {
  const value = draft.productSummary.trim();
  if (value.length < 8 || value.length > 80) {
    return VALIDATION_COPY.productLength;
  }
  if (EMAIL_PATTERN.test(value) || URL_PATTERN.test(value)) {
    return VALIDATION_COPY.productContact;
  }
  return null;
}

export function validateCountry(draft: InterviewDraft): string | null {
  const country = getCountry(draft.countryCode);
  if (!country) return VALIDATION_COPY.country;
  if (country.risk_tier === "restricted" && !draft.restrictedGeoAck) {
    return VALIDATION_COPY.restrictedAck;
  }
  return null;
}

export function validateLocation(draft: InterviewDraft): string | null {
  if (!draft.locationSpecificity) return VALIDATION_COPY.selectOption;
  if (draft.locationSpecificity === "country_only") return null;

  const value = draft.locationText.trim();
  if (value.length < 2 || value.length > 60) {
    return VALIDATION_COPY.locationText;
  }
  return null;
}

export function validateDevelopmentStage(draft: InterviewDraft): string | null {
  return draft.developmentStage ? null : VALIDATION_COPY.selectOption;
}
