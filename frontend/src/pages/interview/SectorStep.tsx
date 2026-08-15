import type { Ref } from "react";
import { AssistantPrompt } from "../../components/wizard/AssistantPrompt";
import { Chip } from "../../components/wizard/Chip";
import { SearchSelect } from "../../components/wizard/SearchSelect";
import { TextField } from "../../components/wizard/TextField";
import { PINNED_SECTORS, SECTOR_TAXONOMY, WIZARD_COPY } from "../../mocks/interview";
import { isOtherSector } from "../../lib/interviewValidation";
import type { InterviewDraft, SectorOption } from "../../types/interview";

type SectorStepProps = {
  draft: InterviewDraft;
  onSelect: (option: SectorOption) => void;
  onOtherChange: (value: string) => void;
  error: string | null;
  controlRef: Ref<HTMLInputElement>;
};

export function SectorStep({
  draft,
  onSelect,
  onOtherChange,
  error,
  controlRef,
}: SectorStepProps) {
  const showOtherField = isOtherSector(draft.sectorCode);
  const selectedLabel = showOtherField
    ? draft.sectorOther.trim() || "Other"
    : draft.sectorLabel;

  return (
    <section className="space-y-6">
      <AssistantPrompt title={WIZARD_COPY.q2.title} message={WIZARD_COPY.q2.message} />

      <div className="flex flex-wrap gap-2">
        {PINNED_SECTORS.map((sector) => (
          <Chip
            key={sector.code}
            label={sector.label}
            selected={draft.sectorCode === sector.code}
            onClick={() => onSelect(sector)}
          />
        ))}
      </div>

      <SearchSelect
        ref={showOtherField ? undefined : controlRef}
        id="sector-search"
        label="All sectors"
        options={SECTOR_TAXONOMY}
        value={draft.sectorCode}
        onChange={onSelect}
        error={showOtherField ? null : error}
        placeholder="Search by name or code"
      />

      {selectedLabel && !showOtherField ? (
        <p className="text-sm text-slate-400">
          Selected: <span className="font-medium text-slate-200">{selectedLabel}</span>
        </p>
      ) : null}

      {showOtherField ? (
        <TextField
          ref={controlRef}
          id="sector-other"
          label="Describe the sector"
          value={draft.sectorOther}
          onChange={onOtherChange}
          placeholder="e.g. Waste-to-energy"
          maxLength={40}
          helper="3–40 characters. Letters, numbers, spaces, and hyphens only."
          error={error}
        />
      ) : null}
    </section>
  );
}
