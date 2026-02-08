// ============================================
// Header Component
// ============================================

import { Component } from './base';
import { toggleTheme, getTheme } from '@utils/theme';

interface HeaderState {
  searchQuery: string;
  theme: 'light' | 'dark';
}

/**
 * App header with logo, search, theme toggle, and mobile menu
 */
export class Header extends Component<HeaderState> {
  constructor(container: HTMLElement) {
    super(container, {
      searchQuery: '',
      theme: getTheme(),
    });
  }

  template(): string {
    const { theme } = this.state;
    const isDark = theme === 'dark';

    return /* html */ `
      <header class="app-header">
        <div class="header-left">
          <button class="btn btn-icon mobile-menu-toggle" aria-label="Toggle menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          
          <a href="#/" class="logo">
            <span class="logo-icon">📚</span>
            <span class="logo-text">DSA Mastery</span>
          </a>
        </div>

        <div class="header-center">
          <div class="search-box">
            <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              class="search-input" 
              placeholder="Search topics, problems, patterns..." 
              aria-label="Search"
            />
            <kbd class="search-shortcut">⌘K</kbd>
          </div>
        </div>

        <div class="header-right">
          <button class="btn btn-icon theme-toggle" aria-label="Toggle theme" title="Toggle theme">
            ${isDark ? this.sunIcon() : this.moonIcon()}
          </button>
          
          <a href="#/progress" class="btn btn-ghost progress-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
            <span class="progress-text">Progress</span>
          </a>
        </div>
      </header>
    `;
  }

  private sunIcon(): string {
    return /* html */ `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    `;
  }

  private moonIcon(): string {
    return /* html */ `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    `;
  }

  afterRender(): void {
    // Theme toggle
    const themeBtn = this.container.querySelector('.theme-toggle');
    themeBtn?.addEventListener('click', () => {
      toggleTheme();
      this.setState({ theme: getTheme() });
    });

    // Mobile menu toggle
    const menuBtn = this.container.querySelector('.mobile-menu-toggle');
    menuBtn?.addEventListener('click', () => {
      document.body.classList.toggle('sidebar-open');
    });

    // Search input
    const searchInput = this.container.querySelector('.search-input') as HTMLInputElement;
    searchInput?.addEventListener('input', this.debounce((e: Event) => {
      const target = e.target as HTMLInputElement;
      this.setState({ searchQuery: target.value });
      // TODO: Emit search event or update global search state
    }, 300));

    // Keyboard shortcut for search
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInput?.focus();
      }
    });
  }
}
