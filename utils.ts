
export const getYouTubeID = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

/**
 * BASIC EMBED: Using standard domain and minimal parameters.
 * Stripped of all extra configuration to avoid sandbox origin errors (Error 153).
 */
export const constructEmbedUrl = (videoId: string, index: number, refreshKey: number): string => {
  // Using standard domain and minimal params as requested
  // The 't' param is just a harmless cache-buster
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1&t=${refreshKey}${index}`;
};
