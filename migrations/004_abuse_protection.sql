CREATE TABLE IF NOT EXISTS public.gesab_abuse_buckets (
  bucket_key text PRIMARY KEY,
  used integer NOT NULL CHECK (used >= 0),
  expires_at timestamptz NOT NULL
);
-- statement-breakpoint
CREATE INDEX IF NOT EXISTS gesab_abuse_buckets_expiry_idx ON public.gesab_abuse_buckets (expires_at);
-- statement-breakpoint
CREATE TABLE IF NOT EXISTS public.gesab_abuse_admissions (
  kind text NOT NULL,
  event_id uuid NOT NULL,
  fingerprint text NOT NULL,
  budget_day date NOT NULL DEFAULT ((CURRENT_TIMESTAMP AT TIME ZONE 'UTC')::date),
  expires_at timestamptz NOT NULL,
  PRIMARY KEY (kind,event_id)
);
-- statement-breakpoint
ALTER TABLE public.gesab_abuse_admissions ADD COLUMN IF NOT EXISTS budget_day date NOT NULL DEFAULT ((CURRENT_TIMESTAMP AT TIME ZONE 'UTC')::date);
-- statement-breakpoint
CREATE INDEX IF NOT EXISTS gesab_abuse_admissions_expiry_idx ON public.gesab_abuse_admissions (expires_at);
-- statement-breakpoint
CREATE OR REPLACE FUNCTION public.gesab_consume_abuse_buckets(p_kind text,p_rules jsonb,p_now timestamptz)
RETURNS integer LANGUAGE plpgsql SET search_path = pg_catalog, public AS $$
DECLARE rule jsonb; seconds integer; maximum integer; start_at bigint; bucket text; current_used integer; retry integer := 0;
BEGIN
  IF jsonb_typeof(p_rules) <> 'array' OR jsonb_array_length(p_rules) NOT BETWEEN 1 AND 12 THEN RAISE EXCEPTION 'Invalid budget rules'; END IF;
  -- Caller holds the endpoint advisory lock. Check every budget before consuming any.
  FOR rule IN SELECT value FROM jsonb_array_elements(p_rules) LOOP
    seconds := (rule->>'seconds')::integer; maximum := (rule->>'limit')::integer;
    IF seconds NOT BETWEEN 1 AND 86400 OR maximum NOT BETWEEN 1 AND 1000000 OR length(rule->>'key') NOT BETWEEN 1 AND 128 THEN RAISE EXCEPTION 'Invalid budget'; END IF;
    start_at := floor(extract(epoch FROM p_now) / seconds)::bigint * seconds;
    bucket := p_kind || ':' || (rule->>'key') || ':' || seconds || ':' || start_at;
    SELECT used INTO current_used FROM public.gesab_abuse_buckets WHERE bucket_key = bucket;
    IF coalesce(current_used,0) >= maximum THEN retry := greatest(retry,ceil(start_at + seconds - extract(epoch FROM p_now))::integer); END IF;
  END LOOP;
  IF retry > 0 THEN RETURN retry; END IF;
  FOR rule IN SELECT value FROM jsonb_array_elements(p_rules) LOOP
    seconds := (rule->>'seconds')::integer;
    start_at := floor(extract(epoch FROM p_now) / seconds)::bigint * seconds;
    bucket := p_kind || ':' || (rule->>'key') || ':' || seconds || ':' || start_at;
    INSERT INTO public.gesab_abuse_buckets(bucket_key,used,expires_at)
      VALUES(bucket,1,to_timestamp(start_at+seconds) + interval '1 day')
      ON CONFLICT(bucket_key) DO UPDATE SET used = public.gesab_abuse_buckets.used + 1;
  END LOOP;
  RETURN 0;
END;
$$;
-- statement-breakpoint
CREATE OR REPLACE FUNCTION public.gesab_admit_contact(p_kind text,p_event uuid,p_fingerprint text,p_attempts jsonb,p_budgets jsonb)
RETURNS jsonb LANGUAGE plpgsql SET search_path = pg_catalog, public AS $$
DECLARE clock_time timestamptz; retry integer; previous text; previous_day date; today date;
BEGIN
  IF p_kind NOT IN ('inquiry','phone') OR p_event IS NULL OR p_fingerprint !~ '^[a-f0-9]{64}$' THEN RAISE EXCEPTION 'Invalid admission'; END IF;
  -- A short transaction lock serializes decisions across all Vercel instances.
  PERFORM pg_advisory_xact_lock(hashtextextended('gesab-abuse:' || p_kind,0));
  clock_time := clock_timestamp();
  today := (clock_time AT TIME ZONE 'UTC')::date;
  DELETE FROM public.gesab_abuse_buckets WHERE bucket_key IN
    (SELECT bucket_key FROM public.gesab_abuse_buckets WHERE expires_at < clock_time ORDER BY expires_at LIMIT 100 FOR UPDATE SKIP LOCKED);
  DELETE FROM public.gesab_abuse_admissions WHERE (kind,event_id) IN
    (SELECT kind,event_id FROM public.gesab_abuse_admissions WHERE expires_at < clock_time ORDER BY expires_at LIMIT 100 FOR UPDATE SKIP LOCKED);
  retry := public.gesab_consume_abuse_buckets(p_kind,p_attempts,clock_time);
  IF retry > 0 THEN RETURN jsonb_build_object('allowed',false,'retry_after',retry); END IF;
  SELECT fingerprint,budget_day INTO previous,previous_day FROM public.gesab_abuse_admissions WHERE kind=p_kind AND event_id=p_event;
  IF previous IS NOT NULL AND previous <> p_fingerprint THEN RETURN jsonb_build_object('allowed',false,'conflict',true,'retry_after',0); END IF;
  -- A retry on another UTC day must reserve that day's budgets before possible delivery.
  IF previous_day = today THEN RETURN jsonb_build_object('allowed',true,'retry_after',0); END IF;
  retry := public.gesab_consume_abuse_buckets(p_kind,p_budgets,clock_time);
  IF retry > 0 THEN RETURN jsonb_build_object('allowed',false,'retry_after',retry); END IF;
  INSERT INTO public.gesab_abuse_admissions(kind,event_id,fingerprint,budget_day,expires_at) VALUES(p_kind,p_event,p_fingerprint,today,clock_time+interval '2 days')
    ON CONFLICT(kind,event_id) DO UPDATE SET budget_day=EXCLUDED.budget_day,expires_at=EXCLUDED.expires_at;
  RETURN jsonb_build_object('allowed',true,'retry_after',0);
END;
$$;
-- statement-breakpoint
REVOKE ALL ON public.gesab_abuse_buckets, public.gesab_abuse_admissions FROM PUBLIC;
-- statement-breakpoint
REVOKE ALL ON FUNCTION public.gesab_consume_abuse_buckets(text,jsonb,timestamptz), public.gesab_admit_contact(text,uuid,text,jsonb,jsonb) FROM PUBLIC;
