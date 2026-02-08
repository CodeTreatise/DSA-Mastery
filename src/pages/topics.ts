// ============================================
// Topics Page
// ============================================

import { Component } from '@components/base';
import { getTopics, getConceptCountByTopic, getProblemsByTopic } from '@services/data-service';
import { getTopicCompletionPercent } from '@store/progress-store';
import type { Topic } from '@/types';

interface TopicsPageState {
  searchQuery: string;
}

/**
 * Topics list with progress indicators
 */
export class TopicsPage extends Component<TopicsPageState> {
  constructor(container: HTMLElement) {
    super(container, { searchQuery: '' });
  }

  template(): string {
    const topics = getTopics();
    const { searchQuery } = this.state;

    const filteredTopics = searchQuery
      ? topics.filter((t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : topics;

    return /* html */ `
      <div class="page page-topics">
        <div class="page-header">
          <h1>Topics</h1>
          <p class="page-subtitle">Master DSA concepts topic by topic</p>
        </div>

        <div class="topics-filters">
          <div class="search-box">
            <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              class="search-input topic-search" 
              placeholder="Search topics..." 
              value="${searchQuery}"
            />
          </div>
        </div>

        <div class="topics-grid">
          ${filteredTopics.map((topic) => this.renderTopicCard(topic)).join('')}
        </div>
      </div>
    `;
  }

  private renderTopicCard(topic: Topic): string {
    const conceptCount = getConceptCountByTopic(topic.id);
    const problemCount = getProblemsByTopic(topic.id).length;
    const completionPercent = getTopicCompletionPercent(topic.id, conceptCount);
    const orderNum = String(topic.order).padStart(2, '0');

    return /* html */ `
      <a href="#/topics/${topic.id}" class="topic-card card">
        <div class="topic-header">
          <span class="topic-order">${orderNum}</span>
          <h3 class="topic-title">${topic.title.replace(/^\d+\s*-\s*/, '')}</h3>
        </div>
        
        <p class="topic-description">${topic.description}</p>
        
        <div class="topic-meta">
          <span class="meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            ${topic.timeEstimate}
          </span>
          <span class="meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            ${conceptCount} concepts
          </span>
          <span class="meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
            ${problemCount} problems
          </span>
        </div>
        
        <div class="topic-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${completionPercent}%"></div>
          </div>
          <span class="progress-text">${completionPercent}% complete</span>
        </div>
      </a>
    `;
  }

  afterRender(): void {
    const searchInput = this.container.querySelector('.topic-search') as HTMLInputElement;
    searchInput?.addEventListener('input', this.debounce((e: Event) => {
      const target = e.target as HTMLInputElement;
      this.setState({ searchQuery: target.value });
    }, 200));
  }
}
