import { AssistantPrompt } from "../../components/wizard/AssistantPrompt";
import { WIZARD_COPY } from "../../mocks/interview";

export function FramingScreen() {
  return (
    <section className="space-y-6">
      <AssistantPrompt
        title={WIZARD_COPY.framing.title}
        message={WIZARD_COPY.framing.message}
      />
    </section>
  );
}
