export type InterviewLocationState = {
  investmentIdea: string;
};

export function isInterviewLocationState(
  value: unknown
): value is InterviewLocationState {
  return (
    typeof value === "object" &&
    value !== null &&
    "investmentIdea" in value &&
    typeof (value as InterviewLocationState).investmentIdea === "string"
  );
}
