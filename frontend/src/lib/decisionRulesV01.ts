/**
 * Decision Prototype v0.1 — deterministic intake policy over Q1–Q12.
 * Same frozen draft → same Decision Object. No AI. No Market/Financial scores.
 * Emits only proceed_with_conditions or defer.
 *
 * Manual fixtures: ./decisionRulesV01.fixtures.ts
 */

import { getCountry } from "../mocks/countries";
import type {
  ConditionId,
  DecisionObjectV01,
  DecisionPenalty,
  DecisionRisk,
  MandateTension,
} from "../types/decision";
import type {
  BuyerType,
  CapexRange,
  CountryRiskTier,
  DecisionNeeded,
  DemandCertainty,
  DevelopmentStage,
  EvaluationContext,
  InterviewDraft,
  LocationSpecificity,
  OpportunityType,
  SiteControl,
} from "../types/interview";

export const RULE_VERSION = "rules.v0.1" as const;
export const SCHEMA_VERSION = "decision_object.v0.1" as const;

const DEFER_VETOES = new Set([
  "VETO-CONF-THIN",
  "VETO-BUYER-MEGA",
  "VETO-CONCEPT-MEGA",
  "VETO-TRIPLE-THIN",
  "VETO-DEMAND-MEGA",
  "VETO-BANK-HYP",
  "VETO-FINANCE-READ",
]);

type FrozenIntake = {
  opportunityType: OpportunityType;
  sectorCode: string;
  sectorLabel: string | null;
  productSummary: string;
  countryCode: string;
  countryRiskTier: CountryRiskTier;
  locationSpecificity: LocationSpecificity;
  locationText: string | null;
  developmentStage: DevelopmentStage;
  currency: string;
  capexRange: CapexRange;
  evaluationContext: EvaluationContext;
  buyerType: BuyerType;
  demandCertainty: DemandCertainty;
  siteControl: SiteControl;
  decisionNeeded: DecisionNeeded;
};

function isCapexAtLeast100m(range: CapexRange): boolean {
  return range === "100_500m" || range === "gt_500m";
}

function isPhysicalSite(type: OpportunityType): boolean {
  return type === "greenfield" || type === "zone";
}

function freezeIntake(draft: InterviewDraft): FrozenIntake | null {
  const country = getCountry(draft.countryCode);
  if (
    !draft.opportunityType ||
    !draft.sectorCode ||
    !draft.productSummary.trim() ||
    !country ||
    !draft.locationSpecificity ||
    !draft.developmentStage ||
    !draft.currency ||
    !draft.capexRange ||
    !draft.evaluationContext ||
    !draft.buyerType ||
    !draft.demandCertainty ||
    !draft.siteControl ||
    !draft.decisionNeeded
  ) {
    return null;
  }

  return {
    opportunityType: draft.opportunityType,
    sectorCode: draft.sectorCode,
    sectorLabel: draft.sectorCode === "other" ? null : draft.sectorLabel,
    productSummary: draft.productSummary.trim(),
    countryCode: country.code,
    countryRiskTier: country.risk_tier,
    locationSpecificity: draft.locationSpecificity,
    locationText:
      draft.locationSpecificity === "country_only"
        ? null
        : draft.locationText.trim() || null,
    developmentStage: draft.developmentStage,
    currency: draft.currency,
    capexRange: draft.capexRange,
    evaluationContext: draft.evaluationContext,
    buyerType: draft.buyerType,
    demandCertainty: draft.demandCertainty,
    siteControl: draft.siteControl,
    decisionNeeded: draft.decisionNeeded,
  };
}

function mandateTension(intake: FrozenIntake): MandateTension {
  const { evaluationContext: context, opportunityType: type, buyerType: buyer } =
    intake;
  const sectorOther = intake.sectorCode === "other";

  if (context === "bank_screen" && buyer === "unknown") return "severe";
  if (context === "bank_screen" && intake.demandCertainty === "hypothesis") {
    return "severe";
  }
  if (context === "ipa_inbound" && type === "other" && sectorOther) return "severe";

  if (context === "bank_screen" && (buyer === "b2b_spot" || buyer === "b2c" || buyer === "mixed")) {
    return "mild";
  }
  if (context === "ipa_inbound" && type === "asset_light") return "mild";
  if (
    context === "zone_developer" &&
    (type === "asset_light" || intake.locationSpecificity === "country_only")
  ) {
    return "mild";
  }
  if (context === "public_agency" && type === "asset_light") return "mild";

  return "none";
}

function risksFrom(intake: FrozenIntake): DecisionRisk[] {
  const risks: DecisionRisk[] = [];
  const { buyerType: buyer, capexRange: capex, opportunityType: type } = intake;

  if (buyer === "unknown" && isCapexAtLeast100m(capex)) {
    risks.push({
      risk_id: "RISK-BUYER-MEGA",
      probability: "high",
      impact: "critical",
      status: "open",
    });
  }
  if (intake.demandCertainty === "hypothesis" && isCapexAtLeast100m(capex)) {
    risks.push({
      risk_id: "RISK-DEMAND-SCALE",
      probability: "high",
      impact: "critical",
      status: "open",
    });
  }
  if (intake.developmentStage === "concept" && capex === "gt_500m") {
    risks.push({
      risk_id: "RISK-CONCEPT-MEGA",
      probability: "high",
      impact: "high",
      status: "open",
    });
  }
  if (
    intake.developmentStage === "concept" &&
    intake.locationSpecificity === "country_only" &&
    (buyer === "unknown" || capex === "not_sure")
  ) {
    risks.push({
      risk_id: "RISK-TRIPLE-THIN",
      probability: "high",
      impact: "high",
      status: "open",
    });
  }
  if (intake.countryRiskTier === "restricted") {
    risks.push({
      risk_id: "RISK-GEO-RESTRICTED",
      probability: "medium",
      impact: "high",
      status: "open",
    });
  }
  if (capex === "not_sure") {
    risks.push({
      risk_id: "RISK-SCALE-UNKNOWN",
      probability: "medium",
      impact: "medium",
      status: "open",
    });
  }
  if (buyer === "unknown" && !risks.some((risk) => risk.risk_id === "RISK-BUYER-MEGA")) {
    risks.push({
      risk_id: "RISK-BUYER-UNKNOWN",
      probability: "medium",
      impact: "high",
      status: "open",
    });
  }
  if (intake.siteControl === "searching" && isPhysicalSite(type)) {
    risks.push({
      risk_id: "RISK-SITE-GREENFIELD",
      probability: "high",
      impact: "high",
      status: "open",
    });
  }

  return risks;
}

function confidenceFrom(intake: FrozenIntake): DecisionObjectV01["confidence"] {
  const restricted = intake.countryRiskTier === "restricted";
  const penalties: DecisionPenalty[] = [];
  const userDrivers: { delta: number; text: string }[] = [];

  if (intake.capexRange === "not_sure") {
    penalties.push({ code: "CAPEX_NOT_SURE", delta: -25 });
    userDrivers.push({ delta: -25, text: "Capital scale is unknown." });
  }
  if (intake.buyerType === "unknown") {
    penalties.push({ code: "BUYER_UNKNOWN", delta: -15 });
    userDrivers.push({ delta: -15, text: "Buyer type is undefined." });
  }
  if (intake.demandCertainty === "hypothesis") {
    penalties.push({ code: "DEMAND_HYPOTHESIS", delta: -15 });
    userDrivers.push({ delta: -15, text: "Demand is a hypothesis." });
  }
  if (intake.locationSpecificity === "country_only") {
    penalties.push({ code: "COUNTRY_ONLY", delta: -10 });
    userDrivers.push({ delta: -10, text: "Location is country-only." });
  }
  if (intake.siteControl === "searching") {
    penalties.push({ code: "SITE_SEARCHING", delta: -10 });
    userDrivers.push({ delta: -10, text: "Site is not selected." });
  }
  if (intake.sectorCode === "other") {
    penalties.push({ code: "SECTOR_OTHER", delta: -8 });
    userDrivers.push({ delta: -8, text: "Sector is unspecified (Other)." });
  }

  let value = 100 + penalties.reduce((sum, item) => sum + item.delta, 0);
  const uncapped = value;
  if (intake.capexRange === "not_sure" && intake.buyerType === "unknown") {
    value = Math.min(value, 40);
  }
  if (intake.demandCertainty === "hypothesis" && isCapexAtLeast100m(intake.capexRange)) {
    value = Math.min(value, 45);
  }
  if (restricted) {
    value = Math.min(value, 70);
  }
  value = Math.max(0, Math.min(100, value));

  const restrictedCapBinds = restricted && uncapped > 70;
  userDrivers.sort((a, b) => a.delta - b.delta);

  const qualityNote = "Confidence is evidence quality, not attractiveness.";
  const noSoft = "Collected answers contain no soft unknowns.";

  let drivers: [string, string];
  if (userDrivers.length >= 2) {
    drivers = [userDrivers[0].text, userDrivers[1].text];
  } else if (userDrivers.length === 1 && restrictedCapBinds) {
    drivers = [userDrivers[0].text, "Restricted geography caps confidence."];
  } else if (userDrivers.length === 1) {
    drivers = [userDrivers[0].text, qualityNote];
  } else if (restrictedCapBinds) {
    drivers = [noSoft, "Restricted geography caps confidence."];
  } else {
    drivers = [noSoft, qualityNote];
  }

  const band = value >= 70 ? "high" : value >= 45 ? "medium" : "low";
  return { value, band, penalties, drivers };
}

function conditionsFrom(intake: FrozenIntake): ConditionId[] {
  const ids: ConditionId[] = [];
  const offtake =
    intake.demandCertainty === "hypothesis" ||
    intake.demandCertainty === "advanced" ||
    intake.buyerType === "unknown";

  if (offtake) ids.push("COND-OFFTAKE");
  if (isPhysicalSite(intake.opportunityType) && intake.siteControl === "searching") {
    ids.push("COND-SITE");
  }
  if (intake.capexRange === "not_sure") ids.push("COND-SCALE");
  if (intake.countryRiskTier === "restricted") ids.push("COND-GEO");
  return ids.slice(0, 5);
}

function vetoesFrom(intake: FrozenIntake, confidence: number): string[] {
  const veto_ids: string[] = [];
  if (confidence < 40) veto_ids.push("VETO-CONF-THIN");
  if (intake.buyerType === "unknown" && isCapexAtLeast100m(intake.capexRange)) {
    veto_ids.push("VETO-BUYER-MEGA");
  }
  if (intake.developmentStage === "concept" && intake.capexRange === "gt_500m") {
    veto_ids.push("VETO-CONCEPT-MEGA");
  }
  if (
    intake.developmentStage === "concept" &&
    intake.locationSpecificity === "country_only" &&
    (intake.buyerType === "unknown" || intake.capexRange === "not_sure")
  ) {
    veto_ids.push("VETO-TRIPLE-THIN");
  }
  if (intake.demandCertainty === "hypothesis" && isCapexAtLeast100m(intake.capexRange)) {
    veto_ids.push("VETO-DEMAND-MEGA");
  }
  if (
    intake.evaluationContext === "bank_screen" &&
    intake.demandCertainty === "hypothesis"
  ) {
    veto_ids.push("VETO-BANK-HYP");
  }
  if (
    intake.decisionNeeded === "financing_read" &&
    intake.demandCertainty !== "binding" &&
    intake.demandCertainty !== "loi"
  ) {
    veto_ids.push("VETO-FINANCE-READ");
  }
  return veto_ids;
}

/**
 * Evaluate a validated Q1–Q12 draft. Returns null if hard fields are missing
 * (caller stays on Review). Emits only proceed_with_conditions or defer.
 */
export function evaluateDecisionV01(
  draft: InterviewDraft
): DecisionObjectV01 | null {
  const intake = freezeIntake(draft);
  if (!intake) return null;

  const confidence = confidenceFrom(intake);
  const condition_ids = conditionsFrom(intake);
  const risks = risksFrom(intake);
  const veto_ids = vetoesFrom(intake, confidence.value);
  const posture = veto_ids.some((id) => DEFER_VETOES.has(id))
    ? "defer"
    : "proceed_with_conditions";

  return {
    schema_version: SCHEMA_VERSION,
    rule_version: RULE_VERSION,
    engine: "intake_policy",
    posture,
    confidence,
    veto_ids,
    condition_ids,
    mandate_tension: mandateTension(intake),
    risks,
    missing_inputs: ["known_constraints"],
    export_blocked: intake.countryRiskTier === "restricted",
    fired_rule_ids: [...veto_ids, ...condition_ids],
    sources: [
      {
        source_id: "src-user-intake",
        source_type: "user_input",
        reliability_score: 80,
      },
    ],
    inputs: {
      opportunity_type: intake.opportunityType,
      sector_code: intake.sectorCode,
      sector_label: intake.sectorLabel,
      product_summary: intake.productSummary,
      country_code: intake.countryCode,
      country_risk_tier: intake.countryRiskTier,
      location_specificity: intake.locationSpecificity,
      location_text: intake.locationText,
      development_stage: intake.developmentStage,
      currency: intake.currency,
      capex_range: intake.capexRange,
      evaluation_context: intake.evaluationContext,
      buyer_type: intake.buyerType,
      demand_certainty: intake.demandCertainty,
      site_control: intake.siteControl,
      decision_needed: intake.decisionNeeded,
    },
  };
}
