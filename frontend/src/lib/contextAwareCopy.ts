/**
 * Context-aware wording for Q9, Q10, Review, and Decision Card microcopy.
 * Same stored enums. Same rules.v0.1. not_sure uses the private dialect.
 * Language only changes displayed copy.
 */

import {
  BUYER_TYPE_OPTIONS,
  DEMAND_CERTAINTY_OPTIONS,
} from "../mocks/interview";
import type {
  BuyerType,
  DemandCertainty,
  ProjectContext,
  SelectOption,
} from "../types/interview";
import {
  DEFAULT_LANGUAGE,
  getCopy,
  labeledOptions,
  type Language,
} from "./i18n";

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

export function q9Prompt(
  context: ProjectContext | null | undefined,
  language: Language = DEFAULT_LANGUAGE
): { title: string; message: string } {
  const copy = getCopy(language);
  const dialect = copyDialect(context);
  if (dialect === "public") {
    return {
      title: copy.context.q9.publicTitle,
      message: copy.context.q9.publicMessage,
    };
  }
  if (dialect === "development_finance") {
    return {
      title: copy.context.q9.devfinTitle,
      message: copy.context.q9.devfinMessage,
    };
  }
  return { title: copy.q9.title, message: copy.q9.message };
}

export function q10Prompt(
  context: ProjectContext | null | undefined,
  language: Language = DEFAULT_LANGUAGE
): { title: string; message: string } {
  const copy = getCopy(language);
  const dialect = copyDialect(context);
  if (dialect === "public") {
    return {
      title: copy.context.q10.publicTitle,
      message: copy.context.q10.publicMessage,
    };
  }
  if (dialect === "development_finance") {
    return {
      title: copy.context.q10.devfinTitle,
      message: copy.context.q10.devfinMessage,
    };
  }
  return { title: copy.q10.title, message: copy.q10.message };
}

export function buyerTypeOptions(
  context: ProjectContext | null | undefined,
  language: Language = DEFAULT_LANGUAGE
): SelectOption<BuyerType>[] {
  const copy = getCopy(language);
  const dialect = copyDialect(context);
  const labels =
    dialect === "public"
      ? copy.options.buyerTypePublic
      : dialect === "development_finance"
        ? copy.options.buyerTypeDevfin
        : copy.options.buyerTypePrivate;
  return labeledOptions(BUYER_TYPE_OPTIONS, labels);
}

export function demandCertaintyOptions(
  context: ProjectContext | null | undefined,
  language: Language = DEFAULT_LANGUAGE
): SelectOption<DemandCertainty>[] {
  const copy = getCopy(language);
  const labels = usesPublicDemandCopy(context)
    ? copy.options.demandCertaintyPublic
    : copy.options.demandCertaintyPrivate;
  return labeledOptions(DEMAND_CERTAINTY_OPTIONS, labels);
}

export function offtakeConditionSentence(
  context: ProjectContext | null | undefined,
  fallback: string,
  language: Language = DEFAULT_LANGUAGE
): string {
  return usesPublicDemandCopy(context)
    ? getCopy(language).context.offtakePublic
    : fallback;
}

export function grantDisclaimer(
  context: ProjectContext | null | undefined,
  language: Language = DEFAULT_LANGUAGE
): string | null {
  return context === "development_finance"
    ? getCopy(language).context.grantDisclaimer
    : null;
}

export function conditionsIntroLine(
  context: ProjectContext | null | undefined,
  isDefer: boolean,
  language: Language = DEFAULT_LANGUAGE
): string {
  const lines = getCopy(language).context.conditionsIntro;
  if (isDefer) return lines.defer;
  return lines[copyDialect(context)];
}

export function emptyConditionFallback(
  context: ProjectContext | null | undefined,
  language: Language = DEFAULT_LANGUAGE
): string {
  return getCopy(language).context.emptyFallback[copyDialect(context)];
}

export function nextCommissionLine(
  context: ProjectContext | null | undefined,
  language: Language = DEFAULT_LANGUAGE
): string {
  return getCopy(language).context.nextCommission[copyDialect(context)];
}

export function proceedPostureSentence(
  context: ProjectContext | null | undefined,
  language: Language = DEFAULT_LANGUAGE
): string {
  return getCopy(language).context.proceedPosture[copyDialect(context)];
}

export function proceedWhyLine(
  context: ProjectContext | null | undefined,
  language: Language = DEFAULT_LANGUAGE
): string {
  return getCopy(language).context.proceedWhy[copyDialect(context)];
}

export function reviewSiteGroupTitle(
  context: ProjectContext | null | undefined,
  language: Language = DEFAULT_LANGUAGE
): string {
  return getCopy(language).context.reviewSiteGroup[copyDialect(context)];
}
