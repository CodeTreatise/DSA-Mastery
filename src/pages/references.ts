// ============================================
// References Page - Learning Resources
// ============================================

import { Component } from '@components/base';
import referencesJson from '../data/references.json';

interface Resource {
  id: string;
  name: string;
  url: string;
  description: string;
  stars?: string;
  subscribers?: string;
  problemCount?: number | string;
  timeEstimate?: string;
  price?: string;
  tier?: string;
  author?: string;
  languages?: string[];
  playlists?: string[];
  sections?: string[];
  bestFor: string[];
}

interface Category {
  id: string;
  name: string;
  description: string;
  resources: Resource[];
}

interface StudyPlan {
  id: string;
  name: string;
  description: string;
  resources: string[];
  dailyHours: number;
  totalProblems?: string;
  focus: string;
  strategy?: string[];
}

interface ReferencesData {
  categories: Category[];
  studyPlans: StudyPlan[];
}

interface ReferencesState {
  data: ReferencesData | null;
  loading: boolean;
  error: string | null;
  activeCategory: string | null;
  searchQuery: string;
}

/**
 * References page showing curated learning resources
 */
export class ReferencesPage extends Component<ReferencesState> {
  private dataLoaded = false;

  constructor(container: HTMLElement) {
    super(container, {
      data: null,
      loading: true,
      error: null,
      activeCategory: null,
      searchQuery: '',
    });
  }

  private async loadData(): Promise<void> {
    try {
      const data = referencesJson as unknown as ReferencesData;
      this.setState({ 
        data, 
        loading: false,
        activeCategory: data.categories[0]?.id || null
      });
    } catch (error) {
      this.setState({ 
        error: error instanceof Error ? error.message : 'Unknown error', 
        loading: false 
      });
    }
  }

  template(): string {
    const { data, loading, error, activeCategory, searchQuery } = this.state;

    if (loading) {
      return this.renderLoading();
    }

    if (error || !data) {
      return this.renderError(error || 'Failed to load data');
    }

    const filteredCategories = this.getFilteredCategories(data.categories, searchQuery);

    return /* html */ `
      <div class="page page-references">
        <div class="page-header">
          <div class="header-content">
            <h1>📚 Learning Resources</h1>
            <p class="page-subtitle">Curated resources for DSA interview preparation</p>
          </div>
          <div class="search-box">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input type="text" 
                   placeholder="Search resources..." 
                   value="${searchQuery}"
                   class="search-input"
                   id="resource-search">
          </div>
        </div>

        ${this.renderStudyPlans(data.studyPlans)}

        <div class="categories-nav">
          ${data.categories.map(cat => `
            <button class="category-tab ${activeCategory === cat.id ? 'active' : ''}" 
                    data-category="${cat.id}">
              ${cat.name}
            </button>
          `).join('')}
        </div>

        <div class="resources-content">
          ${filteredCategories.map(cat => this.renderCategory(cat, activeCategory)).join('')}
        </div>
      </div>
    `;
  }

  private renderLoading(): string {
    return /* html */ `
      <div class="page page-references">
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading resources...</p>
        </div>
      </div>
    `;
  }

  private renderError(message: string): string {
    return /* html */ `
      <div class="page page-references">
        <div class="error-state">
          <span class="error-icon">⚠️</span>
          <h2>Error Loading Resources</h2>
          <p>${message}</p>
          <button class="btn btn-primary" onclick="location.reload()">Retry</button>
        </div>
      </div>
    `;
  }

  private renderStudyPlans(plans: StudyPlan[]): string {
    return /* html */ `
      <div class="study-plans-section">
        <h2>🎯 Quick Study Plans</h2>
        <div class="study-plans-grid">
          ${plans.map(plan => `
            <div class="study-plan-card card">
              <h3>${plan.name}</h3>
              <p class="plan-description">${plan.description}</p>
              <div class="plan-meta">
                <span class="plan-hours">⏱️ ${plan.dailyHours}h/day</span>
                ${plan.totalProblems ? `<span class="plan-problems">📝 ${plan.totalProblems} problems</span>` : ''}
              </div>
              <p class="plan-focus">${plan.focus}</p>
              ${plan.strategy ? `
                <details class="plan-strategy">
                  <summary>📋 Week-by-week plan</summary>
                  <ul>
                    ${plan.strategy.map(s => `<li>${s}</li>`).join('')}
                  </ul>
                </details>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  private renderCategory(category: Category, activeCategory: string | null): string {
    const isActive = activeCategory === category.id || activeCategory === null;
    
    return /* html */ `
      <div class="category-section ${isActive ? 'active' : 'hidden'}" data-category-content="${category.id}">
        <div class="category-header">
          <h2>${category.name}</h2>
          <p>${category.description}</p>
        </div>
        <div class="resources-grid">
          ${category.resources.map(resource => this.renderResource(resource)).join('')}
        </div>
      </div>
    `;
  }

  private renderResource(resource: Resource): string {
    const meta = this.getResourceMeta(resource);
    const tierClass = resource.tier ? `tier-${resource.tier.toLowerCase()}` : '';
    
    return /* html */ `
      <a href="${resource.url}" target="_blank" rel="noopener" class="resource-card card">
        <div class="resource-header">
          <h3>
            ${resource.tier ? `<span class="tier-badge ${tierClass}">${resource.tier}</span> ` : ''}
            ${resource.name}
          </h3>
          ${meta ? `<span class="resource-meta">${meta}</span>` : ''}
        </div>
        ${resource.author ? `<p class="resource-author">by ${resource.author}</p>` : ''}
        <p class="resource-description">${resource.description}</p>
        <div class="resource-tags">
          ${resource.bestFor.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <div class="resource-link">
          Open Resource
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </div>
      </a>
    `;
  }

  private getResourceMeta(resource: Resource): string | null {
    if (resource.stars) return `⭐ ${resource.stars}`;
    if (resource.subscribers) return `👥 ${resource.subscribers}`;
    if (resource.problemCount) return `📝 ${resource.problemCount} problems`;
    if (resource.price) return `💰 ${resource.price}`;
    return null;
  }

  private getFilteredCategories(categories: Category[], query: string): Category[] {
    if (!query.trim()) return categories;
    
    const lowerQuery = query.toLowerCase();
    return categories.map(cat => ({
      ...cat,
      resources: cat.resources.filter(r => 
        r.name.toLowerCase().includes(lowerQuery) ||
        r.description.toLowerCase().includes(lowerQuery) ||
        r.bestFor.some(tag => tag.toLowerCase().includes(lowerQuery))
      )
    })).filter(cat => cat.resources.length > 0);
  }

  afterRender(): void {
    // Load data on first render
    if (!this.dataLoaded && this.state.loading) {
      this.dataLoaded = true;
      this.loadData();
      return;
    }

    // Search handler
    const searchInput = this.container.querySelector('#resource-search') as HTMLInputElement;
    searchInput?.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      this.setState({ searchQuery: target.value, activeCategory: null });
    });

    // Category tab handlers
    const tabs = this.container.querySelectorAll('.category-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const categoryId = tab.getAttribute('data-category');
        this.setState({ activeCategory: categoryId });
      });
    });
  }
}
