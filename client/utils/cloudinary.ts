/**
 * Optimizes a Cloudinary image URL by inserting transform parameters.
 *
 * Applied transforms:
 *  - q_auto: smart compression (keeps quality, drops file size)
 *  - f_auto: auto-serves WebP / AVIF to browsers that support it
 *  - c_limit: never upscale beyond the original
 *  - dpr_auto: auto-serves 2x resolution to retina screens
 *  - w_{width}: caps the max display width
 *
 * Non-Cloudinary URLs (Unsplash, /images/..., etc.) are returned untouched.
 *
 * @param url      - The original image URL
 * @param width    - Max display width in CSS pixels (default 800)
 * @param quality  - 'auto' | 'auto:good' | 'auto:best' | 'auto:low' (default 'auto')
 * @param height   - Optional max height in CSS pixels
 */
export function optimizeCloudinaryUrl(
    url: string | undefined | null,
    width = 800,
    quality: "auto" | "auto:good" | "auto:best" | "auto:low" = "auto",
    height?: number
  ): string {
    if (!url) return "";
  
    // Only transform Cloudinary URLs — leave everything else alone
    if (!url.includes("res.cloudinary.com")) return url;
  
    // Skip if already transformed (avoids stacking q_auto,q_auto,...)
    if (/\/upload\/[^/]*(q_auto|f_auto|w_\d+|dpr_auto)/.test(url)) return url;
  
    // Build the transform chain
    const parts = [
      `q_${quality}`,
      "f_auto",
      "c_limit",
      `w_${width}`,
    ];
  
    if (height !== undefined && height > 0) {
      parts.push(`h_${height}`);
    }
  
    parts.push("dpr_auto");
  
    return url.replace("/upload/", `/upload/${parts.join(",")}/`);
  }