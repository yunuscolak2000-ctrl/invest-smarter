/**
 * Deterministic Q1–Q12 fixtures for Decision Prototype v0.1.
 * projectContext is setup only; it must not change rules.v0.1.
 * Not used by the UI. Pair with ./decisionRulesV01.qa.ts.
 */

import type { InterviewDraft } from "../types/interview";

function fromStrong(patch: Partial<InterviewDraft>): InterviewDraft {
  return { ...FIXTURE_STRONG, ...patch };
}

/** 1. Strong clean case — expansion / binding / secured / mandate screen */
export const FIXTURE_STRONG: InterviewDraft = {
  projectContext: "private_investment",
  opportunityType: "expansion",
  sectorCode: "energy.renewable.solar",
  sectorLabel: "Energy — Solar",
  sectorOther: "",
  productSummary: "Utility-scale solar PV for industrial offtake",
  countryCode: "TR",
  restrictedGeoAck: false,
  locationSpecificity: "city_known",
  locationText: "Gaziantep",
  developmentStage: "operating",
  currency: "EUR",
  capexRange: "5_25m",
  evaluationContext: "ipa_inbound",
  buyerType: "b2b_contract",
  demandCertainty: "binding",
  siteControl: "secured",
  decisionNeeded: "mandate_screen",
};

/** 2. Average conditions — greenfield / advanced / searching */
export const FIXTURE_AVERAGE: InterviewDraft = {
  projectContext: "private_investment",
  opportunityType: "greenfield",
  sectorCode: "energy.renewable.solar",
  sectorLabel: "Energy — Solar",
  sectorOther: "",
  productSummary: "Solar PV plant for regional offtake",
  countryCode: "TR",
  restrictedGeoAck: false,
  locationSpecificity: "region_known",
  locationText: "Central Anatolia",
  developmentStage: "pre_feasibility",
  currency: "EUR",
  capexRange: "25_100m",
  evaluationContext: "ipa_inbound",
  buyerType: "mixed",
  demandCertainty: "advanced",
  siteControl: "searching",
  decisionNeeded: "mandate_screen",
};

/** 3. Weak defer — stacked soft unknowns + bank screen + financing read */
export const FIXTURE_WEAK: InterviewDraft = {
  projectContext: "private_investment",
  opportunityType: "greenfield",
  sectorCode: "other",
  sectorLabel: null,
  sectorOther: "new materials",
  productSummary: "Advanced materials campus",
  countryCode: "RU",
  restrictedGeoAck: true,
  locationSpecificity: "country_only",
  locationText: "",
  developmentStage: "concept",
  currency: "USD",
  capexRange: "not_sure",
  evaluationContext: "bank_screen",
  buyerType: "unknown",
  demandCertainty: "hypothesis",
  siteControl: "searching",
  decisionNeeded: "financing_read",
};

/**
 * 4. Hypothesis at ≥ 100m, otherwise a clean file.
 * Isolates VETO-DEMAND-MEGA and the 45 confidence cap.
 */
export const FIXTURE_HYPOTHESIS_MEGA: InterviewDraft = fromStrong({
  capexRange: "100_500m",
  demandCertainty: "hypothesis",
});

/**
 * 5. Financing read without paper.
 * Uses advanced (not hypothesis) so this veto is not mixed with bank/hypothesis rules.
 */
export const FIXTURE_FINANCING_READ: InterviewDraft = fromStrong({
  demandCertainty: "advanced",
  decisionNeeded: "financing_read",
});

/**
 * 6. Bank screen with hypothesized demand, otherwise a clean file.
 */
export const FIXTURE_BANK_HYPOTHESIS: InterviewDraft = fromStrong({
  evaluationContext: "bank_screen",
  demandCertainty: "hypothesis",
});

/**
 * 7. Restricted geography on an otherwise clean file.
 * Must not defer only because the country is restricted.
 */
export const FIXTURE_RESTRICTED_GEO: InterviewDraft = fromStrong({
  countryCode: "RU",
  restrictedGeoAck: true,
});
