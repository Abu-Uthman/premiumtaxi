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
    throw new Error(`Email endpoint returned ${response.status}`);
  }
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
