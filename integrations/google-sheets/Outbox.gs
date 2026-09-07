function gesabOutbox_() {
  var book = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = book.getSheetByName('_Synk');
  if (!sheet) {
    sheet = book.insertSheet('_Synk');
    sheet.getRange(1, 1, 1, 3).setValues([['Händelse ID', 'Skapad', 'Ändring JSON']]);
    sheet.hideSheet();
  }
  return sheet;
}

function gesabQueueRange_(range) {
  var sheet = range.getSheet();
  if (sheet.getName() !== 'Förfrågningar' || range.getColumn() > 13 || range.getLastColumn() < 8) return;
  var first = Math.max(2, range.getRow()), last = Math.min(range.getLastRow(), sheet.getLastRow());
  for (var start = first; start <= last; start += 100) {
    (function (rowNumber, count) {
      gesabWithLock_(function () {
        var rows = sheet.getRange(rowNumber, 1, count, 13).getValues();
        var queued = [], bookedUpdates = [];
        rows.forEach(function (row, index) {
          if (!row[0]) return;
          var booked = row[11];
          if (row[7] === 'Bokat jobb' && !booked) { booked = new Date(); bookedUpdates.push([rowNumber + index, booked]); }
          var patch = {submissionId: String(row[0]), eventId: Utilities.getUuid(), progress: {status: String(row[7]), nextContact: gesabCalendarDate_(row[8]), owner: String(row[9] || ''), notes: String(row[10] || ''), bookedAt: gesabIso_(booked), valueSek: row[12] === '' ? null : Number(row[12])}};
          if (patch.progress.valueSek !== null && !isFinite(patch.progress.valueSek)) throw new Error('Affärsvärdet måste vara ett tal. Rätta raden och skicka den igen.');
          queued.push([patch.eventId, new Date(), JSON.stringify(patch)]);
        });
        if (!queued.length) return;
        var outbox = gesabOutbox_(), end = outbox.getLastRow();
        gesabEnsureRows_(outbox, end + queued.length);
        outbox.getRange(end + 1, 1, queued.length, 3).setValues(queued);
        SpreadsheetApp.flush();
        bookedUpdates.forEach(function (update) { sheet.getRange(update[0], 12).setValue(update[1]); });
        gesabStatus_('Ändringar väntar på synk.');
      });
    })(start, Math.min(100, last - start + 1));
  }
}

function gesabSendPending_() {
  var batch = gesabWithLock_(function () {
    var sheet = gesabOutbox_();
    var rows = sheet.getLastRow() > 1 ? sheet.getRange(2, 1, Math.min(100, sheet.getLastRow() - 1), 3).getValues() : [];
    while (rows.length && gesabProgressBytes_([rows[0]]) > 500 * 1024) {
      gesabArchiveRejected_([rows[0]], 'Ändringen är för stor att skicka. Rätta Förfrågningar och skicka raden igen.');
      sheet.deleteRow(2);
      rows.shift();
    }
    return gesabBoundedBatch_(rows);
  });
  if (!batch.length) return;
  var response = gesabRequest_({action: 'progress', patches: batch.map(function (row) { return JSON.parse(row[2]); })});
  if (!response.ok || !Array.isArray(response.acceptedEventIds)) throw new Error('Servern bekräftade inte ändringarna. Kön behålls.');
  var accepted = new Set(response.acceptedEventIds);
  var rejected = new Set((response.rejectedEvents || []).map(function (event) { return event.eventId; }));
  gesabWithLock_(function () {
    gesabArchiveRejected_(batch.filter(function (row) { return rejected.has(row[0]) && !accepted.has(row[0]); }));
    var sheet = gesabOutbox_();
    // Only this worker removes rows; edits append while HTTP runs. Remove bottom-up, and only confirmed events.
    for (var index = batch.length - 1; index >= 0; index--) {
      if (accepted.has(batch[index][0]) || rejected.has(batch[index][0])) sheet.deleteRow(index + 2);
    }
  });
  if (batch.some(function (row) { return !accepted.has(row[0]) && !rejected.has(row[0]); })) throw new Error('Vissa ändringar väntar fortfarande på serverns bekräftelse.');
}

function gesabArchiveRejected_(rows, reason) {
  if (!rows.length) return;
  var book = SpreadsheetApp.getActiveSpreadsheet(), archive = book.getSheetByName('Synkfel');
  if (!archive) { archive = book.insertSheet('Synkfel'); archive.getRange(1, 1, 1, 4).setValues([['Händelse ID', 'Skapad', 'Ändring JSON', 'Åtgärd']]); }
  var archived = [];
  rows.forEach(function (row) {
    var payload = String(row[2]), parts = Math.max(1, Math.ceil(payload.length / 40000));
    for (var part = 0; part < parts; part++) archived.push([row[0], row[1], gesabText_(payload.slice(part * 40000, (part + 1) * 40000)), (reason || 'Servern avvisade status, datum eller värde. Rätta Förfrågningar och skicka raden igen.') + (parts > 1 ? ' JSON-del ' + (part + 1) + '/' + parts : '')]);
  });
  var last = archive.getLastRow();
  gesabEnsureRows_(archive, last + archived.length);
  archive.getRange(last + 1, 1, archived.length, 4).setValues(archived);
  SpreadsheetApp.flush();
}

// 500 KiB leaves headroom below the server's 512 KiB request limit. Count actual UTF-8 bytes.
function gesabProgressBytes_(rows) {
  var payload = JSON.stringify({action: 'progress', patches: rows.map(function (row) { return JSON.parse(row[2]); })});
  return Utilities.newBlob(payload).getBytes().length;
}

function gesabBoundedBatch_(rows) {
  var selected = [], bytes = gesabProgressBytes_([]);
  for (var index = 0; index < rows.length; index++) {
    var patchBytes = Utilities.newBlob(JSON.stringify(JSON.parse(rows[index][2]))).getBytes().length;
    var nextBytes = bytes + patchBytes + (selected.length ? 1 : 0);
    if (nextBytes > 500 * 1024) break;
    selected.push(rows[index]);
    bytes = nextBytes;
  }
  return selected;
}
