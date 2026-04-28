const FORM_ENDPOINT = "/api/send-email";

function setStatus(form, message, tone = "neutral") {
  const status = form.querySelector("[data-form-status]");
  if (!status) return;

  status.textContent = message;
  status.dataset.tone = tone;
}

async function postForm(form) {
  const body = JSON.stringify(Object.fromEntries(new FormData(form).entries()));

  const response = await fetch(FORM_ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.message || `Email endpoint returned ${response.status}`);
  }
}

function getTurnstileToken(form) {
  return form.querySelector("[name='cf-turnstile-response']")?.value || "";
}

function resetTurnstile(form) {
  const widget = form.querySelector(".cf-turnstile");
  if (!widget || !window.turnstile) return;
  window.turnstile.reset(widget);
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-resend-form]").forEach((form) => {
    const startedAt = form.querySelector("[name='form_started_at']");
    if (startedAt) startedAt.value = String(Date.now());

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const button = form.querySelector("button[type='submit']");
      const originalLabel = button?.textContent;

      if (!getTurnstileToken(form)) {
        setStatus(form, "Please complete the security check before sending.", "error");
        return;
      }

      setStatus(form, "Sending...", "neutral");
      if (button) {
        button.disabled = true;
        button.textContent = "Sending...";
      }

      try {
        await postForm(form);
        form.reset();
        if (startedAt) startedAt.value = String(Date.now());
        resetTurnstile(form);
        setStatus(form, "Thanks. We received your request and sent a confirmation email.", "success");
      } catch (error) {
        resetTurnstile(form);
        setStatus(form, error.message || "We could not send this online. Please call or email us directly.", "error");
      } finally {
        if (button) {
          button.disabled = false;
          button.textContent = originalLabel;
        }
      }
    });
  });
});
