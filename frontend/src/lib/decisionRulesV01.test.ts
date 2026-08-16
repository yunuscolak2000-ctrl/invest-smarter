import { describe, expect, it } from "vitest";
import { verifyDecisionRulesV01 } from "./decisionRulesV01.qa";

describe("decision rules v0.1", () => {
  it("passes the deterministic QA fixture suite", () => {
    const result = verifyDecisionRulesV01();
    const failures = result.checks
      .filter((check) => !check.ok)
      .map((check) => `${check.caseId}: ${check.detail}`)
      .join("\n");
    expect(result.failed, failures).toBe(0);
  });
});
