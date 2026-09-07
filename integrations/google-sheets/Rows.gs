function gesabText_(value) {
  var text = value == null ? '' : String(value);
  return /^[=+\-@\s\x00-\x1f]/.test(text) ? "'" + text : text;
}

function gesabDate_(value) {
  if (!value) return '';
  var date = value instanceof Date ? value : new Date(value);
  if (isNaN(date.getTime())) throw new Error('Ogiltigt datum. Kontrollera datumkolumnerna.');
  return date;
}

function gesabIso_(value) { var date = gesabDate_(value); return date ? date.toISOString() : null; }

function gesabLeadRow_(lead) {
  var inquiry = lead.inquiry || {}, attribution = lead.attribution || {};
  return [gesabText_(lead.submission_id), gesabDate_(lead.created_at), gesabText_(inquiry.name), gesabText_(inquiry.phone), gesabText_(inquiry.email), gesabText_(inquiry.service), gesabText_(inquiry.message), gesabText_(lead.status || 'Ny'), gesabDate_(lead.next_contact), gesabText_(lead.owner), gesabText_(lead.notes), gesabDate_(lead.booked_at), lead.value_sek == null ? '' : Number(lead.value_sek), gesabText_(inquiry.source), gesabText_(attribution.campaignid || attribution.utm_campaign), gesabText_(attribution.adgroupid), gesabText_(attribution.creative), gesabText_(attribution.gclid), gesabText_(attribution.gbraid), gesabText_(attribution.wbraid), attribution.consentGranted === true ? 'Ja' : 'Nej', gesabDate_(attribution.consentAt), gesabText_(attribution.landingPage)].concat(gesabTrafficCells_(attribution));
}

function gesabEnsureRows_(sheet, lastRow) {
  if (lastRow > 350000) throw new Error('Arbetsboken behöver arkiveras innan fler rader kan läggas till.');
  if (lastRow > sheet.getMaxRows()) sheet.insertRowsAfter(sheet.getMaxRows(), lastRow - sheet.getMaxRows());
}

function gesabAppendLeads_(leads) {
  return gesabAppendRecords_(leads, 'Förfrågningar', 'submission_id', gesabLeadRow_, 26);
}

function gesabAppendRecords_(records, tab, idKey, toRow, width) {
  if (!Array.isArray(records) || records.length > 100) throw new Error('Ogiltigt antal poster från servern.');
  if (!records.length) return [];
  return gesabWithLock_(function () {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(tab);
    if (!sheet) throw new Error('Fliken ' + tab + ' saknas.');
    var last = sheet.getLastRow();
    if (last > 100001) throw new Error('Arbetsboken behöver arkiveras.');
    var existing = new Set(last > 1 ? sheet.getRange(2, 1, last - 1, 1).getValues().map(function (row) { return String(row[0]); }) : []);
    var rows = [], ids = [];
    records.forEach(function (record) {
      var id = record[idKey];
      if (typeof id !== 'string' || !id) throw new Error('Posten saknar ID.');
      ids.push(id);
      if (!existing.has(id)) { rows.push(toRow(record)); existing.add(id); }
    });
    if (rows.length) {
      if (last + rows.length > 100001) throw new Error('Arbetsboken behöver arkiveras innan fler poster kan synkas.');
      gesabEnsureRows_(sheet, last + rows.length);
      // Native table column types own display formats; write only typed values here.
      sheet.getRange(last + 1, 1, rows.length, width).setValues(rows);
    }
    return ids;
  });
}

function gesabCalendarDate_(value) {
  if (!value) return null;
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  return Utilities.formatDate(gesabDate_(value), 'Europe/Stockholm', 'yyyy-MM-dd');
}


function gesabTrafficCells_(attribution) {
  var traffic = attribution.traffic || {};
  return [gesabText_(traffic.channel || 'Ej registrerad'), gesabText_(traffic.source), gesabText_(traffic.campaign)];
}
