import { getCountry } from "../mocks/countries";
import {
  DECISION_NEEDED_OPTIONS,
  DEVELOPMENT_STAGE_OPTIONS,
  EVALUATION_CONTEXT_OPTIONS,
  LOCATION_SPECIFICITY_OPTIONS,
  OPPORTUNITY_TYPE_OPTIONS,
  PROJECT_CONTEXT_OPTIONS,
  SITE_CONTROL_OPTIONS,
} from "../mocks/interview";
import {
  buyerTypeOptions,
  demandCertaintyOptions,
  q9Prompt,
  q10Prompt,
  reviewSiteGroupTitle,
} from "./contextAwareCopy";
import {
  DEFAULT_LANGUAGE,
  getCopy,
  labeledOptions,
  type Language,
} from "./i18n";
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

export function sectorDisplayName(
  draft: InterviewDraft,
  language: Language = DEFAULT_LANGUAGE
): string {
  const copy = getCopy(language);
  if (draft.sectorCode === "other") {
    return draft.sectorOther.trim() || copy.chrome.other;
  }
  return (
    copy.sectors[draft.sectorCode ?? ""] ||
    draft.sectorLabel?.trim() ||
    copy.chrome.newOpportunity
  );
}

export function formatCapitalScale(
  currency: string,
  range: CapexRange,
  language: Language = DEFAULT_LANGUAGE
): string {
  const copy = getCopy(language);
  if (range === "not_sure") return copy.review.scaleNotSet;
  const label = copy.options.capexRange[range]?.label ?? range;
  return `${currency} ${label}`;
}

export function locationDisplayValue(
  draft: InterviewDraft,
  language: Language = DEFAULT_LANGUAGE
): string {
  if (draft.locationSpecificity === "country_only") {
    return optionLabel(
      labeledOptions(
        LOCATION_SPECIFICITY_OPTIONS,
        getCopy(language).options.locationSpecificity
      ),
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

export function reviewGroups(
  draft: InterviewDraft,
  language: Language = DEFAULT_LANGUAGE
): ReviewGroup[] {
  const copy = getCopy(language);
  const country = getCountry(draft.countryCode);
  const currency = draft.currency ?? country?.currency ?? "";

  return [
    {
      title: copy.review.groupOpportunity,
      rows: [
        {
          step: "projectContext",
          label: copy.review.rowProjectContext,
          value: optionLabel(
            labeledOptions(PROJECT_CONTEXT_OPTIONS, copy.options.projectContext),
            draft.projectContext
          ),
        },
        {
          step: "q1",
          label: copy.review.rowOpportunityType,
          value: optionLabel(
            labeledOptions(
              OPPORTUNITY_TYPE_OPTIONS,
              copy.options.opportunityType
            ),
            draft.opportunityType
          ),
        },
        {
          step: "q2",
          label: copy.review.rowSector,
          value: sectorDisplayName(draft, language),
        },
        {
          step: "q3",
          label: copy.review.rowProduct,
          value: draft.productSummary.trim(),
        },
      ],
    },
    {
      title: copy.review.groupPlace,
      rows: [
        {
          step: "q4",
          label: copy.review.rowCountry,
          value: country ? `${country.name} (${country.code})` : "",
        },
        {
          step: "q5",
          label: copy.review.rowLocation,
          value: locationDisplayValue(draft, language),
        },
      ],
    },
    {
      title: copy.review.groupScale,
      rows: [
        {
          step: "q6",
          label: copy.review.rowStage,
          value: optionLabel(
            labeledOptions(
              DEVELOPMENT_STAGE_OPTIONS,
              copy.options.developmentStage
            ),
            draft.developmentStage
          ),
        },
        {
          step: "q7",
          label: copy.review.rowCurrency,
          value: currency,
        },
        {
          step: "q7",
          label: copy.review.rowCapital,
          value: draft.capexRange
            ? formatCapitalScale(currency, draft.capexRange, language)
            : "",
        },
      ],
    },
    {
      title: copy.review.groupContext,
      rows: [
        {
          step: "q8",
          label: copy.review.rowEvaluator,
          value: optionLabel(
            labeledOptions(
              EVALUATION_CONTEXT_OPTIONS,
              copy.options.evaluationContext
            ),
            draft.evaluationContext
          ),
        },
        {
          step: "q12",
          label: copy.review.rowDecisionNeeded,
          value: optionLabel(
            labeledOptions(DECISION_NEEDED_OPTIONS, copy.options.decisionNeeded),
            draft.decisionNeeded
          ),
        },
      ],
    },
    {
      title: reviewSiteGroupTitle(draft.projectContext, language),
      rows: [
        {
          step: "q9",
          label: q9Prompt(draft.projectContext, language).title,
          value: optionLabel(
            buyerTypeOptions(draft.projectContext, language),
            draft.buyerType
          ),
        },
        {
          step: "q10",
          label: q10Prompt(draft.projectContext, language).title,
          value: optionLabel(
            demandCertaintyOptions(draft.projectContext, language),
            draft.demandCertainty
          ),
        },
        {
          step: "q11",
          label: copy.review.rowSite,
          value: optionLabel(
            labeledOptions(SITE_CONTROL_OPTIONS, copy.options.siteControl),
            draft.siteControl
          ),
        },
      ],
    },
  ];
}

export function identitySectorLabel(
  draft: InterviewDraft,
  language: Language = DEFAULT_LANGUAGE
): string {
  const copy = getCopy(language);
  if (draft.sectorCode === "other") return copy.chrome.other;
  if (draft.sectorCode && copy.sectors[draft.sectorCode]) {
    return copy.sectors[draft.sectorCode];
  }
  if (draft.sectorLabel?.trim()) return draft.sectorLabel.trim();
  return copy.chrome.other;
}

export function identityTitle(
  draft: InterviewDraft,
  language: Language = DEFAULT_LANGUAGE
): string {
  const country = getCountry(draft.countryCode);
  const sector = identitySectorLabel(draft, language);
  return country ? `${sector} — ${country.name}` : sector;
}

export function identityMeta(
  draft: InterviewDraft,
  language: Language = DEFAULT_LANGUAGE
): string {
  const copy = getCopy(language);
  const country = getCountry(draft.countryCode);
  const currency = draft.currency ?? country?.currency ?? "";
  const project = optionLabel(
    labeledOptions(PROJECT_CONTEXT_OPTIONS, copy.options.projectContext),
    draft.projectContext
  );
  const stage = optionLabel(
    labeledOptions(DEVELOPMENT_STAGE_OPTIONS, copy.options.developmentStage),
    draft.developmentStage
  );
  const scale = draft.capexRange
    ? formatCapitalScale(currency, draft.capexRange, language)
    : copy.review.scaleNotSet;
  const context = optionLabel(
    labeledOptions(EVALUATION_CONTEXT_OPTIONS, copy.options.evaluationContext),
    draft.evaluationContext
  );
  return [project, stage, scale, context].filter(Boolean).join(" · ");
}

export function reviewConfidencePreview(
  draft: InterviewDraft,
  language: Language = DEFAULT_LANGUAGE
): {
  band: string;
  message: string;
} {
  const copy = getCopy(language);
  const open: string[] = [];
  if (draft.capexRange === "not_sure") open.push(copy.review.openCapital);
  if (draft.buyerType === "unknown") open.push(copy.review.openBuyer);
  if (draft.demandCertainty === "hypothesis") open.push(copy.review.openDemand);
  if (draft.siteControl === "searching") open.push(copy.review.openSite);
  if (draft.locationSpecificity === "country_only") {
    open.push(copy.review.openLocation);
  }
  if (draft.sectorCode === "other") open.push(copy.review.openSector);

  const thinDemandAndSite =
    draft.demandCertainty === "hypothesis" && draft.siteControl === "searching";

  if (draft.capexRange === "not_sure" || thinDemandAndSite) {
    return {
      band: copy.decision.bandLow,
      message:
        open.length > 0
          ? copy.review.confidenceLowOpen(open.join(", "))
          : copy.review.confidenceLowScale,
    };
  }

  if (open.length === 0) {
    return {
      band: copy.decision.bandHigh,
      message: copy.review.confidenceHigh,
    };
  }

  return {
    band: copy.decision.bandMedium,
    message: copy.review.confidenceMedium(open.join(", ")),
  };
}
