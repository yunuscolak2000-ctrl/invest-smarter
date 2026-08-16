import { useMemo, useState } from "react";
import { LanguageSelector } from "../components/LanguageSelector";
import { useLanguage } from "../hooks/useLanguage";
import {
  createRecommendationSnapshot,
  evaluatorDecisionErrors,
  hasEvaluatorDecisionErrors,
} from "../lib/createRecommendationSnapshot";
import {
  DECISION_QA_FIXTURES,
  type DecisionQaFixture,
  type HarnessPosture,
} from "../lib/decisionQaCatalog";
import { verifyDecisionRulesV01 } from "../lib/decisionRulesV01.qa";
import { presentDecisionCard } from "../lib/presentDecisionCard";
import {
  DEFAULT_EVALUATOR_STATUS,
  type EvaluatorDecisionStatus,
  type RecommendationSnapshot,
} from "../types/decision";
import { DecisionCardScreen } from "./interview/DecisionCardScreen";

type RecordedStatus = Exclude<EvaluatorDecisionStatus, "not_accepted">;

type RunState = {
  fixture: DecisionQaFixture;
  snapshot: RecommendationSnapshot;
};

function postureLabel(
  posture: HarnessPosture,
  proceed: string,
  defer: string
): string {
  return posture === "defer" ? defer : proceed;
}

export default function DecisionQaPage() {
  const { language, copy } = useLanguage();
  const qa = copy.qaHarness;
  const [run, setRun] = useState<RunState | null>(null);
  const [evaluatorStatus, setEvaluatorStatus] =
    useState<EvaluatorDecisionStatus>(DEFAULT_EVALUATOR_STATUS);
  const [evaluatorName, setEvaluatorName] = useState("");
  const [evaluatorReason, setEvaluatorReason] = useState("");

  const rulesReport = useMemo(() => verifyDecisionRulesV01(), []);

  const view = run
    ? presentDecisionCard(
        run.snapshot.decisionObject,
        run.snapshot.frozenDraft,
        evaluatorStatus,
        language
      )
    : null;

  function resetEvaluator() {
    setEvaluatorStatus(DEFAULT_EVALUATOR_STATUS);
    setEvaluatorName("");
    setEvaluatorReason("");
  }

  function runFixture(fixture: DecisionQaFixture) {
    const snapshot = createRecommendationSnapshot(fixture.draft);
    if (!snapshot) return;
    setRun({ fixture, snapshot });
    resetEvaluator();
  }

  function recordEvaluatorDecision(
    status: RecordedStatus,
    name: string,
    reason: string
  ) {
    const errors = evaluatorDecisionErrors(status, name, reason, language);
    if (hasEvaluatorDecisionErrors(errors)) return errors;
    setEvaluatorStatus(status);
    return { name: null, reason: null };
  }

  const actualPosture = run?.snapshot.decisionObject.posture;
  const actualConfidence = run?.snapshot.decisionObject.confidence.value;
  const postureMatch =
    actualPosture === "proceed_with_conditions" || actualPosture === "defer"
      ? actualPosture === run?.fixture.expectedPosture
      : false;
  const confidenceMatch =
    run?.fixture.expectedConfidence == null ||
    actualConfidence === run.fixture.expectedConfidence;
  const passed = Boolean(run && postureMatch && confidenceMatch);

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 px-4 py-4 sm:px-6">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-4">
          <p className="text-sm font-medium uppercase tracking-widest text-emerald-400">
            Invest Smarter
          </p>
          <LanguageSelector />
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl space-y-8 px-4 py-8 sm:px-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            {qa.title}
          </h1>
          <p className="text-sm leading-relaxed text-slate-400">{qa.helper}</p>
          <p className="text-sm text-slate-500">
            {qa.rulesQa}:{" "}
            <span
              className={
                rulesReport.failed === 0 ? "text-emerald-400" : "text-amber-300"
              }
            >
              {rulesReport.failed === 0 ? qa.rulesPassed : qa.rulesFailed}
            </span>
          </p>
        </header>

        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {DECISION_QA_FIXTURES.map((fixture) => {
            const selected = run?.fixture.id === fixture.id;
            return (
              <li key={fixture.id}>
                <button
                  type="button"
                  onClick={() => runFixture(fixture)}
                  className={`h-full w-full rounded-2xl border px-4 py-4 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 ${
                    selected
                      ? "border-slate-300 bg-slate-800"
                      : "border-slate-800 bg-slate-900 hover:border-slate-600"
                  }`}
                >
                  <span className="block text-sm font-semibold text-white">
                    {fixture.name}
                  </span>
                  <span className="mt-2 block text-xs text-slate-400">
                    {postureLabel(
                      fixture.expectedPosture,
                      copy.decision.postureProceed,
                      copy.decision.postureDefer
                    )}
                    {fixture.expectedConfidence != null
                      ? ` · ${fixture.expectedConfidence}`
                      : ""}
                  </span>
                  <span className="mt-2 block text-xs leading-relaxed text-slate-500">
                    {fixture.purpose}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {!run ? (
          <p className="text-sm text-slate-500">{qa.selectPrompt}</p>
        ) : (
          <section className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-4">
            <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-widest text-slate-500">
                  {qa.expectedPosture}
                </dt>
                <dd className="mt-1 text-slate-200">
                  {postureLabel(
                    run.fixture.expectedPosture,
                    copy.decision.postureProceed,
                    copy.decision.postureDefer
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-slate-500">
                  {qa.actualPosture}
                </dt>
                <dd className="mt-1 text-slate-200">
                  {actualPosture === "defer" ||
                  actualPosture === "proceed_with_conditions"
                    ? postureLabel(
                        actualPosture,
                        copy.decision.postureProceed,
                        copy.decision.postureDefer
                      )
                    : qa.notSet}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-slate-500">
                  {qa.expectedConfidence}
                </dt>
                <dd className="mt-1 text-slate-200">
                  {run.fixture.expectedConfidence ?? qa.notSet}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-slate-500">
                  {qa.actualConfidence}
                </dt>
                <dd className="mt-1 text-slate-200">
                  {actualConfidence ?? qa.notSet}
                </dd>
              </div>
            </dl>
            <p
              className={`text-sm font-medium ${
                passed ? "text-emerald-400" : "text-amber-300"
              }`}
            >
              {passed ? qa.pass : qa.check}
            </p>
          </section>
        )}

        {run ? (
          <DecisionCardScreen
            view={view}
            evaluatorStatus={evaluatorStatus}
            evaluatorName={evaluatorName}
            evaluatorReason={evaluatorReason}
            onEvaluatorName={setEvaluatorName}
            onEvaluatorReason={setEvaluatorReason}
            onRecordDecision={recordEvaluatorDecision}
            onClearSaved={() => {
              setRun(null);
              resetEvaluator();
            }}
          />
        ) : null}
      </main>
    </div>
  );
}
