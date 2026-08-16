/**
 * Internal Decision QA catalog. Not part of the customer workflow.
 * Uses the same drafts as decisionRulesV01.fixtures.ts.
 * Expected posture/confidence are human QA locks, not engine IDs.
 */

import type { InterviewDraft } from "../types/interview";
import {
  FIXTURE_AVERAGE,
  FIXTURE_BANK_HYPOTHESIS,
  FIXTURE_FINANCING_READ,
  FIXTURE_HYPOTHESIS_MEGA,
  FIXTURE_RESTRICTED_GEO,
  FIXTURE_STRONG,
  FIXTURE_WEAK,
} from "./decisionRulesV01.fixtures";

export type HarnessPosture = "proceed_with_conditions" | "defer";

export type DecisionQaFixture = {
  id: string;
  name: string;
  purpose: string;
  expectedPosture: HarnessPosture;
  expectedConfidence: number | null;
  draft: InterviewDraft;
};

export const DECISION_QA_FIXTURES: DecisionQaFixture[] = [
  {
    id: "strong",
    name: "Strong clean case",
    purpose: "Clean expansion file. Should proceed with conditions at full confidence.",
    expectedPosture: "proceed_with_conditions",
    expectedConfidence: 100,
    draft: FIXTURE_STRONG,
  },
  {
    id: "average",
    name: "Average conditions case",
    purpose: "Greenfield with advanced demand and open site. Conditions, not defer.",
    expectedPosture: "proceed_with_conditions",
    expectedConfidence: 90,
    draft: FIXTURE_AVERAGE,
  },
  {
    id: "weak",
    name: "Weak defer case",
    purpose: "Stacked unknowns plus bank screen. Must defer.",
    expectedPosture: "defer",
    expectedConfidence: 17,
    draft: FIXTURE_WEAK,
  },
  {
    id: "hypothesis-mega",
    name: "Hypothesis mega case",
    purpose: "Hypothesis demand at 100m+. Must defer; confidence capped.",
    expectedPosture: "defer",
    expectedConfidence: 45,
    draft: FIXTURE_HYPOTHESIS_MEGA,
  },
  {
    id: "financing-read",
    name: "Financing read without paper",
    purpose: "Financing read with demand not on paper. Must defer.",
    expectedPosture: "defer",
    expectedConfidence: null,
    draft: FIXTURE_FINANCING_READ,
  },
  {
    id: "bank-hypothesis",
    name: "Bank screen with hypothesis",
    purpose: "Bank early screen cannot treat hypothesized demand as credit-ready.",
    expectedPosture: "defer",
    expectedConfidence: null,
    draft: FIXTURE_BANK_HYPOTHESIS,
  },
  {
    id: "restricted-geo",
    name: "Restricted geography",
    purpose: "Restricted country on an otherwise clean file. Must not defer from geography alone.",
    expectedPosture: "proceed_with_conditions",
    expectedConfidence: 70,
    draft: FIXTURE_RESTRICTED_GEO,
  },
];
