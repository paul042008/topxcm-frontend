import "./global.css";
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingState from './components/LoadingState';
 

// --- LAZY LOADED COMPONENTS ---
// This splits your code into small chunks so the site loads faster
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Photography = lazy(() => import("./pages/Photography"));
const PhotoWeddings = lazy(() => import("./pages/PhotoWeddings"));
const PhotoStudios = lazy(() => import("./pages/PhotoStudios"));
const PhotoVideos = lazy(() => import("./pages/PhotoVideos"));
const PhotoAerials = lazy(() => import("./pages/PhotoAerials"));
const PhotoOutdoors = lazy(() => import("./pages/PhotoOutdoors"));
const Fashion = lazy(() => import("./pages/Fashion"));
const FashionSuits = lazy(() => import("./pages/FashionSuits"));
const FashionAgbada = lazy(() => import("./pages/FashionAgbada"));
const FashionNatives = lazy(() => import("./pages/FashionNatives"));
const FashionCasuals = lazy(() => import("./pages/FashionCasuals"));
const FashionContact = lazy(() => import("./pages/FashionContact"));
const RealEstate = lazy(() => import("./pages/RealEstate"));
const WeddingAlbum = lazy(() => import("./pages/WeddingAlbum"));
const Admin = lazy(() => import("./pages/Admin"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* Suspense catch the "loading" phase and shows your LoadingState component */}
        <Suspense fallback={<LoadingState />}>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Photography Routes */}
            <Route path="/photography" element={<Photography />} />
            <Route path="/photography/weddings" element={<PhotoWeddings />} />
            <Route path="/photography/studios" element={<PhotoStudios />} />
            <Route path="/photography/aerials" element={<PhotoAerials />} />
            <Route path="/photography/videos" element={<PhotoVideos />} />
            <Route path="/photography/outdoors" element={<PhotoOutdoors />} />
            
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
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);