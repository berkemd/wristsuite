(() => {
  const form = document.getElementById("sample-question");
  const feedback = document.getElementById("sample-feedback");
  const status = document.getElementById("sample-answer-status");
  const retry = document.getElementById("sample-retry");
  const fallback = document.getElementById("sample-static-answer");
  if (!form || !feedback || !status || !retry || !fallback) return;

  const firstAnswer = form.querySelector('input[name="sample-answer"]');
  if (!firstAnswer) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const selected = form.querySelector('input[name="sample-answer"]:checked');
    if (!selected) {
      form.reportValidity();
      return;
    }
    status.textContent =
      selected.value === "macrophages"
        ? "Yes — macrophages."
        : "Best answer: macrophages.";
    form.hidden = true;
    feedback.hidden = false;
    feedback.focus();
  });

  retry.addEventListener("click", () => {
    form.reset();
    feedback.hidden = true;
    form.hidden = false;
    firstAnswer.focus();
  });

  fallback.hidden = true;
  form.hidden = false;
})();
