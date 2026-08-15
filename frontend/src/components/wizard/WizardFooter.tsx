import { Button } from "../Button";

type WizardFooterProps = {
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  hideNext?: boolean;
  onPrevious?: () => void;
  showPrevious?: boolean;
  previousLabel?: string;
  secondaryLabel?: string;
  onSecondary?: () => void;
};

export function WizardFooter({
  onNext,
  nextLabel = "Next",
  nextDisabled = false,
  hideNext = false,
  onPrevious,
  showPrevious = false,
  previousLabel = "Previous",
  secondaryLabel,
  onSecondary,
}: WizardFooterProps) {
  const leftAction =
    showPrevious && onPrevious ? (
      <Button
        variant="ghost"
        className={hideNext ? "w-full" : "w-full sm:w-auto sm:min-w-32"}
        onClick={onPrevious}
      >
        {previousLabel}
      </Button>
    ) : secondaryLabel && onSecondary ? (
      <Button variant="ghost" className="w-full sm:w-auto sm:min-w-32" onClick={onSecondary}>
        {secondaryLabel}
      </Button>
    ) : null;

  return (
    <footer className="sticky bottom-0 border-t border-slate-800 bg-slate-950/95 px-4 py-3 backdrop-blur-sm sm:px-6 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 sm:flex-row sm:items-center">
        {leftAction}
        {hideNext || !onNext ? null : (
          <Button
            className="w-full sm:flex-1"
            onClick={onNext}
            disabled={nextDisabled}
          >
            {nextLabel}
          </Button>
        )}
      </div>
    </footer>
  );
}
