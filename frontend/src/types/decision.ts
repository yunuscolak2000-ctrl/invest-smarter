import type { InterviewDraft } from "./interview";

export type DecisionPosture =
  | "proceed"
  | "proceed_with_conditions"
  | "defer"
  | "do_not_pursue";

/** Human overlay only. Never written by rules.v0.1. */
export type EvaluatorDecisionStatus =
  | "not_accepted"
  | "accepted"
  | "amended"
  | "rejected";

export const DEFAULT_EVALUATOR_STATUS: EvaluatorDecisionStatus =
  "not_accepted";

export type RecommendationSnapshot = {
  id: string;
  createdAt: string;
  frozenDraft: InterviewDraft;
  decisionObject: DecisionObjectV01;
  evaluatorStatus: EvaluatorDecisionStatus;
  evaluatorName: string;
  evaluatorReason: string;
};

export type ConfidenceBand = "low" | "medium" | "high";

export type MandateTension = "none" | "mild" | "severe";

export type ConditionId =
  | "COND-OFFTAKE"
  | "COND-SITE"
  | "COND-SCALE"
  | "COND-PERMIT"
  | "COND-TECH"
  | "COND-GRANT-FUND"
  | "COND-INFRA"
  | "COND-GEO"
  | "COND-REFRAME";

export type MissingInput =
  | "demand_certainty"
  | "site_control"
  | "decision_needed"
  | "known_constraints";

export type DecisionRisk = {
  risk_id: string;
  probability: "low" | "medium" | "high";
  impact: "low" | "medium" | "high" | "critical";
  status: "open";
};

export type DecisionPenalty = {
  code: string;
  delta: number;
};

export type DecisionObjectV01 = {
  schema_version: "decision_object.v0.1";
  rule_version: "rules.v0.1";
  engine: "intake_policy";
  posture: DecisionPosture;
  confidence: {
    value: number;
    band: ConfidenceBand;
    penalties: DecisionPenalty[];
    drivers: [string, string];
  };
  veto_ids: string[];
  condition_ids: ConditionId[];
  mandate_tension: MandateTension;
  risks: DecisionRisk[];
  missing_inputs: MissingInput[];
  export_blocked: boolean;
  fired_rule_ids: string[];
  sources: [
    {
      source_id: "src-user-intake";
      source_type: "user_input";
      reliability_score: 80;
    },
  ];
  inputs: {
    opportunity_type: string;
    sector_code: string;
    sector_label: string | null;
    product_summary: string;
    country_code: string;
    country_risk_tier: "standard" | "restricted";
    location_specificity: string;
    location_text: string | null;
    development_stage: string;
    currency: string;
    capex_range: string;
    evaluation_context: string;
    buyer_type: string;
    demand_certainty: string;
    site_control: string;
    decision_needed: string;
  };
};
