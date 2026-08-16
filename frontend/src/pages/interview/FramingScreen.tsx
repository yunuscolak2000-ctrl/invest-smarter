import { AssistantPrompt } from "../../components/wizard/AssistantPrompt";
import { useCopy } from "../../hooks/useLanguage";

export function FramingScreen() {
  const copy = useCopy();

  return (
    <section className="space-y-6">
      <AssistantPrompt title={copy.framing.title} message={copy.framing.message} />
    </section>
  );
}
