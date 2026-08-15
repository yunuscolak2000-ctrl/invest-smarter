export type InterviewLocationState = {
  investmentIdea: string;
};

export function isInterviewLocationState(
  value: unknown
): value is InterviewLocationState {
  return (
    typeof value === "object" &&
    value !== null &&
    "investmentIdea" in value &&
    typeof (value as InterviewLocationState).investmentIdea === "string"
  );
}

export type WizardStepId = "framing" | "q1" | "q2" | "q3";

export type OpportunityType =
  | "greenfield"
  | "expansion"
  | "brownfield"
  | "zone"
  | "asset_light"
  | "other";

export type SelectOption<T extends string = string> = {
  value: T;
  label: string;
  helper?: string;
};

export type SectorOption = {
  code: string;
  label: string;
  parent?: string;
};

export type InterviewDraft = {
  opportunityType: OpportunityType | null;
  sectorCode: string | null;
  sectorLabel: string | null;
  sectorOther: string;
  productSummary: string;
};

export const EMPTY_INTERVIEW_DRAFT: InterviewDraft = {
  opportunityType: null,
  sectorCode: null,
  sectorLabel: null,
  sectorOther: "",
  productSummary: "",
};

export const WIZARD_QUESTION_TOTAL = 12;
