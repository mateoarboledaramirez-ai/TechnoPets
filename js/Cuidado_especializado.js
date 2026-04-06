function toggle(card) {
      const isOpen = card.classList.contains('open');
      document.querySelectorAll('.spec-card').forEach(c => c.classList.remove('open'));
      if (!isOpen) card.classList.add('open');
    }
