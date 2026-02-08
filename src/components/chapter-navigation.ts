/**
 * Chapter Navigation Component
 * Tree-style navigation for sections and chapters with expand/collapse
 */

import {
  type ContentItem,
  type ChapterItem,
  type SectionItem,
  isChapterRead,
  getTopicProgress,
  flattenChapters,
} from '../services/content-service';

interface ChapterNavOptions {
  container: HTMLElement;
  topicId: string;
  items: ContentItem[];
  onChapterSelect: (chapter: ChapterItem) => void;
}

export class ChapterNavigation {
  private container: HTMLElement;
  private topicId: string;
  private items: ContentItem[];
  private onChapterSelect: (chapter: ChapterItem) => void;
  private currentChapterPath: string | null = null;
  private expandedSections: Set<string> = new Set();

  constructor(options: ChapterNavOptions) {
    this.container = options.container;
    this.topicId = options.topicId;
    this.items = options.items;
    this.onChapterSelect = options.onChapterSelect;
    
    // Listen for chapter completion events
    window.addEventListener('chapter-completed', this.handleChapterCompleted.bind(this));
  }

  /**
   * Render the navigation
   */
  render(): void {
    const totalChapters = flattenChapters(this.items).length;
    const progress = getTopicProgress(this.topicId, totalChapters);
    
    this.container.innerHTML = `
      <div class="chapter-nav">
        <div class="chapter-nav__header">
          <h3 class="chapter-nav__title">Contents</h3>
          <div class="chapter-nav__progress">
            <div class="progress-bar">
              <div class="progress-bar__fill" style="width: ${progress}%"></div>
            </div>
            <span class="progress-text">${progress}% complete</span>
          </div>
        </div>
        <nav class="chapter-nav__tree">
          ${this.renderItems(this.items)}
        </nav>
      </div>
    `;

    this.setupEventListeners();
  }

  /**
   * Render content items recursively
   */
  private renderItems(items: ContentItem[], depth: number = 0): string {
    return items.map(item => {
      if (item.type === 'section') {
        return this.renderSection(item, depth);
      } else {
        return this.renderChapter(item, depth);
      }
    }).join('');
  }

  /**
   * Render a section with its children
   */
  private renderSection(section: SectionItem, depth: number): string {
    const isExpanded = this.expandedSections.has(section.path);
    const hasCurrentChapter = this.sectionContainsChapter(section, this.currentChapterPath);
    
    // Auto-expand if contains current chapter
    if (hasCurrentChapter && !isExpanded) {
      this.expandedSections.add(section.path);
    }
    
    const expanded = this.expandedSections.has(section.path);
    
    return `
      <div class="nav-section ${expanded ? 'is-expanded' : ''}" data-section-path="${section.path}">
        <button class="nav-section__toggle" data-path="${section.path}">
          <svg class="nav-section__icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
          <span class="nav-section__title">${section.title}</span>
          <span class="nav-section__count">${this.countChapters(section.children)}</span>
        </button>
        <div class="nav-section__children" style="--depth: ${depth + 1}">
          ${this.renderItems(section.children, depth + 1)}
        </div>
      </div>
    `;
  }

  /**
   * Render a chapter item
   */
  private renderChapter(chapter: ChapterItem, depth: number): string {
    const isRead = isChapterRead(this.topicId, chapter.path);
    const isCurrent = chapter.path === this.currentChapterPath;
    
    return `
      <button 
        class="nav-chapter ${isRead ? 'is-read' : ''} ${isCurrent ? 'is-current' : ''}"
        data-chapter-path="${chapter.path}"
        style="--depth: ${depth}"
        title="${chapter.description || chapter.title}"
      >
        <span class="nav-chapter__status">
          ${isRead ? `
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          ` : `
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
            </svg>
          `}
        </span>
        <span class="nav-chapter__title">${chapter.title}</span>
        <span class="nav-chapter__time">${chapter.estimatedReadTime}m</span>
      </button>
    `;
  }

  /**
   * Count chapters in a section
   */
  private countChapters(items: ContentItem[]): number {
    let count = 0;
    for (const item of items) {
      if (item.type === 'chapter') {
        count++;
      } else if (item.type === 'section' && item.children) {
        count += this.countChapters(item.children);
      }
    }
    return count;
  }

  /**
   * Check if a section contains a specific chapter
   */
  private sectionContainsChapter(section: SectionItem, chapterPath: string | null): boolean {
    if (!chapterPath) return false;
    
    for (const item of section.children) {
      if (item.type === 'chapter' && item.path === chapterPath) {
        return true;
      } else if (item.type === 'section') {
        if (this.sectionContainsChapter(item, chapterPath)) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Find a chapter by path
   */
  private findChapter(items: ContentItem[], path: string): ChapterItem | null {
    for (const item of items) {
      if (item.type === 'chapter' && item.path === path) {
        return item;
      } else if (item.type === 'section' && item.children) {
        const found = this.findChapter(item.children, path);
        if (found) return found;
      }
    }
    return null;
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Section toggle - use event delegation for better handling of nested sections
    this.container.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const toggleBtn = target.closest('.nav-section__toggle') as HTMLElement;
      
      if (toggleBtn) {
        e.preventDefault();
        e.stopPropagation(); // Prevent bubbling to parent sections
        const path = toggleBtn.dataset.path!;
        this.toggleSection(path);
        return;
      }
      
      const chapterBtn = target.closest('.nav-chapter') as HTMLElement;
      if (chapterBtn) {
        e.preventDefault();
        const path = chapterBtn.dataset.chapterPath!;
        this.selectChapter(path);
      }
    });
  }

  /**
   * Toggle a section's expanded state
   */
  private toggleSection(path: string): void {
    const section = this.container.querySelector(`[data-section-path="${path}"]`);
    
    if (this.expandedSections.has(path)) {
      this.expandedSections.delete(path);
      section?.classList.remove('is-expanded');
    } else {
      this.expandedSections.add(path);
      section?.classList.add('is-expanded');
    }
  }

  /**
   * Select a chapter
   */
  selectChapter(path: string): void {
    // Update current state
    this.currentChapterPath = path;
    
    // Update UI
    this.container.querySelectorAll('.nav-chapter').forEach(btn => {
      btn.classList.toggle('is-current', (btn as HTMLElement).dataset.chapterPath === path);
    });
    
    // Expand parent sections
    this.expandParentSections(path);
    
    // Find and emit chapter
    const chapter = this.findChapter(this.items, path);
    if (chapter) {
      this.onChapterSelect(chapter);
    }
  }

  /**
   * Expand all parent sections of a chapter
   */
  private expandParentSections(chapterPath: string): void {
    const expandParents = (items: ContentItem[], path: string[]): boolean => {
      for (const item of items) {
        if (item.type === 'chapter' && item.path === chapterPath) {
          // Found - expand all sections in path
          path.forEach(p => {
            this.expandedSections.add(p);
            const section = this.container.querySelector(`[data-section-path="${p}"]`);
            section?.classList.add('is-expanded');
          });
          return true;
        } else if (item.type === 'section' && item.children) {
          if (expandParents(item.children, [...path, item.path])) {
            return true;
          }
        }
      }
      return false;
    };
    
    expandParents(this.items, []);
  }

  /**
   * Handle chapter completed event
   */
  private handleChapterCompleted(e: Event): void {
    const detail = (e as CustomEvent).detail;
    if (detail.topicId === this.topicId) {
      // Re-render to update progress
      this.render();
      // Re-select current chapter to maintain state
      if (this.currentChapterPath) {
        this.selectChapter(this.currentChapterPath);
      }
    }
  }

  /**
   * Get the first chapter (for initial load)
   */
  getFirstChapter(): ChapterItem | null {
    const chapters = flattenChapters(this.items);
    return chapters[0] || null;
  }

  /**
   * Destroy the component
   */
  destroy(): void {
    window.removeEventListener('chapter-completed', this.handleChapterCompleted.bind(this));
  }
}

/**
 * Create chapter navigation instance
 */
export function createChapterNavigation(options: ChapterNavOptions): ChapterNavigation {
  return new ChapterNavigation(options);
}

export default ChapterNavigation;
