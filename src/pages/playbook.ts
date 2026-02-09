// ============================================
// Playbook Page - Battle-Tested Strategies
// ============================================

import { Component } from '@components/base';
import playbookJson from '../data/playbook.json';

// --- Interfaces ---

interface SuccessStory {
  id: string;
  title: string;
  upvotes: string;
  source: string;
  sourceUrl: string;
  quote: string;
  keyTakeaways: string[];
  resources: string[];
  outcome: string;
  philosophy: string;
}

interface StudyTechnique {
  id: string;
  name: string;
  icon: string;
  difficulty: string;
  description: string;
  steps: string[];
  source: string;
  sourceUrl: string;
}

interface TacticStep {
  name: string;
  time: string;
  details: string;
  dos: string[];
  donts: string[];
}

interface InterviewTactic {
  id: string;
  name: string;
  icon: string;
  timeEstimate: string;
  description: string;
  steps: TacticStep[];
  source: string;
  sourceUrl: string;
}

interface ToolRecommendation {
  id: string;
  name: string;
  icon: string;
  url: string;
  category: string;
  description: string;
  whyItWorks: string;
}

interface WisdomQuote {
  id: string;
  quote: string;
  author: string;
  category: string;
}

interface EvalCriterion {
  name: string;
  weight: string;
  icon: string;
  description: string;
}

interface EvaluationCriteria {
  title: string;
  source: string;
  sourceUrl: string;
  criteria: EvalCriterion[];
}

interface StudyPlan {
  id: string;
  name: string;
  icon: string;
  dailyHours: string;
  totalProblems: string;
  approach: string;
  weeks: string[];
}

interface PlaybookData {
  successStories: SuccessStory[];
  studyTechniques: StudyTechnique[];
  interviewTactics: InterviewTactic[];
  toolsAndWorkflows: ToolRecommendation[];
  wisdomQuotes: WisdomQuote[];
  evaluationCriteria: EvaluationCriteria;
  studyPlans: StudyPlan[];
}

type TabId = 'stories' | 'techniques' | 'tactics' | 'tools' | 'plans' | 'wisdom';

interface PlaybookState {
  data: PlaybookData | null;
  loading: boolean;
  error: string | null;
  activeTab: TabId;
  expandedCards: Set<string>;
}

// --- Tabs Config ---

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'stories', label: 'Success Stories', icon: '🏆' },
  { id: 'techniques', label: 'Study Techniques', icon: '🧠' },
  { id: 'tactics', label: 'Interview Tactics', icon: '🎯' },
  { id: 'tools', label: 'Tools & Workflows', icon: '🔧' },
  { id: 'plans', label: 'Study Plans', icon: '📅' },
  { id: 'wisdom', label: 'Wisdom', icon: '💬' },
];

/**
 * Playbook page — community-proven strategies for DSA interview success.
 * Distinct from References (what to study) — this is HOW to succeed.
 */
export class PlaybookPage extends Component<PlaybookState> {
  private dataLoaded = false;

  constructor(container: HTMLElement) {
    super(container, {
      data: null,
      loading: true,
      error: null,
      activeTab: 'stories',
      expandedCards: new Set(),
    });
  }

  // --- Data Loading ---

  private async loadData(): Promise<void> {
    try {
      const data = playbookJson as unknown as PlaybookData;
      this.setState({ data, loading: false });
    } catch (error) {
      this.setState({
        error: error instanceof Error ? error.message : 'Unknown error',
        loading: false,
      });
    }
  }

  // --- Template ---

  template(): string {
    const { data, loading, error, activeTab } = this.state;

    if (loading) return this.renderLoading();
    if (error || !data) return this.renderError(error || 'Failed to load data');

    return /* html */ `
      <div class="page page-playbook">
        <div class="page-header">
          <div class="header-content">
            <h1>🗺️ The Playbook</h1>
            <p class="page-subtitle">Battle-tested strategies from people who actually got the offer</p>
          </div>
        </div>

        ${this.renderEvalCriteria(data.evaluationCriteria)}

        <div class="playbook-tabs">
          ${TABS.map(
            (tab) => /* html */ `
            <button class="playbook-tab ${activeTab === tab.id ? 'active' : ''}"
                    data-tab="${tab.id}">
              <span class="tab-icon">${tab.icon}</span>
              <span class="tab-label">${tab.label}</span>
            </button>
          `,
          ).join('')}
        </div>

        <div class="playbook-content">
          ${this.renderActiveTab(data, activeTab)}
        </div>
      </div>
    `;
  }

  // --- Tab Content Router ---

  private renderActiveTab(data: PlaybookData, tab: TabId): string {
    switch (tab) {
      case 'stories':
        return this.renderStories(data.successStories);
      case 'techniques':
        return this.renderTechniques(data.studyTechniques);
      case 'tactics':
        return this.renderTactics(data.interviewTactics);
      case 'tools':
        return this.renderTools(data.toolsAndWorkflows);
      case 'plans':
        return this.renderPlans(data.studyPlans);
      case 'wisdom':
        return this.renderWisdom(data.wisdomQuotes);
      default:
        return '';
    }
  }

  // --- Success Stories ---

  private renderStories(stories: SuccessStory[]): string {
    return /* html */ `
      <div class="playbook-section">
        <div class="section-intro">
          <h2>Real People, Real Offers</h2>
          <p>These aren't hypotheticals — they're from verified posts with thousands of upvotes on r/leetcode and respected engineering blogs.</p>
        </div>
        <div class="stories-grid">
          ${stories.map((story) => this.renderStoryCard(story)).join('')}
        </div>
      </div>
    `;
  }

  private renderStoryCard(story: SuccessStory): string {
    const isExpanded = this.state.expandedCards.has(story.id);
    return /* html */ `
      <div class="story-card card ${isExpanded ? 'expanded' : ''}">
        <div class="story-header">
          <div class="story-title-row">
            <h3>${story.title}</h3>
            ${story.upvotes ? `<span class="upvote-badge">▲ ${story.upvotes}</span>` : ''}
          </div>
          <div class="story-meta">
            <a href="${story.sourceUrl}" target="_blank" rel="noopener" class="source-link">${story.source}</a>
            <span class="story-outcome">${story.outcome}</span>
          </div>
        </div>
        <blockquote class="story-quote">"${story.quote}"</blockquote>
        <button class="expand-btn" data-story="${story.id}">
          ${isExpanded ? 'Show less ▲' : 'Key Takeaways ▼'}
        </button>
        ${
          isExpanded
            ? /* html */ `
          <div class="story-details">
            <div class="takeaways">
              <h4>Key Takeaways</h4>
              <ul>
                ${story.keyTakeaways.map((t) => `<li>${t}</li>`).join('')}
              </ul>
            </div>
            <div class="story-resources">
              <h4>Resources Used</h4>
              <div class="resource-chips">
                ${story.resources.map((r) => `<span class="chip">${r}</span>`).join('')}
              </div>
            </div>
          </div>
        `
            : ''
        }
      </div>
    `;
  }

  // --- Study Techniques ---

  private renderTechniques(techniques: StudyTechnique[]): string {
    return /* html */ `
      <div class="playbook-section">
        <div class="section-intro">
          <h2>How to Actually Learn</h2>
          <p>The difference between grinding 500 problems and mastering 150 is your approach. These techniques are consistently recommended by successful candidates.</p>
        </div>
        <div class="techniques-grid">
          ${techniques.map((t) => this.renderTechniqueCard(t)).join('')}
        </div>
      </div>
    `;
  }

  private renderTechniqueCard(technique: StudyTechnique): string {
    const isExpanded = this.state.expandedCards.has(technique.id);
    return /* html */ `
      <div class="technique-card card ${isExpanded ? 'expanded' : ''}">
        <div class="technique-header">
          <span class="technique-icon">${technique.icon}</span>
          <div>
            <h3>${technique.name}</h3>
            <span class="difficulty-badge badge-${technique.difficulty.toLowerCase().replace(/[^a-z]/g, '-')}">${technique.difficulty}</span>
          </div>
        </div>
        <p class="technique-description">${technique.description}</p>
        <button class="expand-btn" data-technique="${technique.id}">
          ${isExpanded ? 'Hide steps ▲' : 'Show steps ▼'}
        </button>
        ${
          isExpanded
            ? /* html */ `
          <div class="technique-steps">
            <ol>
              ${technique.steps.map((s) => `<li>${s}</li>`).join('')}
            </ol>
            <a href="${technique.sourceUrl}" target="_blank" rel="noopener" class="source-cite">
              Source: ${technique.source}
            </a>
          </div>
        `
            : ''
        }
      </div>
    `;
  }

  // --- Interview Tactics ---

  private renderTactics(tactics: InterviewTactic[]): string {
    return /* html */ `
      <div class="playbook-section">
        <div class="section-intro">
          <h2>Interview Day Playbook</h2>
          <p>What separates a good candidate from a great one isn't just problem-solving — it's communication, structure, and composure.</p>
        </div>
        <div class="tactics-list">
          ${tactics.map((t) => this.renderTacticCard(t)).join('')}
        </div>
      </div>
    `;
  }

  private renderTacticCard(tactic: InterviewTactic): string {
    const isExpanded = this.state.expandedCards.has(tactic.id);
    return /* html */ `
      <div class="tactic-card card ${isExpanded ? 'expanded' : ''}">
        <div class="tactic-header" data-tactic="${tactic.id}" role="button" tabindex="0">
          <span class="tactic-icon">${tactic.icon}</span>
          <div class="tactic-title">
            <h3>${tactic.name}</h3>
            <span class="tactic-time">${tactic.timeEstimate}</span>
          </div>
          <span class="expand-chevron">${isExpanded ? '▲' : '▼'}</span>
        </div>
        <p class="tactic-description">${tactic.description}</p>
        ${
          isExpanded
            ? /* html */ `
          <div class="tactic-steps">
            ${tactic.steps.map((step) => this.renderTacticStep(step)).join('')}
            <a href="${tactic.sourceUrl}" target="_blank" rel="noopener" class="source-cite">
              Source: ${tactic.source}
            </a>
          </div>
        `
            : ''
        }
      </div>
    `;
  }

  private renderTacticStep(step: TacticStep): string {
    return /* html */ `
      <div class="tactic-step">
        <div class="step-header">
          <strong>${step.name}</strong>
          ${step.time ? `<span class="step-time">${step.time}</span>` : ''}
        </div>
        <p>${step.details}</p>
        <div class="dos-donts">
          <div class="dos">
            ${step.dos.map((d) => `<span class="do-item">✅ ${d}</span>`).join('')}
          </div>
          <div class="donts">
            ${step.donts.map((d) => `<span class="dont-item">❌ ${d}</span>`).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // --- Tools & Workflows ---

  private renderTools(tools: ToolRecommendation[]): string {
    const categories = [...new Set(tools.map((t) => t.category))];
    return /* html */ `
      <div class="playbook-section">
        <div class="section-intro">
          <h2>Tools of the Trade</h2>
          <p>The right tools don't replace hard work — but they make your hard work count for more.</p>
        </div>
        ${categories
          .map(
            (cat) => /* html */ `
          <div class="tools-category">
            <h3 class="category-label">${cat}</h3>
            <div class="tools-grid">
              ${tools
                .filter((t) => t.category === cat)
                .map((t) => this.renderToolCard(t))
                .join('')}
            </div>
          </div>
        `,
          )
          .join('')}
      </div>
    `;
  }

  private renderToolCard(tool: ToolRecommendation): string {
    return /* html */ `
      <a href="${tool.url}" target="_blank" rel="noopener" class="tool-card card">
        <div class="tool-header">
          <span class="tool-icon">${tool.icon}</span>
          <h3>${tool.name}</h3>
        </div>
        <p class="tool-description">${tool.description}</p>
        <p class="tool-why"><strong>Why it works:</strong> ${tool.whyItWorks}</p>
        <span class="tool-link">
          Open →
        </span>
      </a>
    `;
  }

  // --- Study Plans ---

  private renderPlans(plans: StudyPlan[]): string {
    return /* html */ `
      <div class="playbook-section">
        <div class="section-intro">
          <h2>Pick Your Path</h2>
          <p>There's no one-size-fits-all. Choose the plan that matches your timeline, then commit to it.</p>
        </div>
        <div class="plans-grid">
          ${plans.map((p) => this.renderPlanCard(p)).join('')}
        </div>
      </div>
    `;
  }

  private renderPlanCard(plan: StudyPlan): string {
    return /* html */ `
      <div class="plan-card card">
        <div class="plan-header">
          <span class="plan-icon">${plan.icon}</span>
          <h3>${plan.name}</h3>
        </div>
        <div class="plan-stats">
          <span class="stat"><strong>⏱️</strong> ${plan.dailyHours}h/day</span>
          <span class="stat"><strong>📝</strong> ${plan.totalProblems} problems</span>
          <span class="stat"><strong>🧭</strong> ${plan.approach}</span>
        </div>
        <div class="plan-weeks">
          ${plan.weeks.map((w) => `<div class="week-item">${w}</div>`).join('')}
        </div>
      </div>
    `;
  }

  // --- Wisdom Quotes ---

  private renderWisdom(quotes: WisdomQuote[]): string {
    const categories = [...new Set(quotes.map((q) => q.category))];
    const categoryLabels: Record<string, string> = {
      patterns: '🧩 Pattern Recognition',
      learning: '📖 Learning Philosophy',
      consistency: '🔄 Consistency',
      mindset: '🧘 Mindset',
      efficiency: '⚡ Efficiency',
      tactics: '🎯 Tactics',
      resilience: '💪 Resilience',
      fundamentals: '🏗️ Fundamentals',
    };

    return /* html */ `
      <div class="playbook-section">
        <div class="section-intro">
          <h2>Words to Code By</h2>
          <p>Wisdom distilled from engineers who've been through the process and came out the other side.</p>
        </div>
        ${categories
          .map(
            (cat) => /* html */ `
          <div class="wisdom-category">
            <h3>${categoryLabels[cat] || cat}</h3>
            <div class="quotes-grid">
              ${quotes
                .filter((q) => q.category === cat)
                .map((q) => this.renderQuoteCard(q))
                .join('')}
            </div>
          </div>
        `,
          )
          .join('')}
      </div>
    `;
  }

  private renderQuoteCard(quote: WisdomQuote): string {
    return /* html */ `
      <div class="quote-card">
        <blockquote>"${quote.quote}"</blockquote>
        <cite>— ${quote.author}</cite>
      </div>
    `;
  }

  // --- Evaluation Criteria ---

  private renderEvalCriteria(criteria: EvaluationCriteria): string {
    return /* html */ `
      <div class="eval-criteria-bar">
        <span class="eval-title">What interviewers evaluate:</span>
        <div class="eval-items">
          ${criteria.criteria
            .map(
              (c) => /* html */ `
            <span class="eval-item" title="${c.description}">
              ${c.icon} ${c.name} <strong>${c.weight}</strong>
            </span>
          `,
            )
            .join('')}
        </div>
        <a href="${criteria.sourceUrl}" target="_blank" rel="noopener" class="eval-source">Source</a>
      </div>
    `;
  }

  // --- Loading / Error ---

  private renderLoading(): string {
    return /* html */ `
      <div class="page page-playbook">
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading playbook...</p>
        </div>
      </div>
    `;
  }

  private renderError(message: string): string {
    return /* html */ `
      <div class="page page-playbook">
        <div class="error-state">
          <span class="error-icon">⚠️</span>
          <h2>Error Loading Playbook</h2>
          <p>${message}</p>
          <button class="btn btn-primary" onclick="location.reload()">Retry</button>
        </div>
      </div>
    `;
  }

  // --- Lifecycle ---

  afterRender(): void {
    if (!this.dataLoaded && this.state.loading) {
      this.dataLoaded = true;
      this.loadData();
      return;
    }

    // Tab handlers
    this.container.querySelectorAll('.playbook-tab').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab') as TabId;
        if (tabId) this.setState({ activeTab: tabId, expandedCards: new Set() });
      });
    });

    // Story expand handlers
    this.container.querySelectorAll('.expand-btn[data-story]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-story');
        if (id) this.toggleCard(id);
      });
    });

    // Technique expand handlers
    this.container.querySelectorAll('.expand-btn[data-technique]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-technique');
        if (id) this.toggleCard(id);
      });
    });

    // Tactic header expand handlers
    this.container.querySelectorAll('.tactic-header[data-tactic]').forEach((el) => {
      el.addEventListener('click', () => {
        const id = el.getAttribute('data-tactic');
        if (id) this.toggleCard(id);
      });
      el.addEventListener('keydown', (e) => {
        if ((e as KeyboardEvent).key === 'Enter' || (e as KeyboardEvent).key === ' ') {
          e.preventDefault();
          const id = el.getAttribute('data-tactic');
          if (id) this.toggleCard(id);
        }
      });
    });
  }

  private toggleCard(id: string): void {
    const newSet = new Set(this.state.expandedCards);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    this.setState({ expandedCards: newSet });
  }
}
