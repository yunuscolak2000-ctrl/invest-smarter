import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { WizardFooter } from "../components/wizard/WizardFooter";
import { WizardShell } from "../components/wizard/WizardShell";
import { useInterviewWizard } from "../hooks/useInterviewWizard";
import { WIZARD_COPY } from "../mocks/interview";
import { isInterviewLocationState } from "../types/interview";
import { BuyerTypeStep } from "./interview/BuyerTypeStep";
import { CountryStep } from "./interview/CountryStep";
import { DecisionCardScreen } from "./interview/DecisionCardScreen";
import { DecisionNeededStep } from "./interview/DecisionNeededStep";
import { DemandCertaintyStep } from "./interview/DemandCertaintyStep";
import { DevelopmentStageStep } from "./interview/DevelopmentStageStep";
import { EvaluationContextStep } from "./interview/EvaluationContextStep";
import { FramingScreen } from "./interview/FramingScreen";
import { LocationStep } from "./interview/LocationStep";
import { OpportunityTypeStep } from "./interview/OpportunityTypeStep";
import { ProductStep } from "./interview/ProductStep";
import { ReviewScreen } from "./interview/ReviewScreen";
import { ScaleStep } from "./interview/ScaleStep";
import { SectorStep } from "./interview/SectorStep";
import { SiteControlStep } from "./interview/SiteControlStep";

export default function InterviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const wizard = useInterviewWizard();

  if (!isInterviewLocationState(location.state)) {
    return <Navigate to="/" replace />;
  }

  const isFraming = wizard.step === "framing";
  const isReview = wizard.step === "review";
  const isDecision = wizard.step === "decision";

  const footer = isDecision ? (
    <WizardFooter
      hideNext
      showPrevious
      previousLabel={WIZARD_COPY.decision.editLabel}
      onPrevious={wizard.goPrevious}
    />
  ) : (
    <WizardFooter
      onNext={isReview ? wizard.seeRecommendation : wizard.goNext}
      nextLabel={
        isFraming
          ? "Start interview"
          : isReview
            ? WIZARD_COPY.review.nextLabel
            : "Next"
      }
      showPrevious={!isFraming}
      onPrevious={wizard.goPrevious}
      secondaryLabel={isFraming ? "Cancel" : undefined}
      onSecondary={isFraming ? () => navigate("/") : undefined}
    />
  );

  return (
    <WizardShell
      questionNumber={wizard.questionNumber}
      questionTotal={wizard.questionTotal}
      minutesLeft={wizard.minutesLeft}
      workingTitle={wizard.workingTitle}
      footer={footer}
    >
      {wizard.step === "framing" ? <FramingScreen /> : null}

      {wizard.step === "q1" ? (
        <OpportunityTypeStep
          value={wizard.draft.opportunityType}
          onChange={wizard.setOpportunityType}
          error={wizard.error}
          controlRef={wizard.fieldsetRef}
        />
      ) : null}

      {wizard.step === "q2" ? (
        <SectorStep
          draft={wizard.draft}
          onSelect={wizard.setSector}
          onOtherChange={wizard.setSectorOther}
          error={wizard.error}
          controlRef={wizard.inputRef}
        />
      ) : null}

      {wizard.step === "q3" ? (
        <ProductStep
          draft={wizard.draft}
          onChange={wizard.setProductSummary}
          error={wizard.error}
          controlRef={wizard.inputRef}
        />
      ) : null}

      {wizard.step === "q4" ? (
        <CountryStep
          draft={wizard.draft}
          onSelect={wizard.setCountry}
          onAckChange={wizard.setRestrictedGeoAck}
          error={wizard.error}
          searchRef={wizard.inputRef}
          ackRef={wizard.ackRef}
        />
      ) : null}

      {wizard.step === "q5" ? (
        <LocationStep
          draft={wizard.draft}
          onSpecificityChange={wizard.setLocationSpecificity}
          onLocationTextChange={wizard.setLocationText}
          error={wizard.error}
          fieldsetRef={wizard.fieldsetRef}
          inputRef={wizard.inputRef}
        />
      ) : null}

      {wizard.step === "q6" ? (
        <DevelopmentStageStep
          value={wizard.draft.developmentStage}
          onChange={wizard.setDevelopmentStage}
          error={wizard.error}
          controlRef={wizard.fieldsetRef}
        />
      ) : null}

      {wizard.step === "q7" ? (
        <ScaleStep
          draft={wizard.draft}
          onCurrencyChange={wizard.setCurrency}
          onRangeChange={wizard.setCapexRange}
          error={wizard.error}
          controlRef={wizard.fieldsetRef}
        />
      ) : null}

      {wizard.step === "q8" ? (
        <EvaluationContextStep
          value={wizard.draft.evaluationContext}
          onChange={wizard.setEvaluationContext}
          error={wizard.error}
          controlRef={wizard.fieldsetRef}
        />
      ) : null}

      {wizard.step === "q9" ? (
        <BuyerTypeStep
          value={wizard.draft.buyerType}
          onChange={wizard.setBuyerType}
          error={wizard.error}
          controlRef={wizard.fieldsetRef}
        />
      ) : null}

      {wizard.step === "q10" ? (
        <DemandCertaintyStep
          value={wizard.draft.demandCertainty}
          buyerType={wizard.draft.buyerType}
          onChange={wizard.setDemandCertainty}
          error={wizard.error}
          controlRef={wizard.fieldsetRef}
        />
      ) : null}

      {wizard.step === "q11" ? (
        <SiteControlStep
          value={wizard.draft.siteControl}
          opportunityType={wizard.draft.opportunityType}
          onChange={wizard.setSiteControl}
          error={wizard.error}
          controlRef={wizard.fieldsetRef}
        />
      ) : null}

      {wizard.step === "q12" ? (
        <DecisionNeededStep
          value={wizard.draft.decisionNeeded}
          onChange={wizard.setDecisionNeeded}
          error={wizard.error}
          controlRef={wizard.fieldsetRef}
        />
      ) : null}

      {isReview ? (
        <ReviewScreen
          draft={wizard.draft}
          error={wizard.error}
          onEdit={wizard.goToStep}
        />
      ) : null}

      {isDecision ? <DecisionCardScreen view={wizard.decisionView} /> : null}
    </WizardShell>
  );
}
