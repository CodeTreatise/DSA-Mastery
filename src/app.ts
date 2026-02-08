// ============================================
// App Shell - Main Application Component
// ============================================

import { router } from './router';
import { Header } from '@components/header';
import { Sidebar } from '@components/sidebar';
import { HomePage } from '@pages/home';
import { TopicsPage } from '@pages/topics';
import { TopicDetailPage } from '@pages/topic-detail';
import { ProblemsPage } from '@pages/problems';
import { PatternsPage } from '@pages/patterns';
import { CompaniesPage } from '@pages/companies';
import { ReferencesPage } from '@pages/references';
import { PlaybookPage } from '@pages/playbook';
import { ProgressPage } from '@pages/progress';
import { SettingsPage } from '@pages/settings';
import { NotFoundPage } from '@pages/not-found';
import { initTheme } from '@utils/theme';

// Current page instance (for cleanup)
let currentPage: { destroy?: () => void } | null = null;

// Component instances
let headerComponent: Header | null = null;
let sidebarComponent: Sidebar | null = null;

/**
 * Initialize the application
 */
export function initApp(): void {
  // Initialize theme from localStorage or system preference
  initTheme();

  // Render app shell
  renderAppShell();

  // Configure routes
  configureRoutes();

  // Start router
  router.start();
}

/**
 * Render the main app structure
 */
function renderAppShell(): void {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <div class="app-layout">
      <!-- Sidebar -->
      <div id="sidebar"></div>
      
      <!-- Main content area -->
      <main class="app-main">
        <!-- Header -->
        <div id="header"></div>
        
        <!-- Page content -->
        <div class="app-content" id="content">
          <!-- Pages render here -->
        </div>
      </main>
    </div>
  `;

  // Initialize header and sidebar components
  const headerEl = document.getElementById('header');
  const sidebarEl = document.getElementById('sidebar');
  
  if (headerEl) {
    headerComponent = new Header(headerEl);
    headerComponent.render();
  }
  
  if (sidebarEl) {
    sidebarComponent = new Sidebar(sidebarEl);
    sidebarComponent.render();
  }

  // Setup mobile sidebar toggle
  setupMobileSidebar();
}

/**
 * Configure application routes
 */
function configureRoutes(): void {
  router
    // Dashboard
    .on('/', () => renderPage(HomePage))
    
    // Topics
    .on('/topics', () => renderPage(TopicsPage))
    .on('/topics/:topicId', ({ params }) => {
      renderPage(TopicDetailPage, { topicId: params.topicId });
    })
    .on('/topics/:topicId/:section', ({ params }) => {
      renderPage(TopicDetailPage, { 
        topicId: params.topicId, 
        section: params.section 
      });
    })
    
    // Problems
    .on('/problems', () => renderPage(ProblemsPage))
    .on('/problems/:difficulty', ({ params }) => {
      renderPage(ProblemsPage, { difficulty: params.difficulty });
    })
    
    // Patterns
    .on('/patterns', () => renderPage(PatternsPage))
    .on('/patterns/:patternId', ({ params }) => {
      renderPage(PatternsPage, { patternId: params.patternId });
    })
    
    // Companies
    .on('/companies', () => renderPage(CompaniesPage))
    .on('/companies/:companyId', ({ params }) => {
      renderPage(CompaniesPage, { companyId: params.companyId });
    })
    
    // References
    .on('/references', () => renderPage(ReferencesPage))
    
    // Playbook
    .on('/playbook', () => renderPage(PlaybookPage))
    
    // Progress
    .on('/progress', () => renderPage(ProgressPage))
    
    // Settings
    .on('/settings', () => renderPage(SettingsPage))
    
    // 404
    .notFound(() => renderPage(NotFoundPage))
    
    // Hooks
    .beforeEach((to) => {
      // Update active sidebar link
      updateActiveLink(to.path);
      return true;
    })
    .afterEach(() => {
      // Scroll to top on navigation
      window.scrollTo(0, 0);
    });
}

/**
 * Render a page component
 */
function renderPage<P extends object>(
  PageClass: new (container: HTMLElement, params?: P) => { render: () => void; destroy?: () => void },
  params?: P
): void {
  // Cleanup previous page
  if (currentPage?.destroy) {
    currentPage.destroy();
  }

  // Get content container
  const content = document.getElementById('content');
  if (!content) return;

  // Create and render new page
  const page = new PageClass(content, params);
  page.render();
  currentPage = page;
}

/**
 * Update active link in sidebar
 */
function updateActiveLink(path: string): void {
  // Remove active class from all links
  document.querySelectorAll('.sidebar-nav__link').forEach((link) => {
    link.classList.remove('active');
  });

  // Add active class to matching link
  const activeLink = document.querySelector(`.sidebar-nav__link[href="#${path}"]`);
  if (activeLink) {
    activeLink.classList.add('active');
  }
}

/**
 * Setup mobile sidebar toggle functionality
 */
function setupMobileSidebar(): void {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const menuBtn = document.getElementById('menu-toggle');

  const closeSidebar = () => {
    sidebar?.classList.remove('open');
    overlay?.classList.remove('visible');
  };

  // Toggle sidebar on menu button click
  menuBtn?.addEventListener('click', () => {
    sidebar?.classList.toggle('open');
    overlay?.classList.toggle('visible');
  });

  // Close sidebar on overlay click
  overlay?.addEventListener('click', closeSidebar);

  // Close sidebar on navigation (mobile)
  window.addEventListener('hashchange', () => {
    if (window.innerWidth < 768) {
      closeSidebar();
    }
  });

  // Close sidebar on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSidebar();
    }
  });
}
