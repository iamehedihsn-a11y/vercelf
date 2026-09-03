-- ============================================================
--  Certifications: editable rows with badge/certificate preview
--  Public read, admin-only write (matches lockdown pattern)
-- ============================================================

create table if not exists public.certifications (
  id integer primary key generated always as identity,
  title text not null default '',
  issuer text not null default '',
  issue_date text default '',
  credential_id text default '',
  credential_url text default '',
  image_url text default '',
  emoji text default '📜',
  skills jsonb not null default '[]',
  description text default '',
  sort_order integer not null default 0
);

-- ---------- Data constraints (defense in depth) ----------
alter table public.certifications
  add constraint certifications_len_check check (
    char_length(coalesce(title, '')) <= 200
    and char_length(coalesce(issuer, '')) <= 200
    and char_length(coalesce(issue_date, '')) <= 100
    and char_length(coalesce(credential_id, '')) <= 200
    and char_length(coalesce(credential_url, '')) <= 500
    and char_length(coalesce(image_url, '')) <= 500
    and char_length(coalesce(emoji, '')) <= 32
    and char_length(coalesce(description, '')) <= 3000
    and jsonb_array_length(coalesce(skills, '[]'::jsonb)) <= 30
  );

alter table public.certifications
  add constraint certifications_url_check check (
    (coalesce(credential_url, '') = '' or credential_url = '#' or credential_url ~* '^https?://')
    and (coalesce(image_url, '') = '' or image_url ~* '^https?://')
  );

drop trigger if exists trg_certifications_skills_check on public.certifications;
create trigger trg_certifications_skills_check
before insert or update on public.certifications
for each row execute function public.check_text_array('skills', 100);

-- ---------- Initial seed data ----------
insert into public.certifications (title, issuer, issue_date, credential_id, credential_url, image_url, emoji, skills, description, sort_order)
select v.title, v.issuer, v.issue_date, v.credential_id, v.credential_url, v.image_url, v.emoji, v.skills::jsonb, v.description, v.sort_order
from (values
  (
    'Meta Front-End Developer Professional Certificate',
    'Meta',
    '2024',
    'META-FED-2024-889',
    'https://coursera.org/verify/professional-cert',
    '',
    '⚛️',
    '["React", "JavaScript", "HTML5 & CSS3", "UI/UX", "Responsive Design"]',
    'Comprehensive 9-course program covering modern front-end development, component architecture, testing, and responsive UI engineering.',
    0
  ),
  (
    'AWS Certified Solutions Architect – Associate',
    'Amazon Web Services',
    '2023',
    'AWS-SAA-839201',
    'https://aws.amazon.com/verification',
    '',
    '☁️',
    '["AWS", "Cloud Architecture", "Serverless", "Security", "S3 & Lambda"]',
    'Demonstrated expertise in architecting resilient, secure, high-performing, and cost-optimized distributed systems on AWS.',
    1
  ),
  (
    'Google Professional Cloud Developer',
    'Google Cloud',
    '2023',
    'GCP-PCD-491028',
    'https://cloud.google.com/certification',
    '',
    '⚡',
    '["GCP", "Kubernetes", "Microservices", "Docker", "DevOps"]',
    'Certified in building scalable cloud-native applications, deploying containerized microservices, and managing cloud storage & databases.',
    2
  )
) as v(title, issuer, issue_date, credential_id, credential_url, image_url, emoji, skills, description, sort_order)
where not exists (select 1 from public.certifications);

-- ---------- RLS: public read, admin write ----------
alter table public.certifications enable row level security;

drop policy if exists "public read certifications" on public.certifications;
drop policy if exists "auth write certifications" on public.certifications;

create policy "public read certifications" on public.certifications
  for select using (true);

create policy "auth write certifications" on public.certifications
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- Realtime ----------
alter publication supabase_realtime add table public.certifications;
