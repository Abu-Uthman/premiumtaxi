const RESEND_API_URL = "https://api.resend.com/emails";

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });
}

function nodeJson(response, status, body) {
  response.statusCode = status;
  response.setHeader("content-type", "application/json; charset=utf-8");
  response.end(JSON.stringify(body));
}

function clean(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function htmlEscape(value) {
  return clean(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderRows(fields) {
  return fields
    .filter(([, value]) => clean(value))
    .map(([label, value]) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;color:#666;width:190px;">${htmlEscape(label)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;color:#111;font-weight:600;">${htmlEscape(value)}</td>
      </tr>
    `)
    .join("");
}

async function readPayload(request) {
  if (request.body && typeof request.body === "object" && !(request.body instanceof ReadableStream)) {
    return request.body;
  }

  if (request.body && typeof request.body === "string") {
    return JSON.parse(request.body);
  }

  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return await request.json();
  }

  const form = await request.formData();
  return Object.fromEntries(form.entries());
}

async function handleRequest(request) {
  if (request.method !== "POST") {
    return json(405, { ok: false, message: "Method not allowed" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.BOOKING_EMAIL_TO || "booking@premiummaxicab.com.au";
  const from = process.env.RESEND_FROM_EMAIL || "Premium Maxi Taxi <onboarding@resend.dev>";

  if (!apiKey) {
    return json(500, { ok: false, message: "RESEND_API_KEY is not configured" });
  }

  const payload = await readPayload(request);
  const formType = clean(payload.form_type || "contact");
  const name = clean(payload.name);
  const email = clean(payload.email);
  const phone = clean(payload.phone);

  if (!name || !email) {
    return json(400, { ok: false, message: "Name and email are required" });
  }

  const isBooking = formType === "booking";
  const subject = isBooking
    ? `New taxi booking request from ${name}`
    : `New Premium Maxi Taxi enquiry from ${name}`;

  const rows = isBooking
    ? [
        ["Name", name],
        ["Phone", phone],
        ["Email", email],
        ["Service", payload.service],
        ["Date", payload.date],
        ["Pickup time", payload.time],
        ["Passengers", payload.passengers],
        ["Pickup", payload.pickup],
        ["Drop-off", payload.dropoff],
        ["Flight", payload.flight],
        ["Wheelchair / accessibility", payload.wheelchair],
        ["Notes", payload.message],
      ]
    : [
        ["Name", name],
        ["Phone", phone],
        ["Email", email],
        ["Subject", payload.subject],
        ["Message", payload.message],
      ];

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111;">
      <h1 style="font-size:22px;margin:0 0 16px;">${htmlEscape(subject)}</h1>
      <table style="border-collapse:collapse;width:100%;max-width:760px;border:1px solid #eee;">
        ${renderRows(rows)}
      </table>
      <p style="color:#777;font-size:13px;margin-top:18px;">Sent from premiummaxicab.com.au</p>
    </div>
  `;

  const resendResponse = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: email,
      subject,
      html,
    }),
  });

  if (!resendResponse.ok) {
    const error = await resendResponse.text();
    return json(502, { ok: false, message: "Resend failed", error });
  }

  return json(200, { ok: true, message: "Message sent" });
}

export default async function handler(request, response) {
  if (!response) {
    return handleRequest(request);
  }

  try {
    const result = await handleRequest(request);
    const body = await result.json();
    return nodeJson(response, result.status, body);
  } catch (error) {
    return nodeJson(response, 500, {
      ok: false,
      message: "Email handler failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
