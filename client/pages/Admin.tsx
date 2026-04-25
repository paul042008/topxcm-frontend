import { useEffect, useMemo, useState, ChangeEvent, FormEvent } from "react";

type Category =
  | "weddings"
  | "portraits"
  | "videos"
  | "aerials"
  | "canvas"
  | "casuals"
  | "natives"
  | "agbada"
  | "realestate";

const ADMIN_PASSWORD = "topxcm123";
const AUTH_KEY = "topxcm_admin_auth";

export default function Admin() {
  const [isAuthed, setIsAuthed] = useState(() => {
    return localStorage.getItem(AUTH_KEY) === "1";
  });
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [category, setCategory] = useState<Category>("weddings");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [price, setPrice] = useState("");
  const [size, setSize] = useState("");
  const [location, setLocation] = useState("");

  const [file, setFile] = useState<File | null>(null);

  const [couple, setCouple] = useState("");
  const [date, setDate] = useState("");
  const [cover, setCover] = useState<File | null>(null);
  const [thumbnails, setThumbnails] = useState<File[]>([]);
  const [album, setAlbum] = useState<File[]>([]);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthed) {
      localStorage.setItem(AUTH_KEY, "1");
    }
  }, [isAuthed]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setSize("");
    setLocation("");
    setFile(null);
    setCouple("");
    setDate("");
    setCover(null);
    setThumbnails([]);
    setAlbum([]);
  };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();

    if (password === ADMIN_PASSWORD) {
      setIsAuthed(true);
      setLoginError("");
      setPassword("");
      return;
    }

    setLoginError("Incorrect password");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      let res: Response;

      if (category === "weddings") {
        if (!cover) {
          setMessage("Cover image required");
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append("category", "weddings");
        formData.append("couple", couple);
        formData.append("title", title);
        formData.append("date", date);
        formData.append("description", description);
        formData.append("cover", cover);

        thumbnails.forEach((f) => formData.append("thumbnails", f));
        album.forEach((f) => formData.append("album", f));

        res = await fetch("https://topxcm-backend.onrender.com/api/upload-wedding", {
          method: "POST",
          headers: {
            Authorization: "topxcm_secure_key",
          },
          body: formData,
        });
      } else {
        if (!file) {
          setMessage("Select an image");
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append("image", file);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("category", category);

        if (price) formData.append("price", price);
        if (size) formData.append("size", size);
        if (location) formData.append("location", location);

        res = await fetch("https://topxcm-backend.onrender.com/api/upload", {
          method: "POST",
          headers: {
            Authorization: "topxcm_secure_key",
          },
          body: formData,
        });
      }

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Upload failed");
        return;
      }

      setMessage("✅ Uploaded successfully");
      resetForm();
    } catch {
      setMessage("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const passwordFieldClass =
    "w-full rounded-2xl border border-white/10 bg-black/80 px-4 py-3 text-white placeholder:text-white/35 outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20";

  const inputClass =
    "w-full rounded-2xl border border-white/10 bg-black/80 px-4 py-3 text-white placeholder:text-white/35 outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20";

  const textareaClass =
    "w-full min-h-[120px] rounded-2xl border border-white/10 bg-black/80 px-4 py-3 text-white placeholder:text-white/35 outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20";

  const panelTitle = useMemo(() => {
    if (category === "weddings") return "Wedding Story Upload";
    if (category === "realestate") return "Real Estate Listing";
    return "Single Content Upload";
  }, [category]);

  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-black px-4 py-10 text-white">
        <div className="mx-auto flex min-h-screen max-w-md items-center justify-center">
          <form
            onSubmit={handleLogin}
            className="w-full rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl"
          >
            <div className="mb-8 text-center">
              <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]/80">
                Private Access
              </p>
              <h1 className="mt-3 text-3xl font-serif text-[#D4AF37]">
                Admin Login
              </h1>
              <p className="mt-3 text-sm leading-6 text-white/60">
                Enter the password to open the upload dashboard.
              </p>
            </div>

            <div className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                placeholder="Password"
                className={passwordFieldClass}
              />

              <button
                type="submit"
                className="w-full rounded-2xl bg-[#D4AF37] px-4 py-3 font-semibold text-black transition hover:opacity-90 active:scale-[0.99]"
              >
                Unlock Admin
              </button>
            </div>

            {loginError && (
              <p className="mt-4 text-center text-sm text-red-400">
                {loginError}
              </p>
            )}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 rounded-[2rem] border border-white/10 bg-white/5 px-6 py-5 backdrop-blur-xl">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]/80">
                Admin Dashboard
              </p>
              <h2 className="mt-2 text-3xl font-serif text-[#D4AF37]">
                Premium Upload Panel
              </h2>
              <p className="mt-2 text-sm text-white/60">
                Create weddings, portraits, fashion pieces, and real estate
                listings from one place.
              </p>
            </div>

            <div className="rounded-full border border-[#D4AF37]/20 bg-black/50 px-4 py-2 text-sm text-[#D4AF37]/90">
              {panelTitle}
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl md:p-8"
        >
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <section className="rounded-[1.5rem] border border-white/10 bg-black/40 p-5">
              <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[#D4AF37]/80">
                Content Type
              </p>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className={inputClass}
              >
                <option value="weddings">Weddings</option>
                <option value="portraits">Portraits</option>
                <option value="videos">Videos</option>
                <option value="aerials">Aerials</option>
                <option value="canvas">Canvas</option>
                <option value="casuals">Casuals</option>
                <option value="natives">Natives</option>
                <option value="agbada">Agbada</option>
                <option value="realestate">Real Estate</option>
              </select>

              <div className="mt-4 rounded-2xl border border-[#D4AF37]/15 bg-[#D4AF37]/5 p-4 text-sm leading-6 text-white/70">
                {category === "weddings"
                  ? "Wedding uploads use a cover image, thumbnails, and a full album."
                  : "This content type uses one image with title, description, and optional price or location fields."}
              </div>
            </section>

            <section className="rounded-[1.5rem] border border-white/10 bg-black/40 p-5">
              <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[#D4AF37]/80">
                Preview
              </p>

              <div className="grid grid-cols-2 gap-3">
                {(category === "weddings"
                  ? [cover, ...thumbnails.slice(0, 3)]
                  : [file]
                )
                  .filter(Boolean)
                  .map((item, index) => {
                    const f = item as File;
                    return (
                      <div
                        key={index}
                        className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                      >
                        <img
                          src={URL.createObjectURL(f)}
                          alt=""
                          className="h-28 w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>
                    );
                  })}

                {((category === "weddings" && !cover && thumbnails.length === 0) ||
                  (category !== "weddings" && !file)) && (
                  <div className="col-span-2 rounded-2xl border border-dashed border-white/15 px-4 py-10 text-center text-sm text-white/40">
                    No image selected yet
                  </div>
                )}
              </div>
            </section>
          </div>

          {category === "weddings" ? (
            <section className="space-y-4 rounded-[1.5rem] border border-white/10 bg-black/40 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]/80">
                Wedding Details
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <input
                  placeholder="Couple Name"
                  value={couple}
                  onChange={(e) => setCouple(e.target.value)}
                  className={inputClass}
                />

                <input
                  placeholder="Date (e.g. Lagos, 2025)"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={inputClass}
                />
              </div>

              <input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputClass}
              />

              <textarea
                placeholder="Story Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={textareaClass}
              />

              <div className="grid gap-4 md:grid-cols-3">
                <UploadBox
                  label="Cover Image"
                  single
                  onChange={(f) => setCover(f[0] || null)}
                  previewFiles={cover ? [cover] : []}
                />

                <UploadBox
                  label="Thumbnails"
                  onChange={setThumbnails}
                  previewFiles={thumbnails}
                />

                <UploadBox
                  label="Full Album"
                  onChange={setAlbum}
                  previewFiles={album}
                />
              </div>
            </section>
          ) : (
            <section className="space-y-4 rounded-[1.5rem] border border-white/10 bg-black/40 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]/80">
                Content Details
              </p>

              <input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputClass}
              />

              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={textareaClass}
              />

              <div className="grid gap-4 md:grid-cols-3">
                {(category === "canvas" ||
                  category === "casuals" ||
                  category === "natives" ||
                  category === "agbada" ||
                  category === "realestate") && (
                  <input
                    placeholder="Price (₦)"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className={inputClass}
                  />
                )}

                {category === "canvas" && (
                  <input
                    placeholder="Size"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className={inputClass}
                  />
                )}

                {category === "realestate" && (
                  <input
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className={inputClass}
                  />
                )}
              </div>

              <UploadBox
                label="Upload Image"
                single
                onChange={(f) => setFile(f[0] || null)}
                previewFiles={file ? [file] : []}
              />
            </section>
          )}

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-white/45">
              All uploads are saved to your backend storage.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-[#D4AF37] px-6 py-3 font-semibold text-black transition hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>

          {message && (
            <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white/75">
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

function UploadBox({
  label,
  onChange,
  previewFiles,
  single = false,
}: {
  label: string;
  onChange: (files: File[]) => void;
  previewFiles: File[];
  single?: boolean;
}) {
  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    onChange(single ? [arr[0]] : arr);
  };

  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]/80">
        {label}
      </p>

      <label className="flex min-h-[120px] cursor-pointer items-center justify-center rounded-2xl border border-dashed border-white/15 bg-black/50 px-4 py-6 text-center transition hover:border-[#D4AF37]/50 hover:bg-black/70">
        <input
          type="file"
          hidden
          multiple={!single}
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div>
          <p className="text-sm text-white/70">Click or drag files here</p>
          <p className="mt-1 text-xs text-white/35">
            {single ? "1 image" : "multiple images"}
          </p>
        </div>
      </label>

      {previewFiles.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {previewFiles.map((file, i) => (
            <img
              key={i}
              src={URL.createObjectURL(file)}
              alt=""
              className="h-24 w-full rounded-xl object-cover border border-white/10"
            />
          ))}
        </div>
      )}
    </div>
  );
}

