document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menu-button');
  const navPanel = document.getElementById('nav-panel');
  const overlay = document.getElementById('overlay');
  if (!menuBtn || !navPanel || !overlay) return;

  menuBtn.setAttribute('role', 'button');
  menuBtn.setAttribute('tabindex', '0');
  menuBtn.setAttribute('aria-label', 'Open personal navigation');
  menuBtn.setAttribute('aria-controls', 'nav-panel');
  menuBtn.setAttribute('aria-expanded', 'false');
  navPanel.inert = true;

  function setMenu(open) {
    navPanel.classList.toggle('open', open);
    overlay.classList.toggle('active', open);
    navPanel.inert = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close personal navigation' : 'Open personal navigation');
    if (open) navPanel.querySelector('a')?.focus();
    else menuBtn.focus();
  }

  menuBtn.addEventListener('click', () => setMenu(!navPanel.classList.contains('open')));
  menuBtn.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setMenu(!navPanel.classList.contains('open'));
    }
  });
  overlay.addEventListener('click', () => setMenu(false));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navPanel.classList.contains('open')) setMenu(false);
    if (event.key === 'Tab' && navPanel.classList.contains('open')) {
      const stops = [menuBtn, ...navPanel.querySelectorAll('a')];
      const index = stops.indexOf(document.activeElement);
      if (event.shiftKey && index === 0) { event.preventDefault(); stops.at(-1).focus(); }
      else if (!event.shiftKey && index === stops.length - 1) { event.preventDefault(); menuBtn.focus(); }
    }
  });
});
