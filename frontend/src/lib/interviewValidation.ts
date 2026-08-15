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
