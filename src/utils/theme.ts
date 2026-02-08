// ============================================
// Theme Utilities
// ============================================

type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'dsa-mastery-theme';

/**
 * Get the current theme from localStorage or system preference
 */
export function getTheme(): Theme {
  const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
  if (stored) return stored;
  
  // Check system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  return 'dark'; // Default to dark
}

/**
 * Set the theme
 */
export function setTheme(theme: Theme): void {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  applyTheme(theme);
}

/**
 * Toggle between light and dark theme
 */
export function toggleTheme(): Theme {
  const current = getTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
  return next;
}

/**
 * Apply theme to document
 */
function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme);
}

/**
 * Initialize theme on app start
 */
export function initTheme(): void {
  const theme = getTheme();
  applyTheme(theme);
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // Only auto-switch if user hasn't set a preference
    if (!localStorage.getItem(THEME_STORAGE_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}
