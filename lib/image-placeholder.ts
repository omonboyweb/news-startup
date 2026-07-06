function shimmerSvg(width: number, height: number): string {
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop stop-color="#f2f2f2" offset="20%" />
      <stop stop-color="#e5e5e5" offset="50%" />
      <stop stop-color="#f2f2f2" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#shimmer)" />
</svg>`;
}

function toBase64(value: string): string {
  return typeof window === "undefined"
    ? Buffer.from(value).toString("base64")
    : window.btoa(value);
}

/** Blur-up placeholder for next/image with remote URLs (no build-time analysis available). */
export function shimmerPlaceholder(width: number, height: number): string {
  return `data:image/svg+xml;base64,${toBase64(shimmerSvg(width, height))}`;
}
