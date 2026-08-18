import React, { Suspense, lazy, useEffect, useRef } from "react";
import "./global.css";
import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AboutTopxcm from "./pages/AboutTopxcm";
import FashionLatest from "./pages/FashionLatest";

const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PhotoAerialsVideos = lazy(() => import("./pages/PhotoAerialsVideos"));
const Photography = lazy(() => import("./pages/Photography"));
const PhotoWeddings = lazy(() => import("./pages/PhotoWeddings"));
const PhotoStudioOutdoors = lazy(() => import("./pages/PhotoStudioOutdoors"));
const PhotoContact = lazy(() => import("./pages/PhotoContact"));
const Fashion = lazy(() => import("./pages/Fashion"));
const FashionSuits = lazy(() => import("./pages/FashionSuits"));
const FashionAgbada = lazy(() => import("./pages/FashionAgbada"));
const FashionNatives = lazy(() => import("./pages/FashionNatives"));
const FashionCasuals = lazy(() => import("./pages/FashionCasuals"));
const FashionContact = lazy(() => import("./pages/FashionContact"));
const RealEstate = lazy(() => import("./pages/RealEstate"));
const RealEstateListings = lazy(() => import("./pages/RealEstateListings"));
const RealEstateContact = lazy(() => import("./pages/RealEstateContact"));
const WeddingAlbum = lazy(() => import("./pages/WeddingAlbum"));
const Admin = lazy(() => import("./pages/Admin"));
const PhotoCanvas = lazy(() => import("./pages/PhotoCanvas"));

const RealEstateConstruction = lazy(() => import("./pages/RealEstateConstruction"));
const RealEstatePlans = lazy(() => import("./pages/RealEstatePlans"));

const queryClient = new QueryClient();

// ─── PROTECTION WRAPPER ──────────────────────────────────────────────

function ProtectionOverlay() {
  const [showWarning, setShowWarning] = React.useState(false);
  const warningTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Disable right-click
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);

    // Detect PrintScreen key (key code 44) – works on desktop browsers
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen" || e.key === "PrintScreen") {
        setShowWarning(true);
        if (warningTimeout.current) clearTimeout(warningTimeout.current);
        warningTimeout.current = setTimeout(() => setShowWarning(false), 3000);
      }
      // Also detect Ctrl+Shift+S (common screenshot tool shortcut)
      if (e.ctrlKey && e.shiftKey && (e.key === "S" || e.key === "s")) {
        setShowWarning(true);
        if (warningTimeout.current) clearTimeout(warningTimeout.current);
        warningTimeout.current = setTimeout(() => setShowWarning(false), 3000);
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      if (warningTimeout.current) clearTimeout(warningTimeout.current);
    };
  }, []);

  return (
    <>
      {/* Watermark overlay – invisible to eye, visible in screenshots */}
      <div
        className="fixed inset-0 pointer-events-none z-[9999]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 30px,
              rgba(0, 174, 239, 0.015) 30px,
              rgba(0, 174, 239, 0.015) 31px
            ),
            repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 30px,
              rgba(0, 174, 239, 0.015) 30px,
              rgba(0, 174, 239, 0.015) 31px
            )
          `,
          backgroundSize: "60px 60px",
          mixBlendMode: "overlay",
        }}
      />
      {/* Watermark text – very faint, appears in screenshots */}
      <div
        className="fixed inset-0 pointer-events-none z-[9999] flex items-center justify-center"
        style={{ opacity: 0.02 }}
      >
        <span className="text-8xl font-black text-[#00AEEF] tracking-widest rotate-[-15deg] select-none">
          TOPXCM
        </span>
      </div>

      {/* Warning popup when screenshot is attempted */}
      {showWarning && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10000] bg-black/90 backdrop-blur-lg border border-[#00AEEF]/40 rounded-2xl px-8 py-6 shadow-2xl pointer-events-none animate-in fade-in zoom-in duration-200">
          <p className="text-[#00AEEF] text-sm font-bold uppercase tracking-widest text-center">
            📸 Screenshots are disabled
          </p>
          <p className="text-white/60 text-xs mt-2 text-center max-w-xs">
            This content is protected. Please respect our privacy.
          </p>
        </div>
      )}
    </>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* Global protection layer */}
        <ProtectionOverlay />
        <div
          className="select-none"
          style={{
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            msUserSelect: "none",
          }}
        >
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Index />} />

              {/* Photography Routes */}
              <Route path="/photography" element={<Photography />} />
              <Route path="/photography/weddings" element={<PhotoWeddings />} />
              <Route path="/photography/studio-outdoors" element={<PhotoStudioOutdoors />} />
              <Route path="/photography/aerials-videos" element={<PhotoAerialsVideos />} />
              <Route path="/photography/canvas" element={<PhotoCanvas />} />
              <Route path="/photography/contact" element={<PhotoContact />} />
              <Route path="/about" element={<AboutTopxcm />} />

              {/* Fashion Routes */}
              <Route path="/fashion" element={<Fashion />} />
              <Route path="/fashion/suits" element={<FashionSuits />} />
              <Route path="/fashion/agbada" element={<FashionAgbada />} />
              <Route path="/fashion/natives" element={<FashionNatives />} />
              <Route path="/fashion/casuals" element={<FashionCasuals />} />
              <Route path="/fashion/contact" element={<FashionContact />} />
              <Route path="/fashion/latest" element={<FashionLatest />} />

              {/* Real Estate Routes */}
              <Route path="/real-estate" element={<RealEstate />} />
              <Route path="/real-estate/listings" element={<RealEstateListings />} />
              <Route path="/real-estate/contact" element={<RealEstateContact />} />
              <Route path="/real-estate/construction" element={<RealEstateConstruction />} />
              <Route path="/real-estate/plans" element={<RealEstatePlans />} />

              {/* Other Routes */}
              <Route path="/wedding/:id" element={<WeddingAlbum />} />
              <Route path="/admin" element={<Admin />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);