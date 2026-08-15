/**
 * Temporary Sprint 3.0 mock of Decision Object v0.1.
 * Applies the frozen intake policy to a Q1–Q9 draft.
 * This is not the Decision Engine: no Market/Financial modules, no persistence.
 */

import { getCountry } from "./countries";
import type {
  ConditionId,
  DecisionObjectV01,
  DecisionPenalty,
  DecisionPosture,
  DecisionRisk,
  MandateTension,
} from "../types/decision";
import type { CapexRange, InterviewDraft } from "../types/interview";

const MISSING_INPUTS = [
  "demand_certainty",
  "site_control",
  "decision_needed",
  "known_constraints",
] as const;

const INCOMPLETE_DRIVER =
  "Interview is incomplete: demand certainty, site control, and decision needed were not collected.";

function isCapexAtLeast100m(range: CapexRange): boolean {
  return range === "100_500m" || range === "gt_500m";
}

function mandateTension(draft: InterviewDraft): MandateTension {
  const context = draft.evaluationContext;
  const type = draft.opportunityType;
  const buyer = draft.buyerType;

  if (context === "ipa_inbound" && type === "other" && draft.sectorCode === "other") {
    return "severe";
  }
  if (context === "bank_screen" && buyer === "unknown") return "severe";

  if (context === "ipa_inbound" && type === "asset_light") return "mild";
  if (
    context === "bank_screen" &&
    (buyer === "b2b_spot" || buyer === "b2c" || buyer === "mixed")
  ) {
    return "mild";
  }
  if (
    context === "zone_developer" &&
    (type === "asset_light" || draft.locationSpecificity === "country_only")
  ) {
    return "mild";
  }
  if (context === "public_agency" && type === "asset_light") return "mild";

  return "none";
}

function buildRisks(draft: InterviewDraft): DecisionRisk[] {
  const risks: DecisionRisk[] = [];
  const type = draft.opportunityType;
  const capex = draft.capexRange;
  const buyer = draft.buyerType;
  const country = getCountry(draft.countryCode);

  if (buyer === "unknown" && capex && isCapexAtLeast100m(capex)) {
    risks.push({
      risk_id: "RISK-BUYER-MEGA",
      probability: "high",
      impact: "critical",
      status: "open",
    });
  }
  if (draft.developmentStage === "concept" && capex === "gt_500m") {
    risks.push({
      risk_id: "RISK-CONCEPT-MEGA",
      probability: "high",
      impact: "high",
      status: "open",
    });
  }
  if (
    draft.developmentStage === "concept" &&
    draft.locationSpecificity === "country_only" &&
    (buyer === "unknown" || capex === "not_sure")
  ) {
    risks.push({
      risk_id: "RISK-TRIPLE-THIN",
      probability: "high",
      impact: "high",
      status: "open",
    });
  }
  if (country?.risk_tier === "restricted") {
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
  if (
    draft.locationSpecificity === "country_only" &&
    (type === "greenfield" || type === "zone")
  ) {
    risks.push({
      risk_id: "RISK-SITE-UNSPECIFIC",
      probability: "high",
      impact: "high",
      status: "open",
    });
  }

  return risks;
}

function confidenceFrom(draft: InterviewDraft, restricted: boolean): {
  value: number;
  band: "low" | "medium" | "high";
  penalties: DecisionPenalty[];
  drivers: [string, string];
} {
  const penalties: DecisionPenalty[] = [
    { code: "Q10_Q12_NOT_COLLECTED", delta: -20 },
  ];
  const userDrivers: { delta: number; text: string }[] = [];

  if (draft.capexRange === "not_sure") {
    penalties.push({ code: "CAPEX_NOT_SURE", delta: -25 });
    userDrivers.push({ delta: -25, text: "Capital scale is unknown." });
  }
  if (draft.buyerType === "unknown") {
    penalties.push({ code: "BUYER_UNKNOWN", delta: -15 });
    userDrivers.push({ delta: -15, text: "Buyer type is undefined." });
  }
  if (draft.locationSpecificity === "country_only") {
    penalties.push({ code: "COUNTRY_ONLY", delta: -10 });
    userDrivers.push({ delta: -10, text: "Location is country-only." });
  }
  if (draft.sectorCode === "other") {
    penalties.push({ code: "SECTOR_OTHER", delta: -8 });
    userDrivers.push({
      delta: -8,
      text: "Sector is unspecified (Other).",
    });
  }

  let value = 100 + penalties.reduce((sum, item) => sum + item.delta, 0);
  const uncapped = value;
  if (draft.capexRange === "not_sure" && draft.buyerType === "unknown") {
    value = Math.min(value, 40);
  }
  if (restricted) {
    value = Math.min(value, 70);
  }
  value = Math.max(0, Math.min(100, value));

  const restrictedCapBinds = restricted && uncapped > 70;
  userDrivers.sort((a, b) => a.delta - b.delta);

  let drivers: [string, string];
  if (userDrivers.length >= 2) {
    drivers = [userDrivers[0].text, userDrivers[1].text];
  } else if (userDrivers.length === 1 && restrictedCapBinds) {
    drivers = [userDrivers[0].text, "Restricted geography caps confidence."];
  } else if (userDrivers.length === 1) {
    drivers = [INCOMPLETE_DRIVER, userDrivers[0].text];
  } else if (restrictedCapBinds) {
    drivers = [INCOMPLETE_DRIVER, "Restricted geography caps confidence."];
  } else {
    drivers = [INCOMPLETE_DRIVER, "Collected answers contain no soft unknowns."];
  }

  const band = value >= 70 ? "high" : value >= 45 ? "medium" : "low";
  return { value, band, penalties, drivers };
}

function conditionsFrom(draft: InterviewDraft, restricted: boolean): ConditionId[] {
  const ids: ConditionId[] = ["COND-OFFTAKE"];
  if (
    draft.opportunityType === "greenfield" ||
    draft.opportunityType === "zone"
  ) {
    ids.push("COND-SITE");
  }
  if (draft.capexRange === "not_sure") ids.push("COND-SCALE");
  if (restricted) ids.push("COND-GEO");
  return ids.slice(0, 5);
}

/**
 * Builds a mocked Decision Object from a frozen Q1–Q9 draft.
 * Returns null if required fields are missing (caller should keep the user on Review).
 */
export function buildMockDecisionObject(
  draft: InterviewDraft
): DecisionObjectV01 | null {
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
    !draft.buyerType
  ) {
    return null;
  }

  const restricted = country.risk_tier === "restricted";
  const tension = mandateTension(draft);
  const risks = buildRisks(draft);
  const confidence = confidenceFrom(draft, restricted);
  const condition_ids = conditionsFrom(draft, restricted);

  const hasCritical = risks.some((risk) => risk.impact === "critical");
  const tripleThin =
    draft.developmentStage === "concept" &&
    draft.locationSpecificity === "country_only" &&
    (draft.buyerType === "unknown" || draft.capexRange === "not_sure");

  const veto_ids: string[] = ["VETO-INTAKE-INCOMPLETE"];
  if (hasCritical) veto_ids.push("VETO-CRITICAL");
  if (confidence.value < 50) veto_ids.push("VETO-CONF-PROCEED");
  if (draft.evaluationContext === "bank_screen" && draft.buyerType === "unknown") {
    veto_ids.push("VETO-BANK-UNKNOWN");
  }
  if (confidence.value < 40) veto_ids.push("VETO-CONF-THIN");
  if (draft.buyerType === "unknown" && isCapexAtLeast100m(draft.capexRange)) {
    veto_ids.push("VETO-BUYER-MEGA");
  }
  if (draft.developmentStage === "concept" && draft.capexRange === "gt_500m") {
    veto_ids.push("VETO-CONCEPT-MEGA");
  }
  if (tripleThin) veto_ids.push("VETO-TRIPLE-THIN");

  const deferVetoes = new Set([
    "VETO-CONF-THIN",
    "VETO-BUYER-MEGA",
    "VETO-CONCEPT-MEGA",
    "VETO-TRIPLE-THIN",
  ]);
  const posture: DecisionPosture = veto_ids.some((id) => deferVetoes.has(id))
    ? "defer"
    : "proceed_with_conditions";

  const fired_rule_ids = [...veto_ids, ...condition_ids];

  return {
    schema_version: "decision_object.v0.1",
    rule_version: "rules.v0.1",
    engine: "intake_policy",
    posture,
    confidence,
    veto_ids,
    condition_ids,
    mandate_tension: tension,
    risks,
    missing_inputs: [...MISSING_INPUTS],
    export_blocked: restricted,
    fired_rule_ids,
    sources: [
      {
        source_id: "src-user-intake",
        source_type: "user_input",
        reliability_score: 80,
      },
    ],
    inputs: {
      opportunity_type: draft.opportunityType,
      sector_code: draft.sectorCode,
      sector_label: draft.sectorCode === "other" ? null : draft.sectorLabel,
      product_summary: draft.productSummary.trim(),
      country_code: country.code,
      country_risk_tier: country.risk_tier,
      location_specificity: draft.locationSpecificity,
      location_text:
        draft.locationSpecificity === "country_only"
          ? null
          : draft.locationText.trim() || null,
      development_stage: draft.developmentStage,
      currency: draft.currency,
      capex_range: draft.capexRange,
      evaluation_context: draft.evaluationContext,
      buyer_type: draft.buyerType,
    },
  };
}
