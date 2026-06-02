import type { Match } from "../types";
import LZ from "lz-string";

// Compress match state to URL-safe format
export function encodeStateToUrl(matches: Record<string, Match>): string {
  // Create a compact representation: only store matches with results
  const playedMatches = Object.entries(matches)
    .filter(([, match]) => match.homeGoals !== null && match.awayGoals !== null)
    .map(([id, match]) => `${id}:${match.homeGoals}${match.awayGoals}`)
    .join(",");

  // Compress with LZ-string for shorter URLs
  const compressed = LZ.compressToEncodedURIComponent(playedMatches);
  return compressed;
}

// Decode URL parameter back to matches
export function decodeStateFromUrl(encoded: string): Record<string, Match> | null {
  try {
    const decompressed = LZ.decompressFromEncodedURIComponent(encoded);
    if (!decompressed) return null;

    const matchEntries = decompressed.split(",");
    const result: Record<string, Match> = {};

    matchEntries.forEach((entry) => {
      if (!entry) return;
      const [id, scores] = entry.split(":");
      const home = parseInt(scores[0], 10);
      const away = parseInt(scores[1], 10);

      // Note: This will need to be combined with the actual match data
      // This just stores the scores; the full match object comes from the store
      result[id] = { homeGoals: home, awayGoals: away } as any;
    });

    return Object.keys(result).length > 0 ? result : null;
  } catch (error) {
    console.error("Failed to decode state:", error);
    return null;
  }
}

// Generate share message
export function generateShareMessage(): string {
  const url = window.location.href;
  return `🏆 Mira mis predicciones del Mundial 2026:\n${url}\n\n#FIFA2026 #WorldCup2026`;
}

// Get sharing URLs
export function getSharingUrls(
  encodedState: string
): {
  whatsapp: string;
  twitter: string;
  facebook: string;
  shareLink: string;
} {
  const baseUrl = `${window.location.origin}${window.location.pathname}?predictions=${encodedState}`;
  const message = encodeURIComponent(
    `🏆 Mira mis predicciones del Mundial 2026 #FIFA2026`
  );

  return {
    whatsapp: `https://wa.me/?text=${message}%20${encodeURIComponent(baseUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${message}&url=${encodeURIComponent(baseUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(baseUrl)}`,
    shareLink: baseUrl,
  };
}
