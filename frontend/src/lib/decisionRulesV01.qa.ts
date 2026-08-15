/**
 * Lightweight rules.v0.1 QA. Not a test runner. Not imported by the UI.
 *
 * Later, with Vitest:
 *   import { verifyDecisionRulesV01 } from "./decisionRulesV01.qa";
 *   expect(verifyDecisionRulesV01().failed).toBe(0);
 */

import type { ConditionId, DecisionObjectV01 } from "../types/decision";
import type { InterviewDraft } from "../types/interview";
import { evaluateDecisionV01 } from "./decisionRulesV01";
import {
  FIXTURE_AVERAGE,
  FIXTURE_BANK_HYPOTHESIS,
  FIXTURE_FINANCING_READ,
  FIXTURE_HYPOTHESIS_MEGA,
  FIXTURE_RESTRICTED_GEO,
  FIXTURE_STRONG,
  FIXTURE_WEAK,
} from "./decisionRulesV01.fixtures";
import {
  presentDecisionCard,
  type DecisionCardView,
} from "./presentDecisionCard";

export type QaCheck = {
  caseId: string;
  ok: boolean;
  detail: string;
};

export type QaReport = {
  passed: number;
  failed: number;
  checks: QaCheck[];
};

type CaseExpect = {
  posture: "proceed_with_conditions" | "defer";
  confidence?: number;
  confidenceMax?: number;
  band?: DecisionObjectV01["confidence"]["band"];
  conditionsInclude?: ConditionId[];
  conditionsExclude?: ConditionId[];
  exportBlocked?: boolean;
  creditApproval?: boolean;
  noIncompleteInterviewText?: boolean;
};

type QaCase = {
  id: string;
  draft: InterviewDraft;
  expect: CaseExpect;
};

const CREDIT_LINE = "This is not a credit approval.";
const INCOMPLETE_INTERVIEW =
  "Demand certainty, site control, and the decision needed were not collected";

const FORBIDDEN_IN_VIEW: { label: string; pattern: RegExp }[] = [
  { label: "JSON blob", pattern: /[{[]\s*"/ },
  { label: "veto id", pattern: /VETO-[A-Z0-9-]+/ },
  { label: "condition id", pattern: /COND-[A-Z0-9-]+/ },
  { label: "risk id", pattern: /RISK-[A-Z0-9-]+/ },
  { label: "penalty code", pattern: /\b[A-Z]{2,}_[A-Z0-9_]+\b/ },
  { label: "posture enum", pattern: /proceed_with_conditions|do_not_pursue/ },
  {
    label: "field enum",
    pattern:
      /\b(demand_certainty|site_control|decision_needed|buyer_type|capex_range|evaluation_context|opportunity_type|veto_ids|condition_ids|fired_rule_ids|missing_inputs|schema_version)\b/,
  },
];

const CASES: QaCase[] = [
  {
    id: "strong",
    draft: FIXTURE_STRONG,
    expect: {
      posture: "proceed_with_conditions",
      confidence: 100,
      band: "high",
      conditionsExclude: ["COND-OFFTAKE", "COND-SITE"],
      exportBlocked: false,
      noIncompleteInterviewText: true,
    },
  },
  {
    id: "average",
    draft: FIXTURE_AVERAGE,
    expect: {
      posture: "proceed_with_conditions",
      confidence: 90,
      band: "high",
      conditionsInclude: ["COND-OFFTAKE", "COND-SITE"],
      noIncompleteInterviewText: true,
    },
  },
  {
    id: "weak",
    draft: FIXTURE_WEAK,
    expect: {
      posture: "defer",
      confidence: 17,
      band: "low",
      conditionsInclude: ["COND-OFFTAKE", "COND-SITE", "COND-SCALE"],
      creditApproval: true,
      noIncompleteInterviewText: true,
    },
  },
  {
    id: "hypothesis-mega",
    draft: FIXTURE_HYPOTHESIS_MEGA,
    expect: {
      posture: "defer",
      confidence: 45,
      confidenceMax: 45,
      conditionsInclude: ["COND-OFFTAKE"],
    },
  },
  {
    id: "financing-read",
    draft: FIXTURE_FINANCING_READ,
    expect: {
      posture: "defer",
    },
  },
  {
    id: "bank-hypothesis",
    draft: FIXTURE_BANK_HYPOTHESIS,
    expect: {
      posture: "defer",
      creditApproval: true,
    },
  },
  {
    id: "restricted-geo",
    draft: FIXTURE_RESTRICTED_GEO,
    expect: {
      posture: "proceed_with_conditions",
      confidence: 70,
      confidenceMax: 70,
      conditionsInclude: ["COND-GEO"],
      exportBlocked: true,
    },
  },
];

function check(
  caseId: string,
  ok: boolean,
  detail: string
): QaCheck {
  return { caseId, ok, detail };
}

function viewText(view: DecisionCardView): string {
  return [
    view.title,
    view.productSummary,
    view.meta,
    view.status,
    view.postureTitle,
    view.postureSentence,
    view.bankDisclaimer ?? "",
    view.confidenceLine,
    ...view.confidenceDrivers,
    view.conditionsIntro,
    ...view.conditions,
    ...view.why,
    ...view.next,
    view.disclaimer,
    view.policyLabel,
  ].join("\n");
}

function hardGuarantees(
  caseId: string,
  decision: DecisionObjectV01,
  view: DecisionCardView
): QaCheck[] {
  const checks: QaCheck[] = [
    check(
      caseId,
      decision.posture !== "proceed",
      `posture must never be proceed (got ${decision.posture})`
    ),
    check(
      caseId,
      decision.posture !== "do_not_pursue",
      `posture must never be do_not_pursue (got ${decision.posture})`
    ),
    check(caseId, view.defect === false, "presenter defect flag must stay false"),
  ];

  const text = viewText(view);
  for (const rule of FORBIDDEN_IN_VIEW) {
    checks.push(
      check(
        caseId,
        !rule.pattern.test(text),
        `presenter must not expose ${rule.label}`
      )
    );
  }
  return checks;
}

function runCase(item: QaCase): QaCheck[] {
  const first = evaluateDecisionV01(item.draft);
  const second = evaluateDecisionV01(item.draft);
  if (!first || !second) {
    return [
      check(item.id, false, "evaluateDecisionV01 returned null for a complete draft"),
    ];
  }

  const view = presentDecisionCard(first, item.draft);
  const checks = hardGuarantees(item.id, first, view);
  const want = item.expect;

  checks.push(
    check(
      item.id,
      JSON.stringify(first) === JSON.stringify(second),
      "same draft must produce the same Decision Object"
    )
  );
  checks.push(
    check(
      item.id,
      first.posture === want.posture,
      `posture expected ${want.posture}, got ${first.posture}`
    )
  );

  if (want.confidence !== undefined) {
    checks.push(
      check(
        item.id,
        first.confidence.value === want.confidence,
        `confidence expected ${want.confidence}, got ${first.confidence.value}`
      )
    );
  }
  if (want.confidenceMax !== undefined) {
    checks.push(
      check(
        item.id,
        first.confidence.value <= want.confidenceMax,
        `confidence expected ≤ ${want.confidenceMax}, got ${first.confidence.value}`
      )
    );
  }
  if (want.band) {
    checks.push(
      check(
        item.id,
        first.confidence.band === want.band,
        `band expected ${want.band}, got ${first.confidence.band}`
      )
    );
  }
  for (const id of want.conditionsInclude ?? []) {
    checks.push(
      check(
        item.id,
        first.condition_ids.includes(id),
        `conditions should include ${id} (got ${first.condition_ids.join(", ") || "none"})`
      )
    );
  }
  for (const id of want.conditionsExclude ?? []) {
    checks.push(
      check(
        item.id,
        !first.condition_ids.includes(id),
        `conditions should not include ${id} (got ${first.condition_ids.join(", ") || "none"})`
      )
    );
  }
  if (want.exportBlocked !== undefined) {
    checks.push(
      check(
        item.id,
        first.export_blocked === want.exportBlocked,
        `export_blocked expected ${want.exportBlocked}, got ${first.export_blocked}`
      )
    );
  }
  if (want.creditApproval) {
    checks.push(
      check(
        item.id,
        view.bankDisclaimer === CREDIT_LINE,
        `presentation should include “${CREDIT_LINE}”`
      )
    );
  }
  if (want.noIncompleteInterviewText) {
    checks.push(
      check(
        item.id,
        !viewText(view).includes(INCOMPLETE_INTERVIEW),
        "presenter must not say Q10–Q12 were not collected"
      )
    );
  }

  return checks;
}

export function verifyDecisionRulesV01(): QaReport {
  const checks = CASES.flatMap(runCase);
  const failed = checks.filter((item) => !item.ok).length;
  return {
    passed: checks.length - failed,
    failed,
    checks,
  };
}
