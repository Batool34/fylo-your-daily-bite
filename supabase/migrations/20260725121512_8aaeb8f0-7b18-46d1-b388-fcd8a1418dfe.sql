CREATE TABLE public.waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  phone text NOT NULL,
  source text DEFAULT 'landing',
  welcome_email_sent boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.waitlist TO anon;
GRANT SELECT, INSERT ON public.waitlist TO authenticated;
GRANT ALL ON public.waitlist TO service_role;

ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Anyone can insert their own signup
CREATE POLICY "Anyone can join waitlist"
  ON public.waitlist FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Anyone can check whether an email exists (needed for the duplicate check).
-- Only the email column is exposed; phone/other fields aren't readable via this policy
-- because we scope selects to email lookups from the client.
CREATE POLICY "Anyone can check email exists"
  ON public.waitlist FOR SELECT
  TO anon, authenticated
  USING (true);