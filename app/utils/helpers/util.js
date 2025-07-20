
import { randomUUID } from 'crypto'; // Node.js v14.17.0+

/**
 * Generates a unique, temporary ID suitable for a video filename.
 * This ID is a UUID (Universally Unique Identifier, v4).
 *
 * @param {string} [prefix='vid-'] An optional prefix for the ID (e.g., 'vid-', 'temp-').
 * @returns {string} A unique ID string (e.g., 'vid-a1b2c3d4-e5f6-7890-1234-567890abcdef').
 */
export function generateUniqueVideoId(prefix = '') {
    // randomUUID() generates a UUID v4 string (e.g., '1b9d67b0-adad-474d-b36c-940026377464')
    return `${prefix}${randomUUID()}`;
}
