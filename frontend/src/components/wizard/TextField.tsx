import { forwardRef } from "react";
import { FieldError } from "./FieldError";

type TextFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  helper?: string;
  error?: string | null;
  maxLength?: number;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    { id, label, value, onChange, placeholder, helper, error, maxLength },
    ref
  ) {
    const helperId = `${id}-helper`;
    const errorId = `${id}-error`;
    const describedBy = [helper ? helperId : null, error ? errorId : null]
      .filter(Boolean)
      .join(" ") || undefined;

    return (
      <div className="space-y-2">
        <label htmlFor={id} className="block text-sm font-medium text-slate-300">
          {label}
        </label>
        <input
          ref={ref}
          id={id}
          type="text"
          value={value}
          maxLength={maxLength}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-base text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
        />
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
