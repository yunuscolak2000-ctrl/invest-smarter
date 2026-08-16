import type { Ref } from "react";
import { AssistantPrompt } from "../../components/wizard/AssistantPrompt";
import { SelectCardGroup } from "../../components/wizard/SelectCard";
import { useCopy } from "../../hooks/useLanguage";
import { labeledOptions } from "../../lib/i18n";
import { PROJECT_CONTEXT_OPTIONS } from "../../mocks/interview";
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
  const copy = useCopy();

  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
          {copy.projectContext.kicker}
        </p>
        <AssistantPrompt
          title={copy.projectContext.title}
          message={copy.projectContext.message}
        />
      </div>
      <SelectCardGroup
        ref={controlRef}
        name="project-context"
        value={value}
        options={labeledOptions(
          PROJECT_CONTEXT_OPTIONS,
          copy.options.projectContext
        )}
        onChange={(next) => onChange(next as ProjectContext)}
        error={error}
      />
    </section>
  );
}
