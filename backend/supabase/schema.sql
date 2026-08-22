create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  firebase_uid text unique,
  email text unique not null,
  name text not null,
  password_hash text,
  avatar_url text,
  branch text default 'Computer Science & Engineering',
  year text default '2026',
  cgpa numeric default 0,
  target_role text default 'Software Engineer',
  target_companies text[] default '{}',
  coding_score integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table users alter column firebase_uid drop not null;
alter table users add column if not exists password_hash text;

create table if not exists skill_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  name text not null,
  category text not null,
  confidence integer not null default 0,
  verified boolean not null default false,
  last_updated timestamptz default now(),
  evidence_trail jsonb default '[]'::jsonb,
  unique(user_id, name)
);

create table if not exists problems (
  id text primary key,
  title text not null,
  description text default '',
  difficulty text not null,
  tags text[] default '{}',
  examples jsonb default '[]'::jsonb,
  constraints jsonb default '[]'::jsonb,
  starter_code jsonb default '{}'::jsonb,
  solution_notes text default '',
  test_cases jsonb default '[]'::jsonb
);

alter table problems add column if not exists examples jsonb default '[]'::jsonb;
alter table problems add column if not exists constraints jsonb default '[]'::jsonb;
alter table problems add column if not exists starter_code jsonb default '{}'::jsonb;
alter table problems add column if not exists solution_notes text default '';

create table if not exists aptitude_questions (
  id text primary key,
  category text not null,
  difficulty text not null,
  question text not null,
  options jsonb default '[]'::jsonb,
  correct_index integer not null,
  explanation text default '',
  source text default 'seeded',
  created_at timestamptz default now()
);

create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  problem_id text references problems(id) on delete set null,
  code text not null,
  language text not null,
  custom_input text default '',
  verdict text not null,
  stdout text default '',
  stderr text default '',
  runtime_ms integer default 0,
  created_at timestamptz default now()
);

create table if not exists aptitude_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  category_scores jsonb default '{}'::jsonb,
  overall_score integer not null default 0,
  accuracy numeric default 0,
  time_taken_seconds integer default 0,
  answers jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

alter table aptitude_results add column if not exists answers jsonb default '[]'::jsonb;

create table if not exists resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  extracted_text text default '',
  target_role text default 'Software Engineer',
  score integer not null default 0,
  matched_skills text[] default '{}',
  missing_skills text[] default '{}',
  suggestions jsonb default '[]'::jsonb,
  roast_text text,
  created_at timestamptz default now()
);

create table if not exists interviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  mode text default 'text',
  qa_pairs jsonb default '[]'::jsonb,
  follow_ups jsonb default '[]'::jsonb,
  tech_score integer default 0,
  clarity_score integer default 0,
  comm_score integer default 0,
  weak_areas text[] default '{}',
  created_at timestamptz default now()
);

create table if not exists video_quizzes (
  id uuid primary key default gen_random_uuid(),
  video_id text not null,
  topic text not null,
  transcript text default '',
  mcqs jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

create table if not exists video_quiz_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  video_quiz_id uuid references video_quizzes(id) on delete set null,
  score integer not null default 0,
  created_at timestamptz default now()
);

create table if not exists roadmaps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  target_role text default 'Software Engineer',
  days jsonb default '[]'::jsonb,
  generated_at timestamptz default now(),
  created_at timestamptz default now()
);

alter table roadmaps add column if not exists target_role text default 'Software Engineer';

create table if not exists crucible_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  parent_session_id uuid,
  status text,
  phase text,
  problem jsonb default '{}'::jsonb,
  phases jsonb default '{}'::jsonb,
  execution jsonb default '{}'::jsonb,
  evaluation jsonb default '{}'::jsonb,
  completed boolean default false,
  created_at timestamptz default now()
);

create table if not exists repo_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  parent_review_id uuid,
  repo_url text,
  snapshot jsonb default '{}'::jsonb,
  review jsonb default '{}'::jsonb,
  answer text,
  follow_up jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists gap_analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  target_role text default 'Software Engineer',
  company text default 'Target Company',
  role_fit integer default 0,
  biggest_skill_gap jsonb default '{}'::jsonb,
  priority_areas jsonb default '[]'::jsonb,
  skills jsonb default '[]'::jsonb,
  seven_day_plan jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_users_firebase_uid on users(firebase_uid);
create index if not exists idx_users_email on users(email);
create index if not exists idx_skill_profiles_user_id on skill_profiles(user_id);
create index if not exists idx_submissions_user_id on submissions(user_id);
create index if not exists idx_aptitude_results_user_id on aptitude_results(user_id);
create index if not exists idx_resumes_user_id on resumes(user_id);
create index if not exists idx_interviews_user_id on interviews(user_id);
create index if not exists idx_crucible_sessions_user_id on crucible_sessions(user_id);
create index if not exists idx_repo_reviews_user_id on repo_reviews(user_id);
create index if not exists idx_gap_analyses_user_id on gap_analyses(user_id);
