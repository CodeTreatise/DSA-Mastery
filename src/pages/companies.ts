// ============================================
// Companies Page - Uses validated company-problems.json data
// Supports categorization by Tier, Domain, and Region
// ============================================

import { Component } from '@components/base';

interface CompanyProblem {
  title: string;
  leetcodeId: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  frequency: number;
  pattern: string;
  topicFile: string;
  sources?: string[];
  validated?: boolean;
}

interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  description?: string;
  avgTC?: string;
}

interface Categories {
  tiers: CategoryItem[];
  domains: CategoryItem[];
  regions: CategoryItem[];
}

interface CompanyData {
  id: string;
  name: string;
  logo: string;
  tier: string;
  domain: string;
  region: string;
  difficulty: string;
  focusAreas: string[];
  interviewTips: string;
  validatedFromSource?: string;
  validationNote?: string;
  problems: CompanyProblem[];
}

type FilterDimension = 'all' | 'tier' | 'domain' | 'region';

interface CompaniesPageState {
  searchQuery: string;
  companies: CompanyData[];
  categories: Categories | null;
  selectedCompany: CompanyData | null;
  activeDimension: FilterDimension;
  activeFilter: string | null;
  loading: boolean;
  error: string | null;
  dataLoaded: boolean;
}

/**
 * Companies page with interview focus areas - fetches from validated JSON data
 */
export class CompaniesPage extends Component<CompaniesPageState> {
  constructor(container: HTMLElement) {
    super(container, { 
      searchQuery: '', 
      companies: [],
      categories: null,
      selectedCompany: null,
      activeDimension: 'all',
      activeFilter: null,
      loading: true,
      error: null,
      dataLoaded: false
    });
  }

  private async loadCompanyData(): Promise<void> {
    // Prevent multiple loads
    if (this.state.dataLoaded) return;
    
    try {
      // Use import.meta.env.BASE_URL for correct path with base config
      const basePath = import.meta.env.BASE_URL || '/';
      const response = await fetch(`${basePath}data/company-problems.json`);
      if (!response.ok) throw new Error('Failed to load company data');
      const data = await response.json();
      this.setState({ 
        companies: data.companies, 
        categories: data.categories || null,
        loading: false, 
        dataLoaded: true 
      });
    } catch (err) {
      console.error('Error loading company data:', err);
      this.setState({ error: 'Failed to load company data', loading: false, dataLoaded: true });
    }
  }

  template(): string {
    const { searchQuery, companies, selectedCompany, loading, error } = this.state;

    if (loading) {
      return /* html */ `
        <div class="page page-companies">
          <div class="page-header">
            <h1>Companies</h1>
            <p class="page-subtitle">Loading company data...</p>
          </div>
          <div class="loading-spinner"></div>
        </div>
      `;
    }

    if (error) {
      return /* html */ `
        <div class="page page-companies">
          <div class="page-header">
            <h1>Companies</h1>
            <p class="page-subtitle error-text">${error}</p>
          </div>
        </div>
      `;
    }

    // If a company is selected, show detail view
    if (selectedCompany) {
      return this.renderCompanyDetail(selectedCompany);
    }

    const { activeDimension, activeFilter, categories } = this.state;

    // Apply search filter
    let filteredCompanies = searchQuery
      ? companies.filter((c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.focusAreas.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      : companies;

    // Apply category filter
    if (activeFilter) {
      filteredCompanies = filteredCompanies.filter((c) => {
        if (activeDimension === 'tier') return c.tier === activeFilter;
        if (activeDimension === 'domain') return c.domain === activeFilter;
        if (activeDimension === 'region') return c.region === activeFilter;
        return true;
      });
    }

    return /* html */ `
      <div class="page page-companies">
        <div class="page-header">
          <h1>Companies</h1>
          <p class="page-subtitle">Interview preparation by company — categorized by tier, domain & region</p>
        </div>

        <div class="companies-filters">
          <div class="search-box">
            <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              class="search-input company-search" 
              placeholder="Search companies or focus areas..." 
              value="${searchQuery}"
            />
          </div>

          ${this.renderCategoryFilters(categories, activeDimension, activeFilter)}
        </div>

        ${this.renderFilteredHeader(activeDimension, activeFilter, filteredCompanies.length, categories)}

        <div class="companies-grid">
          ${filteredCompanies.map((company) => this.renderCompanyCard(company)).join('')}
        </div>
        
        ${filteredCompanies.length === 0 ? '<p class="no-results">No companies match your filters.</p>' : ''}
      </div>
    `;
  }

  private renderCategoryFilters(
    categories: Categories | null, 
    activeDimension: FilterDimension, 
    activeFilter: string | null
  ): string {
    if (!categories) return '';

    const dimensions: { id: FilterDimension; label: string; icon: string }[] = [
      { id: 'all', label: 'All', icon: '📋' },
      { id: 'tier', label: 'By Tier', icon: '💰' },
      { id: 'domain', label: 'By Domain', icon: '🏢' },
      { id: 'region', label: 'By Region', icon: '🌍' },
    ];

    let subFilters = '';
    if (activeDimension !== 'all') {
      const items = activeDimension === 'tier' ? categories.tiers
        : activeDimension === 'domain' ? categories.domains
        : categories.regions;

      subFilters = /* html */ `
        <div class="category-sub-filters">
          ${items.map(item => /* html */ `
            <button 
              class="filter-pill sub-pill ${activeFilter === item.id ? 'active' : ''}" 
              data-filter-value="${item.id}"
              data-filter-dimension="${activeDimension}"
              title="${item.description || item.name}"
            >
              <span class="pill-icon">${item.icon}</span>
              <span class="pill-label">${item.name}</span>
            </button>
          `).join('')}
        </div>
      `;
    }

    return /* html */ `
      <div class="category-filters">
        <div class="dimension-tabs">
          ${dimensions.map(d => /* html */ `
            <button 
              class="filter-pill dimension-pill ${activeDimension === d.id ? 'active' : ''}" 
              data-dimension="${d.id}"
            >
              <span class="pill-icon">${d.icon}</span>
              <span class="pill-label">${d.label}</span>
            </button>
          `).join('')}
        </div>
        ${subFilters}
      </div>
    `;
  }

  private renderFilteredHeader(
    dimension: FilterDimension, 
    filter: string | null, 
    count: number,
    categories: Categories | null
  ): string {
    if (dimension === 'all' || !filter || !categories) return '';

    const items = dimension === 'tier' ? categories.tiers
      : dimension === 'domain' ? categories.domains
      : categories.regions;
    const active = items.find(i => i.id === filter);
    if (!active) return '';

    const tierExtra = dimension === 'tier' && active.avgTC
      ? `<span class="filter-header-meta">Avg TC: ${active.avgTC}</span>` : '';

    return /* html */ `
      <div class="filter-result-header">
        <span class="filter-result-icon">${active.icon}</span>
        <span class="filter-result-title">${active.name}</span>
        ${active.description ? `<span class="filter-result-desc">— ${active.description}</span>` : ''}
        ${tierExtra}
        <span class="filter-result-count">${count} ${count === 1 ? 'company' : 'companies'}</span>
      </div>
    `;
  }

  private renderCompanyCard(company: CompanyData): string {
    const problemCount = company.problems.length;
    const isValidated = company.validatedFromSource && !company.validatedFromSource.includes('community');
    const tierClass = company.tier || 'tier-2';
    const tierLabel = this.getTierLabel(company.tier);
    const domainIcon = this.getCategoryIcon('domain', company.domain);
    const regionIcon = this.getCategoryIcon('region', company.region);
    
    return /* html */ `
      <div class="company-card card" data-company-id="${company.id}">
        <div class="company-header">
          <span class="company-logo">${company.logo}</span>
          <div class="company-info">
            <h3 class="company-name">${company.name}</h3>
            <span class="company-difficulty">${company.difficulty}</span>
            ${isValidated ? '<span class="validated-badge" title="Data validated from LeetCode frequency">✓</span>' : ''}
          </div>
          <span class="tier-badge ${tierClass}" title="${tierLabel}">${tierLabel}</span>
        </div>

        <div class="company-tags-row">
          <span class="company-tag domain-tag" title="Domain">${domainIcon}</span>
          <span class="company-tag region-tag" title="Region">${regionIcon}</span>
        </div>

        <div class="company-focus">
          <span class="focus-label">Focus Areas:</span>
          <div class="focus-tags">
            ${company.focusAreas.slice(0, 4).map((f) => `<span class="tag">${f}</span>`).join('')}
          </div>
        </div>

        <div class="company-meta">
          <span class="problem-count">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
            ${problemCount} problems
          </span>
        </div>

        <button class="btn btn-primary view-problems-btn" data-company-id="${company.id}">
          View Top Problems
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    `;
  }

  private renderCompanyDetail(company: CompanyData): string {
    const isValidated = company.validatedFromSource && !company.validatedFromSource.includes('community');
    const tierLabel = this.getTierLabel(company.tier);
    const tierClass = company.tier || 'tier-2';
    const domainIcon = this.getCategoryIcon('domain', company.domain);
    const regionIcon = this.getCategoryIcon('region', company.region);
    
    return /* html */ `
      <div class="page page-companies company-detail">
        <div class="page-header compact">
          <button class="btn btn-ghost back-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Back
          </button>
          <div class="company-title">
            <span class="company-logo-large">${company.logo}</span>
            <h1>${company.name}</h1>
            <span class="company-difficulty-badge">${company.difficulty}</span>
            <span class="tier-badge ${tierClass}">${tierLabel}</span>
          </div>
        </div>

        <div class="company-category-row">
          <span class="category-chip">${domainIcon}</span>
          <span class="category-chip">${regionIcon}</span>
        </div>

        <div class="company-info-row">
          <div class="company-tips card">
            <h4>💡 Interview Tips</h4>
            <p>${company.interviewTips}</p>
            ${isValidated ? `<small class="validation-note">📊 ${company.validatedFromSource}</small>` : ''}
            ${company.validationNote ? `<small class="validation-warning">⚠️ ${company.validationNote}</small>` : ''}
          </div>

          <div class="company-focus-areas card">
            <h4>🎯 Focus Areas</h4>
            <div class="focus-tags">
              ${company.focusAreas.map((f) => `<span class="tag">${f}</span>`).join('')}
            </div>
          </div>
        </div>

        <div class="problems-section">
          <div class="problems-header">
            <h3>📝 Top ${company.problems.length} Interview Problems</h3>
            <span class="problems-note">Ranked by interview frequency</span>
          </div>
          <div class="problems-table-wrapper">
            <table class="problems-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Problem</th>
                  <th>Difficulty</th>
                  <th>Pattern</th>
                  <th>Sources</th>
                  <th>Topic</th>
                  <th>Frequency</th>
                  <th>Links</th>
                </tr>
              </thead>
              <tbody>
                ${company.problems.map((p, i) => this.renderProblemRow(p, i + 1)).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  private renderProblemRow(problem: CompanyProblem, rank: number): string {
    const difficultyClass = problem.difficulty.toLowerCase();
    const leetcodeUrl = `https://leetcode.com/problems/${this.slugify(problem.title)}/`;
    const frequencyBar = Math.min(100, (problem.frequency / 600) * 100);
    const topicRoute = this.getTopicRoute(problem.topicFile);
    const topicName = this.getTopicName(problem.topicFile);
    const sourceBadges = (problem.sources ?? []).map(s => {
      const cls = this.getSourceClass(s);
      return `<span class="source-badge ${cls}" title="${s}">${this.getSourceAbbr(s)}</span>`;
    }).join('');
    
    return /* html */ `
      <tr>
        <td class="rank">${rank}</td>
        <td class="problem-title">
          ${problem.title}
          ${problem.validated ? '<span class="validated-dot" title="Validated">•</span>' : ''}
        </td>
        <td><span class="difficulty-badge ${difficultyClass}">${problem.difficulty}</span></td>
        <td class="pattern">${problem.pattern}</td>
        <td class="sources">${sourceBadges || '<span class="no-source">—</span>'}</td>
        <td class="topic">
          <a href="#/topics/${topicRoute}" class="topic-link" title="${problem.topicFile}">
            📚 ${topicName}
          </a>
        </td>
        <td class="frequency">
          <div class="frequency-bar-container">
            <div class="frequency-bar" style="width: ${frequencyBar}%"></div>
          </div>
        </td>
        <td class="links">
          <a href="${leetcodeUrl}" target="_blank" rel="noopener" class="problem-link" title="Open on LeetCode">
            LC
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
        </td>
      </tr>
    `;
  }

  private getTopicRoute(topicFile: string): string {
    // Extract topic path for routing: "01-Arrays-Strings/01-Arrays/1.4-Common-Techniques/01-Two-Pointers.md"
    // becomes "arrays-strings" (matching topic IDs in topics.json)
    const parts = topicFile.split('/');
    const folderName = parts[0].replace('.md', '');
    // Remove number prefix (e.g., "01-") and convert to lowercase
    return folderName.replace(/^\d+-/, '').toLowerCase();
  }

  private getTopicName(topicFile: string): string {
    // Get a short display name from the topic file path
    const parts = topicFile.split('/');
    const fileName = parts[parts.length - 1].replace('.md', '');
    // Remove number prefix like "01-" or "1.4-"
    return fileName.replace(/^[\d.]+-/, '').replace(/-/g, ' ');
  }

  private slugify(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  private getSourceClass(source: string): string {
    const map: Record<string, string> = {
      'Blind 75': 'source-blind75',
      'NeetCode 150': 'source-neetcode',
      'Grind 75': 'source-grind75',
      'Striver SDE': 'source-striver',
      'LC Top 100': 'source-lctop',
    };
    return map[source] ?? 'source-default';
  }

  private getSourceAbbr(source: string): string {
    const map: Record<string, string> = {
      'Blind 75': 'B75',
      'NeetCode 150': 'NC',
      'Grind 75': 'G75',
      'Striver SDE': 'SDE',
      'LC Top 100': 'T100',
    };
    return map[source] ?? source;
  }

  private getTierLabel(tier: string): string {
    const labels: Record<string, string> = {
      's-tier': 'S-Tier',
      'tier-1': 'FAANG+',
      'tier-2': 'Strong',
      'tier-3': 'Mid-Market',
    };
    return labels[tier] || tier;
  }

  private getCategoryIcon(type: 'domain' | 'region', id: string): string {
    const { categories } = this.state;
    if (!categories) return id;
    const items = type === 'domain' ? categories.domains : categories.regions;
    const item = items.find(i => i.id === id);
    return item ? `${item.icon} ${item.name}` : id;
  }

  afterRender(): void {
    // Load data on first render only
    if (!this.state.dataLoaded && this.state.loading) {
      this.loadCompanyData();
      return; // Don't set up other handlers yet
    }

    // Search input handler
    const searchInput = this.container.querySelector('.company-search') as HTMLInputElement;
    searchInput?.addEventListener('input', this.debounce((e: Event) => {
      const target = e.target as HTMLInputElement;
      this.setState({ searchQuery: target.value });
    }, 200));

    // Dimension tab handlers (All / By Tier / By Domain / By Region)
    const dimensionPills = this.container.querySelectorAll('.dimension-pill');
    dimensionPills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        const dimension = (e.currentTarget as HTMLElement).dataset.dimension as FilterDimension;
        this.setState({ 
          activeDimension: dimension, 
          activeFilter: null // Reset sub-filter when switching dimensions
        });
      });
    });

    // Sub-filter pill handlers (specific tier/domain/region values)
    const subPills = this.container.querySelectorAll('.sub-pill');
    subPills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        const value = (e.currentTarget as HTMLElement).dataset.filterValue!;
        // Toggle: clicking same filter deselects it
        const newFilter = this.state.activeFilter === value ? null : value;
        this.setState({ activeFilter: newFilter });
      });
    });

    // View problems button handler
    const viewBtns = this.container.querySelectorAll('.view-problems-btn');
    viewBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const companyId = (e.currentTarget as HTMLElement).dataset.companyId;
        const company = this.state.companies.find(c => c.id === companyId);
        if (company) {
          this.setState({ selectedCompany: company });
        }
      });
    });

    // Back button handler
    const backBtn = this.container.querySelector('.back-btn');
    backBtn?.addEventListener('click', () => {
      this.setState({ selectedCompany: null });
    });
  }
}
