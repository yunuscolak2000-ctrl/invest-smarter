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

export type WizardStepId =
  | "framing"
  | "q1"
  | "q2"
  | "q3"
  | "q4"
  | "q5"
  | "q6";

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

export type LabeledOption = {
  code: string;
  label: string;
};

export type SectorOption = LabeledOption & {
  parent?: string;
};

export type LocationSpecificity =
  | "city_known"
  | "region_known"
  | "country_only";

export type DevelopmentStage =
  | "concept"
  | "pre_feasibility"
  | "feasibility"
  | "ready_to_finance"
  | "construction"
  | "operating";

export type CountryRiskTier = "standard" | "restricted";

export type CountryOption = {
  code: string;
  name: string;
  currency: string;
  risk_tier: CountryRiskTier;
};

export type InterviewDraft = {
  opportunityType: OpportunityType | null;
  sectorCode: string | null;
  sectorLabel: string | null;
  sectorOther: string;
  productSummary: string;
  countryCode: string | null;
  restrictedGeoAck: boolean;
  locationSpecificity: LocationSpecificity | null;
  locationText: string;
  developmentStage: DevelopmentStage | null;
};

export const EMPTY_INTERVIEW_DRAFT: InterviewDraft = {
  opportunityType: null,
  sectorCode: null,
  sectorLabel: null,
  sectorOther: "",
  productSummary: "",
  countryCode: null,
  restrictedGeoAck: false,
  locationSpecificity: null,
  locationText: "",
  developmentStage: null,
};

export const WIZARD_QUESTION_TOTAL = 12;
