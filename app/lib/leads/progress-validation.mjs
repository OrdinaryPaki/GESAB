export const LEAD_STATUSES = ['Ny', 'Kontaktad', 'Offert skickad', 'Bokat jobb', 'Avböjd', 'Ej relevant'];
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const isUuid = value => typeof value === 'string' && UUID.test(value);
const FIELDS = new Set(['status', 'nextContact', 'owner', 'notes', 'bookedAt', 'valueSek']);

function validDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0,10) === value;
}

export function validateProgressBatch(patches, now = Date.now()) {
  if (!Array.isArray(patches) || patches.length < 1 || patches.length > 100) return null;
  const eventIds = new Set();
  for (const patch of patches) {
    if (!patch || !isUuid(patch.submissionId) || !isUuid(patch.eventId) || eventIds.has(patch.eventId)) return null;
    eventIds.add(patch.eventId);
    const p = patch.progress;
    if (!p || typeof p !== 'object' || Array.isArray(p) || !Object.keys(p).length
      || Object.keys(p).some(key => !FIELDS.has(key))) return null;
    if ('status' in p && !LEAD_STATUSES.includes(p.status)) return null;
    if ('nextContact' in p && p.nextContact !== null && !validDate(p.nextContact)) return null;
    for (const [key,max] of [['owner',120],['notes',4000]]) {
      if (key in p && p[key] !== null && (typeof p[key] !== 'string' || p[key].length > max)) return null;
    }
    if ('valueSek' in p && p.valueSek !== null && (typeof p.valueSek !== 'number'
      || !Number.isFinite(p.valueSek) || p.valueSek < 0 || p.valueSek >= 1e12)) return null;
    if ('bookedAt' in p && p.bookedAt !== null) {
      if (typeof p.bookedAt !== 'string' || !/^\d{4}-\d{2}-\d{2}T/.test(p.bookedAt)) return null;
      const time = Date.parse(p.bookedAt);
      if (!Number.isFinite(time) || time > now + 300000 || time < Date.UTC(2020,0,1)) return null;
    }
  }
  return patches.map(({submissionId,eventId,progress}) => ({submissionId,eventId,progress}));
}
