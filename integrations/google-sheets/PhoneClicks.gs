function gesabPhoneClickRow_(click) {
  var a = click.attribution || {};
  return [gesabText_(click.event_id), gesabDate_(click.created_at), gesabText_(click.page), gesabText_(click.phone),
    'Telefonklick (inte bekräftat samtal)', gesabText_(a.campaignid || a.utm_campaign), gesabText_(a.adgroupid),
    gesabText_(a.creative), gesabText_(a.gclid), gesabText_(a.gbraid), gesabText_(a.wbraid),
    a.consentGranted === true ? 'Ja' : 'Nej', gesabDate_(a.consentAt), gesabText_(a.landingPage)].concat(gesabTrafficCells_(a));
}
function gesabAppendPhoneClicks_(clicks) {
  return gesabAppendRecords_(clicks, 'Telefonklick', 'event_id', gesabPhoneClickRow_, 17);
}
function gesabSyncPhoneClicks_() {
  var incoming = gesabRequest_(null, 'phone_clicks');
  var ids = gesabAppendPhoneClicks_(incoming.phoneClicks);
  if (!ids.length) return;
  if (!incoming.leaseToken) throw new Error('Serverns synknyckel för telefonklick saknas.');
  var ack = gesabRequest_({action:'ack',kind:'phone_clicks',leaseToken:incoming.leaseToken,ids:ids});
  if (!ack.ok || !Array.isArray(ack.ids) || ids.some(function (id) { return ack.ids.indexOf(id) === -1; })) {
    throw new Error('Telefonklick sparades i bladet men serverns bekräftelse väntar.');
  }
}
