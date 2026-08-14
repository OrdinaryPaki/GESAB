import { SERVICE_TITLES } from "./constants.mjs";

const WEBSITE_URL = "https://www.ges-ab.se";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function serviceTitle(service) {
  if (!service) return "";
  if (SERVICE_TITLES[service]) return SERVICE_TITLES[service];

  const words = service.replaceAll("-", " ").trim();
  return words ? `${words[0].toUpperCase()}${words.slice(1)}` : "";
}

function sourceLabel(source) {
  if (source === "contact") return "Kontaktsidan";
  if (source === "service") return "Tjänstesidan";
  return "Footer/Boka";
}

function formatDate(now) {
  return now.toLocaleDateString("sv-SE", {
    day: "numeric",
    month: "short",
    timeZone: "Europe/Stockholm",
  });
}

function internalSubject(inquiry, title, now) {
  const datedCustomer = `${inquiry.name} (${formatDate(now)})`;

  if (inquiry.source === "contact") {
    return `Ny förfrågan: ${title} – ${datedCustomer}`;
  }
  if (inquiry.source === "service") {
    return `Offertförfrågan: ${title} – ${datedCustomer}`;
  }
  return `Boka offert via hemsidan – ${datedCustomer}`;
}

function customerSubject(inquiry, title) {
  if (inquiry.source === "contact") {
    return `Tack för din förfrågan gällande ${title} - GESAB`;
  }
  if (inquiry.source === "service") {
    return `Tack för din offertförfrågan gällande ${title} - GESAB`;
  }
  return "Tack för din förfrågan - GESAB";
}

function row(label, value) {
  if (!value) return "";

  return `<tr><th style="padding:8px 12px;text-align:left;vertical-align:top;color:#415066">${escapeHtml(label)}</th><td style="padding:8px 12px;color:#142033">${escapeHtml(value)}</td></tr>`;
}

function internalBody(inquiry, title, contactInfo) {
  const safeEmail = escapeHtml(inquiry.email);
  const rows = [
    row("Namn", inquiry.name),
    `<tr><th style="padding:8px 12px;text-align:left;vertical-align:top;color:#415066">E-post</th><td style="padding:8px 12px"><a href="mailto:${safeEmail}" style="color:#0b63ce">${safeEmail}</a></td></tr>`,
    row("Telefon", inquiry.phone),
    row("Tjänst", title),
  ].join("");

  const text = [
    `Ny förfrågan via ${sourceLabel(inquiry.source)}`,
    "",
    `Namn: ${inquiry.name}`,
    `E-post: ${inquiry.email}`,
    inquiry.phone ? `Telefon: ${inquiry.phone}` : "",
    title ? `Tjänst: ${title}` : "",
    "",
    "Meddelande:",
    inquiry.message,
  ].filter((line, index, lines) => line || lines[index - 1] !== "").join("\n");

  const html = `<!doctype html><html lang="sv"><body style="margin:0;background:#f4f6f8;font-family:Arial,sans-serif;color:#142033"><div style="max-width:640px;margin:0 auto;padding:32px 20px"><div style="background:#fff;border-radius:12px;padding:32px"><p style="display:inline-block;margin:0 0 20px;padding:6px 10px;border-radius:999px;background:#eef2f6;font-size:12px;font-weight:700">INTERNT</p><h1 style="margin:0 0 12px;font-size:24px">Ny förfrågan</h1><p style="margin:0 0 24px;color:#415066">Inkommen via <strong>${escapeHtml(sourceLabel(inquiry.source))}</strong>.</p><table role="presentation" style="width:100%;border-collapse:collapse;background:#f8fafc;border-radius:8px">${rows}</table><h2 style="margin:28px 0 10px;font-size:18px">Meddelande</h2><div style="padding:16px;border-radius:8px;background:#f8fafc;white-space:pre-wrap">${escapeHtml(inquiry.message)}</div><p style="margin:28px 0 0"><a href="mailto:${safeEmail}" style="display:inline-block;padding:12px 18px;border-radius:8px;background:#172033;color:#fff;text-decoration:none;font-weight:700">Svara via e-post</a></p></div><p style="margin:16px 0 0;text-align:center;color:#6b7280;font-size:12px">${escapeHtml(contactInfo.company)}</p></div></body></html>`;

  return { html, text };
}

function customerBody(inquiry, title, contactInfo) {
  const firstName = inquiry.name.split(/\s+/)[0] || inquiry.name;
  const serviceSentence = title
    ? ` gällande ${title}`
    : "";
  const safePhoneHref = escapeHtml(contactInfo.phonePrimaryHref);
  const safeEmail = escapeHtml(contactInfo.email);

  const text = [
    `Hej ${firstName},`,
    "",
    `Vi har tagit emot din förfrågan${serviceSentence}.`,
    "Vi går nu igenom dina uppgifter och återkommer inom kort för att diskutera nästa steg.",
    "",
    `Har du frågor redan nu? Ring ${contactInfo.phonePrimary} eller mejla ${contactInfo.email}.`,
    "",
    contactInfo.company,
    contactInfo.addressLine,
    WEBSITE_URL,
  ].join("\n");

  const html = `<!doctype html><html lang="sv"><body style="margin:0;background:#f4f6f8;font-family:Arial,sans-serif;color:#142033"><div style="max-width:640px;margin:0 auto;padding:32px 20px"><div style="background:#fff;border-radius:12px;padding:32px"><div style="margin:0 0 24px;font-size:28px;font-weight:800;letter-spacing:-1px">GESAB</div><h1 style="margin:0 0 20px;font-size:26px">Tack för din förfrågan!</h1><p>Hej ${escapeHtml(firstName)},</p><p>Vi har tagit emot din förfrågan${title ? ` gällande <strong>${escapeHtml(title)}</strong>` : ""}. Vi uppskattar att du vänder dig till oss på GESAB för ditt kommande projekt.</p><p>Vi går nu igenom dina uppgifter och återkommer inom kort för att diskutera nästa steg.</p><div style="margin:28px 0;padding:20px;border-radius:10px;background:#f8fafc"><p style="margin:0 0 14px">Har du frågor redan nu? Tveka inte att höra av dig.</p><a href="${safePhoneHref}" style="display:inline-block;padding:12px 18px;border-radius:8px;background:#172033;color:#fff;text-decoration:none;font-weight:700">Ring oss: ${escapeHtml(contactInfo.phonePrimary)}</a></div><div style="padding-top:20px;border-top:1px solid #e5e7eb;color:#596579;font-size:14px"><p><strong>${escapeHtml(contactInfo.company)}</strong><br>${escapeHtml(contactInfo.addressLine)}</p><p><a href="mailto:${safeEmail}" style="color:#0b63ce">${safeEmail}</a> · ${escapeHtml(contactInfo.phonePrimary)}</p><p><a href="${WEBSITE_URL}" style="color:#0b63ce">www.ges-ab.se</a></p></div></div></div></body></html>`;

  return { html, text };
}

export function buildInquiryEmails(inquiry, { contactInfo, now = new Date() }) {
  const title = serviceTitle(inquiry.service);
  const internalBodyContent = internalBody(inquiry, title, contactInfo);
  const customerBodyContent = customerBody(inquiry, title, contactInfo);

  return {
    internal: {
      from: `GESAB Hemsida <${contactInfo.email}>`,
      to: contactInfo.email,
      replyTo: inquiry.email,
      subject: internalSubject(inquiry, title, now),
      ...internalBodyContent,
    },
    customer: {
      from: `GESAB <${contactInfo.email}>`,
      to: inquiry.email,
      replyTo: contactInfo.email,
      subject: customerSubject(inquiry, title),
      ...customerBodyContent,
    },
  };
}

export function buildPreviewHeaders(
  { recipient, source },
  { contactEmail, now = new Date() },
) {
  const sampleInquiry = {
    source,
    name: "Anna Andersson",
    service: source === "contact" || source === "service"
      ? "badrumsrenovering"
      : "",
  };
  const title = serviceTitle(sampleInquiry.service);

  if (recipient === "customer") {
    return {
      from: `GESAB <${contactEmail}>`,
      to: "Anna Andersson <anna.andersson@example.com>",
      subject: source === "blog"
        ? "Tack för ditt meddelande - GESAB"
        : customerSubject(sampleInquiry, title),
    };
  }

  return {
    from: `GESAB Hemsida <${contactEmail}>`,
    to: `GESAB <${contactEmail}>`,
    subject: source === "blog"
      ? `Förfrågan via bloggen – ${sampleInquiry.name} (${formatDate(now)})`
      : internalSubject(sampleInquiry, title, now),
  };
}
