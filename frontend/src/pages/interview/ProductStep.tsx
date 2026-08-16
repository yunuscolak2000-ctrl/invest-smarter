import type { Ref } from "react";
import { AssistantPrompt } from "../../components/wizard/AssistantPrompt";
import { Chip } from "../../components/wizard/Chip";
import { TextField } from "../../components/wizard/TextField";
import { useCopy } from "../../hooks/useLanguage";
import type { InterviewDraft } from "../../types/interview";

type ProductStepProps = {
  draft: InterviewDraft;
  onChange: (value: string) => void;
  error: string | null;
  controlRef: Ref<HTMLInputElement>;
};

export function ProductStep({
  draft,
  onChange,
  error,
  controlRef,
}: ProductStepProps) {
  const copy = useCopy();
  const root = draft.sectorCode?.split(".")[0] ?? "";
  const chips =
    !draft.sectorCode || draft.sectorCode === "other"
      ? []
      : (copy.productChips[root] ?? []);

  return (
    <section className="space-y-6">
      <AssistantPrompt title={copy.q3.title} message={copy.q3.message} />

      {chips.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <Chip
              key={chip.value}
              label={chip.label}
              selected={draft.productSummary === chip.value}
              onClick={() => onChange(chip.value)}
            />
          ))}
        </div>
      ) : null}

      <TextField
        ref={controlRef}
        id="product-summary"
        label={copy.q3.fieldLabel}
        value={draft.productSummary}
        onChange={onChange}
        placeholder={copy.q3.placeholder}
        maxLength={80}
        helper={copy.q3.helper}
        error={error}
      />
    </section>
  );
}
