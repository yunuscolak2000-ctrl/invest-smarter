import "dotenv/config";
import cors from "cors";
import express from "express";
import { z } from "zod";
import {
  addMessage,
  createInterview,
  getInterview,
  listMessages,
  updateInterview,
} from "./db.js";
import { runInterviewStep } from "./interviewEngine.js";

const app = express();
const port = Number(process.env.PORT ?? 3001);

app.use(cors({ origin: true }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

const startSchema = z.object({
  idea: z.string().trim().min(10, "Describe your investment idea in at least 10 characters"),
});

app.post("/api/interviews/start", async (req, res) => {
  try {
    const { idea } = startSchema.parse(req.body);
    const interview = await createInterview(idea);

    const step = await runInterviewStep({
      initialIdea: idea,
      collectedData: interview.collected_data,
      messages: [],
    });

    const mergedData = {
      ...interview.collected_data,
      ...step.extracted_updates,
    };

    let updated = interview;
    if (Object.keys(step.extracted_updates).length > 0) {
      updated = await updateInterview(interview.id, { collected_data: mergedData });
    }

    await addMessage(interview.id, "user", idea);

    if (step.next_question) {
      await addMessage(interview.id, "assistant", step.next_question);
    }

    if (step.is_complete) {
      updated = await updateInterview(interview.id, { status: "completed" });
      if (step.completion_note) {
        await addMessage(interview.id, "assistant", step.completion_note);
      }
    }

    const messages = await listMessages(interview.id);

    res.status(201).json({
      interview: updated,
      messages,
    });
  } catch (err) {
    console.error(err);
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0]?.message ?? "Invalid input" });
      return;
    }
    res.status(500).json({ error: err instanceof Error ? err.message : "Server error" });
  }
});

const answerSchema = z.object({
  answer: z.string().trim().min(1, "Answer cannot be empty"),
});

app.post("/api/interviews/:id/answer", async (req, res) => {
  try {
    const { id } = req.params;
    const { answer } = answerSchema.parse(req.body);

    const interview = await getInterview(id);
    if (interview.status === "completed") {
      res.status(400).json({ error: "Interview is already complete" });
      return;
    }

    await addMessage(id, "user", answer);

    const messages = await listMessages(id);
    const step = await runInterviewStep({
      initialIdea: interview.initial_idea,
      collectedData: interview.collected_data,
      messages,
      latestAnswer: answer,
    });

    const mergedData = {
      ...interview.collected_data,
      ...step.extracted_updates,
    };

    let updated = await updateInterview(id, { collected_data: mergedData });

    if (step.next_question) {
      await addMessage(id, "assistant", step.next_question);
    }

    if (step.is_complete) {
      updated = await updateInterview(id, { status: "completed" });
      if (step.completion_note) {
        await addMessage(id, "assistant", step.completion_note);
      }
    }

    const allMessages = await listMessages(id);

    res.json({
      interview: updated,
      messages: allMessages,
    });
  } catch (err) {
    console.error(err);
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0]?.message ?? "Invalid input" });
      return;
    }
    res.status(500).json({ error: err instanceof Error ? err.message : "Server error" });
  }
});

app.get("/api/interviews/:id", async (req, res) => {
  try {
    const interview = await getInterview(req.params.id);
    const messages = await listMessages(req.params.id);
    res.json({ interview, messages });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Server error" });
  }
});

app.listen(port, () => {
  console.log(`Invest Smarter API listening on http://localhost:${port}`);
});
