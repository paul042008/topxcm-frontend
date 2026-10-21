import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const API = "https://topxcm-backend-1.onrender.com";

export default function VisitTracker() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let category = null;

    // Map the URL path to a category
    if (path.startsWith("/fashion")) category = "fashion";
    else if (path.startsWith("/photography")) category = "photography";
    else if (path.startsWith("/real-estate")) category = "realestate";

    // If the user is in one of these sections, and we haven't tracked them in this session yet
    if (category) {
      const hasVisited = sessionStorage.getItem(`visited_${category}`);
      
      if (!hasVisited) {
        fetch(`${API}/api/track-visit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category }),
        }).catch(() => {
          // Silently fail
        });

        // Remember that they visited this category in this tab session
        sessionStorage.setItem(`visited_${category}`, "true");
      }
    }
  }, [location.pathname]);

  return null; // Invisible component
}