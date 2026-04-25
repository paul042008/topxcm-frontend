import BackButton from "../components/BackButton";
import useData from "../hooks/useData";
import LoadingState from "../components/LoadingState";

export default function RealEstate() {
  const { data, loading } = useData();

  const phone = "2348061587993";

  if (loading) {
    return <LoadingState />;
  }

  const properties = data.filter((item) => item.category === "realestate");

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-[#D4AF37]/10"></div>

      {/* HEADER */}
      <header className="relative flex items-center justify-between p-5 border-b border-white/10">
        <BackButton />

        <h1 className="absolute left-1/2 -translate-x-1/2 text-[#D4AF37] font-serif">
          TOPXCM REAL ESTATE
        </h1>
      </header>

      {/* HERO */}
      <section className="relative text-center py-16 px-5">
        <h2 className="text-4xl font-serif">
          Find Your <span className="text-[#D4AF37]">Perfect Property</span>
        </h2>
        <p className="text-white/70 mt-4">
          Premium homes, apartments, and investment properties.
        </p>
      </section>

      {/* PROPERTY GRID */}
      <section className="relative grid md:grid-cols-3 gap-6 px-5 pb-20">
        {properties.length === 0 && (
          <p className="text-white/60 col-span-full text-center">
            No properties uploaded yet.
          </p>
        )}

        {properties.map((item) => (
          <div
            key={item.id}
            className="bg-white/5 rounded-2xl overflow-hidden group"
          >
            <img
  src={
    item.image?.startsWith("http")
      ? item.image
      : `https://topxcm-backend.onrender.com${item.image}`
  }
  alt={item.title}
  className="w-full h-[220px] object-cover group-hover:scale-110 transition duration-500"
/>

            {/* CONTENT */}
            <div className="p-4">
              <h3 className="font-semibold">{item.title}</h3>

              {"location" in item && item.location && (
                <p className="text-sm text-white/60">{item.location}</p>
              )}

              {"price" in item && item.price && (
                <p className="text-[#D4AF37] mt-2">{item.price}</p>
              )}

              {/* CTA */}
              <a
                href={`https://wa.me/2348061587993?text=${encodeURIComponent(
                  `Hello, I’m interested in this property: ${item.title}${
                    "location" in item && item.location
                      ? ` (${item.location})`
                      : ""
                  }`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block w-full text-center bg-[#D4AF37] text-black py-2 rounded-full hover:opacity-90 transition"
              >
                Contact for Details
              </a>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

