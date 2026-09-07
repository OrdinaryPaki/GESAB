import { claimSheetPhoneClicks, acknowledgeSheetPhoneClicks } from '../../lib/phone-clicks/store.mjs';
import { handleLeadSync } from '../../lib/leads/sync-handler.mjs';
import { claimSheetLeads, acknowledgeSheetLeads, updateLeadProgressBatch } from '../../lib/leads/store.mjs';

export const runtime = 'nodejs';
export const preferredRegion = 'fra1';
export const dynamic = 'force-dynamic';

function sync(request) {
  return handleLeadSync(request, {
    secret:process.env.LEAD_SYNC_SECRET,
    store:{claimSheetPhoneClicks,acknowledgeSheetPhoneClicks,claimSheetLeads,acknowledgeSheetLeads,updateLeadProgressBatch},
  });
}
export const GET = sync;
export const POST = sync;
