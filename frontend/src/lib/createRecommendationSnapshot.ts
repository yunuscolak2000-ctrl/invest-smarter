/**
 * Freeze a validated interview into a client-side recommendation snapshot.
 * Does not persist. Does not change rules.v0.1.
 */

import { evaluateDecisionV01 } from "./decisionRulesV01";
import { WIZARD_COPY } from "../mocks/interview";
import {
  DEFAULT_EVALUATOR_STATUS,
  type EvaluatorDecisionStatus,
  type RecommendationSnapshot,
} from "../types/decision";
import type { InterviewDraft } from "../types/interview";

export function createRecommendationSnapshot(
  draft: InterviewDraft
): RecommendationSnapshot | null {
  const frozenDraft: InterviewDraft = { ...draft };
  const decisionObject = evaluateDecisionV01(frozenDraft);
  if (!decisionObject) return null;

  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    frozenDraft,
    decisionObject,
    evaluatorStatus: DEFAULT_EVALUATOR_STATUS,
    evaluatorName: "",
    evaluatorReason: "",
  };
}

export function evaluatorReasonError(
  status: Exclude<EvaluatorDecisionStatus, "not_accepted">,
  reason: string
): string | null {
  const trimmed = reason.trim();
  if (status === "amended" && !trimmed) {
    return WIZARD_COPY.decision.evaluator.amendReasonError;
  }
  if (status === "rejected" && !trimmed) {
    return WIZARD_COPY.decision.evaluator.rejectReasonError;
  }
  return null;
}
