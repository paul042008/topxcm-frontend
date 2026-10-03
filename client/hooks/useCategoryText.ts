import { useState, useEffect } from "react";

const API = "https://topxcm-backend-1.onrender.com";

export interface CategoryText {
  category: string;
  title: string;
  description: string;
}

// Simple in-memory cache so multiple pages don't re-fetch every time
let cache: Record<string, CategoryText> | null = null;
let pending: Promise<Record<string, CategoryText>> | null = null;

function fetchAllTexts(): Promise<Record<string, CategoryText>> {
  if (cache) return Promise.resolve(cache);
  if (pending) return pending;

  pending = fetch(`${API}/api/category-texts`, { cache: "no-store" })
    .then((r) => r.json())
    .then((arr: CategoryText[]) => {
      const map: Record<string, CategoryText> = {};
      arr.forEach((t) => {
        map[t.category] = t;
      });
      cache = map;
      pending = null;
      return map;
    })
    .catch((err) => {
      console.error("❌ Failed to fetch category texts:", err);
      pending = null;
      return {};
    });

  return pending;
}

export function useCategoryText(
  category: string,
  fallback: { title: string; description: string }
) {
  const [text, setText] = useState(fallback);

  useEffect(() => {
    let mounted = true;
    fetchAllTexts().then((map) => {
      if (!mounted) return;
      const found = map[category];
      if (found) {
        setText({
          title: found.title || fallback.title,
          description: found.description || fallback.description,
        });
      }
    });
    return () => {
      mounted = false;
    };
  }, [category]);

  return text;
}

// Call this after admin saves — forces next page load to re-fetch
export function invalidateCategoryTextCache() {
  cache = null;
  pending = null;
}