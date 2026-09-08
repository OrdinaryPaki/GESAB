import {getLeadDatabase} from '../leads/database.mjs';
export function createAbuseStore(sql) {
  return {
    async admit({kind,eventId,fingerprint,attempts,budgets}) {
      const [row] = await sql`SELECT public.gesab_admit_contact(${kind},${eventId}::uuid,${fingerprint},${JSON.stringify(attempts)}::jsonb,${JSON.stringify(budgets)}::jsonb) AS decision`;
      if (typeof row?.decision?.allowed !== 'boolean') throw new Error('Admission unavailable');
      return row.decision;
    },
  };
}
export const admitContact = args => createAbuseStore(getLeadDatabase()).admit(args);
