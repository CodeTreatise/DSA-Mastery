// ============================================
// Progress Page — Deep Analytics
// ============================================

import { Component } from '@components/base';
import {
  getWeeklyActivity,
  getPatternGaps,
  getReviewQueue,
  getDifficultyCalibration,
  getSolveTimeStats,
  getTopicDeepDive,
  getMilestones,
} from '@services/progress-analytics';
import type {
  WeeklyActivity,
  PatternGap,
  ReviewItem,
  DifficultyCalibration,
  SolveTimeStat,
  TopicDeepDive,
  Milestone,
} from '@services/progress-analytics';

interface ProgressPageState {
  activeTab: 'overview' | 'topics';
}

/**
 * Deep analytics page — complements Dashboard with drill-down insights
 */
export class ProgressPage extends Component<ProgressPageState> {
  constructor(container: HTMLElement) {
    super(container, { activeTab: 'overview' });
  }

  template(): string {
    const weekly = getWeeklyActivity(8);
    const gaps = getPatternGaps();
    const queue = getReviewQueue();
    const calibration = getDifficultyCalibration();
    const timeStats = getSolveTimeStats();
    const topicDive = getTopicDeepDive();
    const milestones = getMilestones();

    const maxWeekly = Math.max(1, ...weekly.map(w => w.problemsSolved + w.conceptsLearned));
    const achieved = milestones.filter(m => m.achieved).length;

    return /* html */ `
      <div class="page page-progress">
        <div class="page-header">
          <h1>Analytics</h1>
          <p class="page-subtitle">Deep insights into your DSA journey</p>
        </div>

        <!-- ── Section 1: Weekly Activity ── -->
        <section class="analytics-card card">
          <h2>📈 Weekly Activity</h2>
          <p class="section-hint">Problems solved + concepts learned per week</p>
          <div class="weekly-chart" role="img" aria-label="Weekly activity chart">
            ${weekly.map(w => this.renderWeekBar(w, maxWeekly)).join('')}
          </div>
          <div class="chart-legend">
            <span class="legend-item"><span class="legend-dot solved"></span> Problems</span>
            <span class="legend-item"><span class="legend-dot concepts"></span> Concepts</span>
          </div>
        </section>

        <!-- ── Section 2: Pattern Gaps + Calibration ── -->
        <div class="analytics-split">
          <section class="analytics-card card">
            <h2>🎯 Pattern Gaps</h2>
            <p class="section-hint">Weakest patterns first — focus here for max ROI</p>
            ${gaps.length === 0
              ? '<p class="empty-state">No pattern data yet. Solve some problems!</p>'
              : `<div class="gap-list">${gaps.slice(0, 8).map(g => this.renderPatternGap(g)).join('')}</div>`
            }
          </section>

          <section class="analytics-card card">
            <h2>⚖️ Difficulty Calibration</h2>
            ${this.renderCalibration(calibration)}
            ${this.renderTimeStats(timeStats)}
          </section>
        </div>

        <!-- ── Section 3: Review Queue ── -->
        <section class="analytics-card card">
          <h2>🔄 Review Queue <span class="badge">${queue.length}</span></h2>
          <p class="section-hint">Problems that need your attention</p>
          ${queue.length === 0
            ? '<p class="empty-state">Nothing to review — keep solving!</p>'
            : `<div class="review-list">${queue.slice(0, 10).map(r => this.renderReviewItem(r)).join('')}</div>`
          }
        </section>

        <!-- ── Section 4: Topic Deep Dive ── -->
        <section class="analytics-card card">
          <h2>📊 Topic Breakdown</h2>
          <p class="section-hint">Concepts + problems per topic with status breakdown</p>
          <div class="deep-dive-list">
            ${topicDive.map(t => this.renderTopicDeepDive(t)).join('')}
          </div>
        </section>

        <!-- ── Section 5: Milestones ── -->
        <section class="analytics-card card">
          <h2>🏆 Milestones <span class="badge">${achieved}/${milestones.length}</span></h2>
          <div class="milestone-grid">
            ${milestones.map(m => this.renderMilestone(m)).join('')}
          </div>
        </section>
      </div>
    `;
  }

  // ── Renderers ──

  private renderWeekBar(w: WeeklyActivity, max: number): string {
    const total = w.problemsSolved + w.conceptsLearned;
    const height = Math.max(4, Math.round((total / max) * 100));
    const pHeight = total > 0 ? Math.round((w.problemsSolved / total) * height) : 0;
    const cHeight = height - pHeight;
    return /* html */ `
      <div class="week-col">
        <div class="week-bar-stack" style="height: ${height}%" title="${w.problemsSolved} problems, ${w.conceptsLearned} concepts">
          <div class="bar-segment solved" style="height: ${pHeight > 0 ? pHeight + '%' : '0'}"></div>
          <div class="bar-segment concepts" style="height: ${cHeight > 0 ? cHeight + '%' : '0'}"></div>
        </div>
        <span class="week-total">${total || ''}</span>
        <span class="week-label">${w.weekLabel}</span>
      </div>
    `;
  }

  private renderPatternGap(g: PatternGap): string {
    const freqClass = g.frequency;
    return /* html */ `
      <div class="gap-row">
        <div class="gap-info">
          <span class="gap-name">${g.name}</span>
          <span class="freq-badge ${freqClass}">${g.frequency}</span>
        </div>
        <div class="gap-bar-wrap">
          <div class="gap-bar">
            <div class="gap-fill" style="width: ${g.percent}%"></div>
          </div>
          <span class="gap-stat">${g.solved}/${g.total}</span>
        </div>
      </div>
    `;
  }

  private renderCalibration(c: DifficultyCalibration): string {
    if (c.total === 0) {
      return '<p class="empty-state">Rate problem difficulty after solving to see calibration.</p>';
    }
    const tips: Record<string, string> = {
      'level-up': '💪 Most problems feel too easy — try harder ones!',
      'on-track': '✅ Great balance! You\'re solving at the right level.',
      'ease-up': '🧘 Many feel too hard — reinforce fundamentals first.',
      'no-data': 'Keep rating to get advice.',
    };
    return /* html */ `
      <div class="calibration">
        <div class="cal-bars">
          <div class="cal-segment easy" style="flex: ${c.tooEasy || 0.1}" title="Too easy: ${c.tooEasy}">
            <span>😌 ${c.tooEasy}</span>
          </div>
          <div class="cal-segment right" style="flex: ${c.justRight || 0.1}" title="Just right: ${c.justRight}">
            <span>👌 ${c.justRight}</span>
          </div>
          <div class="cal-segment hard" style="flex: ${c.tooHard || 0.1}" title="Too hard: ${c.tooHard}">
            <span>🥵 ${c.tooHard}</span>
          </div>
        </div>
        <p class="cal-tip">${tips[c.suggestion]}</p>
      </div>
    `;
  }

  private renderTimeStats(t: SolveTimeStat): string {
    if (t.count === 0) {
      return '<p class="empty-state">Track solve times to see averages here.</p>';
    }
    return /* html */ `
      <div class="time-stats">
        <h3>⏱️ Solve Times</h3>
        <div class="time-grid">
          <div class="time-cell">
            <span class="time-val">${t.avgMinutes}m</span>
            <span class="time-lbl">avg</span>
          </div>
          ${Object.entries(t.byDifficulty)
            .filter(([, d]) => d.count > 0)
            .map(([diff, d]) => `
              <div class="time-cell">
                <span class="time-val">${d.avg}m</span>
                <span class="time-lbl">${diff} (${d.count})</span>
              </div>
            `).join('')}
        </div>
      </div>
    `;
  }

  private renderReviewItem(r: ReviewItem): string {
    const reasonLabels: Record<string, string> = {
      revisit: '🔁 Revisit',
      stale: '⏰ Stale',
      attempted: '🔧 Incomplete',
    };
    return /* html */ `
      <div class="review-row ${r.reason}">
        <div class="review-info">
          <a href="${r.url}" target="_blank" rel="noopener" class="review-title">${r.title}</a>
          <span class="review-meta">
            <span class="diff-badge ${r.difficulty}">${r.difficulty}</span>
            ${r.pattern ? `<span class="pattern-tag">${r.pattern}</span>` : ''}
          </span>
        </div>
        <div class="review-right">
          <span class="reason-badge ${r.reason}">${reasonLabels[r.reason]}</span>
          ${r.daysSince < 999 ? `<span class="days-ago">${r.daysSince}d ago</span>` : ''}
        </div>
      </div>
    `;
  }

  private renderTopicDeepDive(t: TopicDeepDive): string {
    const statusIcons: Record<string, string> = {
      'not-started': '⬜',
      'in-progress': '🟡',
      'strong': '🟢',
      'complete': '✅',
    };
    return /* html */ `
      <div class="deep-dive-row ${t.isStalling ? 'stalling' : ''}">
        <div class="dd-header">
          <a href="#/topics/${t.id}" class="dd-name">
            ${statusIcons[t.status]} ${t.title}
          </a>
          <span class="dd-pct">${t.overallPercent}%</span>
        </div>
        <div class="dd-bars">
          <div class="dd-bar-row">
            <span class="dd-label">Concepts</span>
            <div class="dd-bar"><div class="dd-fill concepts" style="width: ${t.concepts.percent}%"></div></div>
            <span class="dd-count">${t.concepts.done}/${t.concepts.total}</span>
          </div>
          <div class="dd-bar-row">
            <span class="dd-label">Problems</span>
            <div class="dd-bar"><div class="dd-fill problems" style="width: ${t.problems.percent}%"></div></div>
            <span class="dd-count">${t.problems.solved}/${t.problems.total}</span>
          </div>
        </div>
        ${t.problems.attempted + t.problems.revisit > 0 ? `
          <div class="dd-status-tags">
            ${t.problems.attempted > 0 ? `<span class="status-tag attempted">${t.problems.attempted} attempted</span>` : ''}
            ${t.problems.revisit > 0 ? `<span class="status-tag revisit">${t.problems.revisit} revisit</span>` : ''}
          </div>
        ` : ''}
        ${t.isStalling ? '<span class="stalling-badge">⚠️ Stalling</span>' : ''}
      </div>
    `;
  }

  private renderMilestone(m: Milestone): string {
    const pct = m.progress ?? (m.achieved ? 100 : 0);
    return /* html */ `
      <div class="milestone-badge ${m.achieved ? 'achieved' : 'locked'}">
        <span class="ms-icon">${m.icon}</span>
        <span class="ms-title">${m.title}</span>
        <span class="ms-desc">${m.description}</span>
        ${!m.achieved && m.target
          ? `<div class="ms-progress"><div class="ms-fill" style="width: ${pct}%"></div></div>
             <span class="ms-count">${m.current}/${m.target}</span>`
          : ''}
      </div>
    `;
  }
}
