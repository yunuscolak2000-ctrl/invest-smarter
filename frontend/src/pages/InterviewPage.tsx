import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { WizardFooter } from "../components/wizard/WizardFooter";
import { WizardShell } from "../components/wizard/WizardShell";
import { useInterviewWizard } from "../hooks/useInterviewWizard";
import { isInterviewLocationState } from "../types/interview";
import { CountryStep } from "./interview/CountryStep";
import { DevelopmentStageStep } from "./interview/DevelopmentStageStep";
import { FramingScreen } from "./interview/FramingScreen";
import { LocationStep } from "./interview/LocationStep";
import { OpportunityTypeStep } from "./interview/OpportunityTypeStep";
import { ProductStep } from "./interview/ProductStep";
import { SectorStep } from "./interview/SectorStep";

export default function InterviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const wizard = useInterviewWizard();

  if (!isInterviewLocationState(location.state)) {
    return <Navigate to="/" replace />;
  }

  const isFraming = wizard.step === "framing";

  return (
    <WizardShell
      questionNumber={wizard.questionNumber}
      questionTotal={wizard.questionTotal}
      minutesLeft={wizard.minutesLeft}
      workingTitle={wizard.workingTitle}
      footer={
        <WizardFooter
          onNext={wizard.goNext}
          nextLabel={isFraming ? "Start interview" : "Next"}
          nextDisabled={wizard.reachedEnd}
          showPrevious={!isFraming}
          onPrevious={wizard.goPrevious}
          secondaryLabel={isFraming ? "Cancel" : undefined}
          onSecondary={isFraming ? () => navigate("/") : undefined}
        />
      }
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
          reachedEnd={wizard.reachedEnd}
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
          reachedEnd={wizard.reachedEnd}
        />
      ) : null}
    </WizardShell>
  );
}
