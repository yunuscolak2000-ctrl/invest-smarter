import { WIZARD_COPY } from "../mocks/interview";
import {
  DEFAULT_EVALUATOR_STATUS,
  type DecisionObjectV01,
  type EvaluatorDecisionStatus,
} from "../types/decision";
import type { InterviewDraft } from "../types/interview";
import {
  conditionsIntroLine,
  emptyConditionFallback,
  grantDisclaimer,
  nextCommissionLine,
  offtakeConditionSentence,
  proceedPostureSentence,
  proceedWhyLine,
} from "./contextAwareCopy";
import { identityMeta, identityTitle } from "./interviewLabels";

export type DecisionCardView = {
  defect: boolean;
  title: string;
  productSummary: string;
  meta: string;
  status: string;
  postureTitle: string;
  postureSentence: string;
  bankDisclaimer: string | null;
  grantDisclaimer: string | null;
  confidenceLine: string;
  confidenceDrivers: [string, string];
  conditionsIntro: string;
  conditions: string[];
  why: string[];
  next: string[];
  disclaimer: string;
  policyLabel: string;
};

const COPY = WIZARD_COPY.decision;

function offtakeSentence(
  decision: DecisionObjectV01,
  draft: InterviewDraft
): string {
  const commercial =
    decision.inputs.buyer_type === "unknown"
      ? "Define who buys the output, then evidence that demand."
      : decision.inputs.demand_certainty === "hypothesis"
        ? "Demand is still a hypothesis. Evidence a named buyer path before treating revenue as real."
        : "Demand is in discussion, not on paper. Convert that into a letter or contract before treating offtake as evidenced.";
  return offtakeConditionSentence(draft.projectContext, commercial);
}

function conditionSentence(
  id: DecisionObjectV01["condition_ids"][number],
  decision: DecisionObjectV01,
  draft: InterviewDraft
): string | null {
  if (id === "COND-OFFTAKE") return offtakeSentence(decision, draft);
  if (id === "COND-SITE") {
    return "The site is still being searched. Secure control before treating this as a build-ready file.";
  }
  if (id === "COND-SCALE") {
    return "Bound the capital requirement to a range. “Not sure” is not a scale.";
  }
  if (id === "COND-GEO") {
    return "This geography requires compliance review before any report is published.";
  }
  return null;
}

function whyBullets(
  decision: DecisionObjectV01,
  draft: InterviewDraft
): string[] {
  const vetoes = new Set(decision.veto_ids);
  const deferVetoes = [
    "VETO-CONF-THIN",
    "VETO-BUYER-MEGA",
    "VETO-CONCEPT-MEGA",
    "VETO-TRIPLE-THIN",
    "VETO-DEMAND-MEGA",
    "VETO-BANK-HYP",
    "VETO-FINANCE-READ",
  ];
  const noDefer = !deferVetoes.some((id) => vetoes.has(id));

  const bullets: string[] = [];

  if (decision.posture === "proceed_with_conditions" && noDefer) {
    bullets.push(proceedWhyLine(draft.projectContext));
  }
  if (vetoes.has("VETO-BUYER-MEGA")) {
    bullets.push(
      "Buyer type is undefined at 100 million or above. That is not a credit- or study-ready file."
    );
  }
  if (vetoes.has("VETO-CONCEPT-MEGA")) {
    bullets.push("A concept at this scale is not ready for a study.");
  }
  if (vetoes.has("VETO-TRIPLE-THIN")) {
    bullets.push(
      "Concept, unspecified location, and an open commercial or scale hole. The file is too thin to decide."
    );
  }
  if (vetoes.has("VETO-DEMAND-MEGA")) {
    bullets.push(
      "Demand is a hypothesis at 100 million or above. That is not a study-ready file."
    );
  }
  if (vetoes.has("VETO-BANK-HYP")) {
    bullets.push(
      "A bank early screen cannot treat hypothesized demand as credit-ready."
    );
  }
  if (vetoes.has("VETO-FINANCE-READ")) {
    bullets.push(
      "A financing read needs demand on paper. This is not a bankable financial model."
    );
  }
  if (vetoes.has("VETO-CONF-THIN")) {
    bullets.push("Evidence quality is too low to recommend advancing.");
  }
  if (decision.inputs.decision_needed === "compare") {
    bullets.push(
      "This is an absolute posture for this file. Ranking it against other options is out of scope of this screen."
    );
  }
  if (
    decision.inputs.decision_needed === "financing_read" &&
    !vetoes.has("VETO-FINANCE-READ")
  ) {
    bullets.push("This is not a bankable financial model.");
  }
  if (decision.export_blocked) {
    bullets.push(
      "Geography does not change the posture. It blocks publication until review."
    );
  }
  if (decision.mandate_tension === "severe") {
    bullets.push(
      "This opportunity does not match the desk that is evaluating it."
    );
  }

  return bullets.slice(0, 6);
}

function nextBullets(
  decision: DecisionObjectV01,
  draft: InterviewDraft
): string[] {
  const next = [nextCommissionLine(draft.projectContext)];

  if (decision.posture === "proceed_with_conditions") {
    if (decision.condition_ids.length > 0) {
      next.push(
        "If the conditions are not acceptable, stop. Do not “proceed with caution.”"
      );
    } else {
      next.push(
        "This screen does not issue an unconditional proceed."
      );
    }
  }

  if (decision.posture === "defer") {
    next.push(
      "Close the gaps named in Conditions. Re-run only after those answers exist."
    );
    next.push(
      "Do not staff a file, open a credit workbench, or draft an IPA promotion response as if a decision had been taken."
    );
  }

  if (decision.export_blocked) {
    next.push(
      "Do not export or send this recommendation until compliance review is complete."
    );
  }

  return next.slice(0, 4);
}

function statusLine(status: EvaluatorDecisionStatus): string {
  if (status === "accepted") return COPY.statusAccepted;
  if (status === "amended") return COPY.statusAmended;
  if (status === "rejected") return COPY.statusRejected;
  return COPY.status;
}

export function presentDecisionCard(
  decision: DecisionObjectV01,
  draft: InterviewDraft,
  evaluatorStatus: EvaluatorDecisionStatus = DEFAULT_EVALUATOR_STATUS
): DecisionCardView {
  const defect =
    decision.posture === "proceed" || decision.posture === "do_not_pursue";

  const bandLabel =
    decision.confidence.band === "high"
      ? "High"
      : decision.confidence.band === "medium"
        ? "Medium"
        : "Low";

  const conditions = decision.condition_ids
    .map((id) => conditionSentence(id, decision, draft))
    .filter((sentence): sentence is string => Boolean(sentence));

  if (conditions.length === 0) {
    conditions.push(emptyConditionFallback(draft.projectContext));
  }

  return {
    defect,
    title: identityTitle(draft),
    productSummary: draft.productSummary.trim(),
    meta: identityMeta(draft),
    status: statusLine(evaluatorStatus),
    postureTitle:
      decision.posture === "defer" ? "Defer" : "Proceed with conditions",
    postureSentence:
      decision.posture === "defer"
        ? "This file is not decision-ready. Do not spend further time or budget on it as framed until the gaps below are closed."
        : proceedPostureSentence(draft.projectContext),
    bankDisclaimer:
      draft.evaluationContext === "bank_screen" ? COPY.bankDisclaimer : null,
    grantDisclaimer: grantDisclaimer(draft.projectContext),
    confidenceLine: `${bandLabel} · ${decision.confidence.value} of 100 · ${COPY.confidenceSuffix}`,
    confidenceDrivers: decision.confidence.drivers,
    conditionsIntro: conditionsIntroLine(
      draft.projectContext,
      decision.posture === "defer"
    ),
    conditions,
    why: whyBullets(decision, draft),
    next: nextBullets(decision, draft),
    disclaimer:
      evaluatorStatus === "not_accepted"
        ? COPY.disclaimer
        : COPY.disclaimerRecorded,
    policyLabel: COPY.policyLabel,
  };
}
