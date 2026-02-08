// ============================================
// Topic Detail Page
// ============================================

import { Component } from '@components/base';
import { 
  getTopicById, 
  getConceptsByTopic, 
  getProblemsByTopic,
  getResourcesByTopic 
} from '@services/data-service';
import { 
  isConceptCompleted, 
  toggleConceptComplete,
  getProblemStatus 
} from '@store/progress-store';
import {
  getTopicContent,
  type TopicContent,
  type ChapterItem,
} from '@services/content-service';
import { ChapterNavigation } from '@components/chapter-navigation';
import { ContentViewer } from '@components/content-viewer';
import type { Topic, Concept, Problem, Resource } from '@/types';

interface TopicDetailState {
  activeTab: 'content' | 'concepts' | 'problems' | 'resources';
  contentLoaded: boolean;
  hasContent: boolean;
}

interface TopicDetailParams {
  topicId: string;
  section?: string;
}

/**
 * Topic detail with sections, concepts, and content viewer
 */
export class TopicDetailPage extends Component<TopicDetailState> {
  private params: TopicDetailParams;
  private chapterNav: ChapterNavigation | null = null;
  private contentViewer: ContentViewer | null = null;
  private topicContent: TopicContent | null = null;

  constructor(container: HTMLElement, params?: TopicDetailParams) {
    super(container, { activeTab: 'content', contentLoaded: false, hasContent: false });
    this.params = params || { topicId: '' };
    this.checkContent();
  }

  private async checkContent(): Promise<void> {
    try {
      this.topicContent = await getTopicContent(this.params.topicId);
      this.setState({ 
        hasContent: !!this.topicContent,
        activeTab: this.topicContent ? 'content' : 'concepts'
      });
    } catch {
      this.setState({ hasContent: false, activeTab: 'concepts' });
    }
  }

  template(): string {
    const topic = getTopicById(this.params.topicId);

    if (!topic) {
      return this.renderNotFound();
    }

    const concepts = getConceptsByTopic(topic.id);
    const problems = getProblemsByTopic(topic.id);
    const resources = getResourcesByTopic(topic.id);
    const { activeTab, hasContent } = this.state;

    return /* html */ `
      <div class="page page-topic-detail">
        <div class="topic-detail-header">
          <div class="topic-detail-header__top">
            <a href="#/topics" class="back-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </a>
            <h1>${topic.title}</h1>
            <div class="topic-stats">
              <span class="stat">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                ${topic.timeEstimate}
              </span>
              <span class="stat">${concepts.length} concepts</span>
              <span class="stat">${problems.length} problems</span>
              ${hasContent && this.topicContent ? `<span class="stat">${this.topicContent.stats.chapters} chapters</span>` : ''}
            </div>
          </div>
          <div class="tabs">
            ${hasContent ? /* html */ `
              <button class="tab ${activeTab === 'content' ? 'active' : ''}" data-tab="content">
                📖 Content ${this.topicContent ? `(${this.topicContent.stats.chapters})` : ''}
              </button>
            ` : ''}
            <button class="tab ${activeTab === 'concepts' ? 'active' : ''}" data-tab="concepts">
              Concepts (${concepts.length})
            </button>
            <button class="tab ${activeTab === 'problems' ? 'active' : ''}" data-tab="problems">
              Problems (${problems.length})
            </button>
            <button class="tab ${activeTab === 'resources' ? 'active' : ''}" data-tab="resources">
              Resources (${resources.length})
            </button>
          </div>
        </div>

        <div class="tab-content">
          ${activeTab === 'content' && hasContent ? this.renderContentTab() : ''}
          ${activeTab === 'concepts' ? this.renderConcepts(topic, concepts) : ''}
          ${activeTab === 'problems' ? this.renderProblems(topic, problems) : ''}
          ${activeTab === 'resources' ? this.renderResources(resources) : ''}
        </div>
      </div>
    `;
  }

  private renderContentTab(): string {
    return /* html */ `
      <div class="topic-content-layout">
        <aside class="chapter-sidebar" id="chapter-nav"></aside>
        <main class="content-main" id="content-viewer">
          <div class="content-loading">
            <div class="loading-spinner"></div>
            <p>Loading chapters...</p>
          </div>
        </main>
        <button class="sidebar-toggle" id="sidebar-toggle" aria-label="Toggle sidebar">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
    `;
  }

  private renderNotFound(): string {
    return /* html */ `
      <div class="page page-not-found">
        <div class="empty-state">
          <span class="empty-state__icon">🔍</span>
          <h2>Topic Not Found</h2>
          <p>The topic you're looking for doesn't exist.</p>
          <a href="#/topics" class="btn btn-primary">Back to Topics</a>
        </div>
      </div>
    `;
  }

  private renderConcepts(topic: Topic, concepts: Concept[]): string {
    // Group concepts by section number prefix
    const grouped = this.groupConceptsBySection(concepts);

    return /* html */ `
      <div class="concepts-list">
        ${Object.entries(grouped).map(([section, sectionConcepts]) => /* html */ `
          <div class="concept-section">
            <h3 class="section-title">${section}</h3>
            <div class="concept-items">
              ${sectionConcepts.map((concept) => this.renderConceptItem(topic.id, concept)).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  private groupConceptsBySection(concepts: Concept[]): Record<string, Concept[]> {
    const grouped: Record<string, Concept[]> = {};
    
    concepts.forEach((concept) => {
      const sectionPrefix = concept.sectionNum.split('-')[0];
      const sectionKey = `Section ${sectionPrefix}`;
      
      if (!grouped[sectionKey]) {
        grouped[sectionKey] = [];
      }
      grouped[sectionKey].push(concept);
    });
    
    return grouped;
  }

  private renderConceptItem(topicId: string, concept: Concept): string {
    const isCompleted = isConceptCompleted(topicId, concept.id);

    return /* html */ `
      <div class="concept-item ${isCompleted ? 'completed' : ''}" data-concept-id="${concept.id}">
        <label class="checkbox">
          <input type="checkbox" ${isCompleted ? 'checked' : ''} />
          <span class="checkmark"></span>
        </label>
        <div class="concept-content">
          <span class="concept-title">${concept.title}</span>
          ${concept.checklist.length > 0 ? /* html */ `
            <ul class="concept-checklist">
              ${concept.checklist.slice(0, 3).map((item) => `<li>${item}</li>`).join('')}
              ${concept.checklist.length > 3 ? `<li class="more">+${concept.checklist.length - 3} more</li>` : ''}
            </ul>
          ` : ''}
        </div>
        ${concept.complexity ? `<span class="badge">${concept.complexity}</span>` : ''}
      </div>
    `;
  }

  private renderProblems(topic: Topic, problems: Problem[]): string {
    if (problems.length === 0) {
      return /* html */ `
        <div class="empty-state">
          <span class="empty-state__icon">📝</span>
          <p>No practice problems for this topic yet.</p>
        </div>
      `;
    }

    return /* html */ `
      <div class="problems-list">
        ${problems.map((problem) => this.renderProblemItem(topic.id, problem)).join('')}
      </div>
    `;
  }

  private renderProblemItem(topicId: string, problem: Problem): string {
    const status = getProblemStatus(topicId, problem.id);
    const difficultyClass = problem.difficulty;

    return /* html */ `
      <div class="problem-item" data-problem-id="${problem.id}" data-status="${status}">
        <div class="problem-status">
          <span class="status-indicator ${status}"></span>
        </div>
        <div class="problem-content">
          <a href="${problem.url}" target="_blank" rel="noopener" class="problem-title">
            ${problem.title}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
          ${problem.pattern ? `<span class="problem-pattern">${problem.pattern}</span>` : ''}
        </div>
        <span class="badge badge--${difficultyClass}">${problem.difficulty}</span>
      </div>
    `;
  }

  private renderResources(resources: Resource[]): string {
    if (resources.length === 0) {
      return /* html */ `
        <div class="empty-state">
          <span class="empty-state__icon">📚</span>
          <p>No resources for this topic yet.</p>
        </div>
      `;
    }

    const videos = resources.filter((r) => r.type === 'video');
    const articles = resources.filter((r) => r.type === 'article');

    return /* html */ `
      <div class="resources-list">
        ${videos.length > 0 ? /* html */ `
          <div class="resource-section">
            <h4>📹 Videos</h4>
            ${videos.map((r) => this.renderResourceItem(r)).join('')}
          </div>
        ` : ''}
        
        ${articles.length > 0 ? /* html */ `
          <div class="resource-section">
            <h4>📄 Articles</h4>
            ${articles.map((r) => this.renderResourceItem(r)).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }

  private renderResourceItem(resource: Resource): string {
    return /* html */ `
      <a href="${resource.url}" target="_blank" rel="noopener" class="resource-item">
        <span class="resource-title">${resource.title}</span>
        ${resource.description ? `<span class="resource-desc">${resource.description}</span>` : ''}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
      </a>
    `;
  }

  afterRender(): void {
    // Tab switching
    const tabs = this.container.querySelectorAll('.tab');
    tabs.forEach((tab: Element) => {
      tab.addEventListener('click', () => {
        const tabName = tab.getAttribute('data-tab') as TopicDetailState['activeTab'];
        this.setState({ activeTab: tabName });
      });
    });

    // Concept checkbox toggling
    const conceptItems = this.container.querySelectorAll('.concept-item');
    conceptItems.forEach((item: Element) => {
      const checkbox = item.querySelector('input[type="checkbox"]');
      checkbox?.addEventListener('change', () => {
        const conceptId = item.getAttribute('data-concept-id');
        if (conceptId) {
          toggleConceptComplete(this.params.topicId, conceptId);
          item.classList.toggle('completed');
        }
      });
    });

    // Initialize content viewer if on content tab
    if (this.state.activeTab === 'content' && this.state.hasContent) {
      this.initializeContentViewer();
    }

    // Mobile sidebar toggle
    const sidebarToggle = this.container.querySelector('#sidebar-toggle');
    sidebarToggle?.addEventListener('click', () => {
      const layout = this.container.querySelector('.topic-content-layout');
      layout?.classList.toggle('sidebar-open');
    });
  }

  private async initializeContentViewer(): Promise<void> {
    if (!this.topicContent) return;

    const navContainer = this.container.querySelector('#chapter-nav') as HTMLElement;
    const viewerContainer = this.container.querySelector('#content-viewer') as HTMLElement;

    if (!navContainer || !viewerContainer) return;

    // Create content viewer
    this.contentViewer = new ContentViewer({
      container: viewerContainer,
      topicId: this.params.topicId,
      onLoad: () => {
        viewerContainer.scrollTo({ top: 0 });
      },
    });

    // Create chapter navigation
    this.chapterNav = new ChapterNavigation({
      container: navContainer,
      topicId: this.params.topicId,
      items: this.topicContent.chapters,
      onChapterSelect: (chapter: ChapterItem) => {
        this.contentViewer?.loadChapter(chapter);
      },
    });

    // Render navigation
    this.chapterNav.render();

    // Load first chapter automatically
    const firstChapter = this.chapterNav.getFirstChapter();
    if (firstChapter) {
      this.chapterNav.selectChapter(firstChapter.path);
    }
  }

  destroy(): void {
    this.chapterNav?.destroy();
  }
}
