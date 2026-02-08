// ============================================
// Sidebar Component
// ============================================

import { Component } from './base';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  badge?: string;
}

interface SidebarState {
  currentPath: string;
  collapsed: boolean;
}

/**
 * Navigation sidebar with collapsible sections
 */
export class Sidebar extends Component<SidebarState> {
  private static COLLAPSED_KEY = 'dsa-sidebar-collapsed';
  
  private readonly navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: this.icons.home,
      href: '#/',
    },
    {
      id: 'topics',
      label: 'Topics',
      icon: this.icons.book,
      href: '#/topics',
    },
    {
      id: 'problems',
      label: 'Problems',
      icon: this.icons.code,
      href: '#/problems',
    },
    {
      id: 'patterns',
      label: 'Patterns',
      icon: this.icons.pattern,
      href: '#/patterns',
    },
    {
      id: 'companies',
      label: 'Companies',
      icon: this.icons.building,
      href: '#/companies',
    },
    {
      id: 'references',
      label: 'Resources',
      icon: this.icons.link,
      href: '#/references',
    },
    {
      id: 'playbook',
      label: 'Playbook',
      icon: this.icons.compass,
      href: '#/playbook',
    },
    {
      id: 'progress',
      label: 'My Progress',
      icon: this.icons.chart,
      href: '#/progress',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: this.icons.settings,
      href: '#/settings',
    },
  ];

  private get icons() {
    return {
      home: /* html */ `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
      book: /* html */ `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`,
      code: /* html */ `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
      pattern: /* html */ `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`,
      building: /* html */ `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="9" y1="6" x2="9" y2="6"></line><line x1="15" y1="6" x2="15" y2="6"></line><line x1="9" y1="10" x2="9" y2="10"></line><line x1="15" y1="10" x2="15" y2="10"></line><line x1="9" y1="14" x2="9" y2="14"></line><line x1="15" y1="14" x2="15" y2="14"></line><line x1="9" y1="18" x2="15" y2="18"></line></svg>`,
      link: /* html */ `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`,
      compass: /* html */ `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>`,
      chart: /* html */ `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>`,
      settings: /* html */ `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
      collapse: /* html */ `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline></svg>`,
      expand: /* html */ `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg>`,
      menu: /* html */ `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`,
    };
  }

  constructor(container: HTMLElement) {
    // Load collapsed state from localStorage
    const savedCollapsed = localStorage.getItem(Sidebar.COLLAPSED_KEY);
    
    super(container, {
      currentPath: window.location.hash || '#/',
      collapsed: savedCollapsed === 'true',
    });

    // Listen to route changes
    window.addEventListener('hashchange', () => {
      this.setState({ currentPath: window.location.hash || '#/' });
    });
    
    // Apply initial collapsed state to body
    if (this.state.collapsed) {
      document.body.classList.add('sidebar-collapsed');
    }
  }

  template(): string {
    const { currentPath, collapsed } = this.state;

    return /* html */ `
      <aside class="app-sidebar ${collapsed ? 'is-collapsed' : ''}">
        <div class="sidebar-overlay"></div>
        
        <!-- Mobile hamburger trigger (shown on small screens) -->
        <button class="sidebar-mobile-trigger" aria-label="Open menu">
          ${this.icons.menu}
        </button>
        
        <nav class="sidebar-nav">
          <!-- Collapse toggle button -->
          <button class="sidebar-toggle" aria-label="${collapsed ? 'Expand' : 'Collapse'} sidebar" title="${collapsed ? 'Expand' : 'Collapse'} sidebar">
            ${collapsed ? this.icons.expand : this.icons.collapse}
          </button>
          
          <ul class="nav-list">
            ${this.navItems.map((item) => this.renderNavItem(item, currentPath, collapsed)).join('')}
          </ul>
        </nav>
        
        <div class="sidebar-footer">
          <div class="app-version">
            <span>${collapsed ? 'v1' : 'v1.0.0'}</span>
          </div>
        </div>
      </aside>
    `;
  }

  private renderNavItem(item: NavItem, currentPath: string, collapsed: boolean): string {
    const isActive = this.isActiveRoute(item.href, currentPath);
    const activeClass = isActive ? 'active' : '';

    return /* html */ `
      <li class="nav-item">
        <a href="${item.href}" class="nav-link ${activeClass}" data-nav-id="${item.id}" title="${collapsed ? item.label : ''}">
          <span class="nav-icon">${item.icon}</span>
          <span class="nav-label">${item.label}</span>
          ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
        </a>
      </li>
    `;
  }

  private isActiveRoute(href: string, currentPath: string): boolean {
    const hrefPath = href.replace('#', '');
    const current = currentPath.replace('#', '');

    // Exact match for home
    if (hrefPath === '/' && current === '/') return true;

    // Prefix match for other routes
    if (hrefPath !== '/' && current.startsWith(hrefPath)) return true;

    return false;
  }

  afterRender(): void {
    // Toggle sidebar collapse
    const toggleBtn = this.container.querySelector('.sidebar-toggle');
    toggleBtn?.addEventListener('click', () => {
      this.toggleCollapse();
    });
    
    // Mobile menu trigger
    const mobileTriger = this.container.querySelector('.sidebar-mobile-trigger');
    mobileTriger?.addEventListener('click', () => {
      document.body.classList.add('sidebar-open');
    });
    
    // Close sidebar on overlay click (mobile)
    const overlay = this.container.querySelector('.sidebar-overlay');
    overlay?.addEventListener('click', () => {
      document.body.classList.remove('sidebar-open');
    });

    // Close sidebar on nav click (mobile)
    const navLinks = this.container.querySelectorAll('.nav-link');
    navLinks.forEach((link: Element) => {
      link.addEventListener('click', () => {
        document.body.classList.remove('sidebar-open');
      });
    });
  }
  
  private toggleCollapse(): void {
    const newCollapsed = !this.state.collapsed;
    localStorage.setItem(Sidebar.COLLAPSED_KEY, String(newCollapsed));
    
    if (newCollapsed) {
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }
    
    this.setState({ collapsed: newCollapsed });
  }
}
