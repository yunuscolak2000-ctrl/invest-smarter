-- Sprint 1: Conversational investment interview

create extension if not exists "pgcrypto";

create table interviews (
  id uuid primary key default gen_random_uuid(),
  initial_idea text not null,
  collected_data jsonb not null default '{}',
  status text not null default 'active' check (status in ('active', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  interview_id uuid not null references interviews(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamptz not null default now()
);

create index messages_interview_id_idx on messages(interview_id, created_at);

alter table interviews enable row level security;
alter table messages enable row level security;

-- MVP: open access (tighten before production)
create policy "Allow all on interviews" on interviews for all using (true) with check (true);
create policy "Allow all on messages" on messages for all using (true) with check (true);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger interviews_updated_at
  before update on interviews
  for each row execute function set_updated_at();
