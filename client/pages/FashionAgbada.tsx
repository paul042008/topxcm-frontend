import FashionMenu from "../components/FashionMenu";
import BackButton from "../components/BackButton";

/* ✅ TYPE FIX */
type Item = {
  name: string;
  price: string;
  image: string;
};

const agbadaItems: Item[] = [
  {
    name: "Royal White Agbada",
    price: "₦120,000",
    image: "/images/agbada-1.jpg",
  },
  {
    name: "Classic Navy Agbada",
    price: "₦110,000",
    image: "/images/agbada-2.jpg",
  },
];

export default function FashionAgbada() {
  const phone = "2348061587993";

  return (
    <div className="bg-black text-white min-h-screen">
      <header className="flex items-center justify-between p-5 border-b border-white/10">
        {/* LEFT SIDE */}
        <BackButton />

        {/* CENTER TITLE */}
        <h1 className="text-[#D4AF37] font-serif text-lg">
          Agbada Collection
        </h1>

        {/* RIGHT SIDE */}
        <FashionMenu />
      </header>

      <div className="grid md:grid-cols-3 gap-5 p-5">
        {agbadaItems.map((item: Item) => (
          <div key={item.name} className="bg-white/5 p-4 rounded-2xl">
            <img src={item.image} className="rounded-xl" />
            <h3 className="mt-3">{item.name}</h3>
            <p className="text-[#D4AF37]">{item.price}</p>

            <a
              href={`https://wa.me/2348061587993?text=${encodeURIComponent(
                `Hello, I want to order this: ${item.name}`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block bg-[#D4AF37] text-black px-4 py-2 rounded-full"
            >
              Order Now
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

