import { getCountry } from "../mocks/countries";
import { SECTOR_TAXONOMY } from "../mocks/interview";
import type { InterviewDraft } from "../types/interview";
import type { UiCopy } from "./copy/types";

const SECTOR_OTHER_PATTERN = /^[A-Za-z0-9][A-Za-z0-9 \-]{1,38}[A-Za-z0-9]$/;
const EMAIL_PATTERN = /\S+@\S+\.\S+/;
const URL_PATTERN = /https?:\/\/|www\./i;

export const VALIDATION_COPY = {
  selectOption: "Select an option to continue",
  sectorOther:
    "Enter a sector of 3–40 characters using letters, numbers, spaces, or hyphens",
  productLength: "Describe the output in 8–80 characters",
  productContact:
    "Remove any URL or email — this should be a product, not a link",
  country: "Choose a country from the list",
  restrictedAck: "Confirm you understand analysis may be held for review",
  locationText: "Enter a city or region of 2–60 characters",
} as const;

type ValidationCopy = UiCopy["validation"];

function text(copy?: ValidationCopy): ValidationCopy {
  return copy ?? VALIDATION_COPY;
}

export function isOtherSector(code: string | null): boolean {
  return code === "other";
}

export function validateProjectContext(
  draft: InterviewDraft,
  copy?: ValidationCopy
): string | null {
  return draft.projectContext ? null : text(copy).selectOption;
}

export function validateOpportunityType(
  draft: InterviewDraft,
  copy?: ValidationCopy
): string | null {
  return draft.opportunityType ? null : text(copy).selectOption;
}

export function validateSector(
  draft: InterviewDraft,
  copy?: ValidationCopy
): string | null {
  const messages = text(copy);
  if (isOtherSector(draft.sectorCode)) {
    const other = draft.sectorOther.trim();
    if (
      other.length < 3 ||
      other.length > 40 ||
      !SECTOR_OTHER_PATTERN.test(other)
    ) {
      return messages.sectorOther;
    }
    return null;
  }

  const known = SECTOR_TAXONOMY.some(
    (sector) => sector.code === draft.sectorCode
  );
  return known ? null : messages.selectOption;
}

export function validateProduct(
  draft: InterviewDraft,
  copy?: ValidationCopy
): string | null {
  const messages = text(copy);
  const value = draft.productSummary.trim();
  if (value.length < 8 || value.length > 80) {
    return messages.productLength;
  }
  if (EMAIL_PATTERN.test(value) || URL_PATTERN.test(value)) {
    return messages.productContact;
  }
  return null;
}

export function validateCountry(
  draft: InterviewDraft,
  copy?: ValidationCopy
): string | null {
  const messages = text(copy);
  const country = getCountry(draft.countryCode);
  if (!country) return messages.country;
  if (country.risk_tier === "restricted" && !draft.restrictedGeoAck) {
    return messages.restrictedAck;
  }
  return null;
}

export function validateLocation(
  draft: InterviewDraft,
  copy?: ValidationCopy
): string | null {
  const messages = text(copy);
  if (!draft.locationSpecificity) return messages.selectOption;
  if (draft.locationSpecificity === "country_only") return null;

  const value = draft.locationText.trim();
  if (value.length < 2 || value.length > 60) {
    return messages.locationText;
  }
  return null;
}

export function validateDevelopmentStage(
  draft: InterviewDraft,
  copy?: ValidationCopy
): string | null {
  return draft.developmentStage ? null : text(copy).selectOption;
}

export function validateCapitalScale(
  draft: InterviewDraft,
  copy?: ValidationCopy
): string | null {
  if (!draft.currency || !draft.capexRange) return text(copy).selectOption;
  return null;
}

export function validateEvaluationContext(
  draft: InterviewDraft,
  copy?: ValidationCopy
): string | null {
  return draft.evaluationContext ? null : text(copy).selectOption;
}

export function validateBuyerType(
  draft: InterviewDraft,
  copy?: ValidationCopy
): string | null {
  return draft.buyerType ? null : text(copy).selectOption;
}

export function validateDemandCertainty(
  draft: InterviewDraft,
  copy?: ValidationCopy
): string | null {
  return draft.demandCertainty ? null : text(copy).selectOption;
}

export function validateSiteControl(
  draft: InterviewDraft,
  copy?: ValidationCopy
): string | null {
  return draft.siteControl ? null : text(copy).selectOption;
}

export function validateDecisionNeeded(
  draft: InterviewDraft,
  copy?: ValidationCopy
): string | null {
  return draft.decisionNeeded ? null : text(copy).selectOption;
}

const DRAFT_CHECKS: {
  step:
    | "projectContext"
    | "q1"
    | "q2"
    | "q3"
    | "q4"
    | "q5"
    | "q6"
    | "q7"
    | "q8"
    | "q9"
    | "q10"
    | "q11"
    | "q12";
  validate: (draft: InterviewDraft, copy?: ValidationCopy) => string | null;
}[] = [
  { step: "projectContext", validate: validateProjectContext },
  { step: "q1", validate: validateOpportunityType },
  { step: "q2", validate: validateSector },
  { step: "q3", validate: validateProduct },
  { step: "q4", validate: validateCountry },
  { step: "q5", validate: validateLocation },
  { step: "q6", validate: validateDevelopmentStage },
  { step: "q7", validate: validateCapitalScale },
  { step: "q8", validate: validateEvaluationContext },
  { step: "q9", validate: validateBuyerType },
  { step: "q10", validate: validateDemandCertainty },
  { step: "q11", validate: validateSiteControl },
  { step: "q12", validate: validateDecisionNeeded },
];

export function validateInterviewQuestions(
  draft: InterviewDraft,
  copy?: ValidationCopy
): {
  step: Exclude<(typeof DRAFT_CHECKS)[number]["step"], "projectContext">;
  message: string;
} | null {
  for (const check of DRAFT_CHECKS) {
    if (check.step === "projectContext") continue;
    const message = check.validate(draft, copy);
    if (message) return { step: check.step, message };
  }
  return null;
}

export function validateInterviewDraft(
  draft: InterviewDraft,
  copy?: ValidationCopy
): { step: (typeof DRAFT_CHECKS)[number]["step"]; message: string } | null {
  for (const check of DRAFT_CHECKS) {
    const message = check.validate(draft, copy);
    if (message) return { step: check.step, message };
  }
  return null;
}
