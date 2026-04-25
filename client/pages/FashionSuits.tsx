import FashionMenu from "../components/FashionMenu";
import BackButton from "../components/BackButton";
import useData from "../hooks/useData";

const suits = [
  {
    name: "Black Senator Suit",
    price: "₦85,000",
    image: "/images/suit-1.jpg",
  },
  {
    name: "Classic Navy Suit",
    price: "₦90,000",
    image: "/images/suit-2.jpg",
  },
  {
    name: "Luxury Cream Suit",
    price: "₦95,000",
    image: "/images/suit-3.jpg",
  },
];

export default function FashionSuits() {

  const phone = "2348061587993";

  const { data, loading } = useData();

  if (loading) {
    return <div className="text-white p-10">Loading...</div>;
  }

  const suitItems = data.filter(
    (item) => item.category === "suits"
  );

  return (
    <div className="bg-black text-white min-h-screen">
      <header className="flex items-center justify-between p-5 border-b border-white/10">
        <BackButton />
        <h1 className="text-[#D4AF37] font-serif text-lg">
          Suits Collection
        </h1>
        <FashionMenu />
      </header>

      {/* Hero Section */}
      <section className="text-center py-16 px-5">
        <h2 className="text-4xl font-serif">Premium Suits</h2>
        <p className="mt-4 text-white/70 max-w-xl mx-auto">
          Elegant, tailored suits designed for modern men who value style and precision.
        </p>
      </section>

      {/* Products */}
      <section className="grid md:grid-cols-3 gap-6 px-5 pb-16">

        {suitItems.map((item) => (
          <div
            key={item.id}
            className="bg-white/5 p-4 rounded-2xl hover:scale-105 transition"
          >
            <div className="overflow-hidden rounded-xl">
              <img
                src={`https://topxcm-backend.onrender.com${item.image}`}
                alt={item.title}
                className="w-full h-[300px] object-cover transition duration-500 hover:scale-110"
              />
            </div>

            <h3 className="mt-4 text-lg font-medium">{item.title}</h3>
            <p className="text-[#D4AF37]">{item.price}</p>

            <a
              href={`https://wa.me/2348061587993?text=${encodeURIComponent(
                `Hello, I want to order this suit: ${item.title}`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block bg-[#D4AF37] text-black px-5 py-2 rounded-full text-sm font-medium hover:scale-105 transition"
            >
              Order Now
            </a>
          </div>
        ))}

      </section>
    </div>
  );
}

