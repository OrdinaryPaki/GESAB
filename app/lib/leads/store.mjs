import { createHash, randomUUID } from 'node:crypto';
import { createSheetLeaseStore } from '../sheet-sync/leases.mjs';
import { getLeadDatabase } from './database.mjs';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const PROGRESS_KEYS = new Set(['status', 'nextContact', 'owner', 'notes', 'bookedAt', 'valueSek']);

export class LeadConflictError extends Error {
  constructor() {
    super('Submission ID already belongs to a different inquiry.');
    this.name = 'LeadConflictError';
  }
}

function requireUuid(value) {
  if (typeof value !== 'string' || !UUID.test(value)) throw new TypeError('Expected a UUID.');
}

// Input has already passed normalizeInquiry. Fixed field order makes retries stable.
function canonicalInquiry(inquiry) {
  return JSON.stringify({
    source: inquiry.source, submissionId: inquiry.submissionId.toLowerCase(),
    name: inquiry.name, email: inquiry.email, phone: inquiry.phone,
    service: inquiry.service, message: inquiry.message,
  });
}

function validateProgressPatch(progress) {
  if (!progress || typeof progress !== 'object' || Array.isArray(progress)
    || Object.keys(progress).length === 0
    || Object.keys(progress).some((key) => !PROGRESS_KEYS.has(key))) {
    throw new TypeError('Expected a validated lead progress patch.');
  }
}

export function createLeadStore(sql) {
  const leases = createSheetLeaseStore(sql, 'leads');
  return {
    async registerLead(inquiry, attribution = {}) {
      requireUuid(inquiry.submissionId);
      const payload = canonicalInquiry(inquiry);
      const hash = createHash('sha256').update(payload).digest('hex');
      // The no-op conflict update locks the row and returns the original even when
      // two requests insert concurrently. A SELECT CTE can miss that concurrent row.
      const [lead] = await sql`
        INSERT INTO public.gesab_leads (submission_id, inquiry, payload_hash, attribution)
        VALUES (${inquiry.submissionId}::uuid, ${payload}::jsonb, ${hash}, ${JSON.stringify(attribution)}::jsonb)
        ON CONFLICT (submission_id) DO UPDATE
        SET submission_id = gesab_leads.submission_id
        RETURNING *
      `;
      if (lead.payload_hash !== hash) throw new LeadConflictError();
      return lead;
    },

    async markLeadEmailSent(submissionId) {
      requireUuid(submissionId);
      const [lead] = await sql`
        UPDATE public.gesab_leads
        SET email_sent_at = COALESCE(email_sent_at, now())
        WHERE submission_id = ${submissionId}::uuid RETURNING *
      `;
      return lead ?? null;
    },

    claimSheetLeads: leases.claim,
    acknowledgeSheetLeads: leases.acknowledge,

    async updateLeadProgressBatch(patches) {
      if (!Array.isArray(patches) || patches.length > 100) throw new RangeError('At most 100 progress events are allowed.');
      if (!patches.length) return { acceptedEventIds: [], leads: [] };
      const seen = new Set();
      const events = patches.map(({ submissionId, eventId, progress }) => {
        requireUuid(submissionId);
        requireUuid(eventId);
        if (seen.has(eventId.toLowerCase())) throw new TypeError('Duplicate event ID in batch.');
        seen.add(eventId.toLowerCase());
        validateProgressPatch(progress);
        const canonicalProgress = Object.fromEntries(Object.entries(progress).sort(([left], [right]) => left.localeCompare(right)));
        const hash = createHash('sha256').update(JSON.stringify({ submissionId: submissionId.toLowerCase(), progress: canonicalProgress })).digest('hex');
        return { submissionId, eventId, progress, hash };
      });
      const [result] = await sql`
        WITH incoming AS (
          SELECT item, ordinal FROM jsonb_array_elements(${JSON.stringify(events)}::jsonb)
            WITH ORDINALITY AS entries(item, ordinal)
        ), accepted AS (
          INSERT INTO public.gesab_lead_progress_events (event_id, submission_id, payload_hash)
          SELECT (item->>'eventId')::uuid, (item->>'submissionId')::uuid, item->>'hash'
          FROM incoming JOIN public.gesab_leads AS lead
            ON lead.submission_id = (item->>'submissionId')::uuid
          ON CONFLICT (event_id) DO NOTHING RETURNING event_id
        ), patches AS (
          SELECT (item->>'submissionId')::uuid AS id,
            jsonb_object_agg(field.key, field.value ORDER BY ordinal) AS data,
            bool_or(item->'progress'->>'status' = 'Bokat jobb') AS was_booked
          FROM incoming JOIN accepted ON accepted.event_id = (item->>'eventId')::uuid
          CROSS JOIN LATERAL jsonb_each(item->'progress') AS field
          GROUP BY (item->>'submissionId')::uuid
        )
        , changed AS (UPDATE public.gesab_leads AS lead SET
          status = CASE WHEN data ? 'status' THEN data->>'status' ELSE status END,
          next_contact = CASE WHEN data ? 'nextContact' THEN (data->>'nextContact')::date ELSE next_contact END,
          owner = CASE WHEN data ? 'owner' THEN data->>'owner' ELSE owner END,
          notes = CASE WHEN data ? 'notes' THEN data->>'notes' ELSE notes END,
          value_sek = CASE WHEN data ? 'valueSek' THEN (data->>'valueSek')::numeric ELSE value_sek END,
          booked_at = COALESCE(booked_at, (data->>'bookedAt')::timestamptz,
            CASE WHEN was_booked THEN now() END)
        FROM patches WHERE lead.submission_id = patches.id RETURNING lead.*)
        SELECT
          COALESCE((SELECT jsonb_agg(event_id) FROM (
            SELECT event_id FROM accepted
            UNION
            SELECT receipt.event_id FROM public.gesab_lead_progress_events AS receipt
            JOIN incoming ON receipt.event_id = (item->>'eventId')::uuid
              AND receipt.submission_id = (item->>'submissionId')::uuid
              AND receipt.payload_hash = item->>'hash'
          ) AS acknowledged), '[]'::jsonb) AS "acceptedEventIds",
          COALESCE((SELECT jsonb_agg(changed) FROM changed), '[]'::jsonb) AS leads
      `;
      return result;
    },

    // Convenience entry point; all progress writes share the same batch implementation.
    async updateLeadProgress(submissionId, progress) {
      const result = await createLeadStore(sql).updateLeadProgressBatch([
        { submissionId, progress, eventId: randomUUID() },
      ]);
      return result.leads[0] ?? null;
    },
  };
}

function defaultStore() { return createLeadStore(getLeadDatabase()); }
export const registerLead = (...args) => defaultStore().registerLead(...args);
export const markLeadEmailSent = (...args) => defaultStore().markLeadEmailSent(...args);
export const claimSheetLeads = (...args) => defaultStore().claimSheetLeads(...args);
export const acknowledgeSheetLeads = (...args) => defaultStore().acknowledgeSheetLeads(...args);
export const updateLeadProgress = (...args) => defaultStore().updateLeadProgress(...args);
export const updateLeadProgressBatch = (...args) => defaultStore().updateLeadProgressBatch(...args);
