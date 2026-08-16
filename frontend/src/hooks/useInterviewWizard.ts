import { useRef, useState } from "react";
import { presentDecisionCard } from "../lib/presentDecisionCard";
import { createRecommendationSnapshot } from "../lib/createRecommendationSnapshot";
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
  type SectorOption,
  type SiteControl,
  type WizardStepId,
} from "../types/interview";

const STEP_SEQUENCE: WizardStepId[] = [
  "framing",
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

export function useInterviewWizard() {
  const [step, setStep] = useState<WizardStepId>("framing");
  const [draft, setDraft] = useState<InterviewDraft>(EMPTY_INTERVIEW_DRAFT);
  const [error, setError] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<RecommendationSnapshot | null>(null);
  const fieldsetRef = useRef<HTMLFieldSetElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const ackRef = useRef<HTMLInputElement>(null);

  function patchDraft(patch: Partial<InterviewDraft>) {
    setDraft((current) => ({ ...current, ...patch }));
    setError(null);
    setSnapshot(null);
  }

  function validateStep(current: WizardStepId, currentDraft: InterviewDraft) {
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

  function goToStep(next: WizardStepId) {
    moveTo(next);
  }

  function goPrevious() {
    if (step === "decision") {
      moveTo("review");
      return;
    }
    const index = STEP_SEQUENCE.indexOf(step);
    if (index > 0) moveTo(STEP_SEQUENCE[index - 1]);
  }

  function goNext() {
    if (step === "framing") {
      moveTo("q1");
      return;
    }

    const message = validateStep(step, draft);
    if (message) {
      setError(message);
      focusErrorControl();
      return;
    }

    const next = STEP_SEQUENCE[STEP_SEQUENCE.indexOf(step) + 1];
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

  function setEvaluatorStatus(status: EvaluatorDecisionStatus) {
    setSnapshot((current) =>
      current ? { ...current, evaluatorStatus: status } : current
    );
  }

  const isQuestionStep = step.startsWith("q");
  const question = isQuestionStep
    ? {
        number: Number(step.slice(1)),
        minutesLeft: MINUTES_LEFT_BY_STEP[step as keyof typeof MINUTES_LEFT_BY_STEP],
      }
    : undefined;

  const decisionView =
    snapshot && step === "decision"
      ? presentDecisionCard(
          snapshot.decisionObject,
          snapshot.frozenDraft,
          snapshot.evaluatorStatus
        )
      : null;

  return {
    step,
    draft,
    error,
    fieldsetRef,
    inputRef,
    ackRef,
    workingTitle:
      snapshot && step === "decision"
        ? workingTitleFrom(snapshot.frozenDraft)
        : workingTitleFrom(draft),
    questionNumber: question?.number,
    questionTotal: WIZARD_QUESTION_TOTAL,
    minutesLeft: question?.minutesLeft,
    decisionView,
    evaluatorStatus: snapshot?.evaluatorStatus ?? DEFAULT_EVALUATOR_STATUS,
    setEvaluatorStatus,
    goPrevious,
    goNext,
    goToStep,
    seeRecommendation,
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
