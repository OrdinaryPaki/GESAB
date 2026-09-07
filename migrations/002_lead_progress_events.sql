BEGIN;
CREATE TABLE IF NOT EXISTS public.gesab_lead_progress_events (
  event_id uuid PRIMARY KEY,
  submission_id uuid NOT NULL REFERENCES public.gesab_leads(submission_id),
  payload_hash text NOT NULL CHECK (payload_hash ~ '^[0-9a-f]{64}$'),
  received_at timestamptz NOT NULL DEFAULT now()
);
REVOKE ALL ON TABLE public.gesab_lead_progress_events FROM PUBLIC;
COMMIT;
