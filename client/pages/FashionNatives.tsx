import FashionMenu from "../components/FashionMenu";
import BackButton from "../components/BackButton";
import useData from "../hooks/useData";
import LoadingState from "../components/LoadingState";

export default function FashionNatives() {
  const { data, loading } = useData();

  if (loading) {
    return <LoadingState />;
  }

  const natives = data.filter((item) => item.category === "natives");

  return (
    <div className="bg-black text-white min-h-screen">
      <header className="flex items-center justify-between p-5 border-b border-white/10">
        <BackButton />
        <h1 className="text-[#D4AF37] font-serif text-lg">
          Native Collection
        </h1>
        <FashionMenu />
      </header>

      {/* Empty state */}
      {natives.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[40vh] text-center">
          <p className="text-white/60 text-lg">No native items uploaded yet.</p>
          <p className="text-white/30 text-sm mt-2">Add items from your admin panel.</p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 p-3 md:p-5">
        {natives.map((item) => (
          <div
            key={item.id}
            className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-[#D4AF37]/40 transition duration-300"
          >
            <div className="overflow-hidden">
              {/* ✅ FIX: Use item.image directly — Cloudinary returns full URL */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-44 md:h-64 object-cover transition duration-500 hover:scale-110"
                onContextMenu={(e) => e.preventDefault()}
                draggable={false}
              />
            </div>

            <div className="p-3 md:p-4">
              <h3 className="mt-1 text-sm md:text-lg font-medium">{item.title}</h3>
              <p className="text-[#D4AF37] mt-1 text-sm md:text-base font-semibold">
                {item.price ? item.price : "Price on request"}
              </p>

              <a
                href={`https://wa.me/2348061587993?text=${encodeURIComponent(
                  `Hello, I want to order this: ${item.title}${item.price ? ` — ${item.price}` : ""}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block w-full text-center bg-[#D4AF37] text-black px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition"
              >
                Order Now
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
