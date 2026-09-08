import { handlePhoneClick } from '../../lib/phone-clicks/handler.mjs';
import { registerPhoneClick } from '../../lib/phone-clicks/store.mjs';
import { enforceContactBudget } from '../../lib/abuse/guard.mjs';
export const runtime = 'nodejs';
export const preferredRegion = 'fra1';
export const dynamic = 'force-dynamic';
export function POST(request) {
  return handlePhoneClick(request,{registerPhoneClick:async click => {
    await enforceContactBudget(request,'phone',click);
    return registerPhoneClick(click);
  }});
}
