import { isUuid } from '../leads/progress-validation.mjs';
const TABLES = {leads:['gesab_leads','submission_id'],phone_clicks:['gesab_phone_clicks','event_id']};
const uuid = value => { if (!isUuid(value)) throw new TypeError('Expected a UUID.'); };

// Only fixed, reviewed table names enter SQL; all request values stay parameters.
export function createSheetLeaseStore(sql, kind) {
  if (!Object.hasOwn(TABLES,kind)) throw new TypeError('Unknown sync kind.');
  const [table,id] = TABLES[kind];
  return {
    async claim({limit=50,leaseToken}) {
      if (!Number.isInteger(limit) || limit < 1 || limit > 100) throw new RangeError('Batch limit must be between 1 and 100.');
      uuid(leaseToken);
      return sql.query(`WITH pending AS (
        SELECT ${id} FROM public.${table} WHERE sheet_synced_at IS NULL
          AND (sheet_lease_expires_at IS NULL OR sheet_lease_expires_at <= now())
        ORDER BY created_at, ${id} LIMIT $1 FOR UPDATE SKIP LOCKED
      ) UPDATE public.${table} AS record SET sheet_lease_token = $2::uuid,
        sheet_lease_expires_at = now() + interval '5 minutes'
      FROM pending WHERE record.${id} = pending.${id} RETURNING record.*`,[limit,leaseToken]);
    },
    async acknowledge({leaseToken,ids}) {
      uuid(leaseToken);
      if (!Array.isArray(ids) || ids.length > 100) throw new RangeError('At most 100 IDs are allowed.');
      ids.forEach(uuid);
      if (!ids.length) return [];
      return sql.query(`UPDATE public.${table} SET sheet_synced_at = COALESCE(sheet_synced_at, now()),
        sheet_lease_token = NULL, sheet_lease_expires_at = NULL
        WHERE sheet_lease_token = $1::uuid AND ${id} IN (
          SELECT value::uuid FROM jsonb_array_elements_text($2::jsonb)) RETURNING ${id}`,[leaseToken,JSON.stringify(ids)]);
    },
  };
}
