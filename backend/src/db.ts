import { createClient, SupabaseClient } from "@supabase/supabase-js";

export type InterviewRow = {
  id: string;
  initial_idea: string;
  collected_data: Record<string, unknown>;
  status: "active" | "completed";
  created_at: string;
  updated_at: string;
};

export type MessageRow = {
  id: string;
  interview_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
};

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
  }

  client = createClient(url, key);
  return client;
}

export async function createInterview(initialIdea: string): Promise<InterviewRow> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("interviews")
    .insert({ initial_idea: initialIdea })
    .select()
    .single();

  if (error) throw error;
  return data as InterviewRow;
}

export async function getInterview(id: string): Promise<InterviewRow> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("interviews")
    .select()
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as InterviewRow;
}

export async function updateInterview(
  id: string,
  patch: Partial<Pick<InterviewRow, "collected_data" | "status">>
): Promise<InterviewRow> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("interviews")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as InterviewRow;
}

export async function listMessages(interviewId: string): Promise<MessageRow[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("messages")
    .select()
    .eq("interview_id", interviewId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []) as MessageRow[];
}

export async function addMessage(
  interviewId: string,
  role: MessageRow["role"],
  content: string
): Promise<MessageRow> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("messages")
    .insert({ interview_id: interviewId, role, content })
    .select()
    .single();

  if (error) throw error;
  return data as MessageRow;
}
