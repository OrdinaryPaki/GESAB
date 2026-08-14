# GESAB Form Email Delivery Design

## Goal

Make every existing website inquiry form send a real internal notification to `arijana@ges-ab.se` and a branded confirmation to the customer. The `/epost` route remains an intentional preview, but its addresses and message rules must match the real delivery flow.

## Current problem

The contact, appointment, and service quote forms stop the browser's normal submission, wait one second, and then show a success message. No request reaches a server and no email is sent. The preview separately hard-codes `info@gesab.se` and `noreply@gesab.se`, while the website's authoritative contact address is `arijana@ges-ab.se`.

## Chosen approach

Use the existing verified Resend account through the linked Vercel project. Store `RESEND_API_KEY` only in Vercel's server environment. A single Next.js API route accepts all form submissions and delegates validation, email-content creation, and Resend delivery to focused server modules.

This stateless server model can scale horizontally with Vercel. It does not place email credentials or delivery rules in browser components and avoids three independent implementations that could drift apart.

## Components and responsibilities

- `app/api/inquiries/route.js`: enforce request size/content type, read the request, return stable public success or error responses, and never expose provider details.
- `app/lib/inquiries/validation.mjs`: normalize and validate the shared submission contract. Allow only known form sources and bounded text fields.
- `app/lib/inquiries/email-content.mjs`: own subjects, preview text, plain text, and safe HTML for internal and customer messages.
- `app/lib/inquiries/delivery.js`: call Resend twice with deterministic idempotency keys and server-only configuration.
- `app/components/inquiry-submission.js`: one browser helper used by all forms to create a submission ID, call the API, and translate failures into a consistent UI result.
- Existing form components: retain presentation and local input state; provide their source and fields to the shared helper; show success only after the server confirms both required messages.
- `app/epost/page.js`: remain a preview and reuse the shared address/content rules wherever practical, with sample customer data.

## Data flow

1. A visitor submits one of the existing forms.
2. The browser adds a cryptographically random submission ID and sends a small JSON request to `/api/inquiries`.
3. The server rejects unknown sources, missing required values, invalid email addresses, oversized values, or a filled hidden honeypot field.
4. The server sends an internal notification to `arijana@ges-ab.se` from `GESAB Hemsida <arijana@ges-ab.se>`, with the customer's email as `Reply-To`.
5. The server sends the customer confirmation from `GESAB <arijana@ges-ab.se>`, with `arijana@ges-ab.se` as `Reply-To`.
6. Each message uses a deterministic Resend idempotency key based on the submission ID and message type. A safe retry cannot create duplicate copies.
7. Only after both provider requests are accepted does the API return success and the browser show the existing thank-you state.

## Form mapping

- Contact page: source `contact`; first name, last name, email, service, and message are required.
- Footer/home booking form: source `footer`; name, email, phone, and message are required.
- Service quote form: source `service`; name, email, phone, message, and the current service slug are required.
- The blog example stays available in `/epost`, but no blog submission path is added because the current website has no blog form.

## Error handling and safety

- Visitors receive a simple Swedish retry message; provider errors and credentials are not returned to the browser.
- Personal form contents are not written to application logs.
- Input values are trimmed, length-bounded, and HTML-escaped before rendering.
- A visually hidden honeypot field blocks basic automated spam without adding friction for real visitors.
- Missing Resend configuration is treated as a server error. The UI must not claim that an email was sent.
- Delivery is stateless and uses no in-memory queue or rate limiter, because those would break across multiple Vercel instances. Provider idempotency and bounded requests are structural protections; stronger traffic-rate controls can be added through Vercel Firewall without rewriting the form flow.

## Verification

- Unit tests cover normalization, source-specific validation, HTML escaping, address selection, subjects, and idempotency keys.
- Route tests cover success, invalid input, honeypot submissions, provider failure, and missing configuration without making real external calls.
- Component/source tests verify that all three forms use the shared submit helper and no simulated success timer remains.
- Run the complete test suite and a production build.
- Confirm `RESEND_API_KEY` exists for the intended Vercel environments.
- Send one controlled test submission and confirm both the internal message and customer confirmation are accepted by Resend. If credentials cannot be connected non-interactively, report that exact external setup step instead of claiming live delivery.

## Out of scope

- Changing the visual layout of forms or the `/epost` preview.
- Adding a database or CRM.
- Adding a blog form that does not currently exist.
- Reconfiguring unrelated mailboxes or DNS records.
