import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [idea, setIdea] = useState("");
  const navigate = useNavigate();

  function handleStart(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = idea.trim();
    if (!trimmed) return;

    navigate("/interview", { state: { investmentIdea: trimmed } });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12">
      <div className="w-full max-w-2xl">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-white">
            Invest Smarter
          </h1>
          <p className="mt-3 text-lg text-slate-400">
            Your AI Investment Analyst
          </p>
        </header>

        <form onSubmit={handleStart} className="space-y-6">
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            rows={6}
            placeholder="What investment would you like to evaluate today?"
            className="w-full resize-none rounded-2xl border border-slate-700 bg-slate-900 px-5 py-4 text-base text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />

          <button
            type="submit"
            disabled={!idea.trim()}
            className="w-full rounded-2xl bg-emerald-600 px-6 py-4 text-base font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Start Interview
          </button>
        </form>
      </div>
    </div>
  );
}
