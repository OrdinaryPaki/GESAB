BEGIN;
CREATE TABLE IF NOT EXISTS public.gesab_phone_clicks (
  event_id uuid PRIMARY KEY,
  phone text NOT NULL CHECK (phone ~ '^\+[1-9][0-9]{1,14}$'),
  page text NOT NULL CHECK (length(page) <= 200 AND page LIKE '/%' AND page !~ '[?#]'),
  attribution jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(attribution) = 'object'),
  created_at timestamptz NOT NULL DEFAULT now(),
  sheet_synced_at timestamptz,
  sheet_lease_token uuid,
  sheet_lease_expires_at timestamptz,
  CHECK ((sheet_lease_token IS NULL) = (sheet_lease_expires_at IS NULL))
);
CREATE INDEX IF NOT EXISTS gesab_phone_clicks_pending_sheet_idx
  ON public.gesab_phone_clicks (created_at, event_id) WHERE sheet_synced_at IS NULL;
REVOKE ALL ON TABLE public.gesab_phone_clicks FROM PUBLIC;
COMMIT;
