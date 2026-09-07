BEGIN;

CREATE TABLE IF NOT EXISTS public.gesab_leads (
  submission_id uuid PRIMARY KEY,
  inquiry jsonb NOT NULL CHECK (jsonb_typeof(inquiry) = 'object'),
  payload_hash text NOT NULL CHECK (payload_hash ~ '^[0-9a-f]{64}$'),
  attribution jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(attribution) = 'object'),
  created_at timestamptz NOT NULL DEFAULT now(),
  email_sent_at timestamptz,
  sheet_synced_at timestamptz,
  sheet_lease_token uuid,
  sheet_lease_expires_at timestamptz,
  status text NOT NULL DEFAULT 'Ny'
    CHECK (status IN ('Ny', 'Kontaktad', 'Offert skickad', 'Bokat jobb', 'Avböjd', 'Ej relevant')),
  next_contact date,
  owner text CHECK (length(owner) <= 120),
  notes text CHECK (length(notes) <= 4000),
  booked_at timestamptz,
  value_sek numeric(14,2) CHECK (value_sek >= 0 AND value_sek <> 'NaN'::numeric),
  CHECK ((sheet_lease_token IS NULL) = (sheet_lease_expires_at IS NULL))
);

CREATE INDEX IF NOT EXISTS gesab_leads_pending_sheet_idx
  ON public.gesab_leads (created_at, submission_id)
  WHERE sheet_synced_at IS NULL;

-- Only the application database role (table owner) may access these records.
REVOKE ALL ON TABLE public.gesab_leads FROM PUBLIC;

COMMIT;
