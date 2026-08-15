import { getCountry } from "../mocks/countries";
import { WIZARD_COPY } from "../mocks/interview";
import type { DecisionObjectV01 } from "../types/decision";
import type { InterviewDraft } from "../types/interview";
import { identityMeta, sectorDisplayName } from "./interviewLabels";

export type DecisionCardView = {
  defect: boolean;
  title: string;
  productSummary: string;
  meta: string;
  status: string;
  postureTitle: string;
  postureSentence: string;
  bankDisclaimer: string | null;
  confidenceLine: string;
  confidenceDrivers: [string, string];
  conditionsIntro: string;
  conditions: string[];
  why: string[];
  next: string[];
  disclaimer: string;
  policyLabel: string;
};

const COPY = WIZARD_COPY.decision;

function offtakeSentence(buyerUnknown: boolean): string {
  if (buyerUnknown) {
    return "Define who buys the output, then evidence that demand.";
  }
  return "Evidence demand: a named buyer path is not enough. Record whether demand is contracted, on paper, in discussion, or still a hypothesis.";
}

function conditionSentence(
  id: DecisionObjectV01["condition_ids"][number],
  buyerUnknown: boolean
): string | null {
  if (id === "COND-OFFTAKE") return offtakeSentence(buyerUnknown);
  if (id === "COND-SITE") {
    return "For this greenfield or zone project, site control is unspecified. Record whether the site is secured, under option, or still being searched.";
  }
  if (id === "COND-SCALE") {
    return "Bound the capital requirement to a range. “Not sure” is not a scale.";
  }
  if (id === "COND-GEO") {
    return "This geography requires compliance review before any report is published.";
  }
  return null;
}

function whyBullets(decision: DecisionObjectV01): string[] {
  const vetoes = new Set(decision.veto_ids);
  const deferVetoes = [
    "VETO-CONF-THIN",
    "VETO-BUYER-MEGA",
    "VETO-CONCEPT-MEGA",
    "VETO-TRIPLE-THIN",
  ];
  const noDefer = !deferVetoes.some((id) => vetoes.has(id));

  const bullets: string[] = [COPY.incompleteWhy];

  if (decision.posture === "proceed_with_conditions" && noDefer) {
    bullets.push(
      "The file has a usable shape for a screen, but only if the conditions are accepted."
    );
  }
  if (vetoes.has("VETO-BUYER-MEGA")) {
    bullets.push(
      "Buyer type is undefined at 100 million or above. That is not a credit- or study-ready file."
    );
  }
  if (vetoes.has("VETO-CONCEPT-MEGA")) {
    bullets.push("A concept at this scale is not ready for a study.");
  }
  if (vetoes.has("VETO-TRIPLE-THIN")) {
    bullets.push(
      "Concept, unspecified location, and an open commercial or scale hole. The file is too thin to decide."
    );
  }
  if (vetoes.has("VETO-CONF-THIN")) {
    bullets.push("Evidence quality is too low to recommend advancing.");
  }
  if (vetoes.has("VETO-BANK-UNKNOWN")) {
    bullets.push(
      "A bank early screen with an undefined buyer cannot be treated as a clean mandate fit."
    );
  }
  if (decision.export_blocked) {
    bullets.push(
      "Geography does not change the posture. It blocks publication until review."
    );
  }
  if (decision.mandate_tension === "severe") {
    bullets.push(
      "This opportunity does not match the desk that is evaluating it."
    );
  }

  return bullets.slice(0, 6);
}

function nextBullets(decision: DecisionObjectV01): string[] {
  const next = [COPY.nextCommission];

  if (decision.posture === "proceed_with_conditions") {
    next.push(
      "Complete the remaining interview: demand certainty, site control, and what decision is needed."
    );
    next.push(
      "If the conditions are not acceptable, stop. Do not “proceed with caution.”"
    );
  }

  if (decision.posture === "defer") {
    next.push(
      "Collect the missing facts named in Conditions. Re-run only after those answers exist."
    );
    next.push(
      "Do not staff a file, open a credit workbench, or draft an IPA promotion response as if a decision had been taken."
    );
  }

  if (decision.export_blocked) {
    next.push(
      "Do not export or send this recommendation until compliance review is complete."
    );
  }

  return next.slice(0, 4);
}

export function presentDecisionCard(
  decision: DecisionObjectV01,
  draft: InterviewDraft
): DecisionCardView {
  const country = getCountry(draft.countryCode);
  const defect =
    decision.posture === "proceed" || decision.posture === "do_not_pursue";

  const statusParts = [COPY.status];
  if (decision.export_blocked) statusParts.push(COPY.publicationHeld);

  const bandLabel =
    decision.confidence.band === "high"
      ? "High"
      : decision.confidence.band === "medium"
        ? "Medium"
        : "Low";

  const buyerUnknown = draft.buyerType === "unknown";
  const conditions = decision.condition_ids
    .map((id) => conditionSentence(id, buyerUnknown))
    .filter((sentence): sentence is string => Boolean(sentence));

  return {
    defect,
    title: country
      ? `${sectorDisplayName(draft)} — ${country.name}`
      : sectorDisplayName(draft),
    productSummary: draft.productSummary.trim(),
    meta: identityMeta(draft),
    status: statusParts.join(" · "),
    postureTitle:
      decision.posture === "defer" ? "Defer" : "Proceed with conditions",
    postureSentence:
      decision.posture === "defer"
        ? "This file is not decision-ready. Do not spend further time or budget on it as framed until the gaps below are closed."
        : "Advance only if the conditions below are accepted. This is not clearance to commission a full study.",
    bankDisclaimer:
      draft.evaluationContext === "bank_screen" ? COPY.bankDisclaimer : null,
    confidenceLine: `${bandLabel} · ${decision.confidence.value} of 100 · ${COPY.confidenceSuffix}`,
    confidenceDrivers: decision.confidence.drivers,
    conditionsIntro:
      decision.posture === "defer"
        ? "Closing these is what would allow a new recommendation."
        : "Accept these before spending further resources.",
    conditions,
    why: whyBullets(decision),
    next: nextBullets(decision),
    disclaimer: COPY.disclaimer,
    policyLabel: COPY.policyLabel,
  };
}
