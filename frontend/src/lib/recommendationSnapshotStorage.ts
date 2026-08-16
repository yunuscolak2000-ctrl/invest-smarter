/**
 * Browser-only persistence for the current recommendation snapshot.
 * Demo storage, not an archive. Invalid payloads are discarded.
 */

import { validateInterviewQuestions } from "./interviewValidation";
import type {
  DecisionObjectV01,
  EvaluatorDecisionStatus,
  RecommendationSnapshot,
} from "../types/decision";
import {
  PROJECT_CONTEXT_VALUES,
  type InterviewDraft,
  type ProjectContext,
} from "../types/interview";

export const RECOMMENDATION_SNAPSHOT_STORAGE_KEY =
  "invest-smarter.recommendationSnapshot.v0.1";

const SNAPSHOT_SCHEMA = "invest-smarter.recommendationSnapshot.v0.1" as const;

const EVALUATOR_STATUSES: EvaluatorDecisionStatus[] = [
  "not_accepted",
  "accepted",
  "amended",
  "rejected",
];

type StoredEnvelope = {
  schema: typeof SNAPSHOT_SCHEMA;
  snapshot: RecommendationSnapshot;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isEvaluatorStatus(value: unknown): value is EvaluatorDecisionStatus {
  return (
    typeof value === "string" &&
    EVALUATOR_STATUSES.includes(value as EvaluatorDecisionStatus)
  );
}

function isProjectContextField(value: unknown): value is ProjectContext | null {
  return (
    value === null ||
    value === undefined ||
    (typeof value === "string" &&
      (PROJECT_CONTEXT_VALUES as readonly string[]).includes(value))
  );
}

function isFrozenDraft(value: unknown): value is InterviewDraft {
  if (!isRecord(value)) return false;
  if (!isProjectContextField(value.projectContext)) return false;
  return validateInterviewQuestions(value as InterviewDraft) === null;
}

function isDecisionObject(value: unknown): value is DecisionObjectV01 {
  if (!isRecord(value)) return false;
  if (value.schema_version !== "decision_object.v0.1") return false;
  if (value.rule_version !== "rules.v0.1") return false;
  if (value.posture !== "proceed_with_conditions" && value.posture !== "defer") {
    return false;
  }
  if (!isRecord(value.confidence)) return false;
  if (typeof value.confidence.value !== "number") return false;
  if (!Array.isArray(value.condition_ids)) return false;
  return true;
}

function isRecommendationSnapshot(value: unknown): value is RecommendationSnapshot {
  if (!isRecord(value)) return false;
  if (typeof value.id !== "string" || value.id.trim() === "") return false;
  if (typeof value.createdAt !== "string" || value.createdAt.trim() === "") {
    return false;
  }
  if (!isFrozenDraft(value.frozenDraft)) return false;
  if (!isDecisionObject(value.decisionObject)) return false;
  if (!isEvaluatorStatus(value.evaluatorStatus)) return false;
  if (typeof value.evaluatorName !== "string") return false;
  if (typeof value.evaluatorReason !== "string") return false;
  return true;
}

export function parseStoredRecommendationSnapshot(
  raw: string | null
): RecommendationSnapshot | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.schema !== SNAPSHOT_SCHEMA) return null;
    if (!isRecommendationSnapshot(parsed.snapshot)) return null;
    return {
      ...parsed.snapshot,
      frozenDraft: {
        ...parsed.snapshot.frozenDraft,
        projectContext: parsed.snapshot.frozenDraft.projectContext ?? null,
      },
    };
  } catch {
    return null;
  }
}

export function serializeRecommendationSnapshot(
  snapshot: RecommendationSnapshot
): string {
  const envelope: StoredEnvelope = {
    schema: SNAPSHOT_SCHEMA,
    snapshot,
  };
  return JSON.stringify(envelope);
}

function storage(): Storage | null {
  try {
    if (typeof localStorage === "undefined") return null;
    return localStorage;
  } catch {
    return null;
  }
}

export function loadRecommendationSnapshot(): RecommendationSnapshot | null {
  const store = storage();
  if (!store) return null;
  try {
    const raw = store.getItem(RECOMMENDATION_SNAPSHOT_STORAGE_KEY);
    const snapshot = parseStoredRecommendationSnapshot(raw);
    if (!snapshot && raw !== null) {
      store.removeItem(RECOMMENDATION_SNAPSHOT_STORAGE_KEY);
    }
    return snapshot;
  } catch {
    try {
      store.removeItem(RECOMMENDATION_SNAPSHOT_STORAGE_KEY);
    } catch {
      /* ignore quota / private-mode failures */
    }
    return null;
  }
}

export function saveRecommendationSnapshot(snapshot: RecommendationSnapshot): void {
  const store = storage();
  if (!store) return;
  try {
    store.setItem(
      RECOMMENDATION_SNAPSHOT_STORAGE_KEY,
      serializeRecommendationSnapshot(snapshot)
    );
  } catch {
    /* ignore quota / private-mode failures */
  }
}

export function clearRecommendationSnapshot(): void {
  const store = storage();
  if (!store) return;
  try {
    store.removeItem(RECOMMENDATION_SNAPSHOT_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
