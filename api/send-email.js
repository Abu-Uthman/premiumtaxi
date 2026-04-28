import crypto from "node:crypto";

const RESEND_API_URL = "https://api.resend.com/emails";
const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const MAX_PAYLOAD_BYTES = 12000;
const MIN_SUBMIT_SECONDS = 4;
const DUPLICATE_TTL_SECONDS = 15 * 60;
const IP_RATE_LIMIT = { limit: 8, windowSeconds: 10 * 60 };
const EMAIL_RATE_LIMIT = { limit: 3, windowSeconds: 30 * 60 };
const ALLOWED_FORM_TYPES = new Set(["booking", "contact"]);

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function nodeJson(response, status, body) {
  response.statusCode = status;
  response.setHeader("content-type", "application/json; charset=utf-8");
  response.setHeader("cache-control", "no-store");
  response.end(JSON.stringify(body));
}

function clean(value, maxLength = 500) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function htmlEscape(value) {
  return clean(value, 3000)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getHeader(request, name) {
  if (request.headers?.get) return request.headers.get(name);
  const value = request.headers?.[name.toLowerCase()] || request.headers?.[name];
  return Array.isArray(value) ? value[0] : value || "";
}

function getClientIp(request) {
  const forwardedFor = getHeader(request, "x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return (
    getHeader(request, "x-real-ip") ||
    request.socket?.remoteAddress ||
    request.connection?.remoteAddress ||
    "unknown"
  );
}

function fail(status, message) {
  return json(status, { ok: false, message });
}

function normalizeEmail(value) {
  return clean(value, 254).toLowerCase();
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) && value.length <= 254;
}

function isValidPhone(value, required = false) {
  if (!value) return !required;
  const digits = value.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15 && /^[+\d\s().-]+$/.test(value);
}

function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00+10:00`);
  if (Number.isNaN(date.valueOf())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
}

function isValidTime(value) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

function isAllowedOrigin(request) {
  const origin = getHeader(request, "origin");
  if (!origin) return true;

  const allowedOrigins = new Set([
    "https://www.premiummaxicab.com.au",
    "https://premiummaxicab.com.au",
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "",
    process.env.SITE_URL || "",
  ].filter(Boolean));

  if (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
    return true;
  }

  return allowedOrigins.has(origin);
}

function ensureUpstashConfigured() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    throw Object.assign(new Error("Rate limiting is not configured"), { status: 500 });
  }
}

async function readPayload(request) {
  if (request.body && typeof request.body === "object" && !(request.body instanceof ReadableStream)) {
    return request.body;
  }

  if (request.body && typeof request.body === "string") {
    if (Buffer.byteLength(request.body, "utf8") > MAX_PAYLOAD_BYTES) {
      throw Object.assign(new Error("Payload too large"), { status: 413 });
    }
    return JSON.parse(request.body);
  }

  const contentType = getHeader(request, "content-type") || "";

  if (contentType.includes("application/json")) {
    const text = await request.text();
    if (Buffer.byteLength(text, "utf8") > MAX_PAYLOAD_BYTES) {
      throw Object.assign(new Error("Payload too large"), { status: 413 });
    }
    return JSON.parse(text);
  }

  const form = await request.formData();
  const payload = Object.fromEntries(form.entries());
  const approxSize = Buffer.byteLength(JSON.stringify(payload), "utf8");
  if (approxSize > MAX_PAYLOAD_BYTES) {
    throw Object.assign(new Error("Payload too large"), { status: 413 });
  }
  return payload;
}

async function upstashCommand(command) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return undefined;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(command),
  });

  if (!response.ok) {
    throw new Error(`Upstash command failed with ${response.status}`);
  }

  const body = await response.json();
  return body.result;
}

async function enforceRateLimit(key, limit, windowSeconds) {
  const count = await upstashCommand(["INCR", key]);
  if (count === undefined) return;
  if (Number(count) === 1) {
    await upstashCommand(["EXPIRE", key, String(windowSeconds)]);
  }
  if (Number(count) > limit) {
    throw Object.assign(new Error("Too many submissions"), { status: 429 });
  }
}

async function enforceDuplicate(payload) {
  const fingerprint = [
    payload.formType,
    payload.email,
    payload.phone,
    payload.name,
    payload.pickup,
    payload.dropoff,
    payload.date,
    payload.time,
    payload.message,
  ].join("|").toLowerCase();
  const hash = crypto.createHash("sha256").update(fingerprint).digest("hex");
  const result = await upstashCommand(["SET", `lead:duplicate:${hash}`, "1", "EX", String(DUPLICATE_TTL_SECONDS), "NX"]);
  if (result === undefined) return;
  if (result !== "OK") {
    throw Object.assign(new Error("Duplicate submission"), { status: 409 });
  }
}

async function verifyTurnstile(token, ip) {
  const secret = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
  if (!secret) {
    throw Object.assign(new Error("Turnstile is not configured"), { status: 500 });
  }
  if (!token) {
    throw Object.assign(new Error("Security check missing"), { status: 400 });
  }

  const formData = new URLSearchParams();
  formData.set("secret", secret);
  formData.set("response", token);
  if (ip && ip !== "unknown") formData.set("remoteip", ip);

  const response = await fetch(TURNSTILE_VERIFY_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: formData,
  });
  const result = await response.json();

  if (!result.success) {
    throw Object.assign(new Error("Security check failed"), { status: 400 });
  }
}

function validateSubmission(payload) {
  const formType = clean(payload.form_type || payload.formType || "contact", 30);
  const name = clean(payload.name, 120);
  const email = normalizeEmail(payload.email);
  const phone = clean(payload.phone, 40);
  const message = clean(payload.message, 3000);
  const startedAt = Number(payload.form_started_at || 0);

  if (!ALLOWED_FORM_TYPES.has(formType)) {
    throw Object.assign(new Error("Invalid form type"), { status: 400 });
  }
  if (payload.company || payload.website_url) {
    throw Object.assign(new Error("Spam rejected"), { status: 400 });
  }
  if (!startedAt || Date.now() - startedAt < MIN_SUBMIT_SECONDS * 1000) {
    throw Object.assign(new Error("Please wait a moment before submitting"), { status: 400 });
  }
  if (!name || name.length < 2 || !email || !isValidEmail(email)) {
    throw Object.assign(new Error("Name and valid email are required"), { status: 400 });
  }

  if (formType === "booking") {
    const passengers = Number(payload.passengers);
    const booking = {
      formType,
      name,
      email,
      phone,
      service: clean(payload.service, 120),
      date: clean(payload.date, 20),
      time: clean(payload.time, 20),
      passengers: clean(payload.passengers, 4),
      pickup: clean(payload.pickup, 260),
      dropoff: clean(payload.dropoff, 260),
      flight: clean(payload.flight, 80),
      wheelchair: clean(payload.wheelchair, 80),
      message,
      turnstileToken: clean(payload["cf-turnstile-response"] || payload.turnstile_token, 3000),
    };

    if (!isValidPhone(phone, true) || !booking.service || !isValidDate(booking.date) || !isValidTime(booking.time)) {
      throw Object.assign(new Error("Valid booking details are required"), { status: 400 });
    }
    if (!Number.isInteger(passengers) || passengers < 1 || passengers > 13) {
      throw Object.assign(new Error("Passenger count must be between 1 and 13"), { status: 400 });
    }
    if (!booking.pickup || !booking.dropoff) {
      throw Object.assign(new Error("Pickup and drop-off are required"), { status: 400 });
    }
    return booking;
  }

  const contact = {
    formType,
    name,
    email,
    phone,
    subject: clean(payload.subject, 120),
    message,
    turnstileToken: clean(payload["cf-turnstile-response"] || payload.turnstile_token, 3000),
  };

  if (!isValidPhone(phone, false) || !contact.subject || !contact.message || contact.message.length < 8) {
    throw Object.assign(new Error("Valid enquiry details are required"), { status: 400 });
  }

  return contact;
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

function renderEmailShell(title, content) {
  return `
    <div style="margin:0;padding:0;background:#f6f7f8;">
      <div style="max-width:720px;margin:0 auto;padding:24px 14px;font-family:Arial,sans-serif;line-height:1.55;color:#111;">
        <div style="background:#111;padding:18px 22px;border-radius:12px 12px 0 0;">
          <div style="color:#d4af37;font-size:13px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;">Premium Maxi Taxi Melbourne</div>
          <h1 style="color:#fff;font-size:22px;line-height:1.25;margin:6px 0 0;">${htmlEscape(title)}</h1>
        </div>
        <div style="background:#fff;border:1px solid #ececec;border-top:0;border-radius:0 0 12px 12px;padding:24px;">
          ${content}
          <p style="color:#777;font-size:13px;margin:22px 0 0;">Sent from premiummaxicab.com.au</p>
        </div>
      </div>
    </div>
  `;
}

function getRows(payload) {
  return payload.formType === "booking"
    ? [
        ["Name", payload.name],
        ["Phone", payload.phone],
        ["Email", payload.email],
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
        ["Name", payload.name],
        ["Phone", payload.phone],
        ["Email", payload.email],
        ["Subject", payload.subject],
        ["Message", payload.message],
      ];
}

async function sendResendEmail({ apiKey, from, to, bcc, replyTo, subject, html }) {
  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      bcc,
      reply_to: replyTo,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend failed with ${response.status}: ${await response.text()}`);
  }
}

async function handleRequest(request) {
  if (request.method !== "POST") {
    return fail(405, "Method not allowed");
  }
  if (!isAllowedOrigin(request)) {
    return fail(403, "Request origin is not allowed");
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.BOOKING_EMAIL_TO || "awaledev36@gmail.com";
  const from = process.env.RESEND_FROM_EMAIL || "Premium Maxi Taxi Melbourne <book@premiummaxicab.com.au>";
  const monitoringRecipient = "awaledev36@gmail.com";

  if (!apiKey) {
    return fail(500, "Email service is not configured");
  }

  const clientIp = getClientIp(request);
  const rawPayload = await readPayload(request);
  const payload = validateSubmission(rawPayload);

  await verifyTurnstile(payload.turnstileToken, clientIp);
  ensureUpstashConfigured();
  await enforceRateLimit(`lead:rate:ip:${clientIp}`, IP_RATE_LIMIT.limit, IP_RATE_LIMIT.windowSeconds);
  await enforceRateLimit(`lead:rate:email:${payload.email}`, EMAIL_RATE_LIMIT.limit, EMAIL_RATE_LIMIT.windowSeconds);
  await enforceDuplicate(payload);

  const isBooking = payload.formType === "booking";
  const internalSubject = isBooking
    ? `New taxi booking request from ${payload.name}`
    : `New Premium Maxi Taxi enquiry from ${payload.name}`;
  const customerSubject = isBooking
    ? "We received your Premium Maxi Taxi booking request"
    : "We received your Premium Maxi Taxi enquiry";

  const internalHtml = renderEmailShell(
    internalSubject,
    `
      <p style="margin-top:0;">A new ${isBooking ? "booking request" : "enquiry"} has been submitted from the website.</p>
      <table style="border-collapse:collapse;width:100%;border:1px solid #eee;">
        ${renderRows(getRows(payload))}
      </table>
    `
  );

  const customerHtml = renderEmailShell(
    customerSubject,
    `
      <p style="margin-top:0;">Hi ${htmlEscape(payload.name)},</p>
      <p>Thank you for contacting Premium Maxi Taxi Melbourne. We have received your ${isBooking ? "booking request" : "enquiry"} and our team will review the details supplied.</p>
      <p>This email confirms receipt of your request. It is not a final booking confirmation. For urgent or immediate travel, please call us directly.</p>
      <table style="border-collapse:collapse;width:100%;border:1px solid #eee;margin-top:18px;">
        ${renderRows(getRows(payload))}
      </table>
      <p style="margin-bottom:0;">Kind regards,<br><strong>Premium Maxi Taxi Melbourne</strong></p>
    `
  );

  await sendResendEmail({
    apiKey,
    from,
    to,
    bcc: to === monitoringRecipient ? undefined : monitoringRecipient,
    replyTo: payload.email,
    subject: internalSubject,
    html: internalHtml,
  });

  await sendResendEmail({
    apiKey,
    from,
    to: payload.email,
    replyTo: to,
    subject: customerSubject,
    html: customerHtml,
  });

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
    const status = error?.status || 500;
    const publicMessage =
      status >= 500
        ? "We could not send this online. Please call or email us directly."
        : error instanceof Error
          ? error.message
          : "Invalid request";

    return nodeJson(response, status, {
      ok: false,
      message: publicMessage,
    });
  }
}
