/**
 * Client-only language for user-facing copy.
 * Does not change stored enums, drafts, snapshots, or rules.v0.1.
 */

import { EN } from "./copy/en";
import { TR } from "./copy/tr";
import type { OptionText, UiCopy } from "./copy/types";
import type { SelectOption } from "../types/interview";

export type Language = "en" | "tr";

export const LANGUAGE_STORAGE_KEY = "invest-smarter.language.v0.1";
export const DEFAULT_LANGUAGE: Language = "en";

export function isLanguage(value: unknown): value is Language {
  return value === "en" || value === "tr";
}

export function parseStoredLanguage(raw: string | null): Language | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (isLanguage(parsed)) return parsed;
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      isLanguage((parsed as { language?: unknown }).language)
    ) {
      return (parsed as { language: Language }).language;
    }
  } catch {
    if (isLanguage(raw)) return raw;
  }
  return null;
}

export function loadLanguage(): Language {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  try {
    return parseStoredLanguage(window.localStorage.getItem(LANGUAGE_STORAGE_KEY))
      ?? DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

export function saveLanguage(language: Language): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, JSON.stringify(language));
  } catch {
    // Demo storage only. Ignore quota / private-mode failures.
  }
}

export function getCopy(language: Language = DEFAULT_LANGUAGE): UiCopy {
  return language === "tr" ? TR : EN;
}

export function labeledOptions<T extends string>(
  order: readonly T[] | SelectOption<T>[],
  labels: Record<T, OptionText>
): SelectOption<T>[] {
  return order.map((item) => {
    const value = typeof item === "string" ? item : item.value;
    const text = labels[value];
    return {
      value,
      label: text.label,
      helper: text.helper,
      examples: text.examples,
    };
  });
}

export type { UiCopy } from "./copy/types";
