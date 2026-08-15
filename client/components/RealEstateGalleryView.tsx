import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PropertyImage {
  id?: string;
  url: string;
  title: string;
  description: string;
  price: string;
  extra_text?: string;
  order?: number;
}

interface Property {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  cover?: string;
  images: PropertyImage[];
  location?: string;
  isSingle?: boolean;
}

export default function RealEstateGalleryView({
  property,
  onClose,
}: {
  property: Property;
  onClose: () => void;
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const images = property.images || [];
  const coverImage = property.cover || (images.length > 0 ? images[0].url : "");
  const isVideo = (url: string) => /\.(mp4|mov|webm|avi|mkv)$/i.test(url);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.name,
        text: `Check out ${property.name}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href)
        .then(() => alert("Link copied!"))
        .catch(() => {});
    }
  };

  const renderCover = () => {
    if (!coverImage) {
      return (
        <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">
          🏠
        </div>
      );
    }
    if (isVideo(coverImage)) {
      return (
        <video
          src={coverImage}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          controlsList="nodownload"
          disablePictureInPicture
          onContextMenu={(e) => e.preventDefault()}
        />
      );
    }
    return <img src={coverImage} alt={property.name} className="w-full h-full object-cover" />;
  };

  const renderThumbnail = (img: PropertyImage, idx: number) => {
    if (!img.url) {
      return (
        <div className="w-full h-full flex items-center justify-center text-2xl opacity-20 bg-zinc-900">
          🏠
        </div>
      );
    }
    if (isVideo(img.url)) {
      return (
        <video
          src={img.url}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          muted
          loop
          playsInline
          onMouseEnter={(e) => e.currentTarget.play()}
          onMouseLeave={(e) => e.currentTarget.pause()}
          onContextMenu={(e) => e.preventDefault()}
        />
      );
    }
    return (
      <img
        src={img.url}
        alt={img.title || property.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        onContextMenu={(e) => e.preventDefault()}
      />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed inset-0 z-[150] bg-black overflow-y-auto"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/70 backdrop-blur-xl border-b border-[#B0D4E8]/10 px-5 py-4 flex items-center gap-4">
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-xl border border-[#B0D4E8]/20 flex items-center justify-center text-[#B0D4E8] hover:bg-[#B0D4E8]/10 transition text-lg"
        >
          ←
        </button>
        <div>
          <p className="text-[9px] uppercase tracking-[0.4em] text-[#B0D4E8] font-bold">Gallery</p>
          <h2 className="text-base font-serif text-white leading-tight">{property.name}</h2>
        </div>
        <span className="ml-auto text-xs text-white/40">{property.images.length} items</span>
      </div>

      {/* Cover image */}
      <div className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-zinc-800">
        {renderCover()}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full">
          <h1 className="text-3xl md:text-5xl font-serif text-white leading-tight">{property.name}</h1>
          {property.location && (
            <p className="text-white/60 text-sm flex items-center gap-1 mt-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {property.location}
            </p>
          )}
          {property.price && (
            <p className="text-[#B0D4E8] font-bold text-lg mt-2">{property.price}</p>
          )}
          {property.description && (
            <div
              className="text-white/70 text-sm md:text-base mt-2 max-w-2xl [&_strong]:font-bold [&_em]:italic [&_u]:underline"
              dangerouslySetInnerHTML={{ __html: property.description }}
            />
          )}
          <button
            onClick={handleShare}
            className="mt-4 flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs px-4 py-2 rounded-full backdrop-blur-sm transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            Share
          </button>
        </div>
      </div>

      {/* Thumbnails grid */}
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        {images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {images.map((img, idx) => (
              <motion.div
                key={img.id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                onClick={() => img.url && setSelectedIndex(idx)}
                className={`aspect-square group relative overflow-hidden bg-zinc-900 ${img.url ? "cursor-pointer" : "cursor-default"}`}
              >
                {renderThumbnail(img, idx)}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition" />
                {isVideo(img.url) && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#B0D4E8]/40 bg-black/60 backdrop-blur">
                      <span className="ml-1 text-[#B0D4E8] text-lg">▶</span>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-white/20 text-sm uppercase tracking-widest">No images available</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setSelectedIndex(null)}
          >
            <div
              className="relative max-w-6xl w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedIndex(null)}
                className="absolute top-4 right-4 z-10 text-white/60 hover:text-white text-2xl"
              >
                ✕
              </button>
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedIndex((prev) =>
                        prev !== null ? (prev - 1 + images.length) % images.length : 0
                      );
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition"
                  >
                    ‹
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedIndex((prev) =>
                        prev !== null ? (prev + 1) % images.length : 0
                      );
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition"
                  >
                    ›
                  </button>
                </>
              )}
              {isVideo(images[selectedIndex].url) ? (
                <video
                  src={images[selectedIndex].url}
                  className="max-h-[90vh] max-w-[90vw]"
                  controls
                  autoPlay
                  playsInline
                />
              ) : (
                <img
                  src={images[selectedIndex].url}
                  alt={images[selectedIndex].title || property.name}
                  className="max-h-[90vh] max-w-[90vw] object-contain"
                />
              )}
              {images[selectedIndex].title && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-4 py-2 rounded-full backdrop-blur-sm">
                  {images[selectedIndex].title}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}