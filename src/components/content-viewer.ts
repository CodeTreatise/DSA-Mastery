/**
 * Content Viewer Component
 * Renders markdown content with syntax highlighting, mermaid diagrams, and interactive features
 */

import {
  fetchChapterContent,
  parseMarkdown,
  renderMermaidDiagrams,
  setupCodeCopyButtons,
  markChapterRead,
  type ChapterItem,
} from '../services/content-service';

interface ContentViewerOptions {
  container: HTMLElement;
  topicId: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export class ContentViewer {
  private container: HTMLElement;
  private topicId: string;
  private currentChapter: ChapterItem | null = null;
  private onLoad?: () => void;
  private onError?: (error: Error) => void;

  constructor(options: ContentViewerOptions) {
    this.container = options.container;
    this.topicId = options.topicId;
    this.onLoad = options.onLoad;
    this.onError = options.onError;
  }

  /**
   * Load and render a chapter
   */
  async loadChapter(chapter: ChapterItem): Promise<void> {
    this.currentChapter = chapter;
    this.container.innerHTML = this.renderLoadingState();

    try {
      // Fetch markdown content
      const markdown = await fetchChapterContent(this.topicId, chapter.path);
      
      // Parse to HTML
      const html = await parseMarkdown(markdown);
      
      // Render content
      this.container.innerHTML = `
        <article class="content-article">
          <header class="content-header">
            <div class="content-meta">
              <span class="reading-time">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                ${chapter.estimatedReadTime} min read
              </span>
            </div>
          </header>
          <div class="content-body markdown-content">
            ${html}
          </div>
          <footer class="content-footer">
            <button class="mark-read-btn" title="Mark as read">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span>Mark as Complete</span>
            </button>
          </footer>
        </article>
      `;

      // Post-render setup
      await this.postRender();
      
      // Track reading
      this.setupReadingTracker();
      
      this.onLoad?.();
    } catch (error) {
      console.error('Failed to load chapter:', error);
      this.container.innerHTML = this.renderErrorState(error as Error);
      this.onError?.(error as Error);
    }
  }

  /**
   * Post-render setup (mermaid, code buttons, etc.)
   */
  private async postRender(): Promise<void> {
    // Render mermaid diagrams
    await renderMermaidDiagrams(this.container);
    
    // Setup code copy buttons
    setupCodeCopyButtons(this.container);
    
    // Setup details/summary toggle tracking
    this.setupDetailsTracking();
    
    // Setup heading anchor scrolling
    this.setupAnchorScrolling();
  }

  /**
   * Setup reading completion tracker
   */
  private setupReadingTracker(): void {
    const markReadBtn = this.container.querySelector('.mark-read-btn');
    
    markReadBtn?.addEventListener('click', () => {
      if (this.currentChapter) {
        markChapterRead(this.topicId, this.currentChapter.path);
        markReadBtn.classList.add('completed');
        (markReadBtn.querySelector('span') as HTMLElement).textContent = 'Completed!';
        
        // Dispatch event for navigation to update
        window.dispatchEvent(new CustomEvent('chapter-completed', {
          detail: {
            topicId: this.topicId,
            chapterPath: this.currentChapter.path,
          }
        }));
      }
    });
  }

  /**
   * Track details/summary state
   */
  private setupDetailsTracking(): void {
    const details = this.container.querySelectorAll('details');
    
    details.forEach(detail => {
      const summary = detail.querySelector('summary');
      summary?.addEventListener('click', () => {
        // Small delay to allow toggle to complete
        setTimeout(() => {
          detail.classList.toggle('is-open', detail.open);
        }, 10);
      });
    });
  }

  /**
   * Smooth scrolling for anchor links
   */
  private setupAnchorScrolling(): void {
    const anchors = this.container.querySelectorAll('.heading-anchor');
    
    anchors.forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = (anchor as HTMLAnchorElement).getAttribute('href')?.slice(1);
        const target = document.getElementById(targetId || '');
        
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Update URL without page jump
          history.pushState(null, '', `#${targetId}`);
        }
      });
    });
  }

  /**
   * Loading state HTML
   */
  private renderLoadingState(): string {
    return `
      <div class="content-loading">
        <div class="loading-spinner"></div>
        <p>Loading content...</p>
      </div>
    `;
  }

  /**
   * Error state HTML
   */
  private renderErrorState(error: Error): string {
    return `
      <div class="content-error">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <h3>Failed to Load Content</h3>
        <p>${error.message}</p>
        <button class="btn btn--primary" onclick="location.reload()">
          Retry
        </button>
      </div>
    `;
  }

  /**
   * Scroll to top of content
   */
  scrollToTop(): void {
    this.container.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Get current chapter
   */
  getCurrentChapter(): ChapterItem | null {
    return this.currentChapter;
  }
}

/**
 * Create a content viewer instance
 */
export function createContentViewer(options: ContentViewerOptions): ContentViewer {
  return new ContentViewer(options);
}

export default ContentViewer;
