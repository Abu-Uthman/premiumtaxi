const ENDPOINTS = ["/api/send-email", "/.netlify/functions/send-email"];

function setStatus(form, message, tone = "neutral") {
  const status = form.querySelector("[data-form-status]");
  if (!status) return;

  status.textContent = message;
  status.dataset.tone = tone;
}

async function postForm(form) {
  const body = JSON.stringify(Object.fromEntries(new FormData(form).entries()));
  let lastError = null;

  for (const endpoint of ENDPOINTS) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body,
      });

      if (response.ok) {
        return;
      }

      lastError = new Error(`Endpoint ${endpoint} returned ${response.status}`);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Unable to send form");
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-resend-form]").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const button = form.querySelector("button[type='submit']");
      const originalLabel = button?.textContent;

      setStatus(form, "Sending...", "neutral");
      if (button) {
        button.disabled = true;
        button.textContent = "Sending...";
      }

      try {
        await postForm(form);
        form.reset();
        setStatus(form, "Thanks. Your message has been sent.", "success");
      } catch {
        setStatus(form, "We could not send this online. Please call or email us directly.", "error");
      } finally {
        if (button) {
          button.disabled = false;
          button.textContent = originalLabel;
        }
      }
    });
  });
});
