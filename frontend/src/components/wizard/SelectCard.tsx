import { forwardRef } from "react";
import { useCopy } from "../../hooks/useLanguage";
import type { SelectOption } from "../../types/interview";
import { FieldError } from "./FieldError";

type SelectCardGroupProps = {
  name: string;
  value: string | null;
  options: SelectOption[];
  onChange: (value: string) => void;
  columns?: 1 | 2;
  error?: string | null;
  errorId?: string;
};

export const SelectCardGroup = forwardRef<HTMLFieldSetElement, SelectCardGroupProps>(
  function SelectCardGroup(
    { name, value, options, onChange, columns = 1, error, errorId = `${name}-error` },
    ref
  ) {
    const copy = useCopy();
    return (
      <div className="space-y-3">
        <fieldset
          ref={ref}
          tabIndex={-1}
          className="min-w-0 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
        >
          <legend className="sr-only">{name}</legend>
          <div
            className={
              columns === 2
                ? "grid grid-cols-1 gap-3 sm:grid-cols-2"
                : "grid grid-cols-1 gap-3"
            }
          >
            {options.map((option) => {
              const selected = value === option.value;
              return (
                <label
                  key={option.value}
                  className={`flex min-h-11 cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3.5 transition-colors ${
                    selected
                      ? "border-emerald-500 bg-emerald-950/30"
                      : "border-slate-800 bg-slate-900 hover:border-slate-700"
                  }`}
                >
                  <input
                    type="radio"
                    name={name}
                    value={option.value}
                    checked={selected}
                    onChange={() => onChange(option.value)}
                    className="sr-only"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-white">
                      {option.label}
                    </span>
                    {option.helper ? (
                      <span className="mt-0.5 block text-sm leading-relaxed text-slate-400">
                        {option.helper}
                      </span>
                    ) : null}
                    {option.examples ? (
                      <span className="mt-1 block text-xs leading-relaxed text-slate-500">
                        {copy.chrome.examplesPrefix}: {option.examples}
                      </span>
                    ) : null}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      selected
                        ? "border-emerald-400 bg-emerald-500"
                        : "border-slate-600 bg-transparent"
                    }`}
                  >
                    {selected ? (
                      <span className="h-2 w-2 rounded-full bg-white" />
                    ) : null}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
        <FieldError id={errorId} message={error ?? null} />
      </div>
    );
  }
);
