// ============================================
// Home Page (Dashboard) — Command Center
// ============================================

import { Component } from '@components/base';
import {
  getHeroStats,
  getTopicMastery,
  getPatternCoverage,
  getHeatmapData,
  getSmartActions,
  loadCompanyData,
  computeCompanyReadiness,
  getSolvedProblemTitles,
} from '@services/dashboard-service';
import type {
  HeroStats,
  TopicMastery,
  PatternCoverage,
  HeatmapDay,
  SmartAction,
  CompanyReadiness,
} from '@services/dashboard-service';

interface HomePageState {
  loaded: boolean;
  companyReadiness: CompanyReadiness[];
}

/**
 * Dashboard — personalized command center for DSA prep
 */
export class HomePage extends Component<HomePageState> {
  constructor(container: HTMLElement) {
    super(container, { loaded: false, companyReadiness: [] });
    this.loadAsync();
  }

  private async loadAsync(): Promise<void> {
    const data = await loadCompanyData();
    if (data) {
      const solvedTitles = getSolvedProblemTitles();
      const readiness = computeCompanyReadiness(data, solvedTitles);
      this.setState({ companyReadiness: readiness, loaded: true });
    } else {
      this.setState({ loaded: true });
    }
  }

  template(): string {
    const hero = getHeroStats();
    const mastery = getTopicMastery();
    const patterns = getPatternCoverage();
    const heatmap = getHeatmapData(16);
    const actions = getSmartActions();
    const { companyReadiness } = this.state;

    return /* html */ `
      <div class="page page-dashboard">
        <div class="page-header">
          <h1>Dashboard</h1>
          <p class="page-subtitle">Your DSA prep command center</p>
        </div>

        ${this.renderHeroStats(hero)}
        
        <div class="dash-grid-2">
          ${this.renderHeatmap(heatmap)}
          ${this.renderSmartActions(actions)}
        </div>

        <div class="dash-grid-2">
          ${this.renderTopicMastery(mastery)}
          ${this.renderPatternCoverage(patterns)}
        </div>

        ${this.renderCompanyReadiness(companyReadiness)}
      </div>
    `;
  }

  // ── ① Hero Stats Row ──

  private renderHeroStats(h: HeroStats): string {
    const conceptPct = h.conceptsTotal > 0 ? Math.round((h.conceptsDone / h.conceptsTotal) * 100) : 0;
    const problemPct = h.problemsTotal > 0 ? Math.round((h.problemsSolved / h.problemsTotal) * 100) : 0;
    const topicPct = h.topicsTotal > 0 ? Math.round((h.topicsCovered / h.topicsTotal) * 100) : 0;
    
    const totalSolved = h.solvedByDifficulty.easy + h.solvedByDifficulty.medium + h.solvedByDifficulty.hard;
    const easyPct = totalSolved > 0 ? Math.round((h.solvedByDifficulty.easy / totalSolved) * 100) : 0;
    const medPct = totalSolved > 0 ? Math.round((h.solvedByDifficulty.medium / totalSolved) * 100) : 0;
    const hardPct = totalSolved > 0 ? Math.round((h.solvedByDifficulty.hard / totalSolved) * 100) : 0;

    return /* html */ `
      <div class="hero-stats">
        <div class="hero-card">
          <div class="hero-icon">🔥</div>
          <div class="hero-content">
            <div class="hero-value">${h.streak}</div>
            <div class="hero-label">Day Streak</div>
            <div class="hero-sub">Best: ${h.longestStreak}</div>
          </div>
        </div>

        <div class="hero-card">
          <div class="hero-icon">📚</div>
          <div class="hero-content">
            <div class="hero-value">${h.topicsCovered}<span class="hero-of">/${h.topicsTotal}</span></div>
            <div class="hero-label">Topics Covered</div>
            <div class="hero-bar"><div class="hero-fill" style="width:${topicPct}%"></div></div>
          </div>
        </div>

        <div class="hero-card">
          <div class="hero-icon">💡</div>
          <div class="hero-content">
            <div class="hero-value">${h.conceptsDone}<span class="hero-of">/${h.conceptsTotal}</span></div>
            <div class="hero-label">Concepts Learned</div>
            <div class="hero-bar"><div class="hero-fill" style="width:${conceptPct}%"></div></div>
          </div>
        </div>

        <div class="hero-card">
          <div class="hero-icon">✅</div>
          <div class="hero-content">
            <div class="hero-value">${h.problemsSolved}<span class="hero-of">/${h.problemsTotal}</span></div>
            <div class="hero-label">Problems Solved</div>
            <div class="hero-bar"><div class="hero-fill accent" style="width:${problemPct}%"></div></div>
          </div>
        </div>

        <div class="hero-card">
          <div class="hero-icon">🎯</div>
          <div class="hero-content">
            <div class="hero-value">${totalSolved}</div>
            <div class="hero-label">Difficulty Split</div>
            <div class="hero-difficulty-bar">
              ${totalSolved > 0 ? `
                <div class="diff-seg easy" style="width:${easyPct}%" title="Easy: ${h.solvedByDifficulty.easy}"></div>
                <div class="diff-seg medium" style="width:${medPct}%" title="Medium: ${h.solvedByDifficulty.medium}"></div>
                <div class="diff-seg hard" style="width:${hardPct}%" title="Hard: ${h.solvedByDifficulty.hard}"></div>
              ` : '<div class="diff-seg empty" style="width:100%"></div>'}
            </div>
            <div class="hero-diff-legend">
              <span class="legend-item"><span class="legend-dot easy"></span>${h.solvedByDifficulty.easy}E</span>
              <span class="legend-item"><span class="legend-dot medium"></span>${h.solvedByDifficulty.medium}M</span>
              <span class="legend-item"><span class="legend-dot hard"></span>${h.solvedByDifficulty.hard}H</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ── ② Study Heatmap (GitHub-style contribution graph) ──

  private renderHeatmap(days: HeatmapDay[]): string {
    // Build columns: each column = one week (Mon..Sun)
    const weeks: HeatmapDay[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    const dayLabels = ['Mon', '', 'Wed', '', 'Fri', '', ''];
    const studiedCount = days.filter(d => d.studied).length;
    const totalDays = days.filter(d => !d.isFuture).length;

    // Month labels — placed at the week column where a new month starts
    const monthLabels: Array<{ label: string; col: number }> = [];
    let lastMonth = -1;
    weeks.forEach((week, wIdx) => {
      if (week.length === 0) return;
      const d = new Date(week[0].date);
      if (d.getMonth() !== lastMonth) {
        monthLabels.push({ label: d.toLocaleString('en', { month: 'short' }), col: wIdx });
        lastMonth = d.getMonth();
      }
    });

    const colTemplate = `28px repeat(${weeks.length}, 1fr)`;

    return /* html */ `
      <section class="dash-card heatmap-section">
        <div class="dash-card-header">
          <h2>📅 Study Activity</h2>
          <span class="dash-card-badge">${studiedCount} of ${totalDays} days</span>
        </div>
        <div class="heatmap-wrapper">
          <div class="heatmap-months" style="grid-template-columns: ${colTemplate};">
            <span></span>
            ${weeks.map((_, wIdx) => {
              const ml = monthLabels.find(m => m.col === wIdx);
              return ml ? `<span class="heatmap-month">${ml.label}</span>` : '<span></span>';
            }).join('')}
          </div>
          <div class="heatmap-grid" style="grid-template-columns: ${colTemplate};">
            ${dayLabels.map((label, row) => `<span class="heatmap-day-label">${label}</span>
${weeks.map(week => {
  const day = week[row];
  if (!day) return '<span class="heatmap-cell empty"></span>';
  const cls = day.isFuture ? 'future' : day.studied ? 'studied' : 'missed';
  const todayCls = day.isToday ? ' today' : '';
  return `<span class="heatmap-cell ${cls}${todayCls}" title="${day.date}${day.studied ? ' ✓' : ''}"></span>`;
}).join('')}`).join('\n')}
          </div>
          <div class="heatmap-legend">
            <span class="heatmap-legend-label">Less</span>
            <span class="heatmap-cell missed"></span>
            <span class="heatmap-cell studied"></span>
            <span class="heatmap-legend-label">More</span>
          </div>
        </div>
      </section>
    `;
  }

  // ── ③ Smart Actions ──

  private renderSmartActions(actions: SmartAction[]): string {
    return /* html */ `
      <section class="dash-card actions-section">
        <div class="dash-card-header">
          <h2>⚡ What's Next</h2>
        </div>
        <div class="smart-actions">
          ${actions.map(a => /* html */ `
            <a href="${a.href}" class="smart-action">
              <span class="smart-action-icon">${a.icon}</span>
              <div class="smart-action-content">
                <div class="smart-action-title">${a.title}</div>
                <div class="smart-action-desc">${a.description}</div>
              </div>
              <span class="smart-action-arrow">→</span>
            </a>
          `).join('')}
        </div>
      </section>
    `;
  }

  // ── ④ Topic Mastery ──

  private renderTopicMastery(topics: TopicMastery[]): string {
    const started = topics.filter(t => t.status !== 'not-started').length;
    return /* html */ `
      <section class="dash-card mastery-section">
        <div class="dash-card-header">
          <h2>📊 Topic Mastery</h2>
          <span class="dash-card-badge">${started}/${topics.length} started</span>
        </div>
        <div class="mastery-list">
          ${topics.map(t => {
            const statusCls = t.status;
            return /* html */ `
              <a href="#/topics/${t.id}" class="mastery-row ${statusCls}">
                <span class="mastery-order">${String(t.order).padStart(2, '0')}</span>
                <span class="mastery-name">${t.title}</span>
                <div class="mastery-bar-wrap">
                  <div class="mastery-bar">
                    <div class="mastery-fill ${statusCls}" style="width:${t.percent}%"></div>
                  </div>
                </div>
                <span class="mastery-pct">${t.percent}%</span>
              </a>
            `;
          }).join('')}
        </div>
      </section>
    `;
  }

  // ── ⑤ Pattern Coverage ──

  private renderPatternCoverage(patterns: PatternCoverage[]): string {
    if (patterns.length === 0) {
      return /* html */ `
        <section class="dash-card pattern-section">
          <div class="dash-card-header">
            <h2>🔷 Pattern Coverage</h2>
          </div>
          <div class="empty-state-small">Start solving problems to track pattern coverage</div>
        </section>
      `;
    }

    return /* html */ `
      <section class="dash-card pattern-section">
        <div class="dash-card-header">
          <h2>🔷 Pattern Coverage</h2>
          <a href="#/patterns" class="dash-card-link">View All →</a>
        </div>
        <div class="pattern-list">
          ${patterns.map(p => {
            const freqCls = p.frequency;
            return /* html */ `
              <div class="pattern-row">
                <div class="pattern-info">
                  <span class="pattern-name">${p.name}</span>
                  <span class="pattern-freq ${freqCls}">${p.frequency}</span>
                </div>
                <div class="pattern-bar-wrap">
                  <div class="pattern-bar">
                    <div class="pattern-fill" style="width:${p.percent}%"></div>
                  </div>
                  <span class="pattern-count">${p.solved}/${p.total}</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </section>
    `;
  }

  // ── ⑥ Company Readiness ──

  private renderCompanyReadiness(companies: CompanyReadiness[]): string {
    if (companies.length === 0) {
      return /* html */ `
        <section class="dash-card company-readiness-section">
          <div class="dash-card-header">
            <h2>🏢 Company Readiness</h2>
            <a href="#/companies" class="dash-card-link">Browse Companies →</a>
          </div>
          <div class="empty-state-small">Solve problems to track your readiness for top companies</div>
        </section>
      `;
    }

    return /* html */ `
      <section class="dash-card company-readiness-section">
        <div class="dash-card-header">
          <h2>🏢 Company Readiness</h2>
          <a href="#/companies" class="dash-card-link">Browse All →</a>
        </div>
        <div class="company-readiness-list">
          ${companies.map(c => /* html */ `
            <a href="#/companies" class="company-readiness-row" data-company="${c.id}">
              <span class="cr-logo">${c.logo}</span>
              <span class="cr-name">${c.name}</span>
              <div class="cr-bar-wrap">
                <div class="cr-bar">
                  <div class="cr-fill" style="width:${c.percent}%"></div>
                </div>
              </div>
              <span class="cr-stats">${c.solved}/${c.total}</span>
              <span class="cr-pct">${c.percent}%</span>
            </a>
          `).join('')}
        </div>
      </section>
    `;
  }
}
