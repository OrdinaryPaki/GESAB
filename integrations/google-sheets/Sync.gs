/** Bound script only. Paste these .gs files into Extensions > Apps Script; show manifest and copy appsscript.json. */
function setupGesabSync() {
  SpreadsheetApp.getActiveSpreadsheet().setSpreadsheetTimeZone('Europe/Stockholm');
  gesabWithLock_(gesabOutbox_);
  var book = SpreadsheetApp.getActiveSpreadsheet(), triggers = ScriptApp.getProjectTriggers();
  if (!triggers.some(function (trigger) { return trigger.getHandlerFunction() === 'synkaGesab' && trigger.getEventType() === ScriptApp.EventType.CLOCK; })) ScriptApp.newTrigger('synkaGesab').timeBased().everyMinutes(5).create();
  if (!triggers.some(function (trigger) { return trigger.getHandlerFunction() === 'gesabOnEdit' && trigger.getEventType() === ScriptApp.EventType.ON_EDIT && trigger.getTriggerSourceId() === book.getId(); })) ScriptApp.newTrigger('gesabOnEdit').forSpreadsheet(book).onEdit().create();
  synkaGesab();
}

function gesabOnEdit(event) {
  if (!event || !event.range) return;
  try { gesabQueueRange_(event.range); } catch (error) { gesabStatus_(error.message); throw error; }
}

/** Recovery after a reported edit-trigger failure: select affected H:M rows, then run this function. */
function skickaMarkeradeRader() {
  try { gesabQueueRange_(SpreadsheetApp.getActiveRange()); } catch (error) { gesabStatus_(error.message); throw error; }
  synkaGesab();
}

function synkaGesab() {
  // Serialize HTTP workers separately so document edits can still enter the durable outbox.
  var worker = LockService.getScriptLock();
  if (!worker.tryLock(5000)) return;
  try {
    var incoming = gesabRequest_();
    var ids = gesabAppendLeads_(incoming.leads);
    if (ids.length) {
      if (!incoming.leaseToken) throw new Error('Serverns synknyckel saknas.');
      var acknowledgment = gesabRequest_({action: 'ack', leaseToken: incoming.leaseToken, ids: ids});
      if (!acknowledgment.ok || !Array.isArray(acknowledgment.ids) || ids.some(function (id) { return acknowledgment.ids.indexOf(id) === -1; })) throw new Error('Alla förfrågningar sparades i bladet men serverns bekräftelse väntar.');
    }
    gesabSendPending_();
    gesabSyncPhoneClicks_();
    gesabWithLock_(function () {
      var pending = gesabOutbox_().getLastRow() - 1;
      var errors = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Synkfel');
      if (errors && errors.getLastRow() > 1) { gesabStatus_('Åtgärd krävs: se Synkfel. ' + pending + ' ändringar väntar.'); return; }
      gesabStatus_(pending ? pending + ' ändringar väntar på synk.' : 'Synkad ' + Utilities.formatDate(new Date(), 'Europe/Stockholm', 'yyyy-MM-dd HH:mm'));
    });
  } catch (error) { gesabStatus_(error.message); throw error; } finally { worker.releaseLock(); }
}
