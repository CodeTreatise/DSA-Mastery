// ============================================
// Base Component Class
// ============================================

/**
 * Abstract base class for all UI components.
 * Provides lifecycle hooks, state management, and rendering.
 */
export abstract class Component<TState extends object = object> {
  protected element: HTMLElement;
  protected state: TState;
  private eventListeners: Array<{ element: Element; event: string; handler: EventListener }> = [];

  constructor(container: HTMLElement, initialState: TState) {
    this.element = container;
    this.state = initialState;
  }

  /**
   * Get the container element
   */
  protected get container(): HTMLElement {
    return this.element;
  }

  /**
   * Override to provide the component's HTML template
   */
  abstract template(): string;

  /**
   * Render the component to the DOM
   */
  render(): void {
    // Remove old event listeners
    this.removeEventListeners();
    
    // Update DOM
    this.element.innerHTML = this.template();
    
    // Setup new event listeners
    this.afterRender();
  }

  /**
   * Override to set up event listeners after rendering
   */
  protected afterRender(): void {}

  /**
   * Override for cleanup when component is destroyed
   */
  destroy(): void {
    this.removeEventListeners();
  }

  /**
   * Update state and re-render
   */
  protected setState(newState: Partial<TState>): void {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  /**
   * Get current state (readonly)
   */
  protected getState(): Readonly<TState> {
    return this.state;
  }

  /**
   * Debounce a function
   */
  protected debounce<T extends (...args: Parameters<T>) => void>(
    fn: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  }

  /**
   * Add an event listener (tracked for cleanup)
   */
  protected addListener<K extends keyof HTMLElementEventMap>(
    selector: string,
    event: K,
    handler: (e: HTMLElementEventMap[K]) => void
  ): void {
    const elements = this.element.querySelectorAll(selector);
    elements.forEach((el) => {
      el.addEventListener(event, handler as EventListener);
      this.eventListeners.push({ element: el, event, handler: handler as EventListener });
    });
  }

  /**
   * Add event listener to a single element
   */
  protected addListenerToElement(
    element: Element | null,
    event: string,
    handler: EventListener
  ): void {
    if (element) {
      element.addEventListener(event, handler);
      this.eventListeners.push({ element, event, handler });
    }
  }

  /**
   * Query a single element within this component
   */
  protected query<T extends HTMLElement = HTMLElement>(selector: string): T | null {
    return this.element.querySelector<T>(selector);
  }

  /**
   * Query all elements within this component
   */
  protected queryAll<T extends HTMLElement = HTMLElement>(selector: string): NodeListOf<T> {
    return this.element.querySelectorAll<T>(selector);
  }

  /**
   * Remove all tracked event listeners
   */
  private removeEventListeners(): void {
    this.eventListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    this.eventListeners = [];
  }
}

/**
 * Lightweight component for simple static rendering
 */
export abstract class StaticComponent {
  protected element: HTMLElement;

  constructor(selector: string | HTMLElement) {
    if (typeof selector === 'string') {
      const el = document.querySelector<HTMLElement>(selector);
      if (!el) {
        throw new Error(`StaticComponent: Element "${selector}" not found`);
      }
      this.element = el;
    } else {
      this.element = selector;
    }
  }

  abstract template(): string;

  render(): void {
    this.element.innerHTML = this.template();
    this.afterRender();
  }

  protected afterRender(): void {}
}

/**
 * Helper to create elements from HTML string
 */
export function createElement(html: string): HTMLElement {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstElementChild as HTMLElement;
}

/**
 * Helper for conditional class names
 */
export function classNames(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Escape HTML to prevent XSS
 */
export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Debounce function for performance
 */
export function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
