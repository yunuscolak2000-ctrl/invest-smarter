import { getCountry } from "../mocks/countries";
import {
  CAPEX_RANGE_BASE,
  DECISION_NEEDED_OPTIONS,
  DEVELOPMENT_STAGE_OPTIONS,
  EVALUATION_CONTEXT_OPTIONS,
  LOCATION_SPECIFICITY_OPTIONS,
  OPPORTUNITY_TYPE_OPTIONS,
  PROJECT_CONTEXT_OPTIONS,
  SECTOR_TAXONOMY,
  SITE_CONTROL_OPTIONS,
} from "../mocks/interview";
import {
  buyerTypeOptions,
  demandCertaintyOptions,
  q9Prompt,
  q10Prompt,
} from "./contextAwareCopy";
import type {
  CapexRange,
  InterviewDraft,
  SelectOption,
  WizardStepId,
} from "../types/interview";

function optionLabel<T extends string>(
  options: SelectOption<T>[],
  value: T | null
): string {
  if (!value) return "";
  return options.find((option) => option.value === value)?.label ?? value;
}

export function sectorDisplayName(draft: InterviewDraft): string {
  if (draft.sectorCode === "other") return draft.sectorOther.trim() || "Other";
  return (draft.sectorLabel ?? "").trim() || "New opportunity";
}

export function formatCapitalScale(
  currency: string,
  range: CapexRange
): string {
  if (range === "not_sure") return "Scale not set";
  const label =
    CAPEX_RANGE_BASE.find((option) => option.value === range)?.label ?? range;
  return `${currency} ${label}`;
}

export function locationDisplayValue(draft: InterviewDraft): string {
  if (draft.locationSpecificity === "country_only") {
    return optionLabel(
      LOCATION_SPECIFICITY_OPTIONS,
      draft.locationSpecificity
    );
  }
  return draft.locationText.trim();
}

export type ReviewGroup = {
  title: string;
  rows: {
    step: Extract<WizardStepId, `q${number}`> | "projectContext";
    label: string;
    value: string;
  }[];
};

export function reviewGroups(draft: InterviewDraft): ReviewGroup[] {
  const country = getCountry(draft.countryCode);
  const currency = draft.currency ?? country?.currency ?? "";

  return [
    {
      title: "Opportunity",
      rows: [
        {
          step: "projectContext",
          label: "Project context",
          value: optionLabel(PROJECT_CONTEXT_OPTIONS, draft.projectContext),
        },
        {
          step: "q1",
          label: "Type of opportunity",
          value: optionLabel(OPPORTUNITY_TYPE_OPTIONS, draft.opportunityType),
        },
        {
          step: "q2",
          label: "Sector",
          value: sectorDisplayName(draft),
        },
        {
          step: "q3",
          label: "What it produces",
          value: draft.productSummary.trim(),
        },
      ],
    },
    {
      title: "Place",
      rows: [
        {
          step: "q4",
          label: "Country",
          value: country ? `${country.name} (${country.code})` : "",
        },
        {
          step: "q5",
          label: "Location",
          value: locationDisplayValue(draft),
        },
      ],
    },
    {
      title: "Scale and stage",
      rows: [
        {
          step: "q6",
          label: "Development stage",
          value: optionLabel(DEVELOPMENT_STAGE_OPTIONS, draft.developmentStage),
        },
        {
          step: "q7",
          label: "Currency",
          value: currency,
        },
        {
          step: "q7",
          label: "Capital range",
          value: draft.capexRange
            ? formatCapitalScale(currency, draft.capexRange)
            : "",
        },
      ],
    },
    {
      title: "Context",
      rows: [
        {
          step: "q8",
          label: "Who is evaluating this",
          value: optionLabel(EVALUATION_CONTEXT_OPTIONS, draft.evaluationContext),
        },
        {
          step: "q12",
          label: "Decision needed",
          value: optionLabel(DECISION_NEEDED_OPTIONS, draft.decisionNeeded),
        },
      ],
    },
    {
      title: "Commercial and site",
      rows: [
        {
          step: "q9",
          label: q9Prompt(draft.projectContext).title,
          value: optionLabel(
            buyerTypeOptions(draft.projectContext),
            draft.buyerType
          ),
        },
        {
          step: "q10",
          label: q10Prompt(draft.projectContext).title,
          value: optionLabel(
            demandCertaintyOptions(draft.projectContext),
            draft.demandCertainty
          ),
        },
        {
          step: "q11",
          label: "Site control",
          value: optionLabel(SITE_CONTROL_OPTIONS, draft.siteControl),
        },
      ],
    },
  ];
}

export function identitySectorLabel(draft: InterviewDraft): string {
  if (draft.sectorCode === "other") return "Other";
  if (draft.sectorLabel?.trim()) return draft.sectorLabel.trim();
  return (
    SECTOR_TAXONOMY.find((sector) => sector.code === draft.sectorCode)?.label ??
    "Other"
  );
}

export function identityTitle(draft: InterviewDraft): string {
  const country = getCountry(draft.countryCode);
  const sector = identitySectorLabel(draft);
  return country ? `${sector} — ${country.name}` : sector;
}

export function identityMeta(draft: InterviewDraft): string {
  const country = getCountry(draft.countryCode);
  const currency = draft.currency ?? country?.currency ?? "";
  const project = optionLabel(PROJECT_CONTEXT_OPTIONS, draft.projectContext);
  const stage = optionLabel(DEVELOPMENT_STAGE_OPTIONS, draft.developmentStage);
  const scale = draft.capexRange
    ? formatCapitalScale(currency, draft.capexRange)
    : "Scale not set";
  const context = optionLabel(
    EVALUATION_CONTEXT_OPTIONS,
    draft.evaluationContext
  );
  return [project, stage, scale, context].filter(Boolean).join(" · ");
}

export function reviewConfidencePreview(draft: InterviewDraft): {
  band: "High" | "Medium" | "Low";
  message: string;
} {
  const open: string[] = [];
  if (draft.capexRange === "not_sure") open.push("capital scale");
  if (draft.buyerType === "unknown") open.push("buyer type");
  if (draft.demandCertainty === "hypothesis") open.push("demand certainty");
  if (draft.siteControl === "searching") open.push("site control");
  if (draft.locationSpecificity === "country_only") open.push("location");
  if (draft.sectorCode === "other") open.push("sector");

  const thinDemandAndSite =
    draft.demandCertainty === "hypothesis" && draft.siteControl === "searching";

  if (draft.capexRange === "not_sure" || thinDemandAndSite) {
    return {
      band: "Low",
      message:
        open.length > 0
          ? `Confidence will be low. Still open: ${open.join(", ")}.`
          : "Confidence will be low. Capital scale is not set.",
    };
  }

  if (open.length === 0) {
    return {
      band: "High",
      message: "Confidence will be high. Collected answers contain no soft unknowns.",
    };
  }

  return {
    band: "Medium",
    message: `Confidence will be medium. Still open: ${open.join(", ")}.`,
  };
}
