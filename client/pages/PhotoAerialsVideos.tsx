import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PhotoMenu from "../components/PhotoMenu";
import BackButton from "../components/BackButton";

const API = "https://topxcm-backend-1.onrender.com";
const WA = "https://wa.me/2348132799299?text=Hi!%20I'd%20like%20to%20book%20a%20session.";

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface AlbumImage {
  id?: string;
  url: string;
  title: string;
  description: string;
  price: string;
  extra_text?: string;
  order?: number;
}

interface Album {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  cover?: string;
  images: AlbumImage[];
  isSingle?: boolean;
}

// ─── HELPER: detect video by actual file extension ────────────────────────

function isVideoUrl(url?: string | null): boolean {
  if (!url) return false;
  return /\.(mp4|mov|webm|avi|mkv|m4v|ogg)(\?.*)?$/i.test(url);
}

// ─── HELPER: fullscreen + landscape lock + unmute for videos ──────────────

async function enterLandscapeFullscreen(el: HTMLVideoElement | null) {
  if (!el) return;
  try {
    el.muted = false;
    el.controls = true;
  } catch {}

  const anyEl = el as any;

  // iOS Safari: native fullscreen video player
  if (typeof anyEl.webkitEnterFullscreen === "function") {
    try {
      anyEl.webkitEnterFullscreen();
      return;
    } catch {}
  }

  // Standard Fullscreen API
  try {
    if (!document.fullscreenElement) {
      await el.requestFullscreen();
    }
  } catch {}

  // Orientation lock
  try {
    const orientation = screen.orientation as any;
    if (orientation && orientation.lock) {
      await orientation.lock("landscape");
    }
  } catch {}
}

function exitLandscapeFullscreenAndMute(video: HTMLVideoElement | null) {
  if (!video) return;
  try {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  } catch {}
  try {
    const orientation = screen.orientation as any;
    if (orientation && orientation.unlock) {
      orientation.unlock();
    }
  } catch {}
  video.muted = true;
}

// ─── GALLERY VIEW ──────────────────────────────────────────────────────────

function GalleryView({ album, onClose }: { album: Album; onClose: () => void }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const images = album.images || [];
  const coverImage = album.cover || (images.length > 0 ? images[0].url : "");
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const lightboxVideoRef = useRef<HTMLVideoElement>(null);

  const selectedIsVideo = selectedIndex !== null && isVideoUrl(images[selectedIndex]?.url);

  useEffect(() => {
    if (selectedIndex !== null && selectedIsVideo) {
      const video = lightboxVideoRef.current;
      if (video) {
        video.play().catch(() => {});
        enterLandscapeFullscreen(video);
      }
    }
    return () => {
      if (lightboxVideoRef.current) {
        exitLandscapeFullscreenAndMute(lightboxVideoRef.current);
      }
    };
  }, [selectedIndex, selectedIsVideo]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: album.name,
        text: `Check out ${album.name}'s gallery`,
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
          📷
        </div>
      );
    }
    if (isVideoUrl(coverImage)) {
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
    return <img src={coverImage} alt={album.name} className="w-full h-full object-cover" />;
  };

  const renderThumbnail = (img: AlbumImage, idx: number) => {
    if (!img.url) {
      return (
        <div className="w-full h-full flex items-center justify-center text-2xl opacity-20 bg-zinc-900">
          📷
        </div>
      );
    }
    if (isVideoUrl(img.url)) {
      return (
        <video
          ref={(el) => { videoRefs.current[img.id || String(idx)] = el; }}
          src={img.url}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          autoPlay
          muted
          loop
          playsInline
          onContextMenu={(e) => e.preventDefault()}
        />
      );
    }
    return (
      <img
        src={img.url}
        alt={img.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        onContextMenu={(e) => e.preventDefault()}
      />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] bg-black overflow-y-auto"
    >
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-white/10">
        <button onClick={onClose} className="text-[#D4AF37] text-xl hover:scale-110 transition">
          ←
        </button>
        <span className="text-white/40 text-xs">{images.length} items</span>
      </div>

      <div className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-zinc-800">
        {renderCover()}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full">
          <h1 className="text-3xl md:text-5xl font-serif text-white leading-tight">{album.name}</h1>
          {album.description && (
            <div
              className="text-white/70 text-sm md:text-base mt-2 max-w-2xl [&_strong]:font-bold [&_em]:italic [&_u]:underline album-description"
              dangerouslySetInnerHTML={{ __html: album.description }}
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

      <div className="p-4 md:p-6 max-w-7xl mx-auto">
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
              {isVideoUrl(img.url) && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-black/60 backdrop-blur">
                    <span className="ml-1 text-[#D4AF37] text-lg">▶</span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* ─── LIGHTBOX ── */}
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
              {selectedIsVideo ? (
                <video
                  ref={lightboxVideoRef}
                  src={images[selectedIndex].url}
                  className="max-h-[90vh] max-w-[90vw] w-auto"
                  controls
                  autoPlay
                  playsInline
                  onContextMenu={(e) => e.preventDefault()}
                  onClick={() => {
                    const video = lightboxVideoRef.current;
                    if (video) {
                      if (!document.fullscreenElement) {
                        enterLandscapeFullscreen(video);
                      } else {
                        exitLandscapeFullscreenAndMute(video);
                      }
                    }
                  }}
                />
              ) : (
                <img
                  src={images[selectedIndex].url}
                  alt={images[selectedIndex].title}
                  className="max-h-[90vh] max-w-[90vw] object-contain"
                  onContextMenu={(e) => e.preventDefault()}
                />
              )}
              {images[selectedIndex].title && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-4 py-2 rounded-full backdrop-blur-sm">
                  {images[selectedIndex].title}
                </div>
              )}
              {selectedIsVideo && (
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-[#D4AF37]/20 text-[#D4AF37] text-xs px-3 py-1 rounded-full backdrop-blur-sm border border-[#D4AF37]/30">
                  🎬 Click video to toggle fullscreen
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── ALBUM CARD (with "View Gallery" button) ──────────────────────────────

function AlbumCard({ album, onClick }: { album: Album; onClick: () => void }) {
  const displayImage = album.cover || (album.images.length > 0 ? album.images[0].url : null);
  const displayIsVideo = isVideoUrl(displayImage);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6 }}
      className="bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 shadow-lg group"
    >
      <div
        className="relative h-64 md:h-72 overflow-hidden bg-zinc-800 cursor-pointer"
        onClick={onClick}
      >
        {displayImage ? (
          <>
            {displayIsVideo ? (
              <video
                ref={videoRef}
                src={displayImage}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                autoPlay
                muted
                loop
                playsInline
                onContextMenu={(e) => e.preventDefault()}
              />
            ) : (
              <img
                src={displayImage}
                alt={album.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onContextMenu={(e) => e.preventDefault()}
              />
            )}
            {displayIsVideo && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-black/60 backdrop-blur">
                  <span className="ml-1 text-[#D4AF37] text-2xl">▶</span>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">
            📷
          </div>
        )}
        <span className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20">
          {album.images.length} items
        </span>
      </div>

      <div className="p-5">
        <p className="text-[9px] uppercase tracking-[0.4em] text-[#D4AF37] font-bold mb-1">
          {album.category === "aerials" ? "Aerials" : "Hand Held Videos"}
        </p>
        <h3 className="text-lg font-serif text-white leading-tight">{album.name}</h3>
        {album.description && (
          <div
            className="text-white/40 text-xs leading-relaxed mt-2 line-clamp-2 album-description"
            dangerouslySetInnerHTML={{ __html: album.description }}
          />
        )}
        <button
          onClick={onClick}
          className="mt-4 w-full border border-[#D4AF37]/40 text-[#D4AF37] rounded-xl py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-[#D4AF37]/10 active:scale-[0.98] transition"
        >
          View Gallery →
        </button>
      </div>
    </motion.div>
  );
}

// ─── SINGLE CARD (video plays directly on card) ────────────────────────────

function SingleCard({ item }: { item: Album }) {
  const image = item.images[0];
  const hasUrl = !!image?.url;
  const itemIsVideo = isVideoUrl(image?.url);
  const [isVideoError, setIsVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleVideoLoaded = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        console.log("Autoplay blocked for:", item.name);
      });
    }
  };

  const handleVideoClick = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.controls = true;
    video.play().catch(() => {});
    enterLandscapeFullscreen(video);
  };

  const handleExitFullscreen = () => {
    const video = videoRef.current;
    if (video) {
      exitLandscapeFullscreenAndMute(video);
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      const video = videoRef.current;
      if (!document.fullscreenElement && video) {
        video.muted = true;
        setIsFullscreen(false);
      } else if (document.fullscreenElement && video) {
        setIsFullscreen(true);
      }
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("webkitfullscreenchange", onFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", onFullscreenChange);
    };
  }, []);

  const showExitButton = isFullscreen && itemIsVideo;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6 }}
      className="bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 shadow-lg"
    >
      <div className="relative h-64 md:h-72 overflow-hidden bg-zinc-800">
        {hasUrl ? (
          <>
            {itemIsVideo && !isVideoError ? (
              <>
                <video
                  ref={videoRef}
                  src={image.url}
                  className="w-full h-full object-cover cursor-pointer"
                  autoPlay
                  muted
                  playsInline
                  loop
                  onError={() => {
                    console.error("🎥 Video failed to load:", image.url);
                    setIsVideoError(true);
                  }}
                  onLoadedData={handleVideoLoaded}
                  onClick={handleVideoClick}
                  onContextMenu={(e) => e.preventDefault()}
                />
                {showExitButton && (
                  <button
                    onClick={handleExitFullscreen}
                    className="absolute top-2 right-2 z-20 bg-black/70 hover:bg-black/90 text-white rounded-full p-2 transition text-xl shadow-lg backdrop-blur-sm"
                    aria-label="Exit fullscreen"
                  >
                    ✕
                  </button>
                )}
              </>
            ) : (
              <img
                src={image.url}
                alt={item.name}
                className="w-full h-full object-cover cursor-pointer"
                onError={() => console.error("🖼️ Image failed to load:", image.url)}
                onClick={() => {
                  if (itemIsVideo) {
                    handleVideoClick();
                  }
                }}
                onContextMenu={(e) => e.preventDefault()}
              />
            )}
            {itemIsVideo && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-black/60 backdrop-blur opacity-80 group-hover:opacity-100 transition-opacity">
                  <span className="ml-1 text-[#D4AF37] text-2xl">▶</span>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-4xl opacity-20">
            📷
            <span className="text-xs opacity-60">Unavailable</span>
          </div>
        )}
        <span className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20">
          1 item
        </span>
      </div>
      <div className="p-5">
        <p className="text-[9px] uppercase tracking-[0.4em] text-[#D4AF37] font-bold mb-1">
          {item.category === "aerials" ? "Aerials" : "Hand Held Videos"}
        </p>
        <h3 className="text-lg font-serif text-white leading-tight">{item.name}</h3>
        {item.description && (
          <div
            className="text-white/40 text-xs leading-relaxed mt-2 line-clamp-2 album-description"
            dangerouslySetInnerHTML={{ __html: item.description }}
          />
        )}
      </div>
    </motion.div>
  );
}

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────

export default function PhotoAerialsVideos() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "aerials" | "videos">("all");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const albumsRes = await fetch(`${API}/api/fashion-albums`);
        const albumsData: Album[] = await albumsRes.json();

        const itemsRes = await fetch(`${API}/api/items`);
        const itemsData = await itemsRes.json();

        const photoCategories = ["aerials", "videos"];

        const filteredAlbums = albumsData.filter((album) =>
          photoCategories.includes(album.category)
        );

        const standaloneItems = itemsData.filter(
          (item: any) =>
            !item.album_id &&
            photoCategories.includes(item.category)
        );

        const singleItemsAsAlbums: Album[] = standaloneItems.map((item: any) => ({
          id: `single-${item.id}`,
          name: item.title || "Untitled",
          category: item.category,
          description: item.description || "",
          price: item.price || "",
          cover: item.secureImage || item.image,
          isSingle: true,
          images: [
            {
              url: item.secureImage || item.image,
              title: item.title || "Untitled",
              description: item.description || "",
              price: item.price || "",
              extra_text: item.extra_text || "",
            },
          ],
        }));

        setAlbums([...filteredAlbums, ...singleItemsAsAlbums]);
      } catch (error) {
        console.error("Error fetching data:", error);
        setAlbums([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredAlbums =
    activeTab === "all" ? albums : albums.filter((a) => a.category === activeTab);

  return (
    <div className="min-h-screen bg-[#080808] text-white overflow-x-hidden">
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-10 py-5 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <BackButton />
        <div className="flex flex-col items-center gap-0.5">
          <p className="text-[#D4AF37] text-[10px] tracking-[0.7em] uppercase font-bold leading-none">
             Videos & Drone Aerials
          </p>
          <span className="text-white/20 text-[8px] tracking-[0.3em] uppercase">
            The Official Photography
          </span>
        </div>
        <PhotoMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} onCloseAction={() => setMenuOpen(false)} />
      </header>

      <div className="pt-[72px]">
        <div className="border-b border-white/5 px-6 md:px-16 py-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-[#D4AF37] text-[9px] uppercase tracking-[0.7em] mb-3 font-bold">
              The Collection
            </p>
            <h1
              className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-none"
              style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}
            >
              Videos &<br />Drone Aerials
            </h1>
          </div>
          <p className="text-white/30 text-sm font-light max-w-sm leading-relaxed">
            Cinematic drone perspectives and premium motion content — storytelling from every angle.
          </p>
        </div>
      </div>

      <div className="px-6 md:px-16 py-6 flex gap-6 border-b border-white/5 overflow-x-auto">
        {(["all", "aerials", "videos"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-[10px] uppercase tracking-[0.4em] font-bold pb-2 transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab
                ? "text-[#D4AF37] border-[#D4AF37]"
                : "text-white/30 border-transparent hover:text-white/60"
            }`}
          >
            {tab === "all" ? "All" : tab === "aerials" ? "Aerials" : "Hand Held Videos"}
          </button>
        ))}
      </div>

      <main className="px-4 py-8 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-white/10 border-t-[#D4AF37] rounded-full animate-spin" />
          </div>
        ) : filteredAlbums.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-white/20 text-lg font-serif italic">No collections uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAlbums.map((album) =>
              album.isSingle ? (
                <SingleCard key={album.id} item={album} />
              ) : (
                <AlbumCard
                  key={album.id}
                  album={album}
                  onClick={() => setSelectedAlbum(album)}
                />
              )
            )}
          </div>
        )}
      </main>

      <footer className="py-16 text-center border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
            {/* Instagram – Film (Videos) */}
            <a
              href="https://www.instagram.com/topfilmz1?igsh=MTM5MG02YnNudzJqZw=="
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-3 text-white/40 hover:text-white transition-colors"
              aria-label="Instagram Film"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
              <span className="text-[9px] uppercase tracking-[0.3em]">@topfilmz1</span>
            </a>

            {/* Instagram – Drone (Aerials) */}
            <a
              href="https://www.instagram.com/topdronez1?igsh=MWo0OWh3N2xrcWdzdg=="
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-3 text-white/40 hover:text-white transition-colors"
              aria-label="Instagram Drone"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
              <span className="text-[9px] uppercase tracking-[0.3em]">@topdronez1</span>
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/share/1DL1xouwqS"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-3 text-white/40 hover:text-white transition-colors"
              aria-label="Facebook"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
              <span className="text-[9px] uppercase tracking-[0.3em]">Facebook</span>
            </a>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-[1px] bg-gradient-to-b from-[#D4AF37] to-transparent" />
            <p className="text-[8px] tracking-[1em] text-white/15 uppercase">© 2026 TOP • All Right Reserve</p>
          </div>
        </div>
      </footer>

      <a
        href={WA}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-[150] flex items-center gap-2 px-5 py-3 rounded-full text-black text-xs font-bold uppercase tracking-widest shadow-lg transition-all hover:scale-105 active:scale-95"
        style={{ backgroundColor: "#D4AF37" }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.555 4.126 1.524 5.868L.057 23.5l5.806-1.524A11.953 11.953 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.523-5.18-1.433l-.371-.221-3.844 1.009 1.028-3.752-.242-.386A9.938 9.938 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
        </svg>
        Book Us
      </a>

      <AnimatePresence>
        {selectedAlbum && (
          <GalleryView album={selectedAlbum} onClose={() => setSelectedAlbum(null)} />
        )}
      </AnimatePresence>

      {/* ─── GLOBAL STYLES FOR DESCRIPTION PARAGRAPH SPACING ─────────── */}
      <style>{`
        .album-description p {
          margin-bottom: 0.5rem;
        }
        .album-description p:last-child {
          margin-bottom: 0;
        }
      `}</style>
    </div>
  );
}