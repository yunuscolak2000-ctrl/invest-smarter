/**
 * Browser-only persistence for the in-progress interview draft.
 * Demo storage, not an archive. Invalid payloads are discarded.
 */

import type { InterviewDraft, WizardStepId } from "../types/interview";

export const INTERVIEW_DRAFT_STORAGE_KEY = "invest-smarter.interviewDraft.v0.1";

const DRAFT_SCHEMA = "invest-smarter.interviewDraft.v0.1" as const;

const RESUME_STEPS: WizardStepId[] = [
  "q1",
  "q2",
  "q3",
  "q4",
  "q5",
  "q6",
  "q7",
  "q8",
  "q9",
  "q10",
  "q11",
  "q12",
  "review",
];

export type PersistedInterviewDraft = {
  draft: InterviewDraft;
  step: WizardStepId;
  createdAt: string;
  updatedAt: string;
};

type StoredEnvelope = {
  schema: typeof DRAFT_SCHEMA;
  record: PersistedInterviewDraft;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

function isInterviewDraft(value: unknown): value is InterviewDraft {
  if (!isRecord(value)) return false;
  return (
    isNullableString(value.opportunityType) &&
    isNullableString(value.sectorCode) &&
    isNullableString(value.sectorLabel) &&
    typeof value.sectorOther === "string" &&
    typeof value.productSummary === "string" &&
    isNullableString(value.countryCode) &&
    typeof value.restrictedGeoAck === "boolean" &&
    isNullableString(value.locationSpecificity) &&
    typeof value.locationText === "string" &&
    isNullableString(value.developmentStage) &&
    isNullableString(value.currency) &&
    isNullableString(value.capexRange) &&
    isNullableString(value.evaluationContext) &&
    isNullableString(value.buyerType) &&
    isNullableString(value.demandCertainty) &&
    isNullableString(value.siteControl) &&
    isNullableString(value.decisionNeeded)
  );
}

function isResumeStep(value: unknown): value is WizardStepId {
  return typeof value === "string" && RESUME_STEPS.includes(value as WizardStepId);
}

export function parseStoredInterviewDraft(
  raw: string | null
): PersistedInterviewDraft | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.schema !== DRAFT_SCHEMA) return null;
    if (!isRecord(parsed.record)) return null;
    const record = parsed.record;
    if (!isInterviewDraft(record.draft)) return null;
    if (!isResumeStep(record.step)) return null;
    if (typeof record.createdAt !== "string" || record.createdAt.trim() === "") {
      return null;
    }
    if (typeof record.updatedAt !== "string" || record.updatedAt.trim() === "") {
      return null;
    }
    return {
      draft: record.draft,
      step: record.step,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  } catch {
    return null;
  }
}

export function serializeInterviewDraft(record: PersistedInterviewDraft): string {
  const envelope: StoredEnvelope = {
    schema: DRAFT_SCHEMA,
    record,
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

export function loadInterviewDraft(): PersistedInterviewDraft | null {
  const store = storage();
  if (!store) return null;
  try {
    const raw = store.getItem(INTERVIEW_DRAFT_STORAGE_KEY);
    const record = parseStoredInterviewDraft(raw);
    if (!record && raw !== null) {
      store.removeItem(INTERVIEW_DRAFT_STORAGE_KEY);
    }
    return record;
  } catch {
    try {
      store.removeItem(INTERVIEW_DRAFT_STORAGE_KEY);
    } catch {
      /* ignore quota / private-mode failures */
    }
    return null;
  }
}

export function saveInterviewDraft(record: PersistedInterviewDraft): void {
  const store = storage();
  if (!store) return;
  try {
    store.setItem(INTERVIEW_DRAFT_STORAGE_KEY, serializeInterviewDraft(record));
  } catch {
    /* ignore quota / private-mode failures */
  }
}

export function clearInterviewDraft(): void {
  const store = storage();
  if (!store) return;
  try {
    store.removeItem(INTERVIEW_DRAFT_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
