// ═══════════════════════════════════════════
// FAQ Accordion
// ═══════════════════════════════════════════
(function () {
  document.querySelectorAll('[data-faq]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = btn.getAttribute('data-faq');
      const answer = document.getElementById(`faq-answer-${idx}`);
      const chevron = btn.querySelector('.faq-chevron');

      const isOpen = answer.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-answer').forEach((a) => a.classList.remove('open'));
      document.querySelectorAll('.faq-chevron').forEach((c) => c.classList.remove('open'));

      // Toggle current
      if (!isOpen) {
        answer.classList.add('open');
        chevron.classList.add('open');
      }
    });
  });
})();
