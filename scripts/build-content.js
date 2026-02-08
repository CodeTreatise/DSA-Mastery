#!/usr/bin/env node
/**
 * Build Content Script
 * Copies all expanded MD files from topic folders to public/content/
 * Generates content-manifest.json for runtime discovery
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const ROOT_DIR = path.resolve(__dirname, '../../');
const OUTPUT_DIR = path.resolve(__dirname, '../public/content');
const MANIFEST_PATH = path.resolve(__dirname, '../public/content-manifest.json');

// Topic ID mapping (folder name -> ID used in app)
const TOPIC_ID_MAP = {
  '00-Prerequisites': 'prerequisites',
  '01-Arrays-Strings': 'arrays-strings',
  '02-Recursion-Backtracking': 'recursion-backtracking',
  '03-Sorting-Searching': 'sorting-searching',
  '04-Linked-Lists': 'linked-lists',
  '05-Stacks-Queues': 'stacks-queues',
  '06-Trees': 'trees',
  '07-Binary-Search-Trees': 'binary-search-trees',
  '08-Heaps-Priority-Queues': 'heaps-priority-queues',
  '09-Hashing': 'hashing',
  '10-Graphs': 'graphs',
  '11-Dynamic-Programming': 'dynamic-programming',
  '12-Greedy-Algorithms': 'greedy-algorithms',
  '13-Tries': 'tries',
  '14-Advanced-Data-Structures': 'advanced-data-structures',
  '15-Bit-Manipulation': 'bit-manipulation',
  '16-Math-Number-Theory': 'math-number-theory',
};

// Files to exclude
const EXCLUDE_PATTERNS = [
  /EXECUTION-CHECKLIST/,
  /^README\.md$/,
  /^\./, // Hidden files
];

// Topic overview files to exclude from chapter list (they're duplicates of the folder)
const TOPIC_OVERVIEW_FILES = Object.keys(TOPIC_ID_MAP).map(name => `${name}.md`);

/**
 * Check if a file should be excluded
 */
function shouldExclude(filename) {
  // Check exclude patterns
  if (EXCLUDE_PATTERNS.some(p => p.test(filename))) return true;
  // Check if it's a topic overview file (duplicate of folder)
  if (TOPIC_OVERVIEW_FILES.includes(filename)) return true;
  return false;
}

/**
 * Extract title from markdown content
 */
function extractTitle(content, filename) {
  // Try to find H1 heading
  const h1Match = content.match(/^#\s+(.+)$/m);
  if (h1Match) return h1Match[1].trim();
  
  // Try to find first heading of any level
  const headingMatch = content.match(/^#{1,6}\s+(.+)$/m);
  if (headingMatch) return headingMatch[1].trim();
  
  // Fall back to filename
  return filename
    .replace('.md', '')
    .replace(/^\d+[-.]?/, '') // Remove leading numbers
    .replace(/-/g, ' ')
    .trim();
}

/**
 * Extract description from markdown content
 */
function extractDescription(content) {
  // Try to find text after first heading
  const lines = content.split('\n');
  let foundHeading = false;
  
  for (const line of lines) {
    if (line.startsWith('#')) {
      foundHeading = true;
      continue;
    }
    if (foundHeading && line.trim() && !line.startsWith('#') && !line.startsWith('-') && !line.startsWith('*')) {
      // Return first 150 chars of first paragraph
      const desc = line.trim().replace(/[*_`]/g, '');
      return desc.length > 150 ? desc.substring(0, 147) + '...' : desc;
    }
  }
  
  return '';
}

/**
 * Recursively scan directory and build chapter tree
 */
function scanDirectory(dir, relativePath = '') {
  const items = [];
  
  if (!fs.existsSync(dir)) return items;
  
  const entries = fs.readdirSync(dir, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const entryRelPath = path.join(relativePath, entry.name);
    
    if (entry.isDirectory()) {
      // Skip hidden directories
      if (entry.name.startsWith('.')) continue;
      
      // Recursively scan subdirectory
      const children = scanDirectory(fullPath, entryRelPath);
      if (children.length > 0) {
        items.push({
          type: 'section',
          name: entry.name,
          title: entry.name
            .replace(/^\d+[-.]?/, '')
            .replace(/-/g, ' ')
            .trim(),
          path: entryRelPath,
          children,
        });
      }
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      // Skip excluded files
      if (shouldExclude(entry.name)) continue;
      
      // Read file content for metadata
      const content = fs.readFileSync(fullPath, 'utf-8');
      
      items.push({
        type: 'chapter',
        name: entry.name,
        title: extractTitle(content, entry.name),
        description: extractDescription(content),
        path: entryRelPath,
        size: content.length,
        estimatedReadTime: Math.ceil(content.split(/\s+/).length / 200), // ~200 words per minute
      });
    }
  }
  
  return items;
}

/**
 * Copy files preserving structure
 */
function copyFiles(srcDir, destDir) {
  let fileCount = 0;
  
  if (!fs.existsSync(srcDir)) return fileCount;
  
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    
    if (entry.isDirectory()) {
      if (entry.name.startsWith('.')) continue;
      fs.mkdirSync(destPath, { recursive: true });
      fileCount += copyFiles(srcPath, destPath);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      if (shouldExclude(entry.name)) continue;
      fs.copyFileSync(srcPath, destPath);
      fileCount++;
    }
  }
  
  return fileCount;
}

/**
 * Main build function
 */
function build() {
  console.log('🚀 Building DSA content...\n');
  
  // Clean output directory
  if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmSync(OUTPUT_DIR, { recursive: true });
  }
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  
  const manifest = {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    topics: {},
    stats: {
      totalTopics: 0,
      totalSections: 0,
      totalChapters: 0,
      totalSize: 0,
    },
  };
  
  // Process each topic folder
  const topicFolders = Object.keys(TOPIC_ID_MAP);
  
  for (const folderName of topicFolders) {
    const topicId = TOPIC_ID_MAP[folderName];
    const srcPath = path.join(ROOT_DIR, folderName);
    const destPath = path.join(OUTPUT_DIR, topicId);
    
    if (!fs.existsSync(srcPath)) {
      console.log(`⚠️  Skipping ${folderName} (not found)`);
      continue;
    }
    
    console.log(`📁 Processing ${folderName}...`);
    
    // Copy files
    fs.mkdirSync(destPath, { recursive: true });
    const fileCount = copyFiles(srcPath, destPath);
    
    // Build chapter tree
    const chapters = scanDirectory(srcPath);
    
    // Count sections and chapters
    let sectionCount = 0;
    let chapterCount = 0;
    
    function countItems(items) {
      for (const item of items) {
        if (item.type === 'section') {
          sectionCount++;
          if (item.children) countItems(item.children);
        } else if (item.type === 'chapter') {
          chapterCount++;
        }
      }
    }
    countItems(chapters);
    
    manifest.topics[topicId] = {
      id: topicId,
      folderName,
      chapters,
      stats: {
        sections: sectionCount,
        chapters: chapterCount,
      },
    };
    
    manifest.stats.totalTopics++;
    manifest.stats.totalSections += sectionCount;
    manifest.stats.totalChapters += chapterCount;
    
    console.log(`   ✅ ${fileCount} files copied (${sectionCount} sections, ${chapterCount} chapters)\n`);
  }
  
  // Write manifest
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`\n📋 Manifest written to ${MANIFEST_PATH}`);
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Build Summary');
  console.log('='.repeat(50));
  console.log(`Topics:   ${manifest.stats.totalTopics}`);
  console.log(`Sections: ${manifest.stats.totalSections}`);
  console.log(`Chapters: ${manifest.stats.totalChapters}`);
  console.log('\n✨ Content build complete!\n');
}

// Run build
build();
