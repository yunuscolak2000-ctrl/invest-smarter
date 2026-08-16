/**
 * Context-aware wording for Q9, Q10, Review, and Decision Card microcopy.
 * Same stored enums. Same rules.v0.1. not_sure uses the private dialect.
 */

import {
  BUYER_TYPE_OPTIONS,
  DEMAND_CERTAINTY_OPTIONS,
  WIZARD_COPY,
} from "../mocks/interview";
import type {
  BuyerType,
  DemandCertainty,
  ProjectContext,
  SelectOption,
} from "../types/interview";

export type CopyDialect = "private" | "public" | "development_finance";

export function copyDialect(
  context: ProjectContext | null | undefined
): CopyDialect {
  if (context === "public_project") return "public";
  if (context === "development_finance") return "development_finance";
  return "private";
}

export function usesPublicDemandCopy(
  context: ProjectContext | null | undefined
): boolean {
  const dialect = copyDialect(context);
  return dialect === "public" || dialect === "development_finance";
}

const PUBLIC_OFFTAKE_SENTENCE =
  "Public use or payment is not evidenced. Name the user or payer, or accept that demand is still a hypothesis.";

const GRANT_DISCLAIMER =
  "This is not an eligibility opinion, not a grant award, and not a commitment to disburse.";

const PUBLIC_BUYER_LABELS: Record<BuyerType, string> = {
  b2b_contract: "Named institutional users with an agreement",
  b2b_spot: "Users pay as they go — tariff, ticket, or fee",
  b2c: "Households / general public",
  b2g: "Government is the payer or user",
  mixed: "Mixed users",
  unknown: "Not defined yet",
};

const DEVFIN_BUYER_LABELS: Record<BuyerType, string> = {
  b2b_contract: "Named users or offtakers with an agreement",
  b2b_spot: "Users pay as they go — no long contract",
  b2c: "Households / individual users",
  b2g: "Government or public institution",
  mixed: "Mixed users",
  unknown: "Not defined yet",
};

const PUBLIC_DEMAND_LABELS: Record<DemandCertainty, string> = {
  binding:
    "Binding commitment — contract, tariff decision, budget line, or signed offtake",
  loi: "Written but non-binding — MOU, LoI, or council resolution not yet funded",
  advanced: "Named users or agencies, nothing on paper",
  hypothesis: "Need is assumed; no named user or payer",
  not_applicable: "No user-fee or offtake by design",
};

export function q9Prompt(context: ProjectContext | null | undefined): {
  title: string;
  message: string;
} {
  const dialect = copyDialect(context);
  if (dialect === "public") {
    return {
      title: "Who uses or pays",
      message:
        "Who is expected to use or pay for this? If that is undefined, say so. I will not invent a user.",
    };
  }
  if (dialect === "development_finance") {
    return {
      title: "Who is the user or offtaker",
      message:
        "Who is expected to use or pay for the output of the supported activity? Undefined is allowed and will lower confidence.",
    };
  }
  return {
    title: WIZARD_COPY.q9.title,
    message: WIZARD_COPY.q9.message,
  };
}

export function q10Prompt(context: ProjectContext | null | undefined): {
  title: string;
  message: string;
} {
  const dialect = copyDialect(context);
  if (dialect === "public") {
    return {
      title: "How firm is use or payment",
      message:
        "How evidenced is demand or public use today? A public good with no named user is a hypothesis, not a skip.",
    };
  }
  if (dialect === "development_finance") {
    return {
      title: "Evidence of demand or use",
      message:
        "How firm is demand or use today? Grant screening still needs this. I will not treat a concept note as evidence.",
    };
  }
  return {
    title: WIZARD_COPY.q10.title,
    message: WIZARD_COPY.q10.message,
  };
}

function relabel<T extends string>(
  options: SelectOption<T>[],
  labels: Record<T, string>
): SelectOption<T>[] {
  return options.map((option) => ({
    value: option.value,
    label: labels[option.value],
  }));
}

export function buyerTypeOptions(
  context: ProjectContext | null | undefined
): SelectOption<BuyerType>[] {
  const dialect = copyDialect(context);
  if (dialect === "public") {
    return relabel(BUYER_TYPE_OPTIONS, PUBLIC_BUYER_LABELS);
  }
  if (dialect === "development_finance") {
    return relabel(BUYER_TYPE_OPTIONS, DEVFIN_BUYER_LABELS);
  }
  return BUYER_TYPE_OPTIONS;
}

export function demandCertaintyOptions(
  context: ProjectContext | null | undefined
): SelectOption<DemandCertainty>[] {
  if (usesPublicDemandCopy(context)) {
    return relabel(DEMAND_CERTAINTY_OPTIONS, PUBLIC_DEMAND_LABELS);
  }
  return DEMAND_CERTAINTY_OPTIONS;
}

export function offtakeConditionSentence(
  context: ProjectContext | null | undefined,
  fallback: string
): string {
  return usesPublicDemandCopy(context) ? PUBLIC_OFFTAKE_SENTENCE : fallback;
}

export function grantDisclaimer(
  context: ProjectContext | null | undefined
): string | null {
  return context === "development_finance" ? GRANT_DISCLAIMER : null;
}

export function conditionsIntroLine(
  context: ProjectContext | null | undefined,
  isDefer: boolean
): string {
  if (isDefer) {
    return "Closing these is what would allow a new recommendation.";
  }
  const dialect = copyDialect(context);
  if (dialect === "public") {
    return "Accept these before committing further public time or budget.";
  }
  if (dialect === "development_finance") {
    return "Accept these before taking this file into appraisal or support preparation.";
  }
  return "Accept these before spending further resources.";
}

export function emptyConditionFallback(
  context: ProjectContext | null | undefined
): string {
  const dialect = copyDialect(context);
  if (dialect === "public") {
    return "No additional public-evidence condition was triggered. Treat this as a conditional screen, not authorization to commit public resources.";
  }
  if (dialect === "development_finance") {
    return "No additional appraisal condition was triggered. Treat this as a conditional screen, not an eligibility opinion or funding commitment.";
  }
  return "No additional evidence condition was triggered. This prototype still does not issue an unconditional proceed.";
}

export function nextCommissionLine(
  context: ProjectContext | null | undefined
): string {
  const dialect = copyDialect(context);
  if (dialect === "public") {
    return "Do not commission a study or commit public resources on this recommendation alone.";
  }
  if (dialect === "development_finance") {
    return "Do not treat this as an eligibility decision, award decision, or funding commitment.";
  }
  return WIZARD_COPY.decision.nextCommission;
}

export function proceedPostureSentence(
  context: ProjectContext | null | undefined
): string {
  const dialect = copyDialect(context);
  if (dialect === "public") {
    return "Advance only if the conditions below are accepted. This is not clearance to commit public resources or launch a study.";
  }
  if (dialect === "development_finance") {
    return "Advance only if the conditions below are accepted. This is not clearance to enter appraisal, approve support, or commit funding.";
  }
  return "Advance only if the conditions below are accepted. This is not clearance to commission a full study.";
}

export function proceedWhyLine(
  context: ProjectContext | null | undefined
): string {
  const dialect = copyDialect(context);
  if (dialect === "public") {
    return "The project has a usable shape for an initial public-project screen, but only if the conditions are accepted.";
  }
  if (dialect === "development_finance") {
    return "The file has a usable shape for an initial support screen, but only if the conditions are accepted.";
  }
  return "The file has a usable shape for a screen, but only if the conditions are accepted.";
}

export function reviewSiteGroupTitle(
  context: ProjectContext | null | undefined
): string {
  const dialect = copyDialect(context);
  if (dialect === "public") return "Use, evidence, and site";
  if (dialect === "development_finance") {
    return "Use, evidence, and support readiness";
  }
  return "Commercial and site";
}
