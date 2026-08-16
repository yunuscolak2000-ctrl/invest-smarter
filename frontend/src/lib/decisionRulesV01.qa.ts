/**
 * Lightweight rules.v0.1 QA. Not a test runner. Not imported by the UI.
 *
 * Evaluator status and RecommendationSnapshot are client overlays.
 * They must not change posture, confidence, or conditions.
 * Do not pass evaluator status into evaluateDecisionV01.
 * The card must present snapshot.frozenDraft, not a later live draft.
 * localStorage restore uses parseStoredRecommendationSnapshot and
 * parseStoredInterviewDraft; invalid payloads must return null and never crash.
 * A recommendation snapshot outranks an in-progress draft on refresh.
 * projectContext is setup, not Q13. It is persisted on the draft/snapshot
 * and must not change rules.v0.1. Q9/Q10 labels and Decision Card
 * microcopy follow projectContext; stored enums stay the same.
 * not_sure uses private copy. Language is en by default and persists
 * separately. Changing language must not change rules.v0.1.
 *
 * Later, with Vitest:
 *   import { verifyDecisionRulesV01 } from "./decisionRulesV01.qa";
 *   expect(verifyDecisionRulesV01().failed).toBe(0);
 */

import type { ConditionId, DecisionObjectV01 } from "../types/decision";
import { EMPTY_INTERVIEW_DRAFT, type InterviewDraft } from "../types/interview";
import { evaluateDecisionV01 } from "./decisionRulesV01";
import {
  DEFAULT_LANGUAGE,
  getCopy,
  parseStoredLanguage,
} from "./i18n";
import {
  buyerTypeOptions,
  conditionsIntroLine,
  copyDialect,
  demandCertaintyOptions,
  emptyConditionFallback,
  grantDisclaimer,
  nextCommissionLine,
  proceedPostureSentence,
  proceedWhyLine,
  q9Prompt,
  q10Prompt,
  reviewSiteGroupTitle,
} from "./contextAwareCopy";
import {
  createRecommendationSnapshot,
  evaluatorDecisionErrors,
} from "./createRecommendationSnapshot";
import {
  parseStoredRecommendationSnapshot,
  serializeRecommendationSnapshot,
} from "./recommendationSnapshotStorage";
import {
  parseStoredInterviewDraft,
  serializeInterviewDraft,
} from "./interviewDraftStorage";
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
      /\b(demand_certainty|site_control|decision_needed|buyer_type|capex_range|evaluation_context|opportunity_type|project_context|private_investment|public_project|development_finance|veto_ids|condition_ids|fired_rule_ids|missing_inputs|schema_version)\b/,
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
    view.grantDisclaimer ?? "",
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

function evaluatorOverlayChecks(): QaCheck[] {
  const decision = evaluateDecisionV01(FIXTURE_STRONG);
  if (!decision) {
    return [
      check(
        "evaluator-overlay",
        false,
        "strong fixture must evaluate so overlay can be compared"
      ),
    ];
  }

  const baseline = presentDecisionCard(decision, FIXTURE_STRONG, "not_accepted");
  const statuses = ["accepted", "amended", "rejected"] as const;
  const checks: QaCheck[] = [];

  for (const status of statuses) {
    const view = presentDecisionCard(decision, FIXTURE_STRONG, status);
    checks.push(
      check(
        "evaluator-overlay",
        view.postureTitle === baseline.postureTitle,
        `${status} must not change posture`
      ),
      check(
        "evaluator-overlay",
        view.confidenceLine === baseline.confidenceLine,
        `${status} must not change confidence`
      ),
      check(
        "evaluator-overlay",
        JSON.stringify(view.conditions) === JSON.stringify(baseline.conditions),
        `${status} must not change conditions`
      )
    );
  }

  return checks;
}

function snapshotChecks(): QaCheck[] {
  const first = createRecommendationSnapshot(FIXTURE_STRONG);
  const second = createRecommendationSnapshot(FIXTURE_STRONG);
  if (!first || !second) {
    return [
      check(
        "snapshot",
        false,
        "strong fixture must produce a recommendation snapshot"
      ),
    ];
  }

  const mutatedLive = {
    ...FIXTURE_STRONG,
    productSummary: "Mutated after freeze",
    evaluationContext: "bank_screen" as const,
  };
  const frozenView = presentDecisionCard(
    first.decisionObject,
    first.frozenDraft,
    first.evaluatorStatus
  );
  const leakedLive = presentDecisionCard(
    first.decisionObject,
    mutatedLive,
    first.evaluatorStatus
  );
  const accepted: typeof first = {
    ...first,
    evaluatorStatus: "accepted",
    evaluatorName: "Investment Desk",
    evaluatorReason: "Accepted as written",
  };

  return [
    check(
      "snapshot",
      first.evaluatorStatus === "not_accepted",
      "new snapshot starts as not accepted"
    ),
    check(
      "snapshot",
      first.evaluatorName === "" && first.evaluatorReason === "",
      "new snapshot starts with a blank name until a status is recorded"
    ),
    check(
      "snapshot",
      first.id !== second.id,
      "a new See recommendation must create a new snapshot"
    ),
    check(
      "snapshot",
      frozenView.productSummary === FIXTURE_STRONG.productSummary,
      "card must render the frozen draft, not a later live draft"
    ),
    check(
      "snapshot",
      frozenView.productSummary !== leakedLive.productSummary,
      "a live draft change must not be treated as the frozen snapshot"
    ),
    check(
      "snapshot",
      frozenView.bankDisclaimer === null && leakedLive.bankDisclaimer !== null,
      "snapshot identity fields must not follow a later live draft"
    ),
    check(
      "snapshot",
      JSON.stringify(accepted.decisionObject) ===
        JSON.stringify(first.decisionObject),
      "evaluator overlay must not change the decision object"
    ),
    check(
      "snapshot",
      JSON.stringify(accepted.frozenDraft) === JSON.stringify(first.frozenDraft),
      "evaluator overlay must not change the frozen draft"
    ),
    check(
      "snapshot",
      evaluatorDecisionErrors("accepted", "", "").name !== null &&
        evaluatorDecisionErrors("accepted", "", "").reason === null,
      "accept requires a name and does not require a reason"
    ),
    check(
      "snapshot",
      evaluatorDecisionErrors("accepted", "   ", "").name !== null,
      "whitespace-only name is invalid"
    ),
    check(
      "snapshot",
      evaluatorDecisionErrors("accepted", "Investment Desk", "").name === null &&
        evaluatorDecisionErrors("accepted", "Investment Desk", "").reason ===
          null,
      "accept proceeds when a name exists"
    ),
    check(
      "snapshot",
      evaluatorDecisionErrors("amended", "", "").name !== null &&
        evaluatorDecisionErrors("amended", "", "").reason !== null,
      "amend requires a name and a reason"
    ),
    check(
      "snapshot",
      evaluatorDecisionErrors("rejected", "", "").name !== null &&
        evaluatorDecisionErrors("rejected", "", "").reason !== null,
      "reject requires a name and a reason"
    ),
    check(
      "snapshot",
      evaluatorDecisionErrors("amended", "Investment Desk", "Need offtake paper")
        .name === null &&
        evaluatorDecisionErrors(
          "amended",
          "Investment Desk",
          "Need offtake paper"
        ).reason === null,
      "amend proceeds when name and reason exist"
    ),
  ];
}

function persistenceChecks(): QaCheck[] {
  const snapshot = createRecommendationSnapshot(FIXTURE_STRONG);
  if (!snapshot) {
    return [
      check("persistence", false, "strong fixture must produce a snapshot to persist"),
    ];
  }

  const named: typeof snapshot = {
    ...snapshot,
    evaluatorStatus: "amended",
    evaluatorName: "Investment Desk",
    evaluatorReason: "Need offtake paper",
  };
  const restored = parseStoredRecommendationSnapshot(
    serializeRecommendationSnapshot(named)
  );

  return [
    check(
      "persistence",
      restored !== null && restored.id === named.id,
      "refresh must restore the same snapshot id"
    ),
    check(
      "persistence",
      restored?.evaluatorStatus === "amended" &&
        restored.evaluatorName === "Investment Desk" &&
        restored.evaluatorReason === "Need offtake paper",
      "evaluator status, name, and reason must survive restore"
    ),
    check(
      "persistence",
      restored !== null &&
        JSON.stringify(restored.decisionObject) ===
          JSON.stringify(named.decisionObject),
      "restored decision object must match the frozen snapshot"
    ),
    check(
      "persistence",
      parseStoredRecommendationSnapshot("not-json") === null,
      "invalid JSON must not restore"
    ),
    check(
      "persistence",
      parseStoredRecommendationSnapshot(
        JSON.stringify({ schema: "other.v0", snapshot: named })
      ) === null,
      "incompatible schema must not restore"
    ),
    check(
      "persistence",
      parseStoredRecommendationSnapshot(
        JSON.stringify({
          schema: "invest-smarter.recommendationSnapshot.v0.1",
          snapshot: { ...named, evaluatorStatus: "signed" },
        })
      ) === null,
      "missing or invalid required fields must not restore"
    ),
    check(
      "persistence",
      (() => {
        const legacyDraft = { ...named.frozenDraft };
        delete (legacyDraft as { projectContext?: unknown }).projectContext;
        const restoredLegacy = parseStoredRecommendationSnapshot(
          JSON.stringify({
            schema: "invest-smarter.recommendationSnapshot.v0.1",
            snapshot: { ...named, frozenDraft: legacyDraft },
          })
        );
        return (
          restoredLegacy !== null &&
          restoredLegacy.frozenDraft.projectContext === null
        );
      })(),
      "a pre-context snapshot must still restore; missing projectContext becomes empty"
    ),
  ];
}

function draftPersistenceChecks(): QaCheck[] {
  const partial = {
    ...EMPTY_INTERVIEW_DRAFT,
    opportunityType: "greenfield" as const,
    productSummary: "Solar park",
  };
  const record = {
    draft: partial,
    step: "q3" as const,
    createdAt: "2026-08-16T10:00:00.000Z",
    updatedAt: "2026-08-16T10:05:00.000Z",
  };
  const restored = parseStoredInterviewDraft(serializeInterviewDraft(record));

  return [
    check(
      "draft-persistence",
      restored !== null &&
        restored.step === "q3" &&
        restored.draft.productSummary === "Solar park" &&
        restored.draft.opportunityType === "greenfield" &&
        restored.draft.countryCode === null,
      "refresh must restore a partial in-progress draft and current step"
    ),
    check(
      "draft-persistence",
      parseStoredInterviewDraft("not-json") === null,
      "invalid draft JSON must not restore"
    ),
    check(
      "draft-persistence",
      parseStoredInterviewDraft(
        JSON.stringify({ schema: "other.v0", record })
      ) === null,
      "incompatible draft schema must not restore"
    ),
    check(
      "draft-persistence",
      parseStoredInterviewDraft(
        JSON.stringify({
          schema: "invest-smarter.interviewDraft.v0.1",
          record: { ...record, step: "decision" },
        })
      ) === null,
      "a decision-step draft must not restore; snapshot owns that screen"
    ),
    check(
      "draft-persistence",
      parseStoredInterviewDraft(
        JSON.stringify({
          schema: "invest-smarter.interviewDraft.v0.1",
          record: { ...record, draft: { productSummary: "broken" } },
        })
      ) === null,
      "structurally invalid draft payload must not restore"
    ),
    check(
      "draft-persistence",
      (() => {
        const contextRecord = {
          ...record,
          step: "projectContext" as const,
          draft: {
            ...partial,
            projectContext: "public_project" as const,
          },
        };
        const restoredContext = parseStoredInterviewDraft(
          serializeInterviewDraft(contextRecord)
        );
        return (
          restoredContext?.step === "projectContext" &&
          restoredContext.draft.projectContext === "public_project"
        );
      })(),
      "refresh must restore Project Context as setup, not as a 13th question"
    ),
    check(
      "draft-persistence",
      (() => {
        const legacyDraft = { ...partial };
        delete (legacyDraft as { projectContext?: unknown }).projectContext;
        const restoredLegacy = parseStoredInterviewDraft(
          JSON.stringify({
            schema: "invest-smarter.interviewDraft.v0.1",
            record: { ...record, draft: legacyDraft },
          })
        );
        return (
          restoredLegacy !== null &&
          restoredLegacy.draft.projectContext === null
        );
      })(),
      "a pre-context in-progress draft must still restore"
    ),
  ];
}

function projectContextChecks(): QaCheck[] {
  const publicDraft: InterviewDraft = {
    ...FIXTURE_STRONG,
    projectContext: "public_project",
  };
  const strongDev: InterviewDraft = {
    ...FIXTURE_STRONG,
    projectContext: "development_finance",
  };
  const privateDecision = evaluateDecisionV01(FIXTURE_STRONG);
  const publicDecision = evaluateDecisionV01(publicDraft);
  const strongDevDecision = evaluateDecisionV01(strongDev);
  const privateView = privateDecision
    ? presentDecisionCard(privateDecision, FIXTURE_STRONG)
    : null;
  const publicView = publicDecision
    ? presentDecisionCard(publicDecision, publicDraft)
    : null;
  const strongDevView = strongDevDecision
    ? presentDecisionCard(strongDevDecision, strongDev)
    : null;

  const averagePublic: InterviewDraft = {
    ...FIXTURE_AVERAGE,
    projectContext: "public_project",
  };
  const averageDev: InterviewDraft = {
    ...FIXTURE_AVERAGE,
    projectContext: "development_finance",
  };
  const averageUnsure: InterviewDraft = {
    ...FIXTURE_AVERAGE,
    projectContext: "not_sure",
  };
  const averageDecision = evaluateDecisionV01(FIXTURE_AVERAGE);
  const publicAverageView = averageDecision
    ? presentDecisionCard(averageDecision, averagePublic)
    : null;
  const privateAverageView = averageDecision
    ? presentDecisionCard(averageDecision, FIXTURE_AVERAGE)
    : null;
  const devAverageView = averageDecision
    ? presentDecisionCard(averageDecision, averageDev)
    : null;
  const unsureAverageView = averageDecision
    ? presentDecisionCard(averageDecision, averageUnsure)
    : null;

  const publicOfftake =
    "Public use or payment is not evidenced. Name the user or payer, or accept that demand is still a hypothesis.";
  const grantLine =
    "This is not an eligibility opinion, not a grant award, and not a commitment to disburse.";

  const buyerValues = buyerTypeOptions("public_project").map((option) => option.value);
  const privateBuyerValues = buyerTypeOptions("private_investment").map(
    (option) => option.value
  );

  return [
    check(
      "project-context",
      privateDecision !== null && publicDecision !== null,
      "rules.v0.1 must still evaluate when projectContext is on the draft"
    ),
    check(
      "project-context",
      JSON.stringify(privateDecision) === JSON.stringify(publicDecision),
      "projectContext must not change posture, confidence, or conditions"
    ),
    check(
      "project-context",
      privateView?.meta.startsWith("Private investment ·") === true,
      "Decision Card identity may include the human project-context label"
    ),
    check(
      "project-context",
      publicView?.meta.startsWith("Public project ·") === true,
      "public project identity uses the Review label, not an enum"
    ),
    check(
      "context-copy",
      copyDialect("not_sure") === "private" &&
        q9Prompt("not_sure").title === q9Prompt("private_investment").title &&
        q10Prompt("not_sure").title === q10Prompt("private_investment").title,
      "not_sure must use private Q9/Q10 copy"
    ),
    check(
      "context-copy",
      q9Prompt("public_project").title === "Who uses or pays" &&
        q9Prompt("development_finance").title === "Who is the user or offtaker",
      "public and development-finance Q9 titles must differ from private"
    ),
    check(
      "context-copy",
      JSON.stringify(buyerValues) === JSON.stringify(privateBuyerValues),
      "Q9 stored values must be identical across contexts"
    ),
    check(
      "context-copy",
      demandCertaintyOptions("public_project")[0]?.value ===
        demandCertaintyOptions("private_investment")[0]?.value,
      "Q10 stored values must be identical across contexts"
    ),
    check(
      "context-copy",
      privateAverageView?.conditions.some((line) =>
        line.includes("letter or contract")
      ) === true,
      "private offtake copy stays commercial"
    ),
    check(
      "context-copy",
      publicAverageView?.conditions.includes(publicOfftake) === true &&
        publicAverageView.conditions.every(
          (line) => !line.includes("letter or contract")
        ) &&
        devAverageView?.conditions.includes(publicOfftake) === true,
      "public and development-finance COND-OFFTAKE copy must use the public-use sentence, not commercial offtake language"
    ),
    check(
      "context-copy",
      unsureAverageView?.conditions.some((line) =>
        line.includes("letter or contract")
      ) === true,
      "not_sure offtake copy must match private"
    ),
    check(
      "context-copy",
      grantDisclaimer("development_finance") === grantLine &&
        grantDisclaimer("public_project") === null &&
        grantDisclaimer("private_investment") === null &&
        grantDisclaimer("not_sure") === null,
      "grant disclaimer is development_finance only"
    ),
    check(
      "context-copy",
      devAverageView?.grantDisclaimer === grantLine &&
        publicAverageView?.grantDisclaimer === null &&
        privateAverageView?.grantDisclaimer === null,
      "Decision Card shows the grant disclaimer only for development finance"
    ),
    check(
      "card-microcopy",
      privateView?.conditionsIntro ===
        conditionsIntroLine("private_investment", false) &&
        publicView?.conditionsIntro ===
          "Accept these before committing further public time or budget." &&
        devAverageView?.conditionsIntro ===
          "Accept these before taking this file into appraisal or support preparation." &&
        unsureAverageView?.conditionsIntro ===
          "Accept these before spending further resources.",
      "conditions intro follows projectContext; not_sure matches private"
    ),
    check(
      "card-microcopy",
      privateView?.next[0] === nextCommissionLine("private_investment") &&
        publicView?.next[0] ===
          "Do not commission a study or commit public resources on this recommendation alone." &&
        devAverageView?.next[0] ===
          "Do not treat this as an eligibility decision, award decision, or funding commitment." &&
        unsureAverageView?.next[0] ===
          "Do not commission a feasibility study on this recommendation.",
      "first next bullet follows projectContext; not_sure matches private"
    ),
    check(
      "card-microcopy",
      privateView?.conditions.includes(
        emptyConditionFallback("private_investment")
      ) === true &&
        publicView?.conditions.includes(
          emptyConditionFallback("public_project")
        ) === true &&
        strongDevView?.conditions.includes(
          emptyConditionFallback("development_finance")
        ) === true &&
        emptyConditionFallback("public_project") ===
          "No additional public-evidence condition was triggered. Treat this as a conditional screen, not authorization to commit public resources." &&
        emptyConditionFallback("development_finance") ===
          "No additional appraisal condition was triggered. Treat this as a conditional screen, not an eligibility opinion or funding commitment.",
      "empty-condition fallback is context-aware; Strong has no factual conditions"
    ),
    check(
      "card-microcopy",
      publicAverageView?.conditions.includes(
        emptyConditionFallback("public_project")
      ) !== true &&
        privateAverageView?.conditions.includes(
          emptyConditionFallback("private_investment")
        ) !== true,
      "empty-condition fallback must not replace offtake/site/scale/geo conditions"
    ),
    check(
      "card-microcopy",
      privateView?.postureSentence ===
        proceedPostureSentence("private_investment") &&
        publicView?.postureSentence ===
          "Advance only if the conditions below are accepted. This is not clearance to commit public resources or launch a study." &&
        publicView.postureSentence.includes("commission a full study") ===
          false &&
        strongDevView?.postureSentence ===
          "Advance only if the conditions below are accepted. This is not clearance to enter appraisal, approve support, or commit funding." &&
        unsureAverageView?.postureSentence ===
          "Advance only if the conditions below are accepted. This is not clearance to commission a full study.",
      "proceed posture sentence follows projectContext; public does not say commission a full study"
    ),
    check(
      "card-microcopy",
      privateView?.why.includes(proceedWhyLine("private_investment")) ===
        true &&
        publicView?.why.includes(proceedWhyLine("public_project")) === true &&
        devAverageView?.why.includes(
          proceedWhyLine("development_finance")
        ) === true &&
        unsureAverageView?.why.includes(proceedWhyLine("not_sure")) === true,
      "proceed-with-conditions why line follows projectContext"
    ),
    check(
      "card-microcopy",
      reviewSiteGroupTitle("private_investment") === "Commercial and site" &&
        reviewSiteGroupTitle("not_sure") === "Commercial and site" &&
        reviewSiteGroupTitle("public_project") === "Use, evidence, and site" &&
        reviewSiteGroupTitle("development_finance") ===
          "Use, evidence, and support readiness",
      "Review site-group title follows projectContext; not_sure matches private"
    ),
  ];
}

function languageChecks(): QaCheck[] {
  const decision = evaluateDecisionV01(FIXTURE_STRONG);
  const enView = decision
    ? presentDecisionCard(decision, FIXTURE_STRONG, "not_accepted", "en")
    : null;
  const trView = decision
    ? presentDecisionCard(decision, FIXTURE_STRONG, "not_accepted", "tr")
    : null;
  const enValues = buyerTypeOptions("public_project", "en").map(
    (option) => option.value
  );
  const trValues = buyerTypeOptions("public_project", "tr").map(
    (option) => option.value
  );
  const trCopy = getCopy("tr");
  const leakChecks = trView && decision ? hardGuarantees("language", decision, trView) : [];

  return [
    check(
      "language",
      DEFAULT_LANGUAGE === "en" && getCopy("en").decision.postureProceed ===
        "Proceed with conditions",
      "English is the default language"
    ),
    check(
      "language",
      parseStoredLanguage(null) === null &&
        parseStoredLanguage('"tr"') === "tr" &&
        parseStoredLanguage("tr") === "tr" &&
        parseStoredLanguage("de") === null,
      "language storage parser accepts only en/tr"
    ),
    check(
      "language",
      trCopy.decision.postureProceed === "Koşullu ilerle" &&
        trCopy.decision.postureDefer === "Ertele" &&
        trCopy.options.projectContext.public_project.label === "Kamu projesi" &&
        trCopy.projectContext.title === "Neyi değerlendiriyorsunuz?",
      "Turkish dictionary covers Welcome/context/card core labels"
    ),
    check(
      "language",
      JSON.stringify(enValues) === JSON.stringify(trValues) &&
        trValues.includes("b2b_contract"),
      "Turkish labels must not change stored enum values"
    ),
    check(
      "language",
      enView?.postureTitle === "Proceed with conditions" &&
        trView?.postureTitle === "Koşullu ilerle" &&
        enView?.productSummary === trView?.productSummary,
      "Decision Card can be presented in either language from the same snapshot"
    ),
    check(
      "language",
      decision !== null &&
        evaluateDecisionV01(FIXTURE_STRONG) !== null &&
        JSON.stringify(decision) ===
          JSON.stringify(evaluateDecisionV01(FIXTURE_STRONG)),
      "language must not change rules.v0.1 output"
    ),
    ...leakChecks.map((item) =>
      check(item.caseId, item.ok, `Turkish card: ${item.detail}`)
    ),
  ];
}

export function verifyDecisionRulesV01(): QaReport {
  const checks = [
    ...CASES.flatMap(runCase),
    ...evaluatorOverlayChecks(),
    ...snapshotChecks(),
    ...persistenceChecks(),
    ...draftPersistenceChecks(),
    ...projectContextChecks(),
    ...languageChecks(),
  ];
  const failed = checks.filter((item) => !item.ok).length;
  return {
    passed: checks.length - failed,
    failed,
    checks,
  };
}
