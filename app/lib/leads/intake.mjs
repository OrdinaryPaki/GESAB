// Save first. Sheets synchronization never runs on the visitor's request.
export async function saveAndDeliverLead(inquiry, attribution, { store, deliver }) {
  const lead = await store.registerLead(inquiry, attribution);
  if (lead.email_sent_at) return;
  await deliver(inquiry);
  await store.markLeadEmailSent(inquiry.submissionId);
}
