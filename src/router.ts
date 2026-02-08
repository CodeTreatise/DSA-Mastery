// ============================================
// Hash-Based Router for GitHub Pages
// ============================================

export interface RouteParams {
  [key: string]: string;
}

export interface RouteMatch {
  path: string;
  params: RouteParams;
  query: URLSearchParams;
}

type RouteHandler = (match: RouteMatch) => void | Promise<void>;

interface Route {
  pattern: RegExp;
  paramNames: string[];
  handler: RouteHandler;
}

/**
 * Simple hash-based router for single-page applications.
 * Uses hash (#) routing which works on static hosts like GitHub Pages.
 * 
 * Usage:
 *   const router = new Router();
 *   router
 *     .on('/', () => showHome())
 *     .on('/topics', () => showTopics())
 *     .on('/topics/:id', ({ params }) => showTopic(params.id))
 *     .on('/problems', () => showProblems())
 *     .notFound(() => show404())
 *     .start();
 */
export class Router {
  private routes: Route[] = [];
  private notFoundHandler: RouteHandler = () => console.warn('404: Page not found');
  private beforeEachHook: ((to: RouteMatch, from: string | null) => boolean | void) | null = null;
  private afterEachHook: ((to: RouteMatch) => void) | null = null;
  private currentPath: string | null = null;

  /**
   * Register a route
   * @param path - Route pattern (e.g., '/topics/:id')
   * @param handler - Handler function called when route matches
   */
  on(path: string, handler: RouteHandler): this {
    const { pattern, paramNames } = this.pathToRegex(path);
    this.routes.push({ pattern, paramNames, handler });
    return this;
  }

  /**
   * Set handler for 404 (route not found)
   */
  notFound(handler: RouteHandler): this {
    this.notFoundHandler = handler;
    return this;
  }

  /**
   * Hook called before each route change
   * Return false to cancel navigation
   */
  beforeEach(hook: (to: RouteMatch, from: string | null) => boolean | void): this {
    this.beforeEachHook = hook;
    return this;
  }

  /**
   * Hook called after each route change
   */
  afterEach(hook: (to: RouteMatch) => void): this {
    this.afterEachHook = hook;
    return this;
  }

  /**
   * Start the router and listen for hash changes
   */
  start(): void {
    window.addEventListener('hashchange', () => this.resolve());
    // Initial route resolution
    this.resolve();
  }

  /**
   * Navigate to a new route
   */
  navigate(path: string): void {
    window.location.hash = path;
  }

  /**
   * Replace current route (no history entry)
   */
  replace(path: string): void {
    const url = new URL(window.location.href);
    url.hash = path;
    window.history.replaceState(null, '', url.toString());
    this.resolve();
  }

  /**
   * Go back in history
   */
  back(): void {
    window.history.back();
  }

  /**
   * Go forward in history
   */
  forward(): void {
    window.history.forward();
  }

  /**
   * Get current route path
   */
  getCurrentPath(): string {
    return this.getHashPath();
  }

  /**
   * Resolve the current hash and call the appropriate handler
   */
  private resolve(): void {
    const fullPath = this.getHashPath();
    const [path, queryString] = fullPath.split('?');
    const query = new URLSearchParams(queryString || '');

    // Find matching route
    for (const route of this.routes) {
      const match = path.match(route.pattern);
      if (match) {
        // Extract params
        const params: RouteParams = {};
        route.paramNames.forEach((name, index) => {
          params[name] = decodeURIComponent(match[index + 1]);
        });

        const routeMatch: RouteMatch = { path, params, query };

        // Call beforeEach hook
        if (this.beforeEachHook) {
          const result = this.beforeEachHook(routeMatch, this.currentPath);
          if (result === false) return;
        }

        // Update current path
        const previousPath = this.currentPath;
        this.currentPath = path;

        // Call handler
        route.handler(routeMatch);

        // Call afterEach hook
        if (this.afterEachHook) {
          this.afterEachHook(routeMatch);
        }

        // Log navigation (dev only)
        if (import.meta.env.DEV) {
          console.log(`[Router] ${previousPath || '(initial)'} → ${path}`, params);
        }

        return;
      }
    }

    // No route matched - call notFound handler
    const routeMatch: RouteMatch = { path, params: {}, query };
    this.notFoundHandler(routeMatch);
  }

  /**
   * Get the path from the hash (without the #)
   */
  private getHashPath(): string {
    const hash = window.location.hash.slice(1); // Remove #
    return hash || '/';
  }

  /**
   * Convert a path pattern to a regex
   * e.g., '/topics/:id/concepts/:conceptId' -> /^\/topics\/([^/]+)\/concepts\/([^/]+)$/
   */
  private pathToRegex(path: string): { pattern: RegExp; paramNames: string[] } {
    const paramNames: string[] = [];
    
    // Escape special regex characters except :param
    let pattern = path
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/:(\w+)/g, (_, paramName) => {
        paramNames.push(paramName);
        return '([^/]+)';
      });

    // Add end anchor, but allow optional trailing slash
    pattern = `^${pattern}\\/?$`;

    return { pattern: new RegExp(pattern), paramNames };
  }
}

/**
 * Create link elements that work with the router
 * Usage: <a href="#/topics" data-link>Topics</a>
 */
export function setupRouterLinks(): void {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const link = target.closest('a[data-link]');
    
    if (link) {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        // Already a hash link, let it work naturally
        return;
      }
      if (href) {
        e.preventDefault();
        window.location.hash = href;
      }
    }
  });
}

/**
 * Global router instance
 */
export const router = new Router();
