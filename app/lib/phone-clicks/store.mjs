import { getLeadDatabase } from '../leads/database.mjs';
import { createSheetLeaseStore } from '../sheet-sync/leases.mjs';
import { isUuid } from '../leads/progress-validation.mjs';
export function createPhoneClickStore(sql) {
  const leases = createSheetLeaseStore(sql,'phone_clicks');
  return {
    async registerPhoneClick({eventId,phone,page,attribution={}}) {
      if (!isUuid(eventId)) throw new TypeError('Expected a UUID.');
      const [record] = await sql`INSERT INTO public.gesab_phone_clicks (event_id, phone, page, attribution)
        VALUES (${eventId}::uuid, ${phone}, ${page}, ${JSON.stringify(attribution)}::jsonb)
        ON CONFLICT (event_id) DO UPDATE SET event_id = gesab_phone_clicks.event_id RETURNING *`;
      if (record.phone !== phone || record.page !== page) {
        const error = new Error('Event ID already belongs to a different click.');
        error.name = 'PhoneClickConflictError'; throw error;
      }
      return record;
    },
    claimSheetPhoneClicks: leases.claim,
    acknowledgeSheetPhoneClicks: leases.acknowledge,
  };
}
const store = () => createPhoneClickStore(getLeadDatabase());
export const registerPhoneClick = (...args) => store().registerPhoneClick(...args);
export const claimSheetPhoneClicks = (...args) => store().claimSheetPhoneClicks(...args);
export const acknowledgeSheetPhoneClicks = (...args) => store().acknowledgeSheetPhoneClicks(...args);
