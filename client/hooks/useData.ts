import { useEffect, useState } from "react";

export interface Item {
  id: number;
  title: string;
  category: string;

  // normal items
  image?: string;
  description?: string;
  price?: string;
  size?: string;
  location?: string;

  // 🔥 weddings
  couple?: string;
  date?: string;
  cover?: string;
  thumbnails?: string[];
  gallery?: string[];
  album?: string[];
}

export default function useData() {
  const [data, setData] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://topxcm-backend.onrender.com/api/items")
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  return { data, loading };
}

