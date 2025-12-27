/**
 * Tag utilities for extracting, validating, and managing tags in journal entries.
 */

// Regex to match #tags in content (supports alphanumeric, hyphens, underscores)
const TAG_REGEX = /#([a-zA-Z][a-zA-Z0-9_-]*)/g;

/**
 * Extract all #tags from content string.
 * Tags must start with a letter and can contain letters, numbers, hyphens, and underscores.
 */
export function extractTagsFromContent(content: string): string[] {
  if (!content) return [];
  
  const matches = content.matchAll(TAG_REGEX);
  const tags = new Set<string>();
  
  for (const match of matches) {
    // Normalize tag to lowercase
    tags.add(match[1].toLowerCase());
  }
  
  return Array.from(tags).sort();
}

/**
 * Validate a tag name.
 * Tags must start with a letter and can contain letters, numbers, hyphens, and underscores.
 * Max length: 32 characters.
 */
export function isValidTag(tag: string): boolean {
  if (!tag || tag.length === 0 || tag.length > 32) return false;
  return /^[a-zA-Z][a-zA-Z0-9_-]*$/.test(tag);
}

/**
 * Normalize a tag (lowercase, trim whitespace).
 */
export function normalizeTag(tag: string): string {
  return tag.toLowerCase().trim();
}

/**
 * Merge manual tags with extracted tags, removing duplicates.
 */
export function mergeTags(manualTags: string[], extractedTags: string[]): string[] {
  const normalized = new Set<string>();
  
  for (const tag of [...manualTags, ...extractedTags]) {
    const normalizedTag = normalizeTag(tag);
    if (isValidTag(normalizedTag)) {
      normalized.add(normalizedTag);
    }
  }
  
  return Array.from(normalized).sort();
}

/**
 * Get all unique tags from a list of entries.
 */
export function getAllTagsFromEntries(entries: { tags?: string[] }[]): string[] {
  const allTags = new Set<string>();
  
  for (const entry of entries) {
    if (entry.tags) {
      for (const tag of entry.tags) {
        allTags.add(normalizeTag(tag));
      }
    }
  }
  
  return Array.from(allTags).sort();
}

/**
 * Count entries per tag.
 */
export function getTagCounts(entries: { tags?: string[] }[]): Map<string, number> {
  const counts = new Map<string, number>();
  
  for (const entry of entries) {
    if (entry.tags) {
      for (const tag of entry.tags) {
        const normalizedTag = normalizeTag(tag);
        counts.set(normalizedTag, (counts.get(normalizedTag) || 0) + 1);
      }
    }
  }
  
  return counts;
}

/**
 * Filter entries by tag.
 */
export function filterEntriesByTag<T extends { tags?: string[] }>(
  entries: T[],
  tag: string
): T[] {
  const normalizedTag = normalizeTag(tag);
  return entries.filter(
    (entry) => entry.tags?.some((t) => normalizeTag(t) === normalizedTag)
  );
}

/**
 * Get entries without any tags.
 */
export function getUntaggedEntries<T extends { tags?: string[] }>(entries: T[]): T[] {
  return entries.filter((entry) => !entry.tags || entry.tags.length === 0);
}

/**
 * Highlight tags in content by wrapping them with a span.
 * Returns HTML string with tags wrapped in <span class="tag-highlight">.
 */
export function highlightTagsInContent(content: string): string {
  if (!content) return '';
  return content.replace(TAG_REGEX, '<span class="tag-highlight">#$1</span>');
}

/**
 * Parse a tag input string (comma or space separated) into an array of valid tags.
 */
export function parseTagInput(input: string): string[] {
  if (!input) return [];
  
  // Split by comma or whitespace
  const parts = input.split(/[,\s]+/);
  const tags: string[] = [];
  
  for (const part of parts) {
    // Remove leading # if present
    const tag = part.startsWith('#') ? part.slice(1) : part;
    const normalized = normalizeTag(tag);
    
    if (normalized && isValidTag(normalized) && !tags.includes(normalized)) {
      tags.push(normalized);
    }
  }
  
  return tags.sort();
}
