import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Photography from "./pages/Photography";
import PhotoWeddings from "./pages/PhotoWeddings";
import PhotoPortraits from "./pages/PhotoPortraits";
import PhotoVideos from "./pages/PhotoVideos";
import PhotoAerials from "./pages/PhotoAerials";
import PhotoCanvas from "./pages/PhotoCanvas";
import Fashion from "./pages/Fashion";
import FashionSuits from "./pages/FashionSuits";
import FashionAgbada from "./pages/FashionAgbada";
import FashionNatives from "./pages/FashionNatives";
import FashionCasuals from "./pages/FashionCasuals";
import FashionContact from "./pages/FashionContact";
import RealEstate from "./pages/RealEstate";
import WeddingAlbum from "./pages/WeddingAlbum";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/photography" element={<Photography />} />
          <Route path="/photography/weddings" element={<PhotoWeddings />} />
          <Route path="/photography/portraits" element={<PhotoPortraits />} />
          <Route path="/photography/aerials" element={<PhotoAerials />} />
          <Route path="/photography/videos" element={<PhotoVideos />} />
          <Route path="/photography/canvas" element={<PhotoCanvas />} />
          <Route path="/fashion" element={<Fashion />} />
          <Route path="/fashion/suits" element={<FashionSuits />} /> 
          <Route path="/fashion/agbada" element={<FashionAgbada />} />
          <Route path="/fashion/natives" element={<FashionNatives />} />
          <Route path="/fashion/casuals" element={<FashionCasuals />} />
          <Route path="/fashion/contact" element={<FashionContact />} />
          <Route path="/real-estate" element={<RealEstate />} />
          <Route path="/wedding/:id" element={<WeddingAlbum />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);

