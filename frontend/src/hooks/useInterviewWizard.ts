import { useRef, useState } from "react";
import {
  validateOpportunityType,
  validateProduct,
  validateSector,
} from "../lib/interviewValidation";
import {
  EMPTY_INTERVIEW_DRAFT,
  WIZARD_QUESTION_TOTAL,
  type InterviewDraft,
  type OpportunityType,
  type SectorOption,
  type WizardStepId,
} from "../types/interview";
import { MINUTES_LEFT_BY_STEP } from "../mocks/interview";

const QUESTION_META: Record<
  Exclude<WizardStepId, "framing">,
  { number: number; minutesLeft: number }
> = {
  q1: { number: 1, minutesLeft: MINUTES_LEFT_BY_STEP.q1 },
  q2: { number: 2, minutesLeft: MINUTES_LEFT_BY_STEP.q2 },
  q3: { number: 3, minutesLeft: MINUTES_LEFT_BY_STEP.q3 },
};

export function useInterviewWizard() {
  const [step, setStep] = useState<WizardStepId>("framing");
  const [draft, setDraft] = useState<InterviewDraft>(EMPTY_INTERVIEW_DRAFT);
  const [error, setError] = useState<string | null>(null);
  const [reachedEnd, setReachedEnd] = useState(false);
  const fieldsetRef = useRef<HTMLFieldSetElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function patchDraft(patch: Partial<InterviewDraft>) {
    setDraft((current) => ({ ...current, ...patch }));
    setError(null);
    setReachedEnd(false);
  }

  function focusErrorControl() {
    requestAnimationFrame(() => {
      if (step === "q1") {
        fieldsetRef.current?.focus();
        return;
      }
      inputRef.current?.focus();
    });
  }

  function goPrevious() {
    setError(null);
    setReachedEnd(false);
    if (step === "q1") setStep("framing");
    if (step === "q2") setStep("q1");
    if (step === "q3") setStep("q2");
  }

  function goNext() {
    if (step === "framing") {
      setStep("q1");
      return;
    }

    if (step === "q1") {
      const message = validateOpportunityType(draft);
      if (message) {
        setError(message);
        focusErrorControl();
        return;
      }
      setError(null);
      setStep("q2");
      return;
    }

    if (step === "q2") {
      const message = validateSector(draft);
      if (message) {
        setError(message);
        focusErrorControl();
        return;
      }
      setError(null);
      setStep("q3");
      return;
    }

    const message = validateProduct(draft);
    if (message) {
      setError(message);
      setReachedEnd(false);
      focusErrorControl();
      return;
    }

    setError(null);
    setReachedEnd(true);
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

  const question =
    step === "framing" ? undefined : QUESTION_META[step];

  return {
    step,
    draft,
    error,
    reachedEnd,
    fieldsetRef,
    inputRef,
    questionNumber: question?.number,
    questionTotal: WIZARD_QUESTION_TOTAL,
    minutesLeft: question?.minutesLeft,
    goPrevious,
    goNext,
    setOpportunityType,
    setSector,
    setSectorOther,
    setProductSummary,
  };
}
