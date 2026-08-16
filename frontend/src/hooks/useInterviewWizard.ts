import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { presentDecisionCard } from "../lib/presentDecisionCard";
import {
  createRecommendationSnapshot,
  evaluatorDecisionErrors,
  hasEvaluatorDecisionErrors,
  type EvaluatorDecisionErrors,
} from "../lib/createRecommendationSnapshot";
import {
  clearRecommendationSnapshot,
  loadRecommendationSnapshot,
  saveRecommendationSnapshot,
} from "../lib/recommendationSnapshotStorage";
import {
  clearInterviewDraft,
  loadInterviewDraft,
  saveInterviewDraft,
} from "../lib/interviewDraftStorage";
import {
  validateBuyerType,
  validateCapitalScale,
  validateCountry,
  validateDecisionNeeded,
  validateDemandCertainty,
  validateDevelopmentStage,
  validateEvaluationContext,
  validateInterviewDraft,
  validateLocation,
  validateOpportunityType,
  validateProduct,
  validateProjectContext,
  validateSector,
  validateSiteControl,
} from "../lib/interviewValidation";
import { getCountry } from "../mocks/countries";
import { MINUTES_LEFT_BY_STEP, WIZARD_COPY } from "../mocks/interview";
import {
  DEFAULT_EVALUATOR_STATUS,
  type EvaluatorDecisionStatus,
  type RecommendationSnapshot,
} from "../types/decision";
import {
  EMPTY_INTERVIEW_DRAFT,
  WIZARD_QUESTION_TOTAL,
  type BuyerType,
  type CapexRange,
  type CountryOption,
  type DecisionNeeded,
  type DemandCertainty,
  type DevelopmentStage,
  type EvaluationContext,
  type InterviewDraft,
  type LocationSpecificity,
  type OpportunityType,
  type ProjectContext,
  type SectorOption,
  type SiteControl,
  type WizardStepId,
} from "../types/interview";

const STEP_SEQUENCE: WizardStepId[] = [
  "framing",
  "projectContext",
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

const CARD_STEPS: WizardStepId[] = [
  "projectContext",
  "q1",
  "q6",
  "q7",
  "q8",
  "q9",
  "q10",
  "q11",
  "q12",
];

function workingTitleFrom(draft: InterviewDraft): string {
  const country = getCountry(draft.countryCode);
  if (!country) return "New opportunity";

  const sector =
    draft.sectorCode === "other"
      ? draft.sectorOther.trim()
      : (draft.sectorLabel ?? "").trim();

  if (!sector) return "New opportunity";
  return `${sector} — ${country.name}`;
}

function defaultCurrency(draft: InterviewDraft): string {
  return getCountry(draft.countryCode)?.currency ?? "USD";
}

type WizardOptions = {
  resumeSaved?: boolean;
};

export function useInterviewWizard(options: WizardOptions = {}) {
  const resumeSaved = options.resumeSaved === true;
  const [initial] = useState(() => {
    if (!resumeSaved) {
      clearRecommendationSnapshot();
      clearInterviewDraft();
      return {
        snapshot: null as RecommendationSnapshot | null,
        draft: EMPTY_INTERVIEW_DRAFT,
        step: "framing" as WizardStepId,
        draftCreatedAt: null as string | null,
      };
    }

    const storedSnapshot = loadRecommendationSnapshot();
    if (storedSnapshot) {
      return {
        snapshot: storedSnapshot,
        draft: { ...storedSnapshot.frozenDraft },
        step: "decision" as WizardStepId,
        draftCreatedAt: null as string | null,
      };
    }

    const storedDraft = loadInterviewDraft();
    if (storedDraft) {
      const needsContext = !storedDraft.draft.projectContext;
      return {
        snapshot: null as RecommendationSnapshot | null,
        draft: storedDraft.draft,
        step: (
          needsContext ? "projectContext" : storedDraft.step
        ) as WizardStepId,
        draftCreatedAt: storedDraft.createdAt,
      };
    }

    return {
      snapshot: null as RecommendationSnapshot | null,
      draft: EMPTY_INTERVIEW_DRAFT,
      step: "framing" as WizardStepId,
      draftCreatedAt: null as string | null,
    };
  });
  const [step, setStep] = useState<WizardStepId>(initial.step);
  const [draft, setDraft] = useState<InterviewDraft>(initial.draft);
  const [error, setError] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<RecommendationSnapshot | null>(
    initial.snapshot
  );
  const draftCreatedAtRef = useRef<string | null>(initial.draftCreatedAt);
  const fieldsetRef = useRef<HTMLFieldSetElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const ackRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (snapshot) {
      saveRecommendationSnapshot(snapshot);
      return;
    }
    clearRecommendationSnapshot();
  }, [snapshot]);

  useEffect(() => {
    if (step === "framing" || step === "decision") {
      clearInterviewDraft();
      draftCreatedAtRef.current = null;
      return;
    }
    const createdAt = draftCreatedAtRef.current ?? new Date().toISOString();
    draftCreatedAtRef.current = createdAt;
    saveInterviewDraft({
      draft,
      step,
      createdAt,
      updatedAt: new Date().toISOString(),
    });
  }, [draft, step]);

  useLayoutEffect(() => {
    if (draft.projectContext) return;
    if (
      step === "framing" ||
      step === "decision" ||
      step === "projectContext"
    ) {
      return;
    }
    setStep("projectContext");
  }, [step, draft.projectContext]);

  function patchDraft(patch: Partial<InterviewDraft>) {
    setDraft((current) => ({ ...current, ...patch }));
    setError(null);
    setSnapshot(null);
  }

  function validateStep(current: WizardStepId, currentDraft: InterviewDraft) {
    if (current === "projectContext") return validateProjectContext(currentDraft);
    if (current === "q1") return validateOpportunityType(currentDraft);
    if (current === "q2") return validateSector(currentDraft);
    if (current === "q3") return validateProduct(currentDraft);
    if (current === "q4") return validateCountry(currentDraft);
    if (current === "q5") return validateLocation(currentDraft);
    if (current === "q6") return validateDevelopmentStage(currentDraft);
    if (current === "q7") return validateCapitalScale(currentDraft);
    if (current === "q8") return validateEvaluationContext(currentDraft);
    if (current === "q9") return validateBuyerType(currentDraft);
    if (current === "q10") return validateDemandCertainty(currentDraft);
    if (current === "q11") return validateSiteControl(currentDraft);
    if (current === "q12") return validateDecisionNeeded(currentDraft);
    return null;
  }

  function focusErrorControl() {
    requestAnimationFrame(() => {
      if (CARD_STEPS.includes(step)) {
        fieldsetRef.current?.focus();
        return;
      }

      if (step === "q4") {
        const country = getCountry(draft.countryCode);
        if (country?.risk_tier === "restricted" && !draft.restrictedGeoAck) {
          ackRef.current?.focus();
          return;
        }
        inputRef.current?.focus();
        return;
      }

      if (step === "q5") {
        if (!draft.locationSpecificity) {
          fieldsetRef.current?.focus();
          return;
        }
        inputRef.current?.focus();
        return;
      }

      inputRef.current?.focus();
    });
  }

  function moveTo(next: WizardStepId) {
    setError(null);
    setStep(next);
    window.scrollTo(0, 0);
  }

  const visibleStep: WizardStepId =
    !draft.projectContext &&
    step !== "framing" &&
    step !== "decision" &&
    step !== "projectContext"
      ? "projectContext"
      : step;

  function goToStep(next: WizardStepId) {
    moveTo(next);
  }

  function goPrevious() {
    if (visibleStep === "decision") {
      moveTo("review");
      return;
    }
    const index = STEP_SEQUENCE.indexOf(visibleStep);
    if (index > 0) moveTo(STEP_SEQUENCE[index - 1]);
  }

  function goToProjectContext() {
    moveTo("projectContext");
  }

  function goNext() {
    if (visibleStep === "framing") {
      goToProjectContext();
      return;
    }

    if (visibleStep === "projectContext") {
      const message = validateProjectContext(draft);
      if (message) {
        setError(message);
        focusErrorControl();
        return;
      }
      moveTo("q1");
      return;
    }

    const message = validateStep(visibleStep, draft);
    if (message) {
      setError(message);
      focusErrorControl();
      return;
    }

    const next = STEP_SEQUENCE[STEP_SEQUENCE.indexOf(visibleStep) + 1];
    if (next) moveTo(next);
  }

  function seeRecommendation() {
    const invalid = validateInterviewDraft(draft);
    if (invalid) {
      setError(WIZARD_COPY.review.incompleteError);
      return;
    }

    const next = createRecommendationSnapshot(draft);
    if (!next) {
      setError(WIZARD_COPY.review.incompleteError);
      return;
    }

    setSnapshot(next);
    moveTo("decision");
  }

  function setProjectContext(value: ProjectContext) {
    patchDraft({ projectContext: value });
  }

  function setOpportunityType(value: OpportunityType) {
    patchDraft({ opportunityType: value });
  }

  function setSector(option: SectorOption) {
    patchDraft({
      sectorCode: option.code,
      sectorLabel: option.code === "other" ? null : option.label,
      sectorOther: option.code === "other" ? draft.sectorOther : "",
    });
  }

  function setSectorOther(value: string) {
    patchDraft({ sectorOther: value, sectorCode: "other", sectorLabel: null });
  }

  function setProductSummary(value: string) {
    patchDraft({ productSummary: value });
  }

  function setCountry(country: CountryOption) {
    patchDraft({
      countryCode: country.code,
      restrictedGeoAck: false,
      currency: draft.currency ?? country.currency,
    });
  }

  function setRestrictedGeoAck(value: boolean) {
    patchDraft({ restrictedGeoAck: value });
  }

  function setLocationSpecificity(value: LocationSpecificity) {
    patchDraft({ locationSpecificity: value });
  }

  function setLocationText(value: string) {
    patchDraft({ locationText: value });
  }

  function setDevelopmentStage(value: DevelopmentStage) {
    patchDraft({ developmentStage: value });
  }

  function setCurrency(value: string) {
    patchDraft({ currency: value });
  }

  function setCapexRange(value: CapexRange) {
    patchDraft({
      capexRange: value,
      currency: draft.currency ?? defaultCurrency(draft),
    });
  }

  function setEvaluationContext(value: EvaluationContext) {
    patchDraft({ evaluationContext: value });
  }

  function setBuyerType(value: BuyerType) {
    patchDraft({ buyerType: value });
  }

  function setDemandCertainty(value: DemandCertainty) {
    patchDraft({ demandCertainty: value });
  }

  function setSiteControl(value: SiteControl) {
    patchDraft({ siteControl: value });
  }

  function setDecisionNeeded(value: DecisionNeeded) {
    patchDraft({ decisionNeeded: value });
  }

  function setEvaluatorName(value: string) {
    setSnapshot((current) =>
      current ? { ...current, evaluatorName: value } : current
    );
  }

  function setEvaluatorReason(value: string) {
    setSnapshot((current) =>
      current ? { ...current, evaluatorReason: value } : current
    );
  }

  function recordEvaluatorDecision(
    status: Exclude<EvaluatorDecisionStatus, "not_accepted">,
    name: string,
    reason: string
  ): EvaluatorDecisionErrors {
    const errors = evaluatorDecisionErrors(status, name, reason);
    if (hasEvaluatorDecisionErrors(errors)) return errors;
    setSnapshot((current) =>
      current ? { ...current, evaluatorStatus: status } : current
    );
    return { name: null, reason: null };
  }

  function clearSavedRecommendation() {
    setSnapshot(null);
    setError(null);
    moveTo("review");
  }

  const isQuestionStep = visibleStep.startsWith("q");
  const question = isQuestionStep
    ? {
        number: Number(visibleStep.slice(1)),
        minutesLeft:
          MINUTES_LEFT_BY_STEP[visibleStep as keyof typeof MINUTES_LEFT_BY_STEP],
      }
    : undefined;

  const decisionView =
    snapshot && visibleStep === "decision"
      ? presentDecisionCard(
          snapshot.decisionObject,
          snapshot.frozenDraft,
          snapshot.evaluatorStatus
        )
      : null;

  return {
    step: visibleStep,
    draft,
    error,
    fieldsetRef,
    inputRef,
    ackRef,
    workingTitle:
      snapshot && visibleStep === "decision"
        ? workingTitleFrom(snapshot.frozenDraft)
        : workingTitleFrom(draft),
    questionNumber: question?.number,
    questionTotal: WIZARD_QUESTION_TOTAL,
    minutesLeft: question?.minutesLeft,
    decisionView,
    hasSnapshot: snapshot !== null,
    hasResumableDraft:
      snapshot === null &&
      visibleStep !== "framing" &&
      visibleStep !== "decision",
    evaluatorStatus: snapshot?.evaluatorStatus ?? DEFAULT_EVALUATOR_STATUS,
    evaluatorName: snapshot?.evaluatorName ?? "",
    evaluatorReason: snapshot?.evaluatorReason ?? "",
    setEvaluatorName,
    setEvaluatorReason,
    recordEvaluatorDecision,
    clearSavedRecommendation,
    goPrevious,
    goNext,
    goToStep,
    goToProjectContext,
    seeRecommendation,
    setProjectContext,
    setOpportunityType,
    setSector,
    setSectorOther,
    setProductSummary,
    setCountry,
    setRestrictedGeoAck,
    setLocationSpecificity,
    setLocationText,
    setDevelopmentStage,
    setCurrency,
    setCapexRange,
    setEvaluationContext,
    setBuyerType,
    setDemandCertainty,
    setSiteControl,
    setDecisionNeeded,
  };
}
