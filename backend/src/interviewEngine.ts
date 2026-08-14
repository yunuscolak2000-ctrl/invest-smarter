import OpenAI from "openai";
import { z } from "zod";
import type { MessageRow } from "./db.js";

const responseSchema = z.object({
  extracted_updates: z.record(z.unknown()),
  next_question: z.string().min(1).nullable(),
  is_complete: z.boolean(),
  completion_note: z.string().optional(),
});

export type InterviewStepResult = z.infer<typeof responseSchema>;

const SYSTEM_PROMPT = `You are Invest Smarter, an expert investment advisor conducting a pre-feasibility interview.

Rules:
- Ask exactly ONE focused question per turn. Never ask multiple questions in one message.
- Choose the single highest-value gap in the collected data — what would most change the invest/no-invest view?
- Prioritize: revenue/offtake → land/site control → capex/funding → sponsor experience → timeline → regulatory.
- Be conversational and professional, not robotic. Keep questions under 35 words when possible.
- Extract structured facts from the user's latest answer into extracted_updates (flat keys, e.g. capacity_mw, city, offtake_model).
- Do not invent facts the user did not provide.
- When you have enough for a credible pre-feasibility screen (typically 6-10 exchanges after the idea), set is_complete true and next_question null. Write a brief completion_note summarizing what you know and what remains for deep diligence.

Respond with JSON only:
{
  "extracted_updates": { "key": "value" },
  "next_question": "string or null",
  "is_complete": false,
  "completion_note": "optional string when complete"
}`;

function buildUserPayload(
  initialIdea: string,
  collectedData: Record<string, unknown>,
  messages: MessageRow[],
  latestAnswer?: string
) {
  const history = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({ role: m.role, content: m.content }));

  return JSON.stringify(
    {
      initial_idea: initialIdea,
      collected_data: collectedData,
      conversation: history,
      latest_user_answer: latestAnswer ?? null,
      instruction:
        latestAnswer === undefined
          ? "This is the start. Parse the initial idea into extracted_updates, then ask the single best first follow-up question."
          : "Incorporate latest_user_answer into extracted_updates, then ask the single best next question.",
    },
    null,
    2
  );
}

export async function runInterviewStep(input: {
  initialIdea: string;
  collectedData: Record<string, unknown>;
  messages: MessageRow[];
  latestAnswer?: string;
}): Promise<InterviewStepResult> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return mockStep(input);
  }

  const openai = new OpenAI({ apiKey });
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  const completion = await openai.chat.completions.create({
    model,
    temperature: 0.4,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: buildUserPayload(
          input.initialIdea,
          input.collectedData,
          input.messages,
          input.latestAnswer
        ),
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("Empty response from OpenAI");

  const parsed = responseSchema.safeParse(JSON.parse(raw));
  if (!parsed.success) {
    throw new Error(`Invalid AI response: ${parsed.error.message}`);
  }

  return parsed.data;
}

/** Deterministic fallback when OPENAI_API_KEY is not set — for local UI testing */
function mockStep(input: {
  initialIdea: string;
  collectedData: Record<string, unknown>;
  messages: MessageRow[];
  latestAnswer?: string;
}): InterviewStepResult {
  const userTurns = input.messages.filter((m) => m.role === "user").length;
  const isFirst = input.latestAnswer === undefined;

  if (isFirst) {
    return {
      extracted_updates: {
        raw_idea: input.initialIdea,
        sector_hint: "renewable_energy",
      },
      next_question:
        "Who will buy the power — a utility, corporate off-taker, or merchant market?",
      is_complete: false,
    };
  }

  const mockQuestions = [
    "Do you already have a site or land option secured in Şanlıurfa?",
    "What is your rough total investment budget or capex range?",
    "Do you have experience developing energy projects, or is this your first?",
    "What timeline are you targeting for financial close and commissioning?",
    "Are you pursuing any government incentives or a power purchase agreement?",
  ];

  const idx = userTurns - 1;

  if (idx >= mockQuestions.length) {
    return {
      extracted_updates: { interview_pass: "mock_complete" },
      next_question: null,
      is_complete: true,
      completion_note:
        "Mock interview complete. Connect OPENAI_API_KEY for intelligent follow-ups.",
    };
  }

  return {
    extracted_updates: { [`answer_${userTurns}`]: input.latestAnswer },
    next_question: mockQuestions[idx] ?? null,
    is_complete: false,
  };
}
