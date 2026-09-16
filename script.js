(() => {
  const root = document.documentElement;
  const toggle = document.querySelector('.theme-toggle');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (!toggle) return;

  const updateThemeControl = () => {
    const dark = root.dataset.theme === 'dark';
    const label = `Switch to ${dark ? 'light' : 'dark'} theme`;
    toggle.setAttribute('aria-label', label);
    toggle.setAttribute('title', label);
    if (themeMeta) themeMeta.content = dark ? '#162536' : '#f4f1e9';
  };

  toggle.hidden = false;
  updateThemeControl();
  toggle.addEventListener('click', () => {
    const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = theme;
    try { localStorage.setItem('ma-theme', theme); } catch (_) {}
    updateThemeControl();
  });
})();
