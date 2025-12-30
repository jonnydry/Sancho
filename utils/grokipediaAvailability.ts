/**
 * DEPRECATED: This whitelist is no longer actively used.
 * 
 * Historical Context:
 * - Originally created December 2024 based on manual verification
 * - Testing was done with INCORRECT URL formatting (preserving original casing)
 * - As of December 30, 2024: URLs now use Wikipedia-style formatting (First_word_lowercase_rest)
 * - With correct formatting, most entries work, making this whitelist unnecessary
 * 
 * Current Behavior:
 * - All poetry items now show Grokipedia links (whitelist not checked)
 * - getGrokipediaUrl() properly formats URLs for all items
 * - If a page doesn't exist, users see Grokipedia's standard 404 page
 * 
 * This list is kept for historical reference only.
 */

// DEPRECATED: Whitelist no longer used (kept for historical reference)
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
 * DEPRECATED: Check if a poetry item has a Grokipedia entry available
 * This function is no longer used. All items now show Grokipedia links.
 * Kept for backwards compatibility only.
 */
export function hasGrokipediaEntry(itemName: string): boolean {
  return grokipediaAvailable.has(itemName);
}

/**
 * Get the Grokipedia URL for an item
 * Uses Wikipedia-style formatting: First letter capitalized, rest lowercase, spaces to underscores
 */
export function getGrokipediaUrl(itemName: string): string {
  // Wikipedia-style: First letter caps, rest lowercase, spaces to underscores
  const formatted = itemName
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/^./, (c) => c.toUpperCase());
  return `https://grokipedia.com/page/${formatted}`;
}
