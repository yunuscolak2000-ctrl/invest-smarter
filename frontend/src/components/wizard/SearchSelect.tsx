import { forwardRef, useMemo, useState } from "react";
import type { LabeledOption } from "../../types/interview";
import { FieldError } from "./FieldError";

type SearchSelectProps = {
  id: string;
  label: string;
  options: LabeledOption[];
  value: string | null;
  onChange: (option: LabeledOption) => void;
  error?: string | null;
  placeholder?: string;
  helper?: string;
  emptyMessage?: string;
  minQueryLength?: number;
  minQueryMessage?: string;
};

export const SearchSelect = forwardRef<HTMLInputElement, SearchSelectProps>(
  function SearchSelect(
    {
      id,
      label,
      options,
      value,
      onChange,
      error,
      placeholder = "Search sectors",
      helper,
      emptyMessage = "No matching sectors",
      minQueryLength = 0,
      minQueryMessage = "Type at least 2 letters to search",
    },
    ref
  ) {
    const [query, setQuery] = useState("");
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;
    const listId = `${id}-list`;
    const describedBy = [helper ? helperId : null, error ? errorId : null]
      .filter(Boolean)
      .join(" ") || undefined;

    const needle = query.trim().toLowerCase();
    const queryTooShort = needle.length < minQueryLength;

    const filtered = useMemo(() => {
      if (queryTooShort) return [];
      if (!needle) return options;
      return options.filter(
        (option) =>
          option.label.toLowerCase().includes(needle) ||
          option.code.toLowerCase().includes(needle)
      );
    }, [needle, options, queryTooShort]);

    return (
      <div className="space-y-2">
        <label htmlFor={id} className="block text-sm font-medium text-slate-300">
          {label}
        </label>
        <input
          ref={ref}
          id={id}
          type="search"
          value={query}
          placeholder={placeholder}
          autoComplete="off"
          onChange={(event) => setQuery(event.target.value)}
          aria-controls={listId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-base text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
        />
        <ul
          id={listId}
          role="listbox"
          aria-label={label}
          className="max-h-56 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900"
        >
          {queryTooShort ? (
            <li className="px-4 py-3 text-sm text-slate-500">{minQueryMessage}</li>
          ) : filtered.length === 0 ? (
            <li className="px-4 py-3 text-sm text-slate-500">{emptyMessage}</li>
          ) : (
            filtered.map((option) => {
              const selected = value === option.code;
              return (
                <li key={option.code} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    onClick={() => onChange(option)}
                    className={`flex min-h-11 w-full items-center px-4 py-2.5 text-left text-sm transition-colors focus:outline-none focus-visible:bg-slate-800 ${
                      selected
                        ? "bg-emerald-950/40 font-medium text-emerald-300"
                        : "text-slate-200 hover:bg-slate-800"
                    }`}
                  >
                    {option.label}
                  </button>
                </li>
              );
            })
          )}
        </ul>
        {helper ? (
          <p id={helperId} className="text-sm text-slate-500">
            {helper}
          </p>
        ) : null}
        <FieldError id={errorId} message={error ?? null} />
      </div>
    );
  }
);
