/**
 * List of poetry items that have verified Grokipedia entries.
 * Based on manual verification as of December 2024.
 * 
 * Items with underscores or spaces in names generally don't have entries.
 * Most multi-word technical terms don't have entries.
 * Common single-word forms, meters, and devices are most likely to exist.
 */

// Verified working Grokipedia entries (tested December 2024)
export const grokipediaAvailable = new Set([
  // Forms - Common, well-known forms
  "Sonnet",
  "Haiku",
  "Villanelle",
  "Limerick",
  "Sestina",
  "Ode",
  "Ballad",
  "Ghazal",
  "Elegy",
  "Epic",
  
  // Meters - Note: most compound names don't work
  "Alexandrine",
  
  // Devices - Common literary devices
  "Metaphor",
  "Simile",
  "Alliteration",
  "Personification",
  "Assonance",
  "Consonance",
  "Onomatopoeia",
  "Enjambment",
  "Hyperbole",
  "Irony",
  "Oxymoron",
  "Apostrophe",
  "Synecdoche",
  "Caesura",
  "Imagery",
  "Symbolism",
  "Allusion",
  "Metonymy",
  "Paradox",
]);

/**
 * Check if a poetry item has a Grokipedia entry available
 */
export function hasGrokipediaEntry(itemName: string): boolean {
  return grokipediaAvailable.has(itemName);
}

/**
 * Get the Grokipedia URL for an item (if it exists)
 */
export function getGrokipediaUrl(itemName: string): string | null {
  if (!hasGrokipediaEntry(itemName)) {
    return null;
  }
  return `https://grokipedia.com/page/${encodeURIComponent(itemName.replace(/\s+/g, "_"))}`;
}
