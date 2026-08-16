/**
 * Freeze a validated interview into a client-side recommendation snapshot.
 * Does not persist. Does not change rules.v0.1.
 */

import { evaluateDecisionV01 } from "./decisionRulesV01";
import {
  DEFAULT_LANGUAGE,
  getCopy,
  type Language,
} from "./i18n";
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

export type EvaluatorDecisionErrors = {
  name: string | null;
  reason: string | null;
};

export function evaluatorDecisionErrors(
  status: Exclude<EvaluatorDecisionStatus, "not_accepted">,
  name: string,
  reason: string,
  language: Language = DEFAULT_LANGUAGE
): EvaluatorDecisionErrors {
  const copy = getCopy(language).decision.evaluator;
  const nameError = name.trim() ? null : copy.nameRequiredError;
  let reasonError: string | null = null;
  if (status === "amended" && !reason.trim()) {
    reasonError = copy.amendReasonError;
  } else if (status === "rejected" && !reason.trim()) {
    reasonError = copy.rejectReasonError;
  }
  return { name: nameError, reason: reasonError };
}

export function hasEvaluatorDecisionErrors(
  errors: EvaluatorDecisionErrors
): boolean {
  return Boolean(errors.name || errors.reason);
}
