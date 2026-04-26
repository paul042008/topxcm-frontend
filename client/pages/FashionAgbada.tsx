import FashionMenu from "../components/FashionMenu";
import BackButton from "../components/BackButton";
import LoadingState from "../components/LoadingState";
import useData from "../hooks/useData";

export default function FashionAgbada() {
  const { data, loading } = useData();

  if (loading) {
    return <LoadingState />;
  }

  const agbadaItems = data.filter((item) => item.category === "agbada");

  return (
    <div className="bg-[#F8FBFF] text-slate-800 min-h-screen relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-[#E0F2F7] to-[#B0E0E6]/10 pointer-events-none"></div>

      <header className="relative flex items-center justify-between p-5 border-b border-blue-100 backdrop-blur-sm">
        <BackButton />
        <h1 className="text-[#1E3A8A] font-serif text-lg font-bold tracking-widest">
          AGBADA COLLECTION
        </h1>
        <FashionMenu />
      </header>

      {/* Empty state */}
      {agbadaItems.length === 0 && (
        <div className="relative flex flex-col items-center justify-center h-[40vh] text-center">
          <p className="text-slate-400 text-lg font-serif">No Agbada items uploaded yet.</p>
          <p className="text-slate-400/60 text-sm mt-2">Add items from your admin panel.</p>
        </div>
      )}

      <div className="relative grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 p-3 md:p-5 pb-20">
        {agbadaItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl overflow-hidden border border-blue-50 shadow-lg shadow-blue-900/5 hover:border-blue-200 transition duration-300"
          >
            <div className="overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-44 md:h-64 object-cover transition duration-500 hover:scale-110"
                onContextMenu={(e) => e.preventDefault()}
                draggable={false}
              />
            </div>

            <div className="p-3 md:p-4">
              <h3 className="mt-1 text-sm md:text-lg font-medium text-slate-800">{item.title}</h3>
              <p className="text-[#1E3A8A] mt-1 text-sm md:text-base font-bold">
                {item.price ? item.price : "Price on request"}
              </p>

              <a
                href={`https://wa.me/2348061587993?text=${encodeURIComponent(
                  `Hello, I want to order this: ${item.title}${item.price ? ` — ${item.price}` : ""}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block w-full text-center bg-[#1E3A8A] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#3B82F6] transition-colors shadow-md shadow-blue-900/10"
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