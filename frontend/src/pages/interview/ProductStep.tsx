import type { Ref } from "react";
import { AssistantPrompt } from "../../components/wizard/AssistantPrompt";
import { Chip } from "../../components/wizard/Chip";
import { TextField } from "../../components/wizard/TextField";
import { PRODUCT_CHIPS_BY_ROOT, WIZARD_COPY } from "../../mocks/interview";
import type { InterviewDraft } from "../../types/interview";

type ProductStepProps = {
  draft: InterviewDraft;
  onChange: (value: string) => void;
  error: string | null;
  controlRef: Ref<HTMLInputElement>;
};

function chipsForSector(code: string | null): string[] {
  if (!code || code === "other") return [];
  const root = code.split(".")[0];
  return PRODUCT_CHIPS_BY_ROOT[root] ?? [];
}

export function ProductStep({
  draft,
  onChange,
  error,
  controlRef,
}: ProductStepProps) {
  const chips = chipsForSector(draft.sectorCode);

  return (
    <section className="space-y-6">
      <AssistantPrompt title={WIZARD_COPY.q3.title} message={WIZARD_COPY.q3.message} />

      {chips.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <Chip
              key={chip}
              label={chip}
              selected={draft.productSummary === chip}
              onClick={() => onChange(chip)}
            />
          ))}
        </div>
      ) : null}

      <TextField
        ref={controlRef}
        id="product-summary"
        label="Product or output"
        value={draft.productSummary}
        onChange={onChange}
        placeholder="e.g. 50 MW solar PV plant"
        maxLength={80}
        helper="8–80 characters. Chips fill this field — you can edit them."
        error={error}
      />
    </section>
  );
}
