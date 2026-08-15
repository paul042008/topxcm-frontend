import { useEffect, useState, FormEvent, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";

// ─── TYPES ───────────────────────────────────────────────────────────────────

type MainTab = "fashion" | "photo" | "realestate";

type FashionCategory = "casuals" | "natives" | "agbadas" | "suits" | "latest";
type PhotoCategory = "weddings" | "portraits" | "videos" | "aerials" | "studio" | "outdoors" | "showcase" | "canvas" | "frames";
type RealEstateCategory = "properties" | "construction" | "plans";

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
}

interface SingleItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  price: string;
  order?: number;
  album_id?: string;
  extra_text?: string;
}

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const ADMIN_PASSWORD = "topxcm123";
const AUTH_KEY = "topxcm_admin_auth";
const API = "https://topxcm-backend-1.onrender.com";
const AUTH_HEADER = { Authorization: "topxcm_secure_key" };

const FASHION_CATEGORIES: { value: FashionCategory; label: string; icon: string }[] = [
  { value: "casuals", label: "Casuals", icon: "👕" },
  { value: "natives", label: "Natives", icon: "🪡" },
  { value: "agbadas", label: "Agbada", icon: "✨" },
  { value: "suits", label: "Suits", icon: "🤵" },
  { value: "latest", label: "Latest Collection", icon: "✨" },
];

const PHOTO_CATEGORIES: { value: PhotoCategory; label: string; icon: string }[] = [
  { value: "weddings", label: "Weddings", icon: "💍" },
  { value: "portraits", label: "Portraits", icon: "🎭" },
  { value: "videos", label: "Videos", icon: "🎬" },
  { value: "aerials", label: "Aerials", icon: "🚁" },
  { value: "studio", label: "Studio", icon: "🎞" },
  { value: "outdoors", label: "Outdoors", icon: "🌿" },
  { value: "showcase", label: "Showcase", icon: "✨" },
  { value: "canvas", label: "Canvas", icon: "🖼️" },
  { value: "frames", label: "Frames", icon: "🖼️" },
];

const REAL_ESTATE_CATEGORIES: { value: RealEstateCategory; label: string; icon: string }[] = [
  { value: "properties", label: "Properties", icon: "🏠" },
  { value: "construction", label: "Construction", icon: "🏗️" },
  { value: "plans", label: "2D & 3D Plans", icon: "📐" },
];

// ─── SHOWCASE ROUTE OPTIONS ────────────────────────────────────────────────

const SHOWCASE_ROUTE_OPTIONS = [
  { value: "weddings", label: "Weddings" },
  { value: "studio-outdoors", label: "Studio & Outdoors" },
  { value: "aerials-videos", label: "Drone Aerials & Videos" },
  { value: "canvas", label: "Canvas & Frames" },
  { value: "portraits", label: "Portraits" },
];

// ─── CAROUSEL ROUTE OPTIONS (for fashion) ─────────────────────────────────

const CAROUSEL_ROUTE_OPTIONS = [
  { value: "/fashion/suits", label: "Suits" },
  { value: "/fashion/agbadas", label: "Agbadas" },
  { value: "/fashion/natives", label: "Natives" },
  { value: "/fashion/casuals", label: "Casuals" },
  { value: "/fashion/latest", label: "Latest Collection" },
];

// ─── STYLES ──────────────────────────────────────────────────────────────────

const inputCls = [
  "w-full rounded-xl border border-white/10 px-4 py-3 text-sm",
  "bg-[#111] text-white placeholder:text-white/30",
  "outline-none transition",
  "focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20",
  "[color-scheme:dark]",
].join(" ");

const textareaCls = [
  "w-full rounded-xl border border-white/10 px-4 py-3 text-sm",
  "bg-[#111] text-white placeholder:text-white/30",
  "outline-none transition resize-none min-h-[80px]",
  "focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20",
].join(" ");

const labelCls = "block mb-1.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]/60";

const cardCls = "rounded-2xl border border-white/[0.07] bg-[#111] p-5 space-y-4";

const btnGold =
  "rounded-xl bg-[#D4AF37] px-6 py-2.5 text-sm font-bold text-black transition hover:bg-[#e0c04a] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed";

// ─── RICH TEXT EDITOR ───────────────────────────────────────────────────────

function RichTextEditor({
  value,
  onChange,
  placeholder = "Write something…",
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: { HTMLAttributes: { class: "font-bold" } },
        italic: { HTMLAttributes: { class: "italic" } },
        strike: { HTMLAttributes: { class: "line-through" } },
      }),
      Underline.configure({
        HTMLAttributes: { class: "underline" },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none focus:outline-none min-h-[80px] px-4 py-3 text-sm text-white bg-[#111] rounded-xl border border-white/10",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleUnderline = () => editor.chain().focus().toggleUnderline().run();
  const clearFormat = () => editor.chain().focus().clearNodes().unsetAllMarks().run();

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1 bg-[#1a1a1a] p-2 rounded-xl border border-white/10">
        <button
          type="button"
          onClick={toggleBold}
          className={`px-2 py-1 rounded text-sm transition ${
            editor.isActive("bold") ? "bg-[#D4AF37] text-black" : "text-white/60 hover:text-white hover:bg-white/10"
          }`}
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={toggleItalic}
          className={`px-2 py-1 rounded text-sm transition ${
            editor.isActive("italic") ? "bg-[#D4AF37] text-black" : "text-white/60 hover:text-white hover:bg-white/10"
          }`}
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={toggleUnderline}
          className={`px-2 py-1 rounded text-sm transition ${
            editor.isActive("underline") ? "bg-[#D4AF37] text-black" : "text-white/60 hover:text-white hover:bg-white/10"
          }`}
        >
          <u>U</u>
        </button>
        <button
          type="button"
          onClick={clearFormat}
          className="px-2 py-1 rounded text-sm text-white/40 hover:text-white hover:bg-white/10 transition"
        >
          ✕
        </button>
      </div>
      <EditorContent editor={editor} className="[&_.ProseMirror]:min-h-[80px] [&_.ProseMirror]:px-4 [&_.ProseMirror]:py-3 [&_.ProseMirror]:bg-[#111] [&_.ProseMirror]:rounded-xl [&_.ProseMirror]:border [&_.ProseMirror]:border-white/10 [&_.ProseMirror]:text-sm [&_.ProseMirror]:text-white [&_.ProseMirror]:outline-none [&_.ProseMirror]:focus:border-[#D4AF37] [&_.ProseMirror]:focus:ring-2 [&_.ProseMirror]:focus:ring-[#D4AF37]/20 [&_.ProseMirror]:min-h-[80px]" />
    </div>
  );
}

// ─── PRICE INPUT WITH ₦ PREFIX ────────────────────────────────────────────

function PriceInput({
  value,
  onChange,
  placeholder = "e.g. 85,000",
  ...props
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-medium text-sm">
        ₦
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${inputCls} pl-8`}
        {...props}
      />
    </div>
  );
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

async function pingServer(onStatus: (msg: string) => void): Promise<boolean> {
  onStatus("⏳ Waking up server… (this takes ~30s on first use)");
  const start = Date.now();
  while (Date.now() - start < 90_000) {
    try {
      const res = await fetch(`${API}/api/items`, {
        signal: AbortSignal.timeout(10_000),
        cache: "no-store",
      });
      if (res.ok || res.status < 500) return true;
    } catch {
      // still sleeping
    }
    await new Promise((r) => setTimeout(r, 3000));
    const elapsed = Math.round((Date.now() - start) / 1000);
    onStatus(`⏳ Still waking up… (${elapsed}s) — please wait`);
  }
  return false;
}

async function fetchWithWakeup(
  url: string,
  options: RequestInit,
  onStatus: (msg: string) => void
): Promise<Response> {
  let alive = false;
  try {
    const probe = await fetch(`${API}/api/items`, {
      signal: AbortSignal.timeout(5_000),
      cache: "no-store",
    });
    alive = probe.ok || probe.status < 500;
  } catch {
    alive = false;
  }

  if (!alive) {
    const woke = await pingServer(onStatus);
    if (!woke) {
      throw new Error("Server did not wake up in time");
    }
    onStatus("✅ Server is ready! Submitting…");
    await new Promise((r) => setTimeout(r, 300));
  }

  return fetch(url, { ...options, signal: AbortSignal.timeout(300_000) });
}

// ─── STATUS MESSAGE ──────────────────────────────────────────────────────────

function StatusMsg({ msg }: { msg: string }) {
  if (!msg) return null;
  const isOk = msg.startsWith("✅");
  const isWaiting = msg.startsWith("⏳") || msg.startsWith("🔄");
  const color = isOk
    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
    : isWaiting
    ? "border-amber-400/30 bg-amber-400/10 text-amber-300"
    : "border-red-500/30 bg-red-500/10 text-red-400";
  return (
    <div className={`rounded-xl border px-4 py-2.5 text-xs font-medium ${color}`}>
      {msg}
    </div>
  );
}

// ─── UPLOAD BOX (supports video files) ─────────────────────────────────────

function UploadBox({
  label,
  onChange,
  previewFiles = [],
  single = false,
  accept = "image/*",
}: {
  label: string;
  onChange: (files: File[]) => void;
  previewFiles?: File[];
  single?: boolean;
  accept?: string;
}) {
  return (
    <div className="space-y-2">
      <p className={labelCls}>{label}</p>
      <label className="flex min-h-[96px] cursor-pointer items-center justify-center rounded-xl border border-dashed border-white/15 bg-[#0d0d0d] px-4 py-4 text-center transition hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5 group">
        <input
          type="file"
          hidden
          multiple={!single}
          accept={accept}
          onChange={(e) => {
            const arr = Array.from(e.target.files || []);
            onChange(single ? [arr[0]].filter(Boolean) as File[] : arr);
          }}
        />
        <div>
          <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">📎</div>
          <p className="text-xs text-white/50">{single ? "Click to select file" : "Click to select files"}</p>
        </div>
      </label>
      {previewFiles.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-1">
          {previewFiles.slice(0, 6).map((f, i) => {
            const isVideo = f.type.startsWith("video/");
            return isVideo ? (
              <div key={i} className="h-20 w-full rounded-lg border border-white/10 bg-[#0d0d0d] flex flex-col items-center justify-center text-white/60 text-xs">
                <span className="text-2xl">🎬</span>
                <span className="truncate w-full text-center px-1">{f.name}</span>
              </div>
            ) : (
              <img key={i} src={URL.createObjectURL(f)} alt="" className="h-20 w-full rounded-lg object-cover border border-white/10" />
            );
          })}
          {previewFiles.length > 6 && (
            <div className="h-20 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-white/40 text-xs font-medium">
              +{previewFiles.length - 6} more
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── FIELD ───────────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ── REUSABLE CATEGORY MANAGER ──────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

function CategoryManager({
  type,
  categoryOptions,
  albumEndpoint = `${API}/api/fashion-albums`,
  enableCarousel = false,
}: {
  type: string;
  categoryOptions: { value: string; label: string; icon: string }[];
  albumEndpoint?: string;
  enableCarousel?: boolean;
}) {
  // ─── STATE ──────────────────────────────────────────────────────────────────
  const [albums, setAlbums] = useState<Album[]>([]);
  const [singles, setSingles] = useState<SingleItem[]>([]);
  const [carouselItems, setCarouselItems] = useState<SingleItem[]>([]);
  const [loadingAlbums, setLoadingAlbums] = useState(false);
  const [loadingSingles, setLoadingSingles] = useState(false);
  const [loadingCarousel, setLoadingCarousel] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryOptions[0]?.value || "");
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [mode, setMode] = useState<"albums" | "single" | "carousel">("albums");

  // ─── CREATE ALBUM STATE ────────────────────────────────────────────────────
  const [newAlbumName, setNewAlbumName] = useState("");
  const [newAlbumCategory, setNewAlbumCategory] = useState<string>(categoryOptions[0]?.value || "");
  const [newAlbumDesc, setNewAlbumDesc] = useState("");
  const [newAlbumPrice, setNewAlbumPrice] = useState("");
  const [newAlbumCover, setNewAlbumCover] = useState<File | null>(null);
  const [newAlbumInitialImage, setNewAlbumInitialImage] = useState<File | null>(null);
  const [newAlbumExtraText, setNewAlbumExtraText] = useState("");
  const [creatingAlbum, setCreatingAlbum] = useState(false);
  const [createMsg, setCreateMsg] = useState("");

  // ─── EDIT ALBUM STATE ──────────────────────────────────────────────────────
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [editAlbumName, setEditAlbumName] = useState("");
  const [editAlbumCategory, setEditAlbumCategory] = useState<string>("");
  const [editAlbumDesc, setEditAlbumDesc] = useState("");
  const [editAlbumPrice, setEditAlbumPrice] = useState("");
  const [editAlbumCover, setEditAlbumCover] = useState<File | null>(null);
  const [editAlbumLoading, setEditAlbumLoading] = useState(false);
  const [editAlbumMsg, setEditAlbumMsg] = useState("");

  // ─── IMAGE EDIT STATE ──────────────────────────────────────────────────────
  const [editingImage, setEditingImage] = useState<{ albumId: string; image: AlbumImage } | null>(null);
  const [editImageTitle, setEditImageTitle] = useState("");
  const [editImageDesc, setEditImageDesc] = useState("");
  const [editImagePrice, setEditImagePrice] = useState("");
  const [editImageExtra, setEditImageExtra] = useState("");
  const [editImageOrder, setEditImageOrder] = useState<number | undefined>(undefined);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImageLoading, setEditImageLoading] = useState(false);
  const [editImageMsg, setEditImageMsg] = useState("");

  // ─── SINGLE ITEM STATE ────────────────────────────────────────────────────
  const [singleFile, setSingleFile] = useState<File | null>(null);
  const [singleTitle, setSingleTitle] = useState("");
  const [singleDesc, setSingleDesc] = useState("");
  const [singlePrice, setSinglePrice] = useState("");
  const [singleCat, setSingleCat] = useState<string>(categoryOptions[0]?.value || "");
  const [singleTargetRoute, setSingleTargetRoute] = useState<string>("");
  const [singleLoading, setSingleLoading] = useState(false);
  const [singleMsg, setSingleMsg] = useState("");
  const [deletingSingleId, setDeletingSingleId] = useState<string | null>(null);

  // ─── EDIT SINGLE ITEM STATE ──────────────────────────────────────────────
  const [editingSingle, setEditingSingle] = useState<SingleItem | null>(null);
  const [editSingleTitle, setEditSingleTitle] = useState("");
  const [editSingleCat, setEditSingleCat] = useState<string>("");
  const [editSingleDesc, setEditSingleDesc] = useState("");
  const [editSinglePrice, setEditSinglePrice] = useState("");
  const [editSingleOrder, setEditSingleOrder] = useState<number | undefined>(undefined);
  const [editSingleFile, setEditSingleFile] = useState<File | null>(null);
  const [editSingleLoading, setEditSingleLoading] = useState(false);
  const [editSingleMsg, setEditSingleMsg] = useState("");

  // ─── CAROUSEL STATE ──────────────────────────────────────────────────────
  const [carouselFile, setCarouselFile] = useState<File | null>(null);
  const [carouselTitle, setCarouselTitle] = useState("");
  const [carouselDesc, setCarouselDesc] = useState("");
  const [carouselRoute, setCarouselRoute] = useState<string>(CAROUSEL_ROUTE_OPTIONS[0]?.value || "");
  const [carouselLoading, setCarouselLoading] = useState(false);
  const [carouselMsg, setCarouselMsg] = useState("");
  const [deletingCarouselId, setDeletingCarouselId] = useState<string | null>(null);

  // ─── ADD IMAGES TO ALBUM STATE ──────────────────────────────────────────
  const [imgFiles, setImgFiles] = useState<File[]>([]);
  const [imgTitle, setImgTitle] = useState("");
  const [imgDesc, setImgDesc] = useState("");
  const [imgPrice, setImgPrice] = useState("");
  const [imgExtraText, setImgExtraText] = useState("");
  const [addingImg, setAddingImg] = useState(false);
  const [addImgMsg, setAddImgMsg] = useState("");

  // ─── FETCH FUNCTIONS ───────────────────────────────────────────────────────

  const fetchAlbums = useCallback(async () => {
    setLoadingAlbums(true);
    try {
      const res = await fetch(albumEndpoint);
      if (res.ok) {
        const data = await res.json();
        const withOrder = data.map((album: Album) => ({
          ...album,
          images: album.images?.map((img, idx) => ({
            ...img,
            order: img.order !== undefined ? img.order : idx,
          })) || [],
        }));
        setAlbums(withOrder);
        setLoadingAlbums(false);
        return withOrder;
      }
    } catch {
      // error silently
    }
    setLoadingAlbums(false);
    return [];
  }, [albumEndpoint]);

  const fetchSingles = useCallback(async () => {
    setLoadingSingles(true);
    try {
      const res = await fetch(`${API}/api/items`);
      if (res.ok) {
        const all = await res.json();
        // Exclude carousel items and filter by category options
        const filtered = all.filter(
          (item: any) =>
            !item.album_id &&
            item.category !== "fashion-carousel" &&
            categoryOptions.some((c) => c.value === item.category)
        );
        setSingles(filtered);
      }
    } catch {}
    setLoadingSingles(false);
  }, [categoryOptions]);

  const fetchCarousel = useCallback(async () => {
    if (!enableCarousel) return;
    setLoadingCarousel(true);
    try {
      const res = await fetch(`${API}/api/items?category=fashion-carousel`);
      if (res.ok) {
        const data = await res.json();
        setCarouselItems(data);
      }
    } catch {}
    setLoadingCarousel(false);
  }, [enableCarousel]);

  useEffect(() => {
    fetchAlbums();
    fetchSingles();
    if (enableCarousel) fetchCarousel();
  }, [fetchAlbums, fetchSingles, fetchCarousel, enableCarousel]);

  // ─── REORDER IMAGES ────────────────────────────────────────────────────────

  const moveImage = async (albumId: string, imageId: string, direction: "up" | "down") => {
    console.log(`🔁 moveImage called: album ${albumId}, image ${imageId}, direction ${direction}`);
    const album = albums.find((a) => a.id === albumId);
    if (!album) {
      console.warn("❌ Album not found");
      return;
    }
    const images = album.images;
    const index = images.findIndex((img) => img.id === imageId);
    if (index === -1) {
      console.warn("❌ Image not found in album");
      return;
    }
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= images.length) {
      console.warn("❌ Cannot move out of bounds");
      return;
    }

    const img1 = images[index];
    const img2 = images[newIndex];
    if (!img1.id || !img2.id) {
      console.warn("❌ Missing image ID", { img1, img2 });
      return;
    }

    const order1 = img1.order ?? index;
    const order2 = img2.order ?? newIndex;

    const updateOrder = async (img: AlbumImage, newOrder: number) => {
      const body = {
        title: img.title || "",
        description: img.description || "",
        price: img.price || "",
        extra_text: img.extra_text || "",
        order: newOrder,
      };
      console.log(`📤 Updating image ${img.id} to order ${newOrder}`);
      try {
        const res = await fetch(`${albumEndpoint}/${albumId}/images/${img.id}`, {
          method: "PUT",
          headers: { ...AUTH_HEADER, "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status} - ${text}`);
        }
        console.log(`✅ Image ${img.id} updated`);
      } catch (e) {
        console.error("❌ Failed to update image order", e);
        throw e;
      }
    };

    try {
      await Promise.all([updateOrder(img1, order2), updateOrder(img2, order1)]);
      // Update local state
      const updatedImages = [...images];
      [updatedImages[index], updatedImages[newIndex]] = [updatedImages[newIndex], updatedImages[index]];
      updatedImages.forEach((img, idx) => {
        img.order = idx;
      });

      const updatedAlbums = albums.map((a) =>
        a.id === albumId ? { ...a, images: updatedImages } : a
      );
      setAlbums(updatedAlbums);
      if (selectedAlbum?.id === albumId) {
        setSelectedAlbum({ ...selectedAlbum, images: updatedImages });
      }
      console.log("✅ Image reorder complete");
    } catch (err) {
      alert("❌ Failed to reorder images. Check console for details.");
    }
  };

  // ─── REORDER SINGLES ──────────────────────────────────────────────────────

  const moveSingle = async (itemId: string, direction: "up" | "down") => {
    console.log(`🔁 moveSingle called: item ${itemId}, direction ${direction}`);

    const filtered = singles.filter((s) => s.category === selectedCategory);
    const index = filtered.findIndex((s) => s.id === itemId);
    if (index === -1) {
      console.warn("❌ Item not found in filtered list");
      return;
    }
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= filtered.length) {
      console.warn("❌ Cannot move out of bounds");
      return;
    }

    const item1 = filtered[index];
    const item2 = filtered[newIndex];

    const newOrder1 = newIndex;
    const newOrder2 = index;

    const updateOrder = async (item: SingleItem, newOrder: number) => {
      console.log(`📤 Updating item ${item.id} to order ${newOrder}`);
      try {
        const res = await fetch(`${API}/api/items/${item.id}`, {
          method: "PUT",
          headers: { ...AUTH_HEADER, "Content-Type": "application/json" },
          body: JSON.stringify({ order: newOrder }),
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status} - ${text}`);
        }
        const result = await res.json();
        console.log(`✅ Item ${item.id} updated successfully`, result);
        return result;
      } catch (e) {
        console.error(`❌ Failed to update item ${item.id}`, e);
        throw e;
      }
    };

    try {
      await Promise.all([updateOrder(item1, newOrder1), updateOrder(item2, newOrder2)]);

      const updatedSingles = singles.map((s) => {
        if (s.id === item1.id) return { ...s, order: newOrder1 };
        if (s.id === item2.id) return { ...s, order: newOrder2 };
        return s;
      });
      setSingles(updatedSingles);
      await fetchSingles();
    } catch (err) {
      console.error("❌ Reorder failed", err);
      alert("❌ Failed to reorder items. Check console for details.");
    }
  };

  // ─── DELETE FUNCTIONS ──────────────────────────────────────────────────────

  const deleteAlbum = async (albumId: string) => {
    if (!window.confirm("Delete this album and all its images? This cannot be undone.")) return;
    try {
      const res = await fetch(`${albumEndpoint}/${albumId}`, {
        method: "DELETE",
        headers: AUTH_HEADER,
      });
      if (res.status === 404) {
        alert("Delete endpoint not found.");
        return;
      }
      if (!res.ok) throw new Error("Failed to delete album");
      fetchAlbums();
      if (selectedAlbum?.id === albumId) setSelectedAlbum(null);
    } catch (err) {
      alert("Error deleting album. Try again.");
    }
  };

  const deleteImage = async (albumId: string, imageId: string) => {
    if (!window.confirm("Delete this image? This cannot be undone.")) return;
    try {
      const res = await fetch(`${albumEndpoint}/${albumId}/images/${imageId}`, {
        method: "DELETE",
        headers: AUTH_HEADER,
      });
      if (res.status === 404) {
        alert("Delete endpoint not found.");
        return;
      }
      if (!res.ok) throw new Error("Failed to delete image");
      fetchAlbums();
      setSelectedAlbum((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          images: prev.images.filter((img) => img.id !== imageId),
        };
      });
    } catch (err) {
      alert("Error deleting image. Try again.");
    }
  };

  const deleteSingle = async (itemId: string) => {
    if (!window.confirm("Delete this single item? This cannot be undone.")) return;
    setDeletingSingleId(itemId);
    try {
      const res = await fetch(`${API}/api/items/${itemId}`, {
        method: "DELETE",
        headers: AUTH_HEADER,
      });
      if (res.status === 404) {
        alert("Delete endpoint not found.");
        setDeletingSingleId(null);
        return;
      }
      if (!res.ok) throw new Error("Failed to delete single item");
      fetchSingles();
    } catch (err) {
      alert("Error deleting single item. Try again.");
    } finally {
      setDeletingSingleId(null);
    }
  };

  const deleteCarousel = async (itemId: string) => {
    if (!window.confirm("Delete this carousel item? This cannot be undone.")) return;
    setDeletingCarouselId(itemId);
    try {
      const res = await fetch(`${API}/api/items/${itemId}`, {
        method: "DELETE",
        headers: AUTH_HEADER,
      });
      if (res.status === 404) {
        alert("Delete endpoint not found.");
        setDeletingCarouselId(null);
        return;
      }
      if (!res.ok) throw new Error("Failed to delete carousel item");
      fetchCarousel();
    } catch (err) {
      alert("Error deleting carousel item. Try again.");
    } finally {
      setDeletingCarouselId(null);
    }
  };

  // ─── CREATE ALBUM ──────────────────────────────────────────────────────────

  const handleCreateAlbum = async (e: FormEvent) => {
    e.preventDefault();
    if (!newAlbumName.trim()) return setCreateMsg("Album name is required");
    if (!newAlbumCover) return setCreateMsg("Cover image is required");
    setCreatingAlbum(true);
    setCreateMsg("");
    try {
      const fd = new FormData();
      fd.append("name", newAlbumName);
      fd.append("category", newAlbumCategory);
      fd.append("description", newAlbumDesc);
      fd.append("price", newAlbumPrice);
      fd.append("cover", newAlbumCover);
      if (newAlbumInitialImage) {
        fd.append("initialImage", newAlbumInitialImage);
        fd.append("initialExtraText", newAlbumExtraText);
      }

      const res = await fetchWithWakeup(
        albumEndpoint,
        { method: "POST", headers: AUTH_HEADER, body: fd },
        setCreateMsg
      );
      const d = await res.json();
      if (!res.ok) return setCreateMsg(d.message || "Failed to create album");
      setCreateMsg("✅ Album created!");
      setNewAlbumName("");
      setNewAlbumDesc("");
      setNewAlbumPrice("");
      setNewAlbumCover(null);
      setNewAlbumInitialImage(null);
      setNewAlbumExtraText("");
      fetchAlbums();
    } catch {
      setCreateMsg("❌ Server timed out. Wait 30s and try again.");
    } finally {
      setCreatingAlbum(false);
    }
  };

  // ─── ADD IMAGES TO ALBUM (supports video) ──────────────────────────────

  const handleAddImage = async (e: FormEvent) => {
    e.preventDefault();
    if (imgFiles.length === 0 || !selectedAlbum) return setAddImgMsg("Select at least one image or video");
    setAddingImg(true);
    setAddImgMsg("");
    try {
      const fd = new FormData();
      imgFiles.forEach((file) => fd.append("images", file));

      const isPhoto = type === "photo";
      fd.append("title", isPhoto ? "" : imgTitle);
      fd.append("description", isPhoto ? "" : imgDesc);
      fd.append("price", isPhoto ? "" : imgPrice);
      fd.append("albumId", selectedAlbum.id);
      fd.append("category", selectedAlbum.category);
      fd.append("extraText", isPhoto ? "" : imgExtraText);

      const res = await fetchWithWakeup(
        `${albumEndpoint}/${selectedAlbum.id}/images`,
        { method: "POST", headers: AUTH_HEADER, body: fd },
        setAddImgMsg
      );
      const d = await res.json();
      if (!res.ok) return setAddImgMsg(d.message || "Failed to add images");
      setAddImgMsg(`✅ ${d.images?.length || 0} files added!`);
      setImgFiles([]);
      if (!isPhoto) {
        setImgTitle("");
        setImgDesc("");
        setImgPrice("");
        setImgExtraText("");
      }
      const updatedAlbums = await fetchAlbums();
      const updatedAlbum = updatedAlbums.find((a) => a.id === selectedAlbum.id);
      if (updatedAlbum) {
        setSelectedAlbum(updatedAlbum);
      }
    } catch {
      setAddImgMsg("❌ Could not reach server. Try again.");
    } finally {
      setAddingImg(false);
    }
  };

  // ─── SINGLE UPLOAD (with video support) ──────────────────────────────────

  const handleSingleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!singleFile) return setSingleMsg("Select a file");
    setSingleLoading(true);
    setSingleMsg("");
    try {
      const fd = new FormData();
      fd.append("image", singleFile);
      fd.append("title", singleTitle);
      fd.append("description", singleDesc);
      fd.append("category", singleCat);
      if (singlePrice) fd.append("price", singlePrice);

      const isPhoto = type === "photo";
      if (isPhoto && singleCat === "showcase" && singleTargetRoute) {
        fd.append("extra_text", singleTargetRoute);
      }

      const res = await fetchWithWakeup(
        `${API}/api/upload`,
        { method: "POST", headers: AUTH_HEADER, body: fd },
        setSingleMsg
      );
      const d = await res.json();
      if (!res.ok) return setSingleMsg(d.message || "Upload failed");
      setSingleMsg("✅ Uploaded!");
      setSingleFile(null);
      setSingleTitle("");
      setSingleDesc("");
      setSinglePrice("");
      setSingleTargetRoute("");
      fetchSingles();
    } catch {
      setSingleMsg("❌ Could not reach server. Try again.");
    } finally {
      setSingleLoading(false);
    }
  };

  // ─── CAROUSEL UPLOAD ──────────────────────────────────────────────────────

  const handleCarouselUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!carouselFile) return setCarouselMsg("Select an image");
    if (!carouselTitle.trim()) return setCarouselMsg("Title is required");
    setCarouselLoading(true);
    setCarouselMsg("");
    try {
      const fd = new FormData();
      fd.append("image", carouselFile);
      fd.append("title", carouselTitle);
      fd.append("description", carouselDesc);
      fd.append("category", "fashion-carousel");
      fd.append("extra_text", carouselRoute);

      const res = await fetchWithWakeup(
        `${API}/api/upload`,
        { method: "POST", headers: AUTH_HEADER, body: fd },
        setCarouselMsg
      );
      const d = await res.json();
      if (!res.ok) return setCarouselMsg(d.message || "Upload failed");
      setCarouselMsg("✅ Carousel item added!");
      setCarouselFile(null);
      setCarouselTitle("");
      setCarouselDesc("");
      setCarouselRoute(CAROUSEL_ROUTE_OPTIONS[0]?.value || "");
      fetchCarousel();
    } catch {
      setCarouselMsg("❌ Could not reach server. Try again.");
    } finally {
      setCarouselLoading(false);
    }
  };

  // ─── EDIT ALBUM ────────────────────────────────────────────────────────────

  const openEditAlbum = (album: Album) => {
    setEditingAlbum(album);
    setEditAlbumName(album.name);
    setEditAlbumCategory(album.category);
    setEditAlbumDesc(album.description || "");
    setEditAlbumPrice(album.price || "");
    setEditAlbumCover(null);
    setEditAlbumMsg("");
  };

  const handleEditAlbum = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingAlbum) return;
    setEditAlbumLoading(true);
    setEditAlbumMsg("");
    try {
      const fd = new FormData();
      fd.append("name", editAlbumName);
      fd.append("category", editAlbumCategory);
      fd.append("description", editAlbumDesc);
      fd.append("price", editAlbumPrice);
      if (editAlbumCover) fd.append("cover", editAlbumCover);

      const res = await fetchWithWakeup(
        `${albumEndpoint}/${editingAlbum.id}`,
        { method: "PUT", headers: AUTH_HEADER, body: fd },
        setEditAlbumMsg
      );
      const d = await res.json();
      if (!res.ok) return setEditAlbumMsg(d.message || "Update failed");
      setEditAlbumMsg("✅ Album updated!");
      setEditingAlbum(null);
      fetchAlbums();
      if (selectedAlbum?.id === editingAlbum.id) {
        setSelectedAlbum((prev) =>
          prev
            ? {
                ...prev,
                name: editAlbumName,
                category: editAlbumCategory,
                description: editAlbumDesc,
                price: editAlbumPrice,
              }
            : prev
        );
      }
      setEditAlbumCover(null);
    } catch {
      setEditAlbumMsg("❌ Update failed. Try again.");
    } finally {
      setEditAlbumLoading(false);
    }
  };

  // ─── EDIT IMAGE ────────────────────────────────────────────────────────────

  const openEditImage = (albumId: string, image: AlbumImage) => {
    setEditingImage({ albumId, image });
    setEditImageTitle(image.title || "");
    setEditImageDesc(image.description || "");
    setEditImagePrice(image.price || "");
    setEditImageExtra(image.extra_text || "");
    setEditImageOrder(image.order !== undefined ? image.order : undefined);
    setEditImageFile(null);
    setEditImageMsg("");
  };

  const handleEditImage = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingImage) return;
    setEditImageLoading(true);
    setEditImageMsg("");
    try {
      let res: Response;
      const hasFile = !!editImageFile;
      const bodyData = {
        title: editImageTitle,
        description: editImageDesc,
        price: editImagePrice,
        extra_text: editImageExtra,
        order: editImageOrder !== undefined ? editImageOrder : editingImage.image.order ?? 0,
      };

      if (hasFile) {
        const fd = new FormData();
        fd.append("image", editImageFile);
        fd.append("title", editImageTitle);
        fd.append("description", editImageDesc);
        fd.append("price", editImagePrice);
        fd.append("extra_text", editImageExtra);
        if (editImageOrder !== undefined) fd.append("order", String(editImageOrder));
        res = await fetchWithWakeup(
          `${albumEndpoint}/${editingImage.albumId}/images/${editingImage.image.id}`,
          { method: "PUT", headers: AUTH_HEADER, body: fd },
          setEditImageMsg
        );
      } else {
        res = await fetchWithWakeup(
          `${albumEndpoint}/${editingImage.albumId}/images/${editingImage.image.id}`,
          {
            method: "PUT",
            headers: { ...AUTH_HEADER, "Content-Type": "application/json" },
            body: JSON.stringify(bodyData),
          },
          setEditImageMsg
        );
      }

      const d = await res.json();
      if (!res.ok) return setEditImageMsg(d.message || "Update failed");
      setEditImageMsg("✅ Image updated!");
      setEditingImage(null);
      fetchAlbums();
      if (selectedAlbum?.id === editingImage.albumId) {
        setSelectedAlbum((prev) => {
          if (!prev) return prev;
          const updatedImages = prev.images.map((img) =>
            img.id === editingImage.image.id
              ? { ...img, title: editImageTitle, description: editImageDesc, price: editImagePrice, extra_text: editImageExtra, order: bodyData.order }
              : img
          );
          return { ...prev, images: updatedImages };
        });
      }
    } catch {
      setEditImageMsg("❌ Update failed. Try again.");
    } finally {
      setEditImageLoading(false);
    }
  };

  // ─── EDIT SINGLE ITEM ──────────────────────────────────────────────────────

  const openEditSingle = (item: SingleItem) => {
    setEditingSingle(item);
    setEditSingleTitle(item.title || "");
    setEditSingleCat(item.category);
    setEditSingleDesc(item.description || "");
    setEditSinglePrice(item.price || "");
    setEditSingleOrder(item.order !== undefined ? item.order : undefined);
    setEditSingleFile(null);
    setEditSingleMsg("");
  };

  const handleEditSingle = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingSingle) return;
    setEditSingleLoading(true);
    setEditSingleMsg("");
    try {
      let res: Response;
      const hasFile = !!editSingleFile;
      const bodyData = {
        title: editSingleTitle,
        category: editSingleCat,
        description: editSingleDesc,
        price: editSinglePrice,
        order: editSingleOrder !== undefined ? editSingleOrder : editingSingle.order ?? 0,
      };

      if (hasFile) {
        const fd = new FormData();
        fd.append("image", editSingleFile);
        fd.append("title", editSingleTitle);
        fd.append("category", editSingleCat);
        fd.append("description", editSingleDesc);
        fd.append("price", editSinglePrice);
        if (editSingleOrder !== undefined) fd.append("order", String(editSingleOrder));
        res = await fetchWithWakeup(
          `${API}/api/items/${editingSingle.id}`,
          { method: "PUT", headers: AUTH_HEADER, body: fd },
          setEditSingleMsg
        );
      } else {
        res = await fetchWithWakeup(
          `${API}/api/items/${editingSingle.id}`,
          {
            method: "PUT",
            headers: { ...AUTH_HEADER, "Content-Type": "application/json" },
            body: JSON.stringify(bodyData),
          },
          setEditSingleMsg
        );
      }

      const d = await res.json();
      if (!res.ok) return setEditSingleMsg(d.message || "Update failed");
      setEditSingleMsg("✅ Item updated!");
      setEditingSingle(null);
      fetchSingles();
    } catch {
      setEditSingleMsg("❌ Update failed. Try again.");
    } finally {
      setEditSingleLoading(false);
    }
  };

  // ─── RENDER ─────────────────────────────────────────────────────────────────

  const isPhoto = type === "photo";

  // ─── UPDATED HELPERS: include "properties" for video support ─────────────
  const getMediaAccept = (cat: string) => {
    const videoCats = ["videos", "aerials", "properties", "construction", "plans"];
    return videoCats.includes(cat) ? "video/*,image/*" : "image/*";
  };

  const getMediaLabel = (cat: string, plural: boolean) => {
    const videoCats = ["videos", "aerials", "properties", "construction", "plans"];
    const type = videoCats.includes(cat) ? "Images/Videos" : "Images";
    return plural ? `${type} * (select multiple)` : `${type} *`;
  };

  return (
    <div className="space-y-5">
      {/* Mode toggle */}
      <div className="flex gap-2 p-1 bg-[#111] rounded-xl border border-white/[0.07] w-fit flex-wrap">
        {(["albums", "single"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-lg px-5 py-2 text-sm font-semibold transition ${
              mode === m ? "bg-[#D4AF37] text-black" : "text-white/50 hover:text-white"
            }`}
          >
            {m === "albums" ? "📁 Album Manager" : "⚡ Quick Upload"}
          </button>
        ))}
        {enableCarousel && (
          <button
            onClick={() => setMode("carousel")}
            className={`rounded-lg px-5 py-2 text-sm font-semibold transition ${
              mode === "carousel" ? "bg-[#D4AF37] text-black" : "text-white/50 hover:text-white"
            }`}
          >
            🎠 Carousel
          </button>
        )}
      </div>

      {mode === "carousel" && enableCarousel ? (
        <div className="space-y-5">
          {/* Upload Form */}
          <form onSubmit={handleCarouselUpload} className={`${cardCls} space-y-4`}>
            <SectionTitle>Add Carousel Image</SectionTitle>
            <Field label="Title *">
              <input
                placeholder="e.g. Heritage Drop"
                value={carouselTitle}
                onChange={(e) => setCarouselTitle(e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Description">
              <RichTextEditor
                value={carouselDesc}
                onChange={setCarouselDesc}
                placeholder="Describe the collection…"
              />
            </Field>
            <Field label="Target Route (where 'See More' goes)">
              <select
                value={carouselRoute}
                onChange={(e) => setCarouselRoute(e.target.value)}
                className={inputCls}
              >
                {CAROUSEL_ROUTE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Field>
            <UploadBox
              label="Image *"
              single
              onChange={(f) => setCarouselFile(f[0] || null)}
              previewFiles={carouselFile ? [carouselFile] : []}
              accept="image/*"
            />
            <FormFooter msg={carouselMsg} loading={carouselLoading} label="Add Carousel Item" />
          </form>

          {/* List of carousel items */}
          <div className={cardCls}>
            <div className="flex items-center justify-between">
              <SectionTitle>Carousel Items ({carouselItems.length})</SectionTitle>
              <button onClick={fetchCarousel} className="text-xs text-white/30 hover:text-white/60 transition">
                ↻ Refresh
              </button>
            </div>
            {loadingCarousel ? (
              <p className="text-white/30 text-sm py-4 text-center">Loading…</p>
            ) : carouselItems.length === 0 ? (
              <p className="text-white/25 text-sm italic py-4 text-center">No carousel items yet.</p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {carouselItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-[#0d0d0d] px-3 py-2"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-12 rounded-lg object-cover border border-white/10"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{item.title || "Untitled"}</p>
                      <p className="text-xs text-white/35 truncate">→ {item.extra_text || "No route"}</p>
                    </div>
                    <button
                      onClick={() => deleteCarousel(item.id)}
                      disabled={deletingCarouselId === item.id}
                      className="shrink-0 w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition flex items-center justify-center disabled:opacity-40"
                    >
                      {deletingCarouselId === item.id ? (
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 6h18" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                          <path d="M8 4V2h8v2" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : mode === "single" ? (
        <div className="space-y-5">
          {/* Upload Form */}
          <form onSubmit={handleSingleUpload} className={`${cardCls} space-y-4`}>
            <SectionTitle>Quick Single Upload</SectionTitle>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Category">
                <select
                  value={singleCat}
                  onChange={(e) => setSingleCat(e.target.value)}
                  className={inputCls}
                >
                  {categoryOptions.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.icon} {c.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Price">
                <PriceInput value={singlePrice} onChange={setSinglePrice} placeholder="e.g. 85,000" />
              </Field>
            </div>
            <Field label="Title">
              <input
                placeholder="Item name"
                value={singleTitle}
                onChange={(e) => setSingleTitle(e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Description">
              <RichTextEditor
                value={singleDesc}
                onChange={setSingleDesc}
                placeholder="Describe the piece…"
              />
            </Field>

            {/* ─── Showcase Target Route Dropdown ─── */}
            {isPhoto && singleCat === "showcase" && (
              <Field label="Link to Category (for 'View More' button)">
                <select
                  value={singleTargetRoute}
                  onChange={(e) => setSingleTargetRoute(e.target.value)}
                  className={inputCls}
                >
                  <option value="">Select a category…</option>
                  {SHOWCASE_ROUTE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <p className="text-[9px] text-white/40 mt-1">
                  This determines where the "View More" button on the showcase image will navigate.
                </p>
              </Field>
            )}

            <UploadBox
              label={getMediaLabel(singleCat, false)}
              single
              onChange={(f) => setSingleFile(f[0] || null)}
              previewFiles={singleFile ? [singleFile] : []}
              accept={getMediaAccept(singleCat)}
            />
            <FormFooter msg={singleMsg} loading={singleLoading} label="Upload Item" />
          </form>

          {/* Manage Singles with Category Filter */}
          <div className={cardCls}>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <SectionTitle>Manage Singles ({singles.filter((s) => s.category === selectedCategory).length})</SectionTitle>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-white/40 uppercase tracking-wider">Filter:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-[#0d0d0d] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:border-[#D4AF37] outline-none"
                >
                  {categoryOptions.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.icon} {c.label}
                    </option>
                  ))}
                </select>
                <button onClick={fetchSingles} className="text-xs text-white/30 hover:text-white/60 transition">
                  ↻ Refresh
                </button>
              </div>
            </div>
            {loadingSingles ? (
              <p className="text-white/30 text-sm py-4 text-center">Loading…</p>
            ) : singles.filter((s) => s.category === selectedCategory).length === 0 ? (
              <p className="text-white/25 text-sm italic py-4 text-center">No items in this category.</p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {singles
                  .filter((s) => s.category === selectedCategory)
                  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                  .map((item, index, arr) => (
                    <div
                      key={`${item.id}-${item.order}`}
                      className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-[#0d0d0d] px-3 py-2"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-12 h-12 rounded-lg object-cover border border-white/10"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{item.title || "Untitled"}</p>
                        <p className="text-xs text-white/35 truncate">
                          {item.category} {item.price && `· ₦${item.price}`}
                        </p>
                        {item.category === "showcase" && item.extra_text && (
                          <p className="text-[9px] text-[#D4AF37]/60 mt-0.5">→ {item.extra_text}</p>
                        )}
                      </div>
                      {/* Order buttons */}
                      <button
                        onClick={() => moveSingle(item.id, "up")}
                        disabled={index === 0}
                        className="shrink-0 w-8 h-8 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/20 transition flex items-center justify-center disabled:opacity-20"
                        title="Move up"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="18 15 12 9 6 15" />
                        </svg>
                      </button>
                      <button
                        onClick={() => moveSingle(item.id, "down")}
                        disabled={index === arr.length - 1}
                        className="shrink-0 w-8 h-8 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/20 transition flex items-center justify-center disabled:opacity-20"
                        title="Move down"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>
                      <button
                        onClick={() => openEditSingle(item)}
                        className="shrink-0 w-8 h-8 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/20 transition flex items-center justify-center"
                        title="Edit item"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteSingle(item.id)}
                        disabled={deletingSingleId === item.id}
                        className="shrink-0 w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition flex items-center justify-center disabled:opacity-40"
                      >
                        {deletingSingleId === item.id ? (
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 6h18" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                            <path d="M8 4V2h8v2" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                          </svg>
                        )}
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
          {/* Left: Create + list */}
          <div className="space-y-4">
            <form onSubmit={handleCreateAlbum} className={cardCls}>
              <SectionTitle>Create Album</SectionTitle>
              <Field label="Album Name *">
                <input
                  placeholder="e.g. Summer Collection 2025"
                  value={newAlbumName}
                  onChange={(e) => setNewAlbumName(e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Category">
                <select
                  value={newAlbumCategory}
                  onChange={(e) => setNewAlbumCategory(e.target.value)}
                  className={inputCls}
                >
                  {categoryOptions.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.icon} {c.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Description">
                <RichTextEditor
                  value={newAlbumDesc}
                  onChange={setNewAlbumDesc}
                  placeholder="Album description…"
                />
              </Field>
              <Field label="Default Price">
                <PriceInput value={newAlbumPrice} onChange={setNewAlbumPrice} placeholder="e.g. 60,000" />
              </Field>
              <UploadBox
                label="Cover Image/Video *"
                single
                onChange={(f) => setNewAlbumCover(f[0] || null)}
                previewFiles={newAlbumCover ? [newAlbumCover] : []}
                accept="image/*,video/*" // ─── allow videos for cover ───
              />
              <UploadBox
                label="Initial Album File (optional)"
                single
                onChange={(f) => setNewAlbumInitialImage(f[0] || null)}
                previewFiles={newAlbumInitialImage ? [newAlbumInitialImage] : []}
                accept="image/*,video/*" // ─── allow videos for initial ───
              />
              <Field label="Extra Text for Initial Image (optional)">
                <textarea
                  placeholder="Additional info for this image"
                  value={newAlbumExtraText}
                  onChange={(e) => setNewAlbumExtraText(e.target.value)}
                  className={textareaCls}
                  style={{ minHeight: 60 }}
                />
              </Field>
              <FormFooter msg={createMsg} loading={creatingAlbum} label="Create Album" />
            </form>

            {/* Album list */}
            <div className={cardCls}>
              <div className="flex items-center justify-between">
                <SectionTitle>
                  Albums ({albums.filter((a) => categoryOptions.some((c) => c.value === a.category)).length})
                </SectionTitle>
                <button onClick={fetchAlbums} className="text-xs text-white/30 hover:text-white/60 transition">
                  ↻ Refresh
                </button>
              </div>
              {loadingAlbums ? (
                <p className="text-white/30 text-sm py-4 text-center">Loading…</p>
              ) : albums.filter((a) => categoryOptions.some((c) => c.value === a.category)).length === 0 ? (
                <p className="text-white/25 text-sm italic py-4 text-center">No albums yet</p>
              ) : (
                <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
                  {albums
                    .filter((a) => categoryOptions.some((c) => c.value === a.category))
                    .map((album) => (
                      <div
                        key={album.id}
                        className={`flex items-center gap-2 rounded-xl px-3 py-2 transition border ${
                          selectedAlbum?.id === album.id
                            ? "border-[#D4AF37]/60 bg-[#D4AF37]/10"
                            : "border-white/[0.07] bg-[#0d0d0d] hover:border-white/20"
                        }`}
                      >
                        <button
                          onClick={() => setSelectedAlbum(album)}
                          className="flex-1 text-left min-w-0"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <p className="text-white text-sm font-medium truncate">{album.name}</p>
                              <p className="text-white/35 text-xs capitalize mt-0.5">{album.category}</p>
                            </div>
                            <span className="text-[#D4AF37]/60 text-xs shrink-0 tabular-nums">
                              {album.images?.length || 0} imgs
                            </span>
                          </div>
                        </button>
                        <button
                          onClick={() => openEditAlbum(album)}
                          className="shrink-0 w-8 h-8 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/20 transition flex items-center justify-center"
                          title="Edit album"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteAlbum(album.id)}
                          className="shrink-0 w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition flex items-center justify-center"
                          title="Delete album"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 6h18" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                            <path d="M8 4V2h8v2" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                          </svg>
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Selected album editor */}
          {selectedAlbum ? (
            <div className="space-y-4">
              <div className={cardCls}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className={labelCls}>Editing Album</p>
                    <h3 className="text-xl font-serif text-[#D4AF37]">{selectedAlbum.name}</h3>
                    <p className="text-white/35 text-xs capitalize mt-0.5">
                      {selectedAlbum.category} · {selectedAlbum.images?.length || 0} files
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedAlbum(null)}
                    className="text-white/25 hover:text-white/70 transition text-lg leading-none"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* ─── ADD IMAGES FORM ────────────────────────────────────── */}
              <form onSubmit={handleAddImage} className={cardCls}>
                <SectionTitle>Add Files to Album</SectionTitle>
                {!isPhoto && (
                  <>
                    <div className="grid gap-3 md:grid-cols-2">
                      <Field label="Image Title">
                        <input
                          placeholder="e.g. Royal Blue"
                          value={imgTitle}
                          onChange={(e) => setImgTitle(e.target.value)}
                          className={inputCls}
                        />
                      </Field>
                      <Field label="Price (overrides album default)">
                        <PriceInput value={imgPrice} onChange={setImgPrice} placeholder="e.g. 75,000" />
                      </Field>
                    </div>
                    <Field label="Description">
                      <RichTextEditor
                        value={imgDesc}
                        onChange={setImgDesc}
                        placeholder="Describe this specific piece…"
                      />
                    </Field>
                    <Field label="Extra Text (optional)">
                      <textarea
                        placeholder="Additional info for these images"
                        value={imgExtraText}
                        onChange={(e) => setImgExtraText(e.target.value)}
                        className={textareaCls}
                        style={{ minHeight: 60 }}
                      />
                    </Field>
                  </>
                )}
                <UploadBox
                  label={getMediaLabel(selectedAlbum.category, true)}
                  single={false}
                  onChange={setImgFiles}
                  previewFiles={imgFiles}
                  accept={getMediaAccept(selectedAlbum.category)}
                />
                <FormFooter msg={addImgMsg} loading={addingImg} label="Add Files" />
              </form>

              {/* File Grid with Order Controls */}
              {selectedAlbum.images?.length > 0 && (
                <div className={cardCls}>
                  <SectionTitle>Album Files ({selectedAlbum.images.length})</SectionTitle>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {selectedAlbum.images.map((img, i) => (
                      <div key={i} className="group relative rounded-xl overflow-hidden border border-white/10">
                        {img.url &&
                          (() => {
                            const isVideo = /\.(mp4|mov|webm|avi|mkv)$/i.test(img.url);
                            return isVideo ? (
                              <video src={img.url} className="w-full aspect-square object-cover" muted />
                            ) : (
                              <img src={img.url} alt={img.title} className="w-full aspect-square object-cover" />
                            );
                          })()}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition p-3 flex flex-col justify-end">
                          <p className="text-white text-xs font-medium">{img.title}</p>
                          {img.price && <p className="text-[#D4AF37] text-xs">₦{img.price}</p>}
                          {img.order !== undefined && <p className="text-white/40 text-[10px]">Order: {img.order}</p>}
                        </div>
                        <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                          <button
                            onClick={() => img.id && moveImage(selectedAlbum.id, img.id, "up")}
                            disabled={i === 0}
                            className="w-6 h-6 rounded-full bg-[#D4AF37]/60 text-black hover:bg-[#D4AF37] transition flex items-center justify-center disabled:opacity-20 disabled:cursor-not-allowed"
                            title="Move up"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="18 15 12 9 6 15" />
                            </svg>
                          </button>
                          <button
                            onClick={() => img.id && moveImage(selectedAlbum.id, img.id, "down")}
                            disabled={i === selectedAlbum.images.length - 1}
                            className="w-6 h-6 rounded-full bg-[#D4AF37]/60 text-black hover:bg-[#D4AF37] transition flex items-center justify-center disabled:opacity-20 disabled:cursor-not-allowed"
                            title="Move down"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="6 9 12 15 18 9" />
                            </svg>
                          </button>
                          <button
                            onClick={() => openEditImage(selectedAlbum.id, img)}
                            className="w-6 h-6 rounded-full bg-[#D4AF37]/80 text-black hover:bg-[#D4AF37] transition flex items-center justify-center"
                            title="Edit file"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => img.id && deleteImage(selectedAlbum.id, img.id)}
                            className="w-6 h-6 rounded-full bg-red-500/80 text-white hover:bg-red-500 transition flex items-center justify-center"
                            title="Delete file"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/[0.07] flex flex-col items-center justify-center min-h-[300px] gap-3 text-center px-6">
              <span className="text-3xl opacity-30">📁</span>
              <p className="text-white/25 text-sm">
                Select an album on the left to edit it,
                <br />
                or create a new one
              </p>
            </div>
          )}
        </div>
      )}

      {/* ─── EDIT ALBUM MODAL ──────────────────────────────────────────────── */}
      {editingAlbum && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#111] rounded-2xl border border-white/10 p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-serif text-[#D4AF37] mb-4">Edit Album</h3>
            <form onSubmit={handleEditAlbum} className="space-y-4">
              <Field label="Album Name *">
                <input
                  value={editAlbumName}
                  onChange={(e) => setEditAlbumName(e.target.value)}
                  className={inputCls}
                  required
                />
              </Field>
              <Field label="Category">
                <select
                  value={editAlbumCategory}
                  onChange={(e) => setEditAlbumCategory(e.target.value)}
                  className={inputCls}
                >
                  {categoryOptions.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.icon} {c.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Description">
                <RichTextEditor
                  value={editAlbumDesc}
                  onChange={setEditAlbumDesc}
                  placeholder="Album description…"
                />
              </Field>
              <Field label="Price">
                <PriceInput value={editAlbumPrice} onChange={setEditAlbumPrice} placeholder="e.g. 60,000" />
              </Field>
              <UploadBox
                label="Replace Cover (optional)"
                single
                onChange={(f) => setEditAlbumCover(f[0] || null)}
                previewFiles={editAlbumCover ? [editAlbumCover] : []}
                accept="image/*,video/*"
              />
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingAlbum(null)}
                  className="text-white/50 hover:text-white text-sm transition px-4 py-2 border border-white/10 rounded-lg"
                >
                  Cancel
                </button>
                <button type="submit" disabled={editAlbumLoading} className={btnGold}>
                  {editAlbumLoading ? "Saving…" : "Save Changes"}
                </button>
              </div>
              <StatusMsg msg={editAlbumMsg} />
            </form>
          </div>
        </div>
      )}

      {/* ─── EDIT IMAGE MODAL ──────────────────────────────────────────────── */}
      {editingImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#111] rounded-2xl border border-white/10 p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-serif text-[#D4AF37] mb-4">Edit File</h3>
            <form onSubmit={handleEditImage} className="space-y-4">
              <Field label="Title">
                <input
                  value={editImageTitle}
                  onChange={(e) => setEditImageTitle(e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Price">
                <PriceInput value={editImagePrice} onChange={setEditImagePrice} placeholder="e.g. 75,000" />
              </Field>
              <Field label="Description">
                <RichTextEditor
                  value={editImageDesc}
                  onChange={setEditImageDesc}
                  placeholder="Description…"
                />
              </Field>
              <Field label="Extra Text">
                <textarea
                  value={editImageExtra}
                  onChange={(e) => setEditImageExtra(e.target.value)}
                  className={textareaCls}
                  rows={2}
                />
              </Field>
              <Field label="Order (number) – lower = appears first">
                <input
                  type="number"
                  value={editImageOrder !== undefined ? editImageOrder : ""}
                  onChange={(e) => setEditImageOrder(e.target.value ? parseInt(e.target.value) : undefined)}
                  className={inputCls}
                  placeholder="e.g. 0"
                />
              </Field>
              <UploadBox
                label="Replace File (optional)"
                single
                onChange={(f) => setEditImageFile(f[0] || null)}
                previewFiles={editImageFile ? [editImageFile] : []}
                accept={getMediaAccept(selectedAlbum?.category || "image")}
              />
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingImage(null)}
                  className="text-white/50 hover:text-white text-sm transition px-4 py-2 border border-white/10 rounded-lg"
                >
                  Cancel
                </button>
                <button type="submit" disabled={editImageLoading} className={btnGold}>
                  {editImageLoading ? "Saving…" : "Save Changes"}
                </button>
              </div>
              <StatusMsg msg={editImageMsg} />
            </form>
          </div>
        </div>
      )}

      {/* ─── EDIT SINGLE ITEM MODAL ────────────────────────────────────────── */}
      {editingSingle && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#111] rounded-2xl border border-white/10 p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-serif text-[#D4AF37] mb-4">Edit Single Item</h3>
            <form onSubmit={handleEditSingle} className="space-y-4">
              <Field label="Title *">
                <input
                  value={editSingleTitle}
                  onChange={(e) => setEditSingleTitle(e.target.value)}
                  className={inputCls}
                  required
                />
              </Field>
              <Field label="Category">
                <select
                  value={editSingleCat}
                  onChange={(e) => setEditSingleCat(e.target.value)}
                  className={inputCls}
                >
                  {categoryOptions.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.icon} {c.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Price">
                <PriceInput value={editSinglePrice} onChange={setEditSinglePrice} placeholder="e.g. 85,000" />
              </Field>
              <Field label="Description">
                <RichTextEditor
                  value={editSingleDesc}
                  onChange={setEditSingleDesc}
                  placeholder="Describe this item…"
                />
              </Field>
              <Field label="Order (number) – lower = appears first">
                <input
                  type="number"
                  value={editSingleOrder !== undefined ? editSingleOrder : ""}
                  onChange={(e) => setEditSingleOrder(e.target.value ? parseInt(e.target.value) : undefined)}
                  className={inputCls}
                  placeholder="e.g. 0"
                />
              </Field>
              <UploadBox
                label="Replace File (optional)"
                single
                onChange={(f) => setEditSingleFile(f[0] || null)}
                previewFiles={editSingleFile ? [editSingleFile] : []}
                accept={getMediaAccept(editSingleCat)}
              />
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingSingle(null)}
                  className="text-white/50 hover:text-white text-sm transition px-4 py-2 border border-white/10 rounded-lg"
                >
                  Cancel
                </button>
                <button type="submit" disabled={editSingleLoading} className={btnGold}>
                  {editSingleLoading ? "Saving…" : "Save Changes"}
                </button>
              </div>
              <StatusMsg msg={editSingleMsg} />
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ── SECTION TABS ──────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

function FashionTab() {
  return (
    <CategoryManager
      type="fashion"
      categoryOptions={FASHION_CATEGORIES}
      albumEndpoint={`${API}/api/fashion-albums`}
      enableCarousel={true}
    />
  );
}

function PhotoTab() {
  return <CategoryManager type="photo" categoryOptions={PHOTO_CATEGORIES} albumEndpoint={`${API}/api/fashion-albums`} />;
}

function RealEstateTab() {
  return <CategoryManager type="realestate" categoryOptions={REAL_ESTATE_CATEGORIES} albumEndpoint={`${API}/api/fashion-albums`} />;
}

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37]/80 mb-1">{children}</p>;
}

function FormFooter({ msg, loading, label }: { msg: string; loading: boolean; label: string }) {
  return (
    <div className="flex flex-col gap-3 pt-1">
      <StatusMsg msg={msg} />
      <div className="flex justify-end">
        <button type="submit" disabled={loading} className={btnGold}>
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Working…
            </span>
          ) : label}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ── MAIN ADMIN ──────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

const TAB_CONFIG: { id: MainTab; label: string; icon: string }[] = [
  { id: "fashion", label: "Fashion", icon: "👗" },
  { id: "photo", label: "Photography", icon: "📷" },
  { id: "realestate", label: "Real Estate", icon: "🏠" },
];

export default function Admin() {
  const [isAuthed, setIsAuthed] = useState(() => localStorage.getItem(AUTH_KEY) === "1");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState<MainTab>("fashion");

  useEffect(() => {
    if (isAuthed) localStorage.setItem(AUTH_KEY, "1");
  }, [isAuthed]);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthed(true);
      setLoginError("");
      setPassword("");
    } else {
      setLoginError("Incorrect password");
    }
  };

  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4">
        <div
          className="pointer-events-none fixed inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#D4AF37 1px, transparent 1px), linear-gradient(90deg, #D4AF37 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <form onSubmit={handleLogin} className="relative w-full max-w-sm">
          <div className="rounded-2xl border border-white/10 bg-[#111]/90 p-8 backdrop-blur-xl shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-4 text-2xl">
                🔑
              </div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37]/50 mb-1">Private Access</p>
              <h1 className="text-2xl font-serif text-white">Admin Panel</h1>
            </div>
            <div className="space-y-3">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoFocus
                className={inputCls}
              />
              <button type="submit" className={`${btnGold} w-full py-3 text-base`}>
                Unlock Dashboard
              </button>
            </div>
            {loginError && <p className="mt-4 text-center text-sm text-red-400">{loginError}</p>}
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#0a0a0a]/90 backdrop-blur-xl px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/25 flex items-center justify-center text-sm">
            ✦
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-[0.35em] text-[#D4AF37]/50 leading-none mb-0.5">Admin</p>
            <h1 className="text-sm font-semibold text-white leading-none">TOPXCM Control Panel</h1>
          </div>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem(AUTH_KEY);
            setIsAuthed(false);
          }}
          className="text-xs text-white/30 hover:text-white/60 transition border border-white/10 rounded-lg px-3 py-1.5"
        >
          Sign out
        </button>
      </header>

      <div className="border-b border-white/[0.07] px-5 bg-[#0a0a0a]">
        <div className="flex max-w-5xl mx-auto">
          {TAB_CONFIG.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-3.5 text-sm font-medium transition-all border-b-2 ${
                tab === t.id ? "border-[#D4AF37] text-[#D4AF37]" : "border-transparent text-white/35 hover:text-white/65"
              }`}
            >
              <span className="mr-1.5">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-5 py-8">
        {tab === "fashion" && <FashionTab />}
        {tab === "photo" && <PhotoTab />}
        {tab === "realestate" && <RealEstateTab />}
      </main>
    </div>
  );
}