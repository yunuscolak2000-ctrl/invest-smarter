import type { Ref } from "react";
import { AssistantPrompt } from "../../components/wizard/AssistantPrompt";
import { Chip } from "../../components/wizard/Chip";
import { SearchSelect } from "../../components/wizard/SearchSelect";
import { TextField } from "../../components/wizard/TextField";
import { useCopy } from "../../hooks/useLanguage";
import { isOtherSector } from "../../lib/interviewValidation";
import { PINNED_SECTORS, SECTOR_TAXONOMY } from "../../mocks/interview";
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
  const copy = useCopy();
  const showOtherField = isOtherSector(draft.sectorCode);
  const sectors = SECTOR_TAXONOMY.map((sector) => ({
    ...sector,
    label: copy.sectors[sector.code] ?? sector.label,
  }));
  const pinned = PINNED_SECTORS.map((sector) => ({
    ...sector,
    label: copy.sectors[sector.code] ?? sector.label,
  }));
  const selectedLabel = showOtherField
    ? draft.sectorOther.trim() || copy.chrome.other
    : copy.sectors[draft.sectorCode ?? ""] || draft.sectorLabel;

  return (
    <section className="space-y-6">
      <AssistantPrompt title={copy.q2.title} message={copy.q2.message} />

      <div className="flex flex-wrap gap-2">
        {pinned.map((sector) => (
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
        label={copy.q2.allSectors}
        options={sectors}
        value={draft.sectorCode}
        onChange={onSelect}
        error={showOtherField ? null : error}
        placeholder={copy.q2.searchPlaceholder}
        emptyMessage={copy.q2.emptyMessage}
      />

      {selectedLabel && !showOtherField ? (
        <p className="text-sm text-slate-400">
          {copy.chrome.selected}:{" "}
          <span className="font-medium text-slate-200">{selectedLabel}</span>
        </p>
      ) : null}

      {showOtherField ? (
        <TextField
          ref={controlRef}
          id="sector-other"
          label={copy.q2.describeSector}
          value={draft.sectorOther}
          onChange={onOtherChange}
          placeholder={copy.q2.sectorOtherPlaceholder}
          maxLength={40}
          helper={copy.q2.sectorOtherHelper}
          error={error}
        />
      ) : null}
    </section>
  );
}
