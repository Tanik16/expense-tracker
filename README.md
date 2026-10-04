# Personal Expense Tracker (Next.js + Supabase + Tailwind)

## 1. Expected `expenses` table schema

If you haven't already, make sure your Supabase `expenses` table has these columns
(adjust the app code if your column names differ):

```sql
create table expenses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  amount numeric not null,
  category text not null,
  date date not null,
  created_at timestamp with time zone default now()
);

-- Optional but recommended if RLS is enabled on the table:
alter table expenses enable row level security;

create policy "Allow all access for now"
  on expenses
  for all
  using (true)
  with check (true);
```

(The permissive policy above is fine for local development/demo purposes only —
lock it down before shipping anything real.)

## 2. Install dependencies

Inside an existing Next.js (App Router) + Tailwind project, just add:

```bash
npm install @supabase/supabase-js
```

If you're starting completely fresh instead:

```bash
npx create-next-app@latest expense-tracker --tailwind --app
cd expense-tracker
npm install @supabase/supabase-js
```

Then copy these files into your project, matching the same folder paths:

- `lib/supabase.js`
- `app/layout.js`
- `app/globals.css`
- `app/page.js`
- `tailwind.config.js`
- `postcss.config.js`
- `jsconfig.json`

## 3. Add environment variables

Copy `.env.local.example` to `.env.local` and fill in your project's values
(found in Supabase → Project Settings → API):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

## 4. Run it

```bash
npm run dev
```

Visit http://localhost:3000 — you should be able to add an expense (title,
amount, category, date) and see it appear in the list below, with a running
total and a delete button on each row.
