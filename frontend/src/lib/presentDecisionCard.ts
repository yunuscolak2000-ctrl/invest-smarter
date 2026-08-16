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
import {
  DEFAULT_LANGUAGE,
  getCopy,
  type Language,
} from "./i18n";
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

function offtakeSentence(
  decision: DecisionObjectV01,
  draft: InterviewDraft,
  language: Language
): string {
  const copy = getCopy(language);
  const commercial =
    decision.inputs.buyer_type === "unknown"
      ? copy.card.offtakeUnknown
      : decision.inputs.demand_certainty === "hypothesis"
        ? copy.card.offtakeHypothesis
        : copy.card.offtakeAdvanced;
  return offtakeConditionSentence(draft.projectContext, commercial, language);
}

function conditionSentence(
  id: DecisionObjectV01["condition_ids"][number],
  decision: DecisionObjectV01,
  draft: InterviewDraft,
  language: Language
): string | null {
  const copy = getCopy(language);
  if (id === "COND-OFFTAKE") return offtakeSentence(decision, draft, language);
  if (id === "COND-SITE") return copy.card.condSite;
  if (id === "COND-SCALE") return copy.card.condScale;
  if (id === "COND-GEO") return copy.card.condGeo;
  return null;
}

function whyBullets(
  decision: DecisionObjectV01,
  draft: InterviewDraft,
  language: Language
): string[] {
  const copy = getCopy(language);
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
    bullets.push(proceedWhyLine(draft.projectContext, language));
  }
  if (vetoes.has("VETO-BUYER-MEGA")) bullets.push(copy.card.whyBuyerMega);
  if (vetoes.has("VETO-CONCEPT-MEGA")) bullets.push(copy.card.whyConceptMega);
  if (vetoes.has("VETO-TRIPLE-THIN")) bullets.push(copy.card.whyTripleThin);
  if (vetoes.has("VETO-DEMAND-MEGA")) bullets.push(copy.card.whyDemandMega);
  if (vetoes.has("VETO-BANK-HYP")) bullets.push(copy.card.whyBankHyp);
  if (vetoes.has("VETO-FINANCE-READ")) bullets.push(copy.card.whyFinanceRead);
  if (vetoes.has("VETO-CONF-THIN")) bullets.push(copy.card.whyConfThin);
  if (decision.inputs.decision_needed === "compare") {
    bullets.push(copy.card.whyCompare);
  }
  if (
    decision.inputs.decision_needed === "financing_read" &&
    !vetoes.has("VETO-FINANCE-READ")
  ) {
    bullets.push(copy.card.whyNotBankable);
  }
  if (decision.export_blocked) bullets.push(copy.card.whyExportBlocked);
  if (decision.mandate_tension === "severe") bullets.push(copy.card.whyMandate);

  return bullets.slice(0, 6);
}

function nextBullets(
  decision: DecisionObjectV01,
  draft: InterviewDraft,
  language: Language
): string[] {
  const copy = getCopy(language);
  const next = [nextCommissionLine(draft.projectContext, language)];

  if (decision.posture === "proceed_with_conditions") {
    if (decision.condition_ids.length > 0) {
      next.push(copy.card.nextIfConditions);
    } else {
      next.push(copy.card.nextNoUnconditional);
    }
  }

  if (decision.posture === "defer") {
    next.push(copy.card.nextDeferClose);
    next.push(copy.card.nextDeferStaff);
  }

  if (decision.export_blocked) {
    next.push(copy.card.nextExport);
  }

  return next.slice(0, 4);
}

function statusLine(
  status: EvaluatorDecisionStatus,
  language: Language
): string {
  const copy = getCopy(language).decision;
  if (status === "accepted") return copy.statusAccepted;
  if (status === "amended") return copy.statusAmended;
  if (status === "rejected") return copy.statusRejected;
  return copy.status;
}

function translateDriver(text: string, language: Language): string {
  const copy = getCopy(language);
  return copy.drivers[text] ?? text;
}

export function presentDecisionCard(
  decision: DecisionObjectV01,
  draft: InterviewDraft,
  evaluatorStatus: EvaluatorDecisionStatus = DEFAULT_EVALUATOR_STATUS,
  language: Language = DEFAULT_LANGUAGE
): DecisionCardView {
  const copy = getCopy(language);
  const defect =
    decision.posture === "proceed" || decision.posture === "do_not_pursue";

  const bandLabel =
    decision.confidence.band === "high"
      ? copy.decision.bandHigh
      : decision.confidence.band === "medium"
        ? copy.decision.bandMedium
        : copy.decision.bandLow;

  const conditions = decision.condition_ids
    .map((id) => conditionSentence(id, decision, draft, language))
    .filter((sentence): sentence is string => Boolean(sentence));

  if (conditions.length === 0) {
    conditions.push(emptyConditionFallback(draft.projectContext, language));
  }

  return {
    defect,
    title: identityTitle(draft, language),
    productSummary: draft.productSummary.trim(),
    meta: identityMeta(draft, language),
    status: statusLine(evaluatorStatus, language),
    postureTitle:
      decision.posture === "defer"
        ? copy.decision.postureDefer
        : copy.decision.postureProceed,
    postureSentence:
      decision.posture === "defer"
        ? copy.decision.deferPostureSentence
        : proceedPostureSentence(draft.projectContext, language),
    bankDisclaimer:
      draft.evaluationContext === "bank_screen"
        ? copy.decision.bankDisclaimer
        : null,
    grantDisclaimer: grantDisclaimer(draft.projectContext, language),
    confidenceLine: `${bandLabel} · ${decision.confidence.value} ${copy.decision.of} 100 · ${copy.decision.confidenceSuffix}`,
    confidenceDrivers: [
      translateDriver(decision.confidence.drivers[0], language),
      translateDriver(decision.confidence.drivers[1], language),
    ],
    conditionsIntro: conditionsIntroLine(
      draft.projectContext,
      decision.posture === "defer",
      language
    ),
    conditions,
    why: whyBullets(decision, draft, language),
    next: nextBullets(decision, draft, language),
    disclaimer:
      evaluatorStatus === "not_accepted"
        ? copy.decision.disclaimer
        : copy.decision.disclaimerRecorded,
    policyLabel: copy.decision.policyLabel,
  };
}
