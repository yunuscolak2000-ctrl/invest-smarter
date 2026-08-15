import { useRef, useState } from "react";
import {
  validateCountry,
  validateDevelopmentStage,
  validateLocation,
  validateOpportunityType,
  validateProduct,
  validateSector,
} from "../lib/interviewValidation";
import { getCountry } from "../mocks/countries";
import { MINUTES_LEFT_BY_STEP } from "../mocks/interview";
import {
  EMPTY_INTERVIEW_DRAFT,
  WIZARD_QUESTION_TOTAL,
  type CountryOption,
  type DevelopmentStage,
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

export function useInterviewWizard() {
  const [step, setStep] = useState<WizardStepId>("framing");
  const [draft, setDraft] = useState<InterviewDraft>(EMPTY_INTERVIEW_DRAFT);
  const [error, setError] = useState<string | null>(null);
  const [reachedEnd, setReachedEnd] = useState(false);
  const fieldsetRef = useRef<HTMLFieldSetElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const ackRef = useRef<HTMLInputElement>(null);

  function patchDraft(patch: Partial<InterviewDraft>) {
    setDraft((current) => ({ ...current, ...patch }));
    setError(null);
    setReachedEnd(false);
  }

  function validateStep(current: WizardStepId, snapshot: InterviewDraft) {
    if (current === "q1") return validateOpportunityType(snapshot);
    if (current === "q2") return validateSector(snapshot);
    if (current === "q3") return validateProduct(snapshot);
    if (current === "q4") return validateCountry(snapshot);
    if (current === "q5") return validateLocation(snapshot);
    if (current === "q6") return validateDevelopmentStage(snapshot);
    return null;
  }

  function focusErrorControl() {
    requestAnimationFrame(() => {
      if (step === "q1" || step === "q6") {
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

  function goPrevious() {
    setError(null);
    setReachedEnd(false);
    const index = STEP_SEQUENCE.indexOf(step);
    if (index > 0) setStep(STEP_SEQUENCE[index - 1]);
  }

  function goNext() {
    if (step === "framing") {
      setStep("q1");
      return;
    }

    const message = validateStep(step, draft);
    if (message) {
      setError(message);
      setReachedEnd(false);
      focusErrorControl();
      return;
    }

    const next = STEP_SEQUENCE[STEP_SEQUENCE.indexOf(step) + 1];
    setError(null);

    if (!next) {
      setReachedEnd(true);
      return;
    }

    setReachedEnd(false);
    setStep(next);
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

  const question =
    step === "framing"
      ? undefined
      : {
          number: Number(step.slice(1)),
          minutesLeft: MINUTES_LEFT_BY_STEP[step],
        };

  return {
    step,
    draft,
    error,
    reachedEnd,
    fieldsetRef,
    inputRef,
    ackRef,
    workingTitle: workingTitleFrom(draft),
    questionNumber: question?.number,
    questionTotal: WIZARD_QUESTION_TOTAL,
    minutesLeft: question?.minutesLeft,
    goPrevious,
    goNext,
    setOpportunityType,
    setSector,
    setSectorOther,
    setProductSummary,
    setCountry,
    setRestrictedGeoAck,
    setLocationSpecificity,
    setLocationText,
    setDevelopmentStage,
  };
}
