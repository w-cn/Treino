const key = 'meuTreino.ui.v1:' + location.pathname;
export function readPreferences() {
  try { return JSON.parse(localStorage.getItem(key)) || {}; } catch { return {}; }
}
export function savePreferences(update) {
  try { localStorage.setItem(key, JSON.stringify({ ...readPreferences(), ...update })); } catch { /* Hash keeps the current page available on reload. */ }
}

export function setupNavigation(render) {
  const buttons = [...document.querySelectorAll('.sidebar-nav [data-view]')];
  const views = new Set(buttons.map(b => b.dataset.view));
  const toggle = document.getElementById('sidebarToggle');
  const nav = document.getElementById('sidebarNav');
  const backdrop = document.getElementById('sidebarBackdrop');
  const mobile = matchMedia('(max-width: 700px)');
  let expanded = false;
  function expand(value) {
    expanded = value;
    document.body.classList.toggle('sidebar-expanded', value);
    toggle.setAttribute('aria-expanded', String(value));
    toggle.setAttribute('aria-label', value ? 'Recolher menu' : 'Expandir menu');
    nav.inert = !value;
    document.getElementById('mainContent').inert = value;
    backdrop.hidden = !value;
  }
  function go(id, push = true) {
    if (!views.has(id)) id = 'inicioView';
    if (location.hash !== '#' + id) history[push ? 'pushState' : 'replaceState'](null, '', '#' + id);
    savePreferences({ view: id });
    buttons.forEach(button => {
      const active = button.dataset.view === id;
      button.classList.toggle('active', active);
      if (active) button.setAttribute('aria-current', 'page'); else button.removeAttribute('aria-current');
    });
    document.querySelectorAll('.view').forEach(view => view.classList.toggle('active', view.id === id));
    document.getElementById('currentPageTitle').textContent = buttons.find(b => b.dataset.view === id).getAttribute('aria-label');
    render(id);
    expand(false);
  }
  buttons.forEach(button => button.onclick = () => go(button.dataset.view));
  toggle.onclick = () => expand(!expanded);
  backdrop.onclick = () => { expand(false); toggle.focus(); };
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && expanded) { expand(false); toggle.focus(); }
    if (event.key === 'Tab' && expanded) {
      const controls = [toggle, ...buttons];
      if (event.shiftKey && document.activeElement === controls[0]) { event.preventDefault(); controls.at(-1).focus(); }
      else if (!event.shiftKey && document.activeElement === controls.at(-1)) { event.preventDefault(); toggle.focus(); }
    }
  });
  mobile.addEventListener('change', () => expand(false));
  window.addEventListener('popstate', () => go(location.hash.slice(1), false));
  window.addEventListener('hashchange', () => go(location.hash.slice(1), false));
  expand(false);
  go(location.hash.slice(1) || readPreferences().view || 'inicioView', false);
  return { go };
}

