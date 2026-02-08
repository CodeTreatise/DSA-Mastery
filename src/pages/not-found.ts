// ============================================
// Not Found Page
// ============================================

import { Component } from '@components/base';

/**
 * 404 Not Found page
 */
export class NotFoundPage extends Component {
  constructor(container: HTMLElement) {
    super(container, {});
  }

  template(): string {
    return /* html */ `
      <div class="page page-not-found">
        <div class="not-found-content">
          <div class="not-found-icon">🔍</div>
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <p>The page you're looking for doesn't exist or has been moved.</p>
          <a href="#/" class="btn btn-primary">Go to Dashboard</a>
        </div>
      </div>
    `;
  }
}
