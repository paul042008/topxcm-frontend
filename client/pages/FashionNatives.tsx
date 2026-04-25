import FashionMenu from "../components/FashionMenu";
import BackButton from "../components/BackButton";
import useData from "../hooks/useData";

export default function FashionNatives() {
  const phone = "2348061587993";
  const { data, loading } = useData();

  if (loading) {
    return <div className="text-white p-10">Loading...</div>;
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

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 p-3 md:p-5">
        {natives.map((item) => (
          <div
            key={item.id}
            className="bg-white/5 rounded-2xl overflow-hidden border border-white/10"
          >
            <div className="overflow-hidden">
              <img
                src={`https://topxcm-backend.onrender.com${item.image}`}
                alt={item.title}
                className="w-full h-44 md:h-64 object-cover transition duration-500 hover:scale-110"
              />
            </div>

            <div className="p-3 md:p-4">
              <h3 className="mt-1 text-sm md:text-lg font-medium">
                {item.title}
              </h3>

              <p className="text-[#D4AF37] mt-1 text-sm md:text-base font-semibold">
                {item.price ? item.price : "Price on request"}
              </p>

              <a
                href={`https://wa.me/2348061587993?text=${encodeURIComponent(
                  `Hello, I want to order this: ${item.title}${
                    item.price ? ` — ${item.price}` : ""
                  }`
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

