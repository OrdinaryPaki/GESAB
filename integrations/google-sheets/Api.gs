/** Configure GESAB_API_URL and GESAB_SYNC_SECRET in Script Properties, then run setupGesabSync once as the workbook owner. */
function gesabRequest_(body, kind) {
  var properties = PropertiesService.getScriptProperties();
  var url = properties.getProperty('GESAB_API_URL');
  var secret = properties.getProperty('GESAB_SYNC_SECRET');
  if (url !== 'https://ges-ab.se/api/lead-sync' || !secret) throw new Error('Kontrollera synkinställningarna.');
  if (kind && kind !== 'phone_clicks') throw new Error('Ogiltig synktyp.');
  if (kind) url += '?kind=' + kind;
  var options = {method: body ? 'post' : 'get', headers: {Authorization: 'Bearer ' + secret}, muteHttpExceptions: true, followRedirects: false};
  if (body) { options.contentType = 'application/json'; options.payload = JSON.stringify(body); }
  var response;
  try { response = UrlFetchApp.fetch(url, options); } catch (_) { throw new Error('Servern kunde inte nås. Väntande ändringar behålls.'); }
  if (response.getResponseCode() < 200 || response.getResponseCode() >= 300) throw new Error('Synkfel HTTP ' + response.getResponseCode() + '. Väntande ändringar behålls.');
  try { return JSON.parse(response.getContentText()); } catch (_) { throw new Error('Ogiltigt serversvar. Väntande ändringar behålls.'); }
}

function gesabWithLock_(work) {
  var lock = LockService.getDocumentLock();
  if (!lock || !lock.tryLock(5000)) throw new Error('Synken är upptagen. Markera ändrade rader och kör skickaMarkeradeRader igen.');
  try { return work(); } finally { SpreadsheetApp.flush(); lock.releaseLock(); }
}

function gesabStatus_(message) {
  var overview = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Översikt');
  if (overview) overview.getRange('B4').setValue(message);
}
