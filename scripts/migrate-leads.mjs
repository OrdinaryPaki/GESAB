import { readFile } from 'node:fs/promises';
import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is missing.');
const sql = neon(process.env.DATABASE_URL);
// These reviewed migrations contain simple DDL only, without procedural bodies.
const files = ['001_leads.sql','002_lead_progress_events.sql','003_phone_clicks.sql'];
if (process.argv.includes('--apply')) {
  const statements = [];
  for (const file of files) {
    const source = await readFile(new URL(`../migrations/${file}`,import.meta.url),'utf8');
    statements.push(...source.replace(/^BEGIN;|^COMMIT;/gm,'').split(';').map(s=>s.trim()).filter(Boolean));
  }
  await sql.transaction(statements.map(statement => sql.query(statement,[])));
  console.log('All lead and phone-click migrations applied in one transaction.');
}
const [result] = await sql`
  SELECT to_regclass('public.gesab_phone_clicks') IS NOT NULL AS phone_clicks_table,
    to_regclass('public.gesab_leads') IS NOT NULL AS leads_table,
    to_regclass('public.gesab_lead_progress_events') IS NOT NULL AS event_table,
    EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'gesab_leads_pending_sheet_idx') AS pending_index
`;
console.log(JSON.stringify(result));
if (!result.phone_clicks_table || !result.leads_table || !result.event_table || !result.pending_index) process.exitCode = 1;
