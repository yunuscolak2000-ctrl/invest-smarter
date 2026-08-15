/**
 * Deterministic Q1–Q9 fixtures for Decision Prototype v0.1.
 * Not used by the UI. Call evaluateDecisionV01(draft) in a console to verify.
 *
 * Expected:
 *   strong  → proceed_with_conditions, confidence 80, COND-OFFTAKE
 *   average → proceed_with_conditions, confidence 80, COND-OFFTAKE + COND-SITE
 *   weak    → defer, confidence 22, offtake + site + scale + geo
 */

import type { InterviewDraft } from "../types/interview";

export const FIXTURE_STRONG: InterviewDraft = {
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
};

export const FIXTURE_AVERAGE: InterviewDraft = {
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
};

export const FIXTURE_WEAK: InterviewDraft = {
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
};
