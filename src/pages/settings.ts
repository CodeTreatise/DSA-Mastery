// ============================================
// Settings Page
// ============================================

import { Component } from '@components/base';
import { getPreferences, updatePreferences, resetProgress } from '@store/progress-store';
import { getTheme, setTheme } from '@utils/theme';
import type { UserPreferences } from '@/types';

interface SettingsPageState extends UserPreferences {
  showResetConfirm: boolean;
}

/**
 * User settings and preferences page
 */
export class SettingsPage extends Component<SettingsPageState> {
  constructor(container: HTMLElement) {
    const prefs = getPreferences();
    super(container, {
      ...prefs,
      theme: getTheme(),
      showResetConfirm: false,
    });
  }

  template(): string {
    const { theme, targetProblemsPerDay, targetMinutesPerDay, showDifficulty, showPatterns, showResetConfirm } = this.state;

    return /* html */ `
      <div class="page page-settings">
        <div class="page-header">
          <h1>Settings</h1>
          <p class="page-subtitle">Customize your learning experience</p>
        </div>

        <div class="settings-content">
          <section class="settings-section card">
            <h2>Appearance</h2>
            
            <div class="setting-item">
              <div class="setting-info">
                <span class="setting-label">Theme</span>
                <span class="setting-description">Choose your preferred color scheme</span>
              </div>
              <div class="setting-control">
                <select class="select theme-select">
                  <option value="dark" ${theme === 'dark' ? 'selected' : ''}>Dark</option>
                  <option value="light" ${theme === 'light' ? 'selected' : ''}>Light</option>
                </select>
              </div>
            </div>
          </section>

          <section class="settings-section card">
            <h2>Daily Goals</h2>
            
            <div class="setting-item">
              <div class="setting-info">
                <span class="setting-label">Problems per day</span>
                <span class="setting-description">Target number of problems to solve daily</span>
              </div>
              <div class="setting-control">
                <input 
                  type="number" 
                  class="input problems-target" 
                  min="1" 
                  max="20" 
                  value="${targetProblemsPerDay}"
                />
              </div>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <span class="setting-label">Study minutes per day</span>
                <span class="setting-description">Target study time in minutes</span>
              </div>
              <div class="setting-control">
                <input 
                  type="number" 
                  class="input minutes-target" 
                  min="15" 
                  max="480" 
                  step="15"
                  value="${targetMinutesPerDay}"
                />
              </div>
            </div>
          </section>

          <section class="settings-section card">
            <h2>Display Options</h2>
            
            <div class="setting-item">
              <div class="setting-info">
                <span class="setting-label">Show difficulty badges</span>
                <span class="setting-description">Display Easy/Medium/Hard labels on problems</span>
              </div>
              <div class="setting-control">
                <label class="toggle">
                  <input type="checkbox" class="toggle-difficulty" ${showDifficulty ? 'checked' : ''} />
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <span class="setting-label">Show pattern tags</span>
                <span class="setting-description">Display algorithm patterns on problems</span>
              </div>
              <div class="setting-control">
                <label class="toggle">
                  <input type="checkbox" class="toggle-patterns" ${showPatterns ? 'checked' : ''} />
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>
          </section>

          <section class="settings-section card danger-zone">
            <h2>Danger Zone</h2>
            
            <div class="setting-item">
              <div class="setting-info">
                <span class="setting-label">Reset all progress</span>
                <span class="setting-description">This will permanently delete all your progress data</span>
              </div>
              <div class="setting-control">
                ${showResetConfirm ? /* html */ `
                  <div class="confirm-buttons">
                    <button class="btn btn-danger confirm-reset">Yes, Reset</button>
                    <button class="btn btn-ghost cancel-reset">Cancel</button>
                  </div>
                ` : /* html */ `
                  <button class="btn btn-danger reset-btn">Reset Progress</button>
                `}
              </div>
            </div>
          </section>
        </div>
      </div>
    `;
  }

  afterRender(): void {
    // Theme
    const themeSelect = this.container.querySelector('.theme-select') as HTMLSelectElement;
    themeSelect?.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement;
      const newTheme = target.value as 'light' | 'dark';
      setTheme(newTheme);
      updatePreferences({ theme: newTheme });
      this.setState({ theme: newTheme });
    });

    // Problems target
    const problemsInput = this.container.querySelector('.problems-target') as HTMLInputElement;
    problemsInput?.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      const value = parseInt(target.value, 10);
      if (value >= 1 && value <= 20) {
        updatePreferences({ targetProblemsPerDay: value });
        this.setState({ targetProblemsPerDay: value });
      }
    });

    // Minutes target
    const minutesInput = this.container.querySelector('.minutes-target') as HTMLInputElement;
    minutesInput?.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      const value = parseInt(target.value, 10);
      if (value >= 15 && value <= 480) {
        updatePreferences({ targetMinutesPerDay: value });
        this.setState({ targetMinutesPerDay: value });
      }
    });

    // Show difficulty toggle
    const difficultyToggle = this.container.querySelector('.toggle-difficulty') as HTMLInputElement;
    difficultyToggle?.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      updatePreferences({ showDifficulty: target.checked });
      this.setState({ showDifficulty: target.checked });
    });

    // Show patterns toggle
    const patternsToggle = this.container.querySelector('.toggle-patterns') as HTMLInputElement;
    patternsToggle?.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      updatePreferences({ showPatterns: target.checked });
      this.setState({ showPatterns: target.checked });
    });

    // Reset button
    const resetBtn = this.container.querySelector('.reset-btn');
    resetBtn?.addEventListener('click', () => {
      this.setState({ showResetConfirm: true });
    });

    // Confirm reset
    const confirmBtn = this.container.querySelector('.confirm-reset');
    confirmBtn?.addEventListener('click', () => {
      resetProgress();
      window.location.reload();
    });

    // Cancel reset
    const cancelBtn = this.container.querySelector('.cancel-reset');
    cancelBtn?.addEventListener('click', () => {
      this.setState({ showResetConfirm: false });
    });
  }
}
