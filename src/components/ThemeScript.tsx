/**
 * Inline script to set .dark on <html> before paint to avoid theme flash.
 * Must run before React hydrates.
 */
export function ThemeScript() {
  const script = `
    (function() {
      var stored = localStorage.getItem('app_theme');
      var dark = stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
      if (dark) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
