import { useRef, useState } from "react";
import { presentDecisionCard } from "../lib/presentDecisionCard";
import {
  validateBuyerType,
  validateCapitalScale,
  validateCountry,
  validateDevelopmentStage,
  validateEvaluationContext,
  validateInterviewDraft,
  validateLocation,
  validateOpportunityType,
  validateProduct,
  validateSector,
} from "../lib/interviewValidation";
import { evaluateDecisionV01 } from "../lib/decisionRulesV01";
import { getCountry } from "../mocks/countries";
import { MINUTES_LEFT_BY_STEP, WIZARD_COPY } from "../mocks/interview";
import type { DecisionObjectV01 } from "../types/decision";
import {
  EMPTY_INTERVIEW_DRAFT,
  WIZARD_QUESTION_TOTAL,
  type BuyerType,
  type CapexRange,
  type CountryOption,
  type DevelopmentStage,
  type EvaluationContext,
  type InterviewDraft,
  type LocationSpecificity,
  type OpportunityType,
  type SectorOption,
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
  "review",
];

const CARD_STEPS: WizardStepId[] = ["q1", "q6", "q7", "q8", "q9"];

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
  const [recommendation, setRecommendation] = useState<DecisionObjectV01 | null>(
    null
  );
  const fieldsetRef = useRef<HTMLFieldSetElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const ackRef = useRef<HTMLInputElement>(null);

  function patchDraft(patch: Partial<InterviewDraft>) {
    setDraft((current) => ({ ...current, ...patch }));
    setError(null);
    setRecommendation(null);
  }

  function validateStep(current: WizardStepId, snapshot: InterviewDraft) {
    if (current === "q1") return validateOpportunityType(snapshot);
    if (current === "q2") return validateSector(snapshot);
    if (current === "q3") return validateProduct(snapshot);
    if (current === "q4") return validateCountry(snapshot);
    if (current === "q5") return validateLocation(snapshot);
    if (current === "q6") return validateDevelopmentStage(snapshot);
    if (current === "q7") return validateCapitalScale(snapshot);
    if (current === "q8") return validateEvaluationContext(snapshot);
    if (current === "q9") return validateBuyerType(snapshot);
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

    const decision = evaluateDecisionV01(draft);
    if (!decision) {
      setError(WIZARD_COPY.review.incompleteError);
      return;
    }

    setRecommendation(decision);
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

  const isQuestionStep = step.startsWith("q");
  const question = isQuestionStep
    ? {
        number: Number(step.slice(1)),
        minutesLeft: MINUTES_LEFT_BY_STEP[step as keyof typeof MINUTES_LEFT_BY_STEP],
      }
    : undefined;

  const decisionView =
    recommendation && step === "decision"
      ? presentDecisionCard(recommendation, draft)
      : null;

  return {
    step,
    draft,
    error,
    fieldsetRef,
    inputRef,
    ackRef,
    workingTitle: workingTitleFrom(draft),
    questionNumber: question?.number,
    questionTotal: WIZARD_QUESTION_TOTAL,
    minutesLeft: question?.minutesLeft,
    decisionView,
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
  };
}
