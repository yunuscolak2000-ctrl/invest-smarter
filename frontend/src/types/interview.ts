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
  | "q6"
  | "q7"
  | "q8"
  | "q9"
  | "review"
  | "decision";

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

export type CapexRange =
  | "lt_5m"
  | "5_25m"
  | "25_100m"
  | "100_500m"
  | "gt_500m"
  | "not_sure";

export type EvaluationContext =
  | "consultant_client"
  | "ipa_inbound"
  | "sponsor_own"
  | "bank_screen"
  | "zone_developer"
  | "public_agency";

export type BuyerType =
  | "b2b_contract"
  | "b2b_spot"
  | "b2c"
  | "b2g"
  | "mixed"
  | "unknown";

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
  currency: string | null;
  capexRange: CapexRange | null;
  evaluationContext: EvaluationContext | null;
  buyerType: BuyerType | null;
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
  currency: null,
  capexRange: null,
  evaluationContext: null,
  buyerType: null,
};

export const WIZARD_QUESTION_TOTAL = 12;
