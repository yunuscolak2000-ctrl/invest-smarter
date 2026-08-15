type AssistantPromptProps = {
  title: string;
  message: string;
};

export function AssistantPrompt({ title, message }: AssistantPromptProps) {
  return (
    <div className="flex gap-3">
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-semibold tracking-wide text-emerald-400"
        aria-hidden="true"
      >
        IS
      </div>
      <div className="min-w-0 space-y-2">
        <p className="text-sm leading-relaxed text-slate-300">{message}</p>
        <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
          {title}
        </h2>
      </div>
    </div>
  );
}
