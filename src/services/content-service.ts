/**
 * Content Service
 * Handles fetching and parsing markdown content from the public/content folder
 */

import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import DOMPurify from 'dompurify';
import mermaid from 'mermaid';

// Types
export interface ChapterItem {
  type: 'chapter';
  name: string;
  title: string;
  description: string;
  path: string;
  size: number;
  estimatedReadTime: number;
}

export interface SectionItem {
  type: 'section';
  name: string;
  title: string;
  path: string;
  children: ContentItem[];
}

export type ContentItem = ChapterItem | SectionItem;

export interface TopicContent {
  id: string;
  folderName: string;
  chapters: ContentItem[];
  stats: {
    sections: number;
    chapters: number;
  };
}

export interface ContentManifest {
  version: string;
  generatedAt: string;
  topics: Record<string, TopicContent>;
  stats: {
    totalTopics: number;
    totalSections: number;
    totalChapters: number;
    totalSize: number;
  };
}

// Initialize mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'inherit',
});

// Configure marked with syntax highlighting
marked.use(markedHighlight({
  langPrefix: 'hljs language-',
  highlight(code, lang) {
    if (lang === 'mermaid') {
      // Use ||| as delimiter since it won't appear in URL-encoded content (| becomes %7C)
      const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      return `MERMAID_PLACEHOLDER|||${id}|||${encodeURIComponent(code)}|||MERMAID_END`;
    }
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  }
}));

// Set marked options
marked.use({
  gfm: true,
  breaks: true,
});

// Cache for manifest and content
let manifestCache: ContentManifest | null = null;
const contentCache = new Map<string, string>();

/**
 * Get the base path for content
 */
function getBasePath(): string {
  // Handle both dev and production
  const base = import.meta.env.BASE_URL || '/';
  return base.endsWith('/') ? base : `${base}/`;
}

/**
 * Fetch and cache the content manifest
 */
export async function getManifest(): Promise<ContentManifest> {
  if (manifestCache) return manifestCache;
  
  const response = await fetch(`${getBasePath()}content-manifest.json`);
  if (!response.ok) {
    throw new Error(`Failed to load content manifest: ${response.status}`);
  }
  
  manifestCache = await response.json();
  return manifestCache!;
}

/**
 * Get topic content structure
 */
export async function getTopicContent(topicId: string): Promise<TopicContent | null> {
  const manifest = await getManifest();
  return manifest.topics[topicId] || null;
}

/**
 * Fetch raw markdown content for a chapter
 */
export async function fetchChapterContent(topicId: string, chapterPath: string): Promise<string> {
  const cacheKey = `${topicId}/${chapterPath}`;
  
  if (contentCache.has(cacheKey)) {
    return contentCache.get(cacheKey)!;
  }
  
  const url = `${getBasePath()}content/${topicId}/${chapterPath}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to load chapter: ${response.status}`);
  }
  
  const content = await response.text();
  contentCache.set(cacheKey, content);
  
  return content;
}

/**
 * Parse markdown to HTML with post-processing
 */
export async function parseMarkdown(markdown: string): Promise<string> {
  let html = await marked.parse(markdown);
  
  // Process mermaid placeholders FIRST (before code block wrapping)
  // The placeholder is inside <pre><code class="hljs language-mermaid">PLACEHOLDER</code></pre>
  // Using ||| as delimiter since it won't appear in URL-encoded content
  // Note: [\s\n]* handles potential trailing whitespace/newlines
  html = html.replace(
    /<pre><code class="hljs language-mermaid">MERMAID_PLACEHOLDER\|\|\|([^|]+)\|\|\|(.+?)\|\|\|MERMAID_END[\s\n]*<\/code><\/pre>/g,
    (_, id, encodedCode) => {
      return `<div class="mermaid-container" id="${id}" data-mermaid="${encodedCode}"></div>`;
    }
  );
  
  // Add copy buttons to code blocks (after mermaid is extracted)
  html = html.replace(
    /<pre><code class="hljs language-(\w+)">/g,
    (_, lang) => `
      <div class="code-block">
        <div class="code-header">
          <span class="code-language">${lang}</span>
          <button class="code-copy-btn" title="Copy code">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        </div>
        <pre><code class="hljs language-${lang}">`
  );
  
  // Close the code block wrappers
  html = html.replace(/<\/code><\/pre>/g, '</code></pre></div>');
  
  // Style blockquotes based on content
  html = html.replace(/<blockquote>/g, () => {
    return '<blockquote class="blockquote">';
  });
  
  // Add insight class to blockquotes containing certain emojis
  html = html.replace(
    /<blockquote class="blockquote">([^]*?)<\/blockquote>/g,
    (_, content) => {
      let className = 'blockquote';
      if (content.includes('💡') || content.includes('Key Insight')) {
        className += ' blockquote--insight';
      } else if (content.includes('⚠️') || content.includes('Warning')) {
        className += ' blockquote--warning';
      } else if (content.includes('🔗') || content.includes('Related')) {
        className += ' blockquote--related';
      } else if (content.includes('📝') || content.includes('Note')) {
        className += ' blockquote--note';
      }
      return `<blockquote class="${className}">${content}</blockquote>`;
    }
  );
  
  // Add heading anchors
  html = html.replace(
    /<h([1-6])>([^<]+)<\/h[1-6]>/g,
    (_, level, text) => {
      const slug = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();
      return `<h${level} id="${slug}" class="content-heading"><a href="#${slug}" class="heading-anchor">#</a>${text}</h${level}>`;
    }
  );
  
  // Wrap tables in container
  html = html.replace(
    /<table>/g,
    '<div class="table-container"><table class="content-table">'
  );
  html = html.replace(/<\/table>/g, '</table></div>');
  
  // Sanitize HTML
  const sanitized = DOMPurify.sanitize(html, {
    ADD_TAGS: ['input'],
    ADD_ATTR: ['checked', 'disabled', 'type', 'data-mermaid'],
  });
  
  return sanitized;
}

/**
 * Render mermaid diagrams in the content
 */
export async function renderMermaidDiagrams(container: HTMLElement): Promise<void> {
  const mermaidContainers = container.querySelectorAll('.mermaid-container');
  
  for (const el of mermaidContainers) {
    const code = decodeURIComponent(el.getAttribute('data-mermaid') || '');
    if (code) {
      try {
        const { svg } = await mermaid.render(el.id, code);
        el.innerHTML = svg;
      } catch (error) {
        console.error('Mermaid rendering error:', error);
        el.innerHTML = `<pre class="mermaid-error">${code}</pre>`;
      }
    }
  }
}

/**
 * Setup code copy buttons
 */
export function setupCodeCopyButtons(container: HTMLElement): void {
  const copyButtons = container.querySelectorAll('.code-copy-btn');
  
  copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const codeBlock = btn.closest('.code-block');
      const code = codeBlock?.querySelector('code')?.textContent || '';
      
      try {
        await navigator.clipboard.writeText(code);
        btn.classList.add('copied');
        setTimeout(() => btn.classList.remove('copied'), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    });
  });
}

/**
 * Get all chapters flattened (for navigation)
 */
export function flattenChapters(items: ContentItem[]): ChapterItem[] {
  const chapters: ChapterItem[] = [];
  
  function traverse(items: ContentItem[]) {
    for (const item of items) {
      if (item.type === 'chapter') {
        chapters.push(item);
      } else if (item.type === 'section' && item.children) {
        traverse(item.children);
      }
    }
  }
  
  traverse(items);
  return chapters;
}

/**
 * Find a chapter by path
 */
export function findChapterByPath(items: ContentItem[], path: string): ChapterItem | null {
  for (const item of items) {
    if (item.type === 'chapter' && item.path === path) {
      return item;
    } else if (item.type === 'section' && item.children) {
      const found = findChapterByPath(item.children, path);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Get next and previous chapters for navigation
 */
export function getAdjacentChapters(items: ContentItem[], currentPath: string): {
  prev: ChapterItem | null;
  next: ChapterItem | null;
} {
  const flattened = flattenChapters(items);
  const currentIndex = flattened.findIndex(c => c.path === currentPath);
  
  return {
    prev: currentIndex > 0 ? flattened[currentIndex - 1] : null,
    next: currentIndex < flattened.length - 1 ? flattened[currentIndex + 1] : null,
  };
}

/**
 * Clear content cache (useful for development)
 */
export function clearContentCache(): void {
  contentCache.clear();
  manifestCache = null;
}

// Reading progress tracking
const PROGRESS_KEY = 'dsa-reading-progress';

export interface ReadingProgress {
  [topicId: string]: {
    [chapterPath: string]: {
      completed: boolean;
      lastRead: string;
      scrollPosition?: number;
    };
  };
}

/**
 * Get reading progress from localStorage
 */
export function getReadingProgress(): ReadingProgress {
  try {
    const stored = localStorage.getItem(PROGRESS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

/**
 * Mark a chapter as read
 */
export function markChapterRead(topicId: string, chapterPath: string): void {
  const progress = getReadingProgress();
  
  if (!progress[topicId]) {
    progress[topicId] = {};
  }
  
  progress[topicId][chapterPath] = {
    completed: true,
    lastRead: new Date().toISOString(),
  };
  
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

/**
 * Check if a chapter is read
 */
export function isChapterRead(topicId: string, chapterPath: string): boolean {
  const progress = getReadingProgress();
  return progress[topicId]?.[chapterPath]?.completed || false;
}

/**
 * Get topic reading progress percentage
 */
export function getTopicProgress(topicId: string, totalChapters: number): number {
  const progress = getReadingProgress();
  const topicProgress = progress[topicId] || {};
  const readCount = Object.values(topicProgress).filter(p => p.completed).length;
  return totalChapters > 0 ? Math.round((readCount / totalChapters) * 100) : 0;
}

export default {
  getManifest,
  getTopicContent,
  fetchChapterContent,
  parseMarkdown,
  renderMermaidDiagrams,
  setupCodeCopyButtons,
  flattenChapters,
  findChapterByPath,
  getAdjacentChapters,
  clearContentCache,
  getReadingProgress,
  markChapterRead,
  isChapterRead,
  getTopicProgress,
};
