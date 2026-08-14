import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { MOCK_QUESTIONS } from "../mocks/interview";
import { isInterviewLocationState } from "../types/interview";

export default function InterviewPage() {
  const location = useLocation();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [finished, setFinished] = useState(false);

  if (!isInterviewLocationState(location.state)) {
    return <Navigate to="/" replace />;
  }

  const { investmentIdea } = location.state;
  const currentQuestion = MOCK_QUESTIONS[questionIndex] ?? MOCK_QUESTIONS[0];
  const isLastQuestion = questionIndex >= MOCK_QUESTIONS.length - 1;

  function handleNext(e: React.FormEvent) {
    e.preventDefault();
    if (!answer.trim()) return;

    if (isLastQuestion) {
      setFinished(true);
      return;
    }

    setQuestionIndex((i) => i + 1);
    setAnswer("");
  }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-12">
      <div className="mx-auto w-full max-w-2xl space-y-8">
        <header>
          <p className="text-sm font-medium uppercase tracking-widest text-emerald-400">
            Invest Smarter
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-white">
            Investment Interview
          </h1>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-sm font-medium uppercase tracking-wide text-slate-500">
            Investment Idea
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-100">
            {investmentIdea}
          </p>
        </section>

        <section className="rounded-2xl border border-emerald-900/50 bg-emerald-950/20 p-6">
          <h2 className="text-sm font-medium uppercase tracking-wide text-emerald-400">
            AI Question
          </h2>
          <p className="mt-3 text-lg leading-relaxed text-white">
            {currentQuestion}
          </p>
        </section>

        <form onSubmit={handleNext} className="space-y-4">
          <div>
            <label
              htmlFor="answer"
              className="mb-2 block text-sm font-medium text-slate-400"
            >
              Your answer
            </label>
            <textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={4}
              placeholder="Type your answer here…"
              className="w-full resize-none rounded-2xl border border-slate-700 bg-slate-900 px-5 py-4 text-base text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          <button
            type="submit"
            disabled={!answer.trim() || finished}
            className="rounded-2xl bg-emerald-600 px-8 py-3 text-base font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>

          {finished && (
            <p className="text-sm text-slate-500">
              Mock interview complete. AI integration comes in the next sprint.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
