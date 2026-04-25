import FashionMenu from "../components/FashionMenu";
import BackButton from "../components/BackButton";
import useData from "../hooks/useData";
import LoadingState from "../components/LoadingState";

const casualItems = [
  {
    name: "Modern Casual Fit",
    price: "₦45,000",
    image: "/images/casual-1.jpg",
  },
  {
    name: "Street Style Outfit",
    price: "₦50,000",
    image: "/images/casual-2.jpg",
  },
];

export default function FashionCasuals() {

  const phone = "2348061587993";

  const { data, loading } = useData();

  if (loading) {
    return <LoadingState />;
  }

  const casuals = data.filter(
    (item) => item.category === "casuals"
  );

  return (
    <div className="bg-black text-white min-h-screen">
      <header className="flex items-center justify-between p-5 border-b border-white/10">
        <BackButton />
        <h1 className="text-[#D4AF37] font-serif text-lg">
          Casual Collection
        </h1>
        <FashionMenu />
      </header>

      <div className="grid md:grid-cols-3 gap-5 p-5">

        {casuals.map((item) => (
          <div key={item.id} className="bg-white/5 p-4 rounded-2xl">
            <img
              src={`https://topxcm-backend.onrender.com${item.image}`}
              className="rounded-xl"
            />
            <h3 className="mt-3">{item.title}</h3>
            <p className="text-[#D4AF37]">{item.price}</p>

            <a
              href={`https://wa.me/2348061587993?text=${encodeURIComponent(
                `Hello, I want to order this: ${item.title}`
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

