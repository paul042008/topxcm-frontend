import "./global.css";
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingState from './components/LoadingState';
import AboutTopxcm from "./pages/AboutTopxcm";


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
const WeddingAlbum = lazy(() => import("./pages/WeddingAlbum"));
const Admin = lazy(() => import("./pages/Admin"));
const PhotoCanvas = lazy(() => import("./pages/PhotoCanvas"));


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<LoadingState />}>
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

            {/* Other Routes */}
            <Route path="/real-estate" element={<RealEstate />} />
            <Route path="/wedding/:id" element={<WeddingAlbum />} />
            <Route path="/admin" element={<Admin />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);