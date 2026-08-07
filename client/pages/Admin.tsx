import { useEffect, useState, FormEvent } from "react";

// ─── TYPES ───────────────────────────────────────────────────────────────────

type MainTab = "fashion" | "photo" | "realestate";

type FashionCategory = "casuals" | "natives" | "agbadas" | "suits" | "latest";
type PhotoCategory = "weddings" | "portraits" | "videos" | "aerials" | "studio" | "outdoors";

interface FashionAlbum {
  id: string;
  name: string;
  category: FashionCategory;
  description: string;
  price: string;
  images: { id?: string; url: string; title: string; description: string; price: string }[]; // ✅ changed _id → id
}

interface SingleItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  price: string;
  albumId?: string;
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

  return fetch(url, { ...options, signal: AbortSignal.timeout(60_000) });
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

// ─── UPLOAD BOX ──────────────────────────────────────────────────────────────

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
          {previewFiles.slice(0, 6).map((f, i) => (
            <img key={i} src={URL.createObjectURL(f)} alt="" className="h-20 w-full rounded-lg object-cover border border-white/10" />
          ))}
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
// ── FASHION TAB (with delete)
// ═══════════════════════════════════════════════════════════════════════════════

function FashionTab() {
  const [albums, setAlbums] = useState<FashionAlbum[]>([]);
  const [loadingAlbums, setLoadingAlbums] = useState(false);

  const [newAlbumName, setNewAlbumName] = useState("");
  const [newAlbumCategory, setNewAlbumCategory] = useState<FashionCategory>("casuals");
  const [newAlbumDesc, setNewAlbumDesc] = useState("");
  const [newAlbumPrice, setNewAlbumPrice] = useState("");
  const [newAlbumCover, setNewAlbumCover] = useState<File | null>(null);
  const [creatingAlbum, setCreatingAlbum] = useState(false);
  const [createMsg, setCreateMsg] = useState("");

  const [selectedAlbum, setSelectedAlbum] = useState<FashionAlbum | null>(null);

  const [imgFile, setImgFile] = useState<File | null>(null);
  const [imgTitle, setImgTitle] = useState("");
  const [imgDesc, setImgDesc] = useState("");
  const [imgPrice, setImgPrice] = useState("");
  const [addingImg, setAddingImg] = useState(false);
  const [addImgMsg, setAddImgMsg] = useState("");

  const [singleFile, setSingleFile] = useState<File | null>(null);
  const [singleTitle, setSingleTitle] = useState("");
  const [singleDesc, setSingleDesc] = useState("");
  const [singlePrice, setSinglePrice] = useState("");
  const [singleCat, setSingleCat] = useState<FashionCategory>("casuals");
  const [singleLoading, setSingleLoading] = useState(false);
  const [singleMsg, setSingleMsg] = useState("");

  const [mode, setMode] = useState<"albums" | "single">("albums");

  const [singles, setSingles] = useState<SingleItem[]>([]);
  const [loadingSingles, setLoadingSingles] = useState(false);
  const [deletingSingleId, setDeletingSingleId] = useState<string | null>(null);

  const fetchAlbums = async () => {
    setLoadingAlbums(true);
    try {
      const res = await fetch(`${API}/api/fashion-albums`);
      if (res.ok) setAlbums(await res.json());
    } catch {}
    setLoadingAlbums(false);
  };

  const fetchSingles = async () => {
    setLoadingSingles(true);
    try {
      const res = await fetch(`${API}/api/items`);
      if (res.ok) {
        const all = await res.json();
        const fashionSingles = all.filter(
          (item: any) => !item.albumId && FASHION_CATEGORIES.some((c) => c.value === item.category)
        );
        setSingles(fashionSingles);
      }
    } catch {}
    setLoadingSingles(false);
  };

  useEffect(() => {
    fetchAlbums();
    fetchSingles();
  }, []);

  // ─── Delete album ──────────────────────────────────────────────────────────
  const deleteAlbum = async (albumId: string) => {
    if (!window.confirm("Delete this album and all its images? This cannot be undone.")) return;
    try {
      const res = await fetch(`${API}/api/fashion-albums/${albumId}`, {
        method: "DELETE",
        headers: AUTH_HEADER,
      });
      if (res.status === 404) {
        alert("Delete endpoint not found. Please implement DELETE /api/fashion-albums/:id on your backend.");
        return;
      }
      if (!res.ok) throw new Error("Failed to delete album");
      fetchAlbums();
      if (selectedAlbum?.id === albumId) setSelectedAlbum(null);
    } catch (err) {
      alert("Error deleting album. Try again.");
    }
  };

  // ─── Delete image from album ──────────────────────────────────────────────
  const deleteImage = async (albumId: string, imageId: string) => {
    if (!window.confirm("Delete this image? This cannot be undone.")) return;
    try {
      const res = await fetch(`${API}/api/fashion-albums/${albumId}/images/${imageId}`, {
        method: "DELETE",
        headers: AUTH_HEADER,
      });
      if (res.status === 404) {
        alert("Delete endpoint not found. Please implement DELETE /api/fashion-albums/:albumId/images/:imageId on your backend.");
        return;
      }
      if (!res.ok) throw new Error("Failed to delete image");
      fetchAlbums();
      setSelectedAlbum((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          images: prev.images.filter((img) => img.id !== imageId), // ✅ uses id
        };
      });
    } catch (err) {
      alert("Error deleting image. Try again.");
    }
  };

  // ─── Delete single item ────────────────────────────────────────────────────
  const deleteSingle = async (itemId: string) => {
    if (!window.confirm("Delete this single item? This cannot be undone.")) return;
    setDeletingSingleId(itemId);
    try {
      const res = await fetch(`${API}/api/items/${itemId}`, {
        method: "DELETE",
        headers: AUTH_HEADER,
      });
      if (res.status === 404) {
        alert("Delete endpoint not found. Please implement DELETE /api/items/:id on your backend.");
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

  // ─── Create album ──────────────────────────────────────────────────────────
  const handleCreateAlbum = async (e: FormEvent) => {
    e.preventDefault();
    if (!newAlbumName.trim()) return setCreateMsg("Album name is required");
    setCreatingAlbum(true);
    setCreateMsg("");
    try {
      const fd = new FormData();
      fd.append("name", newAlbumName);
      fd.append("category", newAlbumCategory);
      fd.append("description", newAlbumDesc);
      fd.append("price", newAlbumPrice);
      if (newAlbumCover) fd.append("cover", newAlbumCover);

      const res = await fetchWithWakeup(
        `${API}/api/fashion-albums`,
        { method: "POST", headers: AUTH_HEADER, body: fd },
        setCreateMsg
      );
      const d = await res.json();
      if (!res.ok) return setCreateMsg(d.message || "Failed to create album");
      setCreateMsg("✅ Album created!");
      setNewAlbumName(""); setNewAlbumDesc(""); setNewAlbumPrice(""); setNewAlbumCover(null);
      fetchAlbums();
    } catch {
      setCreateMsg("❌ Server timed out. Wait 30s and try again — Render free tier sleeps.");
    } finally {
      setCreatingAlbum(false);
    }
  };

  // ─── Add image ─────────────────────────────────────────────────────────────
  const handleAddImage = async (e: FormEvent) => {
    e.preventDefault();
    if (!imgFile || !selectedAlbum) return setAddImgMsg("Select an image");
    setAddingImg(true);
    setAddImgMsg("");
    try {
      const fd = new FormData();
      fd.append("image", imgFile);
      fd.append("title", imgTitle);
      fd.append("description", imgDesc);
      fd.append("price", imgPrice);
      fd.append("albumId", selectedAlbum.id);
      fd.append("category", selectedAlbum.category);

      const res = await fetchWithWakeup(
        `${API}/api/fashion-albums/${selectedAlbum.id}/images`,
        { method: "POST", headers: AUTH_HEADER, body: fd },
        setAddImgMsg
      );
      const d = await res.json();
      if (!res.ok) return setAddImgMsg(d.message || "Failed to add image");
      setAddImgMsg("✅ Image added!");
      setImgFile(null); setImgTitle(""); setImgDesc(""); setImgPrice("");
      fetchAlbums();
      setSelectedAlbum((prev) =>
        prev ? { ...prev, images: [...prev.images, d.image] } : prev
      );
    } catch {
      setAddImgMsg("❌ Could not reach server. Try again.");
    } finally {
      setAddingImg(false);
    }
  };

  // ─── Single upload ─────────────────────────────────────────────────────────
  const handleSingleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!singleFile) return setSingleMsg("Select an image");
    setSingleLoading(true);
    setSingleMsg("");
    try {
      const fd = new FormData();
      fd.append("image", singleFile);
      fd.append("title", singleTitle);
      fd.append("description", singleDesc);
      fd.append("category", singleCat);
      if (singlePrice) fd.append("price", singlePrice);

      const res = await fetchWithWakeup(
        `${API}/api/upload`,
        { method: "POST", headers: AUTH_HEADER, body: fd },
        setSingleMsg
      );
      const d = await res.json();
      if (!res.ok) return setSingleMsg(d.message || "Upload failed");
      setSingleMsg("✅ Uploaded!");
      setSingleFile(null); setSingleTitle(""); setSingleDesc(""); setSinglePrice("");
      fetchSingles();
    } catch {
      setSingleMsg("❌ Could not reach server. Try again.");
    } finally {
      setSingleLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Mode toggle */}
      <div className="flex gap-2 p-1 bg-[#111] rounded-xl border border-white/[0.07] w-fit">
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
      </div>

      {mode === "single" ? (
        <div className="space-y-5">
          <form onSubmit={handleSingleUpload} className={`${cardCls} space-y-4`}>
            <SectionTitle>Quick Single Upload</SectionTitle>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Category">
                <select value={singleCat} onChange={(e) => setSingleCat(e.target.value as FashionCategory)} className={inputCls}>
                  {FASHION_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.icon} {c.label}</option>)}
                </select>
              </Field>
              <Field label="Price (₦)">
                <input placeholder="e.g. ₦85,000" value={singlePrice} onChange={(e) => setSinglePrice(e.target.value)} className={inputCls} />
              </Field>
            </div>
            <Field label="Title">
              <input placeholder="Item name" value={singleTitle} onChange={(e) => setSingleTitle(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Description">
              <textarea placeholder="Describe the piece…" value={singleDesc} onChange={(e) => setSingleDesc(e.target.value)} className={textareaCls} />
            </Field>
            <UploadBox label="Image *" single onChange={(f) => setSingleFile(f[0] || null)} previewFiles={singleFile ? [singleFile] : []} />
            <FormFooter msg={singleMsg} loading={singleLoading} label="Upload Item" />
          </form>

          {/* Manage Singles */}
          <div className={cardCls}>
            <div className="flex items-center justify-between">
              <SectionTitle>Manage Singles ({singles.length})</SectionTitle>
              <button onClick={fetchSingles} className="text-xs text-white/30 hover:text-white/60 transition">↻ Refresh</button>
            </div>
            {loadingSingles ? (
              <p className="text-white/30 text-sm py-4 text-center">Loading…</p>
            ) : singles.length === 0 ? (
              <p className="text-white/25 text-sm italic py-4 text-center">No single items uploaded yet.</p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {singles.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-[#0d0d0d] px-3 py-2"
                  >
                    <img src={item.image} alt={item.title} className="w-12 h-12 rounded-lg object-cover border border-white/10" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{item.title || "Untitled"}</p>
                      <p className="text-xs text-white/35 truncate">{item.category} {item.price && `· ${item.price}`}</p>
                    </div>
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M8 4V2h8v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />
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
                <input placeholder="e.g. Summer Casuals 2025" value={newAlbumName} onChange={(e) => setNewAlbumName(e.target.value)} className={inputCls} />
              </Field>
              <Field label="Category">
                <select value={newAlbumCategory} onChange={(e) => setNewAlbumCategory(e.target.value as FashionCategory)} className={inputCls}>
                  {FASHION_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.icon} {c.label}</option>)}
                </select>
              </Field>
              <Field label="Description">
                <textarea placeholder="Album description…" value={newAlbumDesc} onChange={(e) => setNewAlbumDesc(e.target.value)} className={textareaCls} style={{ minHeight: 64 }} />
              </Field>
              <Field label="Default Price (₦)">
                <input placeholder="e.g. ₦60,000" value={newAlbumPrice} onChange={(e) => setNewAlbumPrice(e.target.value)} className={inputCls} />
              </Field>
              <UploadBox label="Cover Image (optional)" single onChange={(f) => setNewAlbumCover(f[0] || null)} previewFiles={newAlbumCover ? [newAlbumCover] : []} />
              <FormFooter msg={createMsg} loading={creatingAlbum} label="Create Album" />
            </form>

            {/* Album list */}
            <div className={cardCls}>
              <div className="flex items-center justify-between">
                <SectionTitle>Albums ({albums.length})</SectionTitle>
                <button onClick={fetchAlbums} className="text-xs text-white/30 hover:text-white/60 transition">↻ Refresh</button>
              </div>
              {loadingAlbums ? (
                <p className="text-white/30 text-sm py-4 text-center">Loading…</p>
              ) : albums.length === 0 ? (
                <p className="text-white/25 text-sm italic py-4 text-center">No albums yet</p>
              ) : (
                <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
                  {albums.map((album) => (
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
                          <span className="text-[#D4AF37]/60 text-xs shrink-0 tabular-nums">{album.images?.length || 0} imgs</span>
                        </div>
                      </button>
                      <button
                        onClick={() => deleteAlbum(album.id)}
                        className="shrink-0 w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition flex items-center justify-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M8 4V2h8v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />
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
                    <p className="text-white/35 text-xs capitalize mt-0.5">{selectedAlbum.category} · {selectedAlbum.images?.length || 0} images</p>
                  </div>
                  <button onClick={() => setSelectedAlbum(null)} className="text-white/25 hover:text-white/70 transition text-lg leading-none">✕</button>
                </div>
              </div>

              <form onSubmit={handleAddImage} className={cardCls}>
                <SectionTitle>Add Image to Album</SectionTitle>
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="Image Title">
                    <input placeholder="e.g. Royal Blue Casual" value={imgTitle} onChange={(e) => setImgTitle(e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Price (₦) — overrides album default">
                    <input placeholder="e.g. ₦75,000" value={imgPrice} onChange={(e) => setImgPrice(e.target.value)} className={inputCls} />
                  </Field>
                </div>
                <Field label="Description">
                  <textarea placeholder="Describe this specific piece…" value={imgDesc} onChange={(e) => setImgDesc(e.target.value)} className={textareaCls} style={{ minHeight: 64 }} />
                </Field>
                <UploadBox label="Image File *" single onChange={(f) => setImgFile(f[0] || null)} previewFiles={imgFile ? [imgFile] : []} />
                <FormFooter msg={addImgMsg} loading={addingImg} label="Add Image to Album" />
              </form>

              {selectedAlbum.images?.length > 0 && (
                <div className={cardCls}>
                  <SectionTitle>Album Images ({selectedAlbum.images.length})</SectionTitle>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {selectedAlbum.images.map((img, i) => (
                      <div key={i} className="group relative rounded-xl overflow-hidden border border-white/10">
                        <img src={img.url} alt={img.title} className="w-full aspect-square object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition p-3 flex flex-col justify-end">
                          <p className="text-white text-xs font-medium">{img.title}</p>
                          {img.price && <p className="text-[#D4AF37] text-xs">{img.price}</p>}
                        </div>
                        <button
                          onClick={() => img.id && deleteImage(selectedAlbum.id, img.id)}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white/80 hover:bg-red-500/80 hover:text-white transition flex items-center justify-center opacity-0 group-hover:opacity-100"
                          title="Delete image"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/[0.07] flex flex-col items-center justify-center min-h-[300px] gap-3 text-center px-6">
              <span className="text-3xl opacity-30">📁</span>
              <p className="text-white/25 text-sm">Select an album on the left to edit it,<br />or create a new one</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ── PHOTO TAB (unchanged)
// ═══════════════════════════════════════════════════════════════════════════════

function PhotoTab() {
  const [photoCategory, setPhotoCategory] = useState<PhotoCategory>("portraits");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [couple, setCouple] = useState("");
  const [weddingDate, setWeddingDate] = useState("");
  const [weddingLocation, setWeddingLocation] = useState("");
  const [cover, setCover] = useState<File | null>(null);
  const [thumbnails, setThumbnails] = useState<File[]>([]);
  const [album, setAlbum] = useState<File[]>([]);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const isWedding = photoCategory === "weddings";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      let res: Response;
      if (isWedding) {
        if (!cover) { setMsg("Cover image is required"); setLoading(false); return; }
        const fd = new FormData();
        fd.append("category", "weddings");
        fd.append("couple", couple);
        fd.append("title", title);
        fd.append("date", weddingDate);
        fd.append("location", weddingLocation);
        fd.append("description", description);
        fd.append("cover", cover);
        thumbnails.forEach((f) => fd.append("thumbnails", f));
        album.forEach((f) => fd.append("album", f));
        res = await fetchWithWakeup(`${API}/api/upload-wedding`, { method: "POST", headers: AUTH_HEADER, body: fd }, setMsg);
      } else {
        if (!file) { setMsg("Select an image"); setLoading(false); return; }
        const fd = new FormData();
        fd.append("image", file);
        fd.append("title", title);
        fd.append("description", description);
        fd.append("category", photoCategory);
        res = await fetchWithWakeup(`${API}/api/upload`, { method: "POST", headers: AUTH_HEADER, body: fd }, setMsg);
      }
      const d = await res.json();
      if (!res.ok) { setMsg(d.message || "Upload failed"); return; }
      setMsg("✅ Uploaded successfully!");
      setTitle(""); setDescription(""); setFile(null);
      setCouple(""); setWeddingDate(""); setWeddingLocation("");
      setCover(null); setThumbnails([]); setAlbum([]);
    } catch {
      setMsg("❌ Could not reach server. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className={cardCls}>
        <SectionTitle>Photo Category</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {PHOTO_CATEGORIES.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setPhotoCategory(c.value)}
              className={`rounded-xl px-4 py-2 text-sm transition font-medium ${
                photoCategory === c.value
                  ? "bg-[#D4AF37] text-black"
                  : "border border-white/10 text-white/50 hover:text-white hover:border-white/25"
              }`}
            >
              {c.icon} {c.label}
            </button>
          ))}
        </div>
      </div>

      {isWedding ? (
        <>
          <div className={cardCls}>
            <SectionTitle>Wedding Details</SectionTitle>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Couple Name *">
                <input placeholder="e.g. Adaeze & Emeka" value={couple} onChange={(e) => setCouple(e.target.value)} className={inputCls} />
              </Field>
              <Field label="Date">
                <input placeholder="e.g. Lagos, 2025" value={weddingDate} onChange={(e) => setWeddingDate(e.target.value)} className={inputCls} />
              </Field>
            </div>
            <Field label="Location">
              <input placeholder="e.g. Eko Hotel, Lagos" value={weddingLocation} onChange={(e) => setWeddingLocation(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Title">
              <input placeholder="Album title" value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Story Description">
              <textarea placeholder="Tell the story of this wedding…" value={description} onChange={(e) => setDescription(e.target.value)} className={textareaCls} />
            </Field>
          </div>
          <div className={cardCls}>
            <SectionTitle>Images</SectionTitle>
            <div className="grid gap-5 md:grid-cols-3">
              <UploadBox label="Cover Image *" single onChange={(f) => setCover(f[0] || null)} previewFiles={cover ? [cover] : []} />
              <UploadBox label="Thumbnails" onChange={setThumbnails} previewFiles={thumbnails} />
              <UploadBox label="Full Album" onChange={setAlbum} previewFiles={album} />
            </div>
          </div>
        </>
      ) : (
        <div className={cardCls}>
          <SectionTitle>Photo Details — {PHOTO_CATEGORIES.find((c) => c.value === photoCategory)?.label}</SectionTitle>
          <Field label="Title *">
            <input placeholder="Photo title" value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Description">
            <textarea placeholder="Describe this photo or session…" value={description} onChange={(e) => setDescription(e.target.value)} className={textareaCls} />
          </Field>
          <UploadBox label="Image *" single onChange={(f) => setFile(f[0] || null)} previewFiles={file ? [file] : []} />
        </div>
      )}

      <FormFooter msg={msg} loading={loading} label={isWedding ? "Upload Wedding" : "Upload Photo"} />
    </form>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ── REAL ESTATE TAB (unchanged)
// ═══════════════════════════════════════════════════════════════════════════════

function RealEstateTab() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return setMsg("Select an image");
    setLoading(true);
    setMsg("");
    try {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("title", title);
      fd.append("description", description);
      fd.append("category", "realestate");
      if (price) fd.append("price", price);
      if (location) fd.append("location", location);
      const res = await fetchWithWakeup(`${API}/api/upload`, { method: "POST", headers: AUTH_HEADER, body: fd }, setMsg);
      const d = await res.json();
      if (!res.ok) return setMsg(d.message || "Upload failed");
      setMsg("✅ Property listed!");
      setTitle(""); setDescription(""); setPrice(""); setLocation(""); setFile(null);
    } catch {
      setMsg("❌ Could not reach server. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`${cardCls} space-y-4`}>
      <SectionTitle>New Property Listing</SectionTitle>
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Property Title *">
          <input placeholder="e.g. 4-Bedroom Duplex, Lekki" value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
        </Field>
        <Field label="Price">
          <input placeholder="e.g. ₦85,000,000" value={price} onChange={(e) => setPrice(e.target.value)} className={inputCls} />
        </Field>
      </div>
      <Field label="Location">
        <input placeholder="e.g. Lekki Phase 1, Lagos" value={location} onChange={(e) => setLocation(e.target.value)} className={inputCls} />
      </Field>
      <Field label="Description">
        <textarea placeholder="Describe the property…" value={description} onChange={(e) => setDescription(e.target.value)} className={textareaCls} />
      </Field>
      <UploadBox label="Property Image *" single onChange={(f) => setFile(f[0] || null)} previewFiles={file ? [file] : []} />
      <FormFooter msg={msg} loading={loading} label="List Property" />
    </form>
  );
}

// ─── SMALL SHARED COMPONENTS ─────────────────────────────────────────────────

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
// ── MAIN ADMIN
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
        <div className="pointer-events-none fixed inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(#D4AF37 1px, transparent 1px), linear-gradient(90deg, #D4AF37 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <form onSubmit={handleLogin} className="relative w-full max-w-sm">
          <div className="rounded-2xl border border-white/10 bg-[#111]/90 p-8 backdrop-blur-xl shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-4 text-2xl">🔑</div>
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
            {loginError && (
              <p className="mt-4 text-center text-sm text-red-400">{loginError}</p>
            )}
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#0a0a0a]/90 backdrop-blur-xl px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/25 flex items-center justify-center text-sm">✦</div>
          <div>
            <p className="text-[9px] uppercase tracking-[0.35em] text-[#D4AF37]/50 leading-none mb-0.5">Admin</p>
            <h1 className="text-sm font-semibold text-white leading-none">TOPXCM Control Panel</h1>
          </div>
        </div>
        <button
          onClick={() => { localStorage.removeItem(AUTH_KEY); setIsAuthed(false); }}
          className="text-xs text-white/30 hover:text-white/60 transition border border-white/10 rounded-lg px-3 py-1.5"
        >
          Sign out
        </button>
      </header>

      {/* Tabs */}
      <div className="border-b border-white/[0.07] px-5 bg-[#0a0a0a]">
        <div className="flex max-w-5xl mx-auto">
          {TAB_CONFIG.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-3.5 text-sm font-medium transition-all border-b-2 ${
                tab === t.id
                  ? "border-[#D4AF37] text-[#D4AF37]"
                  : "border-transparent text-white/35 hover:text-white/65"
              }`}
            >
              <span className="mr-1.5">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-5 py-8">
        {tab === "fashion" && <FashionTab />}
        {tab === "photo" && <PhotoTab />}
        {tab === "realestate" && <RealEstateTab />}
      </main>
    </div>
  );
}