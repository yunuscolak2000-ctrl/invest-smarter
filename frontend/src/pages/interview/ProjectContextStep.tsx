import type { Ref } from "react";
import { AssistantPrompt } from "../../components/wizard/AssistantPrompt";
import { SelectCardGroup } from "../../components/wizard/SelectCard";
import { PROJECT_CONTEXT_OPTIONS, WIZARD_COPY } from "../../mocks/interview";
import type { ProjectContext } from "../../types/interview";

type ProjectContextStepProps = {
  value: ProjectContext | null;
  onChange: (value: ProjectContext) => void;
  error: string | null;
  controlRef: Ref<HTMLFieldSetElement>;
};

export function ProjectContextStep({
  value,
  onChange,
  error,
  controlRef,
}: ProjectContextStepProps) {
  const copy = WIZARD_COPY.projectContext;

  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
          {copy.kicker}
        </p>
        <AssistantPrompt title={copy.title} message={copy.message} />
      </div>
      <SelectCardGroup
        ref={controlRef}
        name="project-context"
        value={value}
        options={PROJECT_CONTEXT_OPTIONS}
        onChange={(next) => onChange(next as ProjectContext)}
        error={error}
      />
    </section>
  );
}
